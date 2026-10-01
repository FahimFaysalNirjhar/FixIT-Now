import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  CreateBookingPayload,
  UpdateCustomerProfilePayload,
} from "./customer.interface";

const TZ = "Asia/Dhaka"; // timezone the technician's hours are in

// Weekday + minutes-since-midnight of a moment, in the technician's timezone
const partsOf = (date: Date) => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .formatToParts(date)
      .map((x) => [x.type, x.value]),
  );

  return {
    day: (p.weekday ?? "").toUpperCase(),
    minutes: (Number(p.hour ?? 0) % 24) * 60 + Number(p.minute ?? 0),
  };
};

// Stored availability times are wall-clock values kept as UTC
const storedMinutes = (d: Date) => d.getUTCHours() * 60 + d.getUTCMinutes();

const updateProfile = async (
  userId: string,
  payload: UpdateCustomerProfilePayload,
) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: payload.name,
      phone: payload.phone,
      address: payload.address,
      profilePhoto: payload.profilePhoto,
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

const createBooking = async (
  customerId: string,
  payload: CreateBookingPayload,
) => {
  const service = await prisma.service.findFirstOrThrow({
    where: {
      id: payload.serviceId,
      isActive: true,
      technician: { user: { status: "ACTIVE" } },
    },
    include: {
      technician: true,
    },
  });

  const scheduledStart = new Date(payload.scheduledStart);
  const scheduledEnd = new Date(payload.scheduledEnd);

  if (scheduledStart >= scheduledEnd) {
    throw new Error("Start time must be before end time.");
  }

  // Check technician availability
  const start = partsOf(scheduledStart);
  const end = partsOf(scheduledEnd);
  const endMinutes = end.minutes === 0 ? 1440 : end.minutes; // ends at midnight

  const windows = await prisma.availability.findMany({
    where: {
      technicianId: service.technicianId,
      isAvailable: true,
      day: start.day as any,
    },
  });

  if (windows.length === 0) {
    throw new Error("Technician is not available on this day.");
  }

  const fits = windows.some((w) => {
    const from = storedMinutes(new Date(w.startTime));
    const to = storedMinutes(new Date(w.endTime)) || 1440;
    return start.minutes >= from && endMinutes <= to;
  });

  if (!fits) {
    throw new Error("Selected time is outside the technician's availability.");
  }

  // Prevent overlapping bookings
  const conflict = await prisma.booking.findFirst({
    where: {
      technicianId: service.technicianId,
      status: {
        in: [BookingStatus.REQUESTED, BookingStatus.ACCEPTED],
      },
      AND: [
        {
          scheduledStart: {
            lt: scheduledEnd,
          },
        },
        {
          scheduledEnd: {
            gt: scheduledStart,
          },
        },
      ],
    },
  });

  if (conflict) {
    throw new Error("The selected time slot has already been booked.");
  }

  const booking = await prisma.booking.create({
    data: {
      customerId,
      technicianId: service.technicianId,
      serviceId: service.id,
      scheduledStart,
      scheduledEnd,
      totalAmount: service.price,
      note: payload.note,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      technician: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
      service: true,
    },
  });

  return booking;
};

const getMyBookings = async (customerId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      customerId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      service: {
        include: {
          category: true,
        },
      },
      technician: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
      reviews: true,
      payment: true,
    },
  });

  return bookings;
};

const getSingleBooking = async (customerId: string, bookingId: string) => {
  const booking = await prisma.booking.findFirstOrThrow({
    where: {
      id: bookingId,
      customerId,
    },
    include: {
      service: {
        include: {
          category: true,
        },
      },
      technician: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
      customer: {
        omit: {
          password: true,
        },
      },
      payment: true,
      reviews: true,
    },
  });

  return booking;
};

const cancelBooking = async (customerId: string, bookingId: string) => {
  const booking = await prisma.booking.findFirstOrThrow({
    where: {
      id: bookingId,
      customerId,
    },
  });

  if (booking.status === "COMPLETED") {
    throw new Error("Completed bookings cannot be cancelled.");
  }

  if (booking.status === "CANCELLED") {
    throw new Error("Booking is already cancelled.");
  }

  if (booking.status === "ACCEPTED") {
    throw new Error("An ongoing booking cannot be cancelled.");
  }

  const updatedBooking = await prisma.booking.update({
    where: {
      id: booking.id,
    },
    data: {
      status: "CANCELLED",
    },
  });

  return updatedBooking;
};

export const customerService = {
  updateProfile,
  createBooking,
  getMyBookings,
  getSingleBooking,
  cancelBooking,
};
