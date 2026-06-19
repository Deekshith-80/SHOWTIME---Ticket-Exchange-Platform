# 🎟️ SHOWTIME - Premium Ticket Exchange Platform

A modern, production-ready **MERN microservices monorepo** for building scalable, multi-tenant ticketing systems. Built with React (Frontend), Express.js (Backend Services), and MongoDB (Atlas), deployed serverless on Vercel.

---

## 📋 Table of Contents

- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Local Quickstart](#local-quickstart)
- [Environment Configuration](#environment-configuration)
- [Deployment & Production](#deployment--production)
- [API Reference](#api-reference)
- [Contributing](#contributing)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                         │
│              Vercel Deployment (https://...)                     │
│  (Single-page app with client-side routing, SPA rewrites)        │
└────────────────┬──────────┬─────────────────┬────────────────────┘
                 │          │                 │
        ┌────────▼──┐ ┌─────▼──────┐ ┌────────▼───────┐
        │ Auth      │ │ Tenant     │ │ Ticket        │
        │ Service   │ │ Service    │ │ Service       │
        │ (5001)    │ │ (5002)     │ │ (5003)        │
        │ Vercel    │ │ Vercel     │ │ Vercel        │
        │ Functions │ │ Functions  │ │ Functions     │
        └────┬──────┘ └─────┬──────┘ └────┬──────────┘
             │              │             │
        ┌────▼──────────────▼─────────────▼────┐
        │    MongoDB Atlas (Serverless)        │
        │  - auth-service database             │
        │  - tenant-service database           │
        │  - ticket-service database           │
        │                                      │
        │  Connection Pooling: 2-5 (Serverless)
        │  Timeouts: 5000ms (Cold Start Ready)
        └──────────────────────────────────────┘
```

### Service Responsibilities

| Service            | Port                | Responsibility                                                                          |
| ------------------ | ------------------- | --------------------------------------------------------------------------------------- |
| **Frontend**       | 3000 (dev) / Vercel | User Interface, Authentication UI, Event Discovery, Booking Management                  |
| **Auth Service**   | 5001                | User Authentication, JWT Token Issuance, Google OAuth Integration, Session Management   |
| **Tenant Service** | 5002                | Tenant Configuration, Event Management, Organizer Analytics, Payout Settings            |
| **Ticket Service** | 5003                | Ticket Creation, Payment Processing (Razorpay), Inventory Management, Order Fulfillment |

### Data Flow

```
User (Frontend)
    ↓
[Single Sign-On or Traditional Auth]
    ↓
Auth Service → JWT Token Issued
    ↓
Frontend stores token in httpOnly cookie
    ↓
[Organizer creates event]
    ↓
Tenant Service → Event stored in MongoDB
    ↓
[Customer discovers & books tickets]
    ↓
Ticket Service → Creates order, initiates Razorpay payment
    ↓
Ticket Service → Verifies payment signature
    ↓
MongoDB → Ticket record created
    ↓
Frontend → Order confirmation displayed
```

---

## 📁 Project Structure

```
ticketing-monorepo/
├── frontend/                          # React + Vite single-page application
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   ├── pages/                    # Route pages (Login, Dashboard, etc)
│   │   ├── services/                 # API client services
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── context/                  # Global state (AuthContext)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json                   # SPA rewrite configuration
│   ├── vite.config.js                # Vite build configuration
│   └── package.json
│
├── backend/
│   ├── auth-service/                 # Authentication & Authorization Microservice
│   │   ├── config/db.js              # Serverless MongoDB connection cache
│   │   ├── controllers/authController.js
│   │   ├── models/                   # Mongoose schemas (User, Audience, Organizer)
│   │   ├── middlewares/              # Tenant context middleware
│   │   ├── routes/authRoutes.js
│   │   ├── server.js                 # Express app entry point
│   │   └── package.json
│   │
│   ├── tenant-service/               # Tenant & Event Management Microservice
│   │   ├── config/db.js              # Serverless MongoDB connection cache
│   │   ├── controllers/tenantController.js
│   │   ├── models/                   # Mongoose schemas (Tenant, Event)
│   │   ├── middlewares/              # Tenant context middleware
│   │   ├── routes/tenantRoutes.js
│   │   ├── server.js                 # Express app entry point
│   │   └── package.json
│   │
│   └── ticket-service/               # Ticket & Payment Processing Microservice
│       ├── config/db.js              # Serverless MongoDB connection cache
│       ├── controllers/ticketController.js
│       ├── models/                   # Mongoose schemas (Ticket, Order)
│       ├── middlewares/              # Tenant context middleware
│       ├── routes/ticketRoutes.js
│       ├── server.js                 # Express app entry point
│       └── package.json
│
├── .gitignore                        # Git exclusion rules
├── .env.example                      # Environment variable template
├── PRODUCTION_READINESS_AUDIT.txt    # Technical audit report
└── README.md                         # This file

```

---

## 🚀 Local Quickstart

### Prerequisites

- **Node.js** 16+ and npm 8+
- **MongoDB Atlas** account (free tier available at https://mongodb.com/cloud/atlas)
- **Google OAuth Client ID** (for social login)
- **Razorpay Account** (for payment processing)
- **Git**

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/ticketing-monorepo.git
cd ticketing-monorepo
```

### Step 2: Install Dependencies

```bash
# Frontend
cd frontend
npm install
cd ..

# Auth Service
cd backend/auth-service
npm install
cd ../..

# Tenant Service
cd backend/tenant-service
npm install
cd ../..

# Ticket Service
cd backend/ticket-service
npm install
cd ../..
```

### Step 3: Configure Environment Variables

Copy `.env.example` to `.env` files in each service:

```bash
# Create .env files from the template
cp .env.example backend/auth-service/.env
cp .env.example backend/tenant-service/.env
cp .env.example backend/ticket-service/.env
cp .env.example frontend/.env.local
```

Then, populate each `.env` file with your actual credentials:

**backend/auth-service/.env**

```env
PORT=5001
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/auth-service
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
FRONTEND_URL=http://localhost:3000
```

**backend/tenant-service/.env**

```env
PORT=5002
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/tenant-service
FRONTEND_URL=http://localhost:3000
```

**backend/ticket-service/.env**

```env
PORT=5003
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ticket-service
FRONTEND_URL=http://localhost:3000
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
TENANT_SERVICE_URL=http://localhost:5002
```

**frontend/.env.local**

```env
VITE_AUTH_SERVICE_URL=http://localhost:5001
VITE_TENANT_SERVICE_URL=http://localhost:5002
VITE_TICKET_SERVICE_URL=http://localhost:5003
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_test_key
VITE_TENANT_ID=production-main
```

### Step 4: Start All Services

**Terminal 1 - Frontend (Port 3000)**

```bash
cd frontend
npm run dev
```

**Terminal 2 - Auth Service (Port 5001)**

```bash
cd backend/auth-service
npm start
```

**Terminal 3 - Tenant Service (Port 5002)**

```bash
cd backend/tenant-service
npm start
```

**Terminal 4 - Ticket Service (Port 5003)**

```bash
cd backend/ticket-service
npm start
```

### Step 5: Access the Application

- **Frontend:** http://localhost:3000
- **Auth Service:** http://localhost:5001/api/auth
- **Tenant Service:** http://localhost:5002/api/tenant
- **Ticket Service:** http://localhost:5003/api/tickets

---

## 🔐 Environment Configuration

### Local Development (.env files)

Each service reads a `.env` file for local development. **Never commit `.env` files to Git** — they will be excluded by `.gitignore`.

### Production Deployment (Vercel)

For production deployments on Vercel:

1. **Frontend (Vercel Deployment Dashboard)**
   - Environment Variables section
   - Add: `VITE_AUTH_SERVICE_URL`, `VITE_TENANT_SERVICE_URL`, `VITE_TICKET_SERVICE_URL` pointing to your production API endpoints
   - Add: `VITE_GOOGLE_CLIENT_ID` (production OAuth credentials)
   - Add: `VITE_RAZORPAY_KEY_ID` (production Razorpay key)

2. **Auth Service (Vercel Functions)**
   - Create a new Vercel project pointing to `backend/auth-service`
   - Environment Variables:
     - `MONGO_URI` (MongoDB Atlas connection string)
     - `JWT_SECRET` (strong, random 32+ character string)
     - `FRONTEND_URL` (your frontend Vercel domain)

3. **Tenant Service (Vercel Functions)**
   - Create a new Vercel project pointing to `backend/tenant-service`
   - Environment Variables:
     - `MONGO_URI`
     - `FRONTEND_URL`

4. **Ticket Service (Vercel Functions)**
   - Create a new Vercel project pointing to `backend/ticket-service`
   - Environment Variables:
     - `MONGO_URI`
     - `FRONTEND_URL`
     - `RAZORPAY_KEY_ID` (production key)
     - `RAZORPAY_KEY_SECRET` (production secret)
     - `TENANT_SERVICE_URL` (production Tenant Service URL)

**⚠️ Important:** Never store secrets in `.env` files tracked by Git. Always use Vercel Dashboard or a secrets management service (GitHub Secrets, HashiCorp Vault, etc.) for production credentials.

---

## 📦 Deployment & Production

### Serverless Architecture

The application is designed to be **serverless-ready** and deployed on **Vercel Functions**:

✅ **Implemented Features:**

- MongoDB connection pooling optimized for serverless (maxPoolSize: 2)
- Connection caching to prevent cold-start delays
- Timeout configurations (5000ms) for reliable function execution
- CORS configuration supporting HTTPS cross-domain requests
- SPA rewrite rules in `vercel.json` for client-side routing
- Secure HTTP-only, cross-domain cookies (sameSite: 'none')

### Deployment Checklist

- [ ] All credentials rotated and injected via Vercel Dashboard (not .env files)
- [ ] `FRONTEND_URL` updated to production domain in all backend services
- [ ] MongoDB Atlas IP whitelist includes Vercel's IP ranges
- [ ] Google OAuth redirect URIs updated to production domain
- [ ] Razorpay webhook URLs configured for production keys
- [ ] Vercel deployment configured with `vercel.json` SPA rewrites
- [ ] Domain SSL/TLS certificate provisioned (automatic on Vercel)
- [ ] Monitoring and logging configured (Vercel Analytics, error tracking)

### Monitoring Production

1. **Vercel Deployment Dashboard** - Monitor function invocations and performance
2. **MongoDB Atlas** - Check connection metrics and replica set health
3. **Application Logs** - View in Vercel Function logs
4. **Error Tracking** - Set up Sentry or similar for production errors

---

## 🔗 API Reference

### Auth Service (`/api/auth`)

```
POST   /api/auth/register       - User registration (email/password)
POST   /api/auth/login          - User login (email/password)
POST   /api/auth/google-login   - Google OAuth sign-in
GET    /api/auth/me             - Get current user session
POST   /api/auth/logout         - End user session
```

### Tenant Service (`/api/tenant`)

```
GET    /api/tenant/settings         - Fetch tenant profile settings
PUT    /api/tenant/settings         - Update tenant profile settings
POST   /api/tenant/events           - Create new event
GET    /api/tenant/events/list      - Get organizer's events
GET    /api/tenant/events/active    - Get all active events
GET    /api/tenant/events/:eventId  - Get event details
PATCH  /api/tenant/events/:id/cancel- Cancel an event
GET    /api/tenant/analytics        - Get organizer analytics dashboard
```

### Ticket Service (`/api/tickets`)

```
GET    /api/tickets/events/active   - Fetch active public events
GET    /api/tickets/events/:id      - Get event details for booking
POST   /api/tickets/orders          - Create ticket order
POST   /api/tickets/verify          - Verify Razorpay payment
GET    /api/tickets/me              - Fetch user's tickets
```

---

## 🛠️ Development Workflow

### Running Tests

```bash
# Frontend tests
cd frontend && npm test

# Backend service tests
cd backend/auth-service && npm test
cd backend/tenant-service && npm test
cd backend/ticket-service && npm test
```

### Code Formatting

```bash
# Install ESLint globally (optional)
npm install -g eslint

# Lint all services
cd frontend && npm run lint
cd ../backend/auth-service && npm run lint
```

### Database Migrations

MongoDB schemas are managed via Mongoose. To update database structure:

1. Modify schema files in `backend/*/models/`
2. Mongoose will handle schema validation on next connection
3. For breaking changes, create a migration script in `backend/scripts/`

---

## 📝 Contributing

### Guidelines

1. **Branch naming:** `feature/short-description` or `fix/issue-name`
2. **Commits:** Write clear, descriptive commit messages
3. **Code style:** Use ESLint configuration provided
4. **Testing:** Write tests for new features
5. **Security:** Never commit credentials or sensitive data

### Pull Request Process

1. Create feature branch from `main`
2. Make changes and test locally
3. Push to GitHub and open a Pull Request
4. Request code review from maintainers
5. Address feedback and merge once approved

---

## 📄 License

MIT License — See LICENSE file for details

---

## 🤝 Support & Contact

- **Documentation:** See `PRODUCTION_READINESS_AUDIT.txt` for technical architecture notes
- **Issues:** Report bugs via GitHub Issues
- **Email:** operations@showtime.com

---

**Last Updated:** June 19, 2026  
**Version:** 1.0.0  
**Status:** 🟢 Production-Ready (Serverless Optimized)
