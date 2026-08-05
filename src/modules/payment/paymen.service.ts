import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckoutSession = async (bookingId: string) => {
  const transationResult = await prisma.$transaction(async (tx) => {
    const booking = await prisma.booking.findUniqueOrThrow({
      where: {
        id: bookingId,
      },
      include: {
        customer: true,
        payment: true,
        service: true,
      },
    });

    if (booking.payment?.status === "PAID") {
      throw new Error("This booking has already been paid.");
    }

    let stripeCustomerId = booking.payment?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: booking.customer.email,
        name: booking.customer.name,
        metadata: {
          bookingId: booking.id,
        },
      });

      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      customer: stripeCustomerId,

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: booking.service.title,
              description: booking.service.description!,
            },

            unit_amount: Math.round(booking.totalAmount * 100),
          },

          quantity: 1,
        },
      ],

      success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${config.app_url}/payment/cancel`,

      metadata: {
        bookingId: booking.id,
      },
    });

    if (booking.payment) {
      await prisma.payment.update({
        where: {
          bookingId: booking.id,
        },
        data: {
          stripeCustomerId,
          stripeSessionId: session.id,
        },
      });
    } else {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: booking.totalAmount,
          status: "PENDING",
          stripeCustomerId,
          stripeSessionId: session.id,
        },
      });
    }
    return session.url;
  });
  return { paymentUrl: transationResult };
};

export const paymentService = { createCheckoutSession };
