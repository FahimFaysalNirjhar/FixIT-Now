import Stripe from "stripe";
import { prisma } from "../../lib/prisma";

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const bookingId = session.metadata?.bookingId;

  if (!bookingId) {
    console.log("Booking id not found.");
    return;
  }

  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
  });

  await prisma.payment.upsert({
    where: {
      bookingId,
    },
    create: {
      bookingId,
      amount: booking.totalAmount,
      status: "PAID",
      stripeCustomerId: session.customer as string,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      paidAt: new Date(),
    },
    update: {
      status: "PAID",
      stripeCustomerId: session.customer as string,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      paidAt: new Date(),
    },
  });
};
