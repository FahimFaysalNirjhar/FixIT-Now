# 🔧 FixItNow - Home Service Marketplace API

A robust RESTful backend API for **FixItNow**, a home service marketplace where customers can book professional technicians, make secure payments using Stripe, leave reviews, and manage bookings. Technicians can manage services, availability, and booking requests while administrators oversee the platform.

---

## 🚀 Live API

**Base URL**

https://fix-it-now-assignment-4.vercel.app

---

## ✨ Features

### Authentication & Authorization

- JWT Authentication
- Role-Based Access Control (RBAC)
- Protected Routes
- Password Hashing with bcrypt

### Customer

- Register & Login
- Browse Services
- Book Services
- View Booking History
- Pay via Stripe Checkout
- View Payment History
- Write Reviews after completed bookings

### Technician

- Create Technician Profile
- Manage Availability
- Create Services
- Update/Delete Services
- Accept or Reject Bookings
- Mark Booking as Completed
- View Reviews

### Admin

- Manage Users
- Manage Categories
- Manage Services
- View Platform Data

### Payment

- Stripe Checkout Session
- Stripe Webhook Integration
- Payment Status Tracking
- Payment History

---

# 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- Stripe
- bcrypt
- Zod
- Vercel

---

# 📂 Project Structure

```
src
│
├── app
├── config
├── lib
├── middleware
├── modules
│   ├── auth
│   ├── user
│   ├── customer
│   ├── technician
│   ├── booking
│   ├── payment
│   ├── review
│   ├── category
│   └── service
│
├── routes
├── utils
└── server.ts
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/your-username/fix-it-now-backend.git
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Start development server

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file.

```env
DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=

BCRYPT_SALT_ROUNDS=10

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

APP_URL=http://localhost:3000

NODE_ENV=development

PORT=5000
```

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | /api/auth/register      |
| POST   | /api/auth/login         |
| POST   | /api/auth/refresh-token |

---

## Categories

| Method | Endpoint            |
| ------ | ------------------- |
| GET    | /api/categories     |
| POST   | /api/categories     |
| PATCH  | /api/categories/:id |
| DELETE | /api/categories/:id |

---

## Services

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | /api/services     |
| GET    | /api/services/:id |
| POST   | /api/services     |
| PATCH  | /api/services/:id |
| DELETE | /api/services/:id |

---

## Customer

| Method | Endpoint                   |
| ------ | -------------------------- |
| POST   | /api/customer/bookings     |
| GET    | /api/customer/bookings     |
| GET    | /api/customer/bookings/:id |

---

## Technician

| Method | Endpoint                     |
| ------ | ---------------------------- |
| POST   | /api/technician/profile      |
| PATCH  | /api/technician/profile      |
| POST   | /api/technician/availability |
| GET    | /api/technician/bookings     |
| PATCH  | /api/technician/bookings/:id |

---

## Payments

| Method | Endpoint                                  |
| ------ | ----------------------------------------- |
| POST   | /api/payments/checkout-session/:bookingId |
| POST   | /api/payments/webhook                     |
| GET    | /api/payments                             |
| GET    | /api/payments/:id                         |

---

## Reviews

| Method | Endpoint         |
| ------ | ---------------- |
| POST   | /api/reviews     |
| GET    | /api/reviews     |
| GET    | /api/reviews/:id |

---

# 💳 Payment Flow

1. Customer creates a booking.
2. Customer requests a Stripe Checkout Session.
3. Stripe redirects customer to Checkout.
4. Payment succeeds.
5. Stripe sends a webhook event.
6. Webhook verifies signature.
7. Payment record is updated.
8. Booking payment status becomes **PAID**.

---

# ⭐ Review Flow

- Booking must be **COMPLETED**
- Payment must be **PAID**
- Customer can submit **one review per booking**
- Average technician rating is updated automatically

---

# 📦 Booking Status

```
REQUESTED

ACCEPTED

COMPLETED

CANCELLED
```

---

# 🔒 User Roles

```
ADMIN

TECHNICIAN

CUSTOMER
```

---

# 📸 API Testing

You can test the API using:

- Postman
- Thunder Client
- Insomnia

---

# 🚀 Deployment

Hosted on

- Vercel
- PostgreSQL Database

---

# 👨‍💻 Author

**Fahim Faysal Nirjhar**

- GitHub: https://github.com/FahimFaysalNirjhar
- Email: fahimfaysal1995@gmail.com

---

# 📄 License

This project is developed for educational purposes.
