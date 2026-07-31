# zapShift

Full-stack parcel delivery app for Bangladesh: a React + Vite client and an Express + MongoDB API.

## Features

- Email/password auth with JWT, roles: `user`, `rider`, `admin`
- Parcel booking with automatic pricing (document / non-document, within or outside city, extra weight)
- Mock payment flow with transaction ids and payment history
- Public parcel tracking by tracking id with a status timeline
- Rider applications, admin approval, rider assignment and delivery status updates
- Coverage map and customer reviews served from the database (64 district warehouses)

## Stack

| Layer    | Tech                                                  |
| -------- | ----------------------------------------------------- |
| Client   | React 19, Vite, Tailwind CSS 4, daisyUI, react-router, react-leaflet, axios |
| Server   | Node.js, Express, Mongoose, JWT, bcryptjs             |
| Database | MongoDB                                               |

## Getting started

Requires Node.js 20.19+ (or 22.12+) and a running MongoDB instance.

```bash
# 1. Client
cp .env.example .env          # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                   # http://localhost:5173

# 2. Server (in a second terminal)
cd server
cp .env.example .env          # set MONGODB_URI and JWT_SECRET
npm install
npm run seed                  # warehouses, reviews and the admin user
npm run dev                   # http://localhost:5000
```

A local MongoDB can be started with Docker:

```bash
docker run -d --name zapshift-mongo -p 27017:27017 mongo:7
```

The seed script creates an admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (default `admin@zapshift.com` / `admin123`).

## API

Base URL: `/api`

| Method | Endpoint                     | Access        | Description                        |
| ------ | ---------------------------- | ------------- | ---------------------------------- |
| POST   | `/auth/register`             | public        | Create an account, returns a JWT   |
| POST   | `/auth/login`                | public        | Login, returns a JWT               |
| GET    | `/auth/me`                   | auth          | Current user                       |
| PATCH  | `/users/me`                  | auth          | Update own profile                 |
| GET    | `/users`                     | admin         | List/search users                  |
| PATCH  | `/users/:id/role`            | admin         | Change a user role                 |
| POST   | `/parcels/quote`             | public        | Price a parcel before booking      |
| GET    | `/parcels/track/:trackingId` | public        | Tracking timeline                  |
| POST   | `/parcels`                   | auth          | Book a parcel                      |
| GET    | `/parcels`                   | auth          | Own / assigned / all parcels by role|
| GET    | `/parcels/stats`             | auth          | Dashboard counters                 |
| PATCH  | `/parcels/:id/assign`        | admin         | Assign an approved rider           |
| PATCH  | `/parcels/:id/status`        | admin, rider  | Update delivery status             |
| DELETE | `/parcels/:id`               | auth          | Delete an unpaid parcel            |
| POST   | `/payments/:parcelId/pay`    | auth          | Pay for a parcel                   |
| GET    | `/payments/history`          | auth          | Payment history                    |
| POST   | `/riders/apply`              | auth          | Apply to become a rider            |
| GET    | `/riders/me`                 | auth          | Own rider application              |
| GET    | `/riders`                    | admin         | List rider applications            |
| PATCH  | `/riders/:id/status`         | admin         | Approve/reject a rider             |
| GET    | `/reviews`                   | public        | Customer reviews                   |
| POST   | `/reviews`                   | auth          | Leave a review                     |
| GET    | `/warehouses`                | public        | Warehouses, searchable             |
| GET    | `/warehouses/regions`        | public        | Regions with their districts       |

## Pricing

| Parcel type              | Within city | Outside city |
| ------------------------ | ----------- | ------------ |
| Document                 | ৳60         | ৳80          |
| Non-document up to 3kg   | ৳110        | ৳150         |
| Non-document above 3kg   | + ৳40/kg    | + ৳40/kg and ৳40 surcharge |
