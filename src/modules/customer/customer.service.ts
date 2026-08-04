import { prisma } from "../../lib/prisma";
import {
  CreateBookingPayload,
  UpdateCustomerProfilePayload,
} from "./customer.interface";

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
    },
    include: {
      technician: true,
    },
  });

  const scheduledStart = new Date(payload.scheduledStart);
  const scheduledEnd = new Date(payload.scheduledEnd);

  console.log("scheduledStart", scheduledStart);
  console.log("scheduledEnd", scheduledEnd);

  if (scheduledStart >= scheduledEnd) {
    throw new Error("Start time must be before end time.");
  }

  // Check technician availability
  const availability = await prisma.availability.findFirst({
    where: {
      technicianId: service.technicianId,
      isAvailable: true,
      day: scheduledStart
        .toLocaleDateString("en-US", {
          weekday: "long",
        })
        .toUpperCase() as any,
    },
  });

  if (!availability) {
    throw new Error("Technician is not available on this day.");
  }

  // Ensure selected time fits inside availability
  const availableStart = new Date(availability.startTime);
  const availableEnd = new Date(availability.endTime);

  if (scheduledStart < availableStart || scheduledEnd > availableEnd) {
    throw new Error("Selected time is outside the technician's availability.");
  }

  // Prevent overlapping bookings
  const conflict = await prisma.booking.findFirst({
    where: {
      technicianId: service.technicianId,
      status: {
        in: ["REQUESTED", "ACCEPTED", "IN_PROGRESS"],
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

export const customerService = {
  updateProfile,
  createBooking,
};
