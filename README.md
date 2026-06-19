# SHOWTIME - Ticket Exchange Platform

Live Demo: https://showtime-frontend.vercel.app

API Services:

- Auth Service: https://showtime-ticket-exchange-platform.vercel.app
- Tenant Service: https://showtime-tenant-service.vercel.app
- Ticket Service: https://showtime-ticket-service.vercel.app

GitHub Repository: https://github.com/Deekshith-80/SHOWTIME---Ticket-Exchange-Platform

## Overview

SHOWTIME is a microservices-based ticket exchange platform built for customers and event organizers.

Users can:

- Browse live events
- View event details
- Book tickets with Razorpay
- Sign in with Google or email/password
- Manage organizer profiles and create events
- View organizer analytics

## Features

- Role-based experience for customers and organizers
- Google OAuth and JWT authentication
- Event creation and management
- Public event discovery
- Razorpay payment flow
- Multi-service backend structure
- Vercel-ready deployment

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router DOM, Tailwind CSS, Axios |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| Authentication | Google OAuth, JWT, bcrypt |
| Payments | Razorpay |
| Deployment | Vercel |

## Project Structure

```bash
ticketing-monorepo/
├── frontend/
│   └── React client application
└── backend/
    ├── auth-service/
    ├── tenant-service/
    └── ticket-service/
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Deekshith-80/SHOWTIME---Ticket-Exchange-Platform.git
cd ticketing-monorepo
```

### 2. Install dependencies

Install dependencies in each folder:

```bash
cd frontend && npm install
cd ../backend/auth-service && npm install
cd ../tenant-service && npm install
cd ../ticket-service && npm install
```

### 3. Configure environment variables

Create a `.env` file in each folder using the examples below.

Frontend `.env`:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_AUTH_SERVICE_URL=http://localhost:5001
VITE_TENANT_SERVICE_URL=http://localhost:5002
VITE_TICKET_SERVICE_URL=http://localhost:5003
VITE_RAZORPAY_KEY_ID=your_razorpay_test_key_id
```

`backend/auth-service/.env`:

```env
PORT=5001
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

`backend/tenant-service/.env`:

```env
PORT=5002
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
```

`backend/ticket-service/.env`:

```env
PORT=5003
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
TENANT_SERVICE_URL=http://localhost:5002
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_secret_key
```

### 4. Run the app

Start each backend service in a separate terminal:

```bash
cd backend/auth-service && npm run dev
cd backend/tenant-service && npm run dev
cd backend/ticket-service && npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend && npm run dev
```

## Default Ports

- Frontend: `5173`
- Auth Service: `5001`
- Tenant Service: `5002`
- Ticket Service: `5003`

## Deployment

The project is already set up for Vercel deployment. The live links are listed at the top of this README.

## Why This Project Stands Out

- Clean microservices architecture
- Real-world authentication and payment flow
- Separate organizer and customer journeys
- Production-friendly backend setup

## Environment Summary

- Frontend: Google client ID, service URLs, Razorpay public key
- Auth service: MongoDB URI, JWT secret, frontend URL
- Tenant service: MongoDB URI, frontend URL
- Ticket service: MongoDB URI, frontend URL, tenant service URL, Razorpay keys

## Author

Built by Deekshith.
