import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createReview = async (
  customerId: string,
  payload: {
    bookingId: string;
    rating: number;
    comment?: string;
  },
) => {
  const { bookingId, rating, comment } = payload;

  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
    include: {
      payment: true,
    },
  });

  // Booking must belong to logged-in customer
  if (booking.customerId !== customerId) {
    throw new Error("You are not authorized to review this booking.");
  }

  // Booking must be completed
  if (booking.status !== BookingStatus.COMPLETED) {
    throw new Error("You can only review a completed booking.");
  }

  // Payment must be completed
  if (!booking.payment || booking.payment.status !== PaymentStatus.PAID) {
    throw new Error("Please complete the payment before leaving a review.");
  }

  // Prevent duplicate review
  const existingReview = await prisma.review.findUnique({
    where: {
      bookingId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this booking.");
  }

  const review = await prisma.$transaction(async (tx) => {
    const createdReview = await tx.review.create({
      data: {
        bookingId,
        customerId,
        technicianId: booking.technicianId,
        rating,
        comment,
      },
    });

    // Recalculate technician rating
    const ratingResult = await tx.review.aggregate({
      where: {
        technicianId: booking.technicianId,
      },
      _avg: {
        rating: true,
      },
    });

    await tx.technicianProfile.update({
      where: {
        id: booking.technicianId,
      },
      data: {
        averageRating: ratingResult._avg.rating ?? 0,
      },
    });

    return createdReview;
  });

  return review;
};

export const reviewService = {
  createReview,
};
