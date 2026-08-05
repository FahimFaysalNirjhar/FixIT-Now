import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handleCheckoutCompleted } from "./payment.utils";

const createCheckoutSession = async (bookingId: string) => {
  const paymentUrl = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUniqueOrThrow({
      where: {
        id: bookingId,
      },
      include: {
        customer: true,
        service: true,
        payment: true,
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
              description: booking.service.description ?? "",
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

    await tx.payment.upsert({
      where: {
        bookingId: booking.id,
      },
      create: {
        bookingId: booking.id,
        amount: booking.totalAmount,
        stripeCustomerId,
        stripeSessionId: session.id,
      },
      update: {
        stripeCustomerId,
        stripeSessionId: session.id,
      },
    });

    return session.url!;
  });

  return {
    paymentUrl,
  };
};

const getPaymentHistory = async (customerId: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      booking: {
        customerId,
      },
    },
    include: {
      booking: {
        select: {
          id: true,
          scheduledStart: true,
          scheduledEnd: true,
          status: true,
          service: {
            select: {
              title: true,
            },
          },
          technician: {
            select: {
              user: {
                select: {
                  name: true,
                  profilePhoto: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return payments;
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripe_webhook_secret!,
  );

  console.log(event.type);

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session,
      );
      break;

    default:
      console.log(`Unhandled event: ${event.type}`);
  }
};

export const paymentService = {
  createCheckoutSession,
  handleWebhook,
  getPaymentHistory,
};
