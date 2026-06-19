```markdown
# 🎟️ SHOWTIME - Premium Ticket Exchange Platform

A modern, production-ready **MERN microservices monorepo** for building scalable, multi-tenant ticketing systems. Built with React (Frontend), Express.js (Backend Services), and MongoDB (Atlas), deployed serverless on Vercel.

### 🌐 Live Production Deployment
* **Frontend UI Application:** [https://showtime-frontend.vercel.app](https://showtime-frontend.vercel.app)
* **Auth Microservice API:** `https://showtime-ticket-exchange-platform.vercel.app`
* **Tenant Microservice API:** `https://showtime-tenant-service.vercel.app`
* **Ticket Microservice API:** `https://showtime-ticket-service.vercel.app`

---

## 📋 Table of Contents

- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Local Quickstart](#local-quickstart)
- [Environment Configuration](#environment-configuration)
- [Deployment & Production](#deployment--production)
- [API Reference](#api-reference)
- [License](#-license)

---

## 🏗️ System Architecture


```

┌─────────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                         │
│              [https://showtime-frontend.vercel.app](https://www.google.com/url?sa=E&source=gmail&q=https://showtime-frontend.vercel.app)               │
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
│  - Connection Pooling: maxPoolSize: 2│
│  - Buffer Commands: false            │
└──────────────────────────────────────┘

```

### Service Responsibilities

| Service | Dev Port | Live Production Endpoint | Responsibility |
| :--- | :--- | :--- | :--- |
| **Frontend** | `5173` | `https://showtime-frontend.vercel.app` | User Interface, Authentication state, Event Discovery, Booking Workflows. |
| **Auth Service** | `5001` | `https://showtime-ticket-exchange-platform.vercel.app` | Identity provider, JWT issuance, Google OAuth integration, secure session cookies. |
| **Tenant Service** | `5002` | `https://showtime-tenant-service.vercel.app` | Organizer profile settings, event registration, branding config, dashboard analytics. |
| **Ticket Service** | `5003` | `https://showtime-ticket-service.vercel.app` | Inventory management, order fulfillment, payment signing and verification via Razorpay. |

---

## 📁 Project Structure


```

ticketing-monorepo/
├── frontend/                          # React + Vite single-page application
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   ├── pages/                    # Route pages (Login, Dashboard, etc)
│   │   ├── services/                 # API client configurations (Axios instances)
│   │   └── main.jsx
│   ├── vercel.json                   # Client-side router SPA rewrite mapping
│   └── package.json
│
├── backend/
│   ├── auth-service/                 # Identity Management Service
│   │   ├── config/db.js              # Serverless connection caching strategy
│   │   ├── server.js                 # Gatekeeper Express application core
│   │   └── package.json
│   │
│   ├── tenant-service/               # Core Vendor Customization Engine
│   │   ├── config/db.js              # Caching configuration layer
│   │   ├── server.js                 # File size-optimized processing engine
│   │   └── package.json
│   │
│   └── ticket-service/               # Transaction & Financial Ledger Gateway
│       ├── config/db.js              # Connection pooling manager
│       ├── server.js                 # Secure backend Razorpay runner
│       └── package.json

```

---

## 🚀 Local Quickstart

### Prerequisites

* **Node.js** 18+ and npm 9+
* **MongoDB Atlas** account with a shared cluster configured
* **Google Cloud Console** account (OAuth 2.0 Web Client credentials)
* **Razorpay Developer Dashboard** account (API Keys in Test Mode)

### Step 1: Clone the Repository

```bash
git clone [https://github.com/Deekshith-80s/SHOWTIME---Ticket-Exchange-Platform.git](https://github.com/Deekshith-80s/SHOWTIME---Ticket-Exchange-Platform.git)
cd SHOWTIME---Ticket-Exchange-Platform

```

### Step 2: Install Monorepo Dependencies

```bash
# Install frontend assets
cd frontend && npm install && cd ..

# Install microservices assets
cd backend/auth-service && npm install && cd ../..
cd backend/tenant-service && npm install && cd ../..
cd backend/ticket-service && npm install && cd ../..

```

### Step 3: Populate Local Environment Files (`.env`)

> ⚠️ **Important:** Do not append a trailing slash (`/`) to URLs inside environmental configuration strings.

**backend/auth-service/.env**

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/auth-service?retryWrites=true&w=majority
JWT_SECRET=<YOUR_LOCAL_SECRET_KEY_STRING>
FRONTEND_URL=http://localhost:5173

```

**backend/tenant-service/.env**

```env
PORT=5002
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tenant-service?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173

```

**backend/ticket-service/.env**

```env
PORT=5003
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ticket-service?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173
TENANT_SERVICE_URL=http://localhost:5002
RAZORPAY_KEY_ID=<YOUR_RAZORPAY_TEST_KEY_ID>
RAZORPAY_KEY_SECRET=<YOUR_RAZORPAY_TEST_SECRET_KEY>

```

**frontend/.env.local**

```env
VITE_AUTH_SERVICE_URL=http://localhost:5001
VITE_TENANT_SERVICE_URL=http://localhost:5002
VITE_TICKET_SERVICE_URL=http://localhost:5003
VITE_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_OAUTH_CLIENT_ID>
VITE_RAZORPAY_KEY_ID=<YOUR_RAZORPAY_TEST_KEY_ID>

```

---

## 🔐 Environment Configuration (Cloud Ecosystem)

For production serverless orchestration across Vercel Functions, register these specific environment keys inside your Vercel project management dashboards:

### 1. Frontend Configuration (`showtime-frontend`)

* `VITE_AUTH_SERVICE_URL` ➔ `https://showtime-ticket-exchange-platform.vercel.app`
* `VITE_TENANT_SERVICE_URL` ➔ `https://showtime-tenant-service.vercel.app`
* `VITE_TICKET_SERVICE_URL` ➔ `https://showtime-ticket-service.vercel.app`
* `VITE_GOOGLE_CLIENT_ID` ➔ `<YOUR_PRODUCTION_GOOGLE_CLIENT_ID>`
* `VITE_RAZORPAY_KEY_ID` ➔ `<YOUR_PRODUCTION_RAZORPAY_KEY_ID>`

### 2. Auth Service Configuration (`showtime-ticket-exchange-platform`)

* `MONGO_URI` ➔ `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/auth-service?retryWrites=true&w=majority`
* `JWT_SECRET` ➔ `<YOUR_PRODUCTION_JWT_HASH_ENTROPY>`
* `FRONTEND_URL` ➔ `https://showtime-frontend.vercel.app`

### 3. Tenant Service Configuration (`showtime-tenant-service`)

* `MONGO_URI` ➔ `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tenant-service?retryWrites=true&w=majority`
* `FRONTEND_URL` ➔ `https://showtime-frontend.vercel.app`

### 4. Ticket Service Configuration (`showtime-ticket-service`)

* `MONGO_URI` ➔ `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ticket-service?retryWrites=true&w=majority`
* `FRONTEND_URL` ➔ `https://showtime-frontend.vercel.app`
* `TENANT_SERVICE_URL` ➔ `https://showtime-tenant-service.vercel.app`
* `RAZORPAY_KEY_ID` ➔ `<YOUR_PRODUCTION_RAZORPAY_KEY_ID>`
* `RAZORPAY_KEY_SECRET` ➔ `<YOUR_PRODUCTION_RAZORPAY_SECRET_KEY>`

---

## 📦 Deployment & Production

### Serverless Optimization Matrix

Deploying stateless microservices into transient serverless environments introduces cold starts and potential runtime connection bottlenecks. This repository implements two core patterns to maintain absolute stability:

#### 1. The Gatekeeper Request Middleware

With Mongoose execution set to `bufferCommands: false` for cloud environments, running database operations before the connection pool fully initializes will cause instant runtime request crashes. Every microservice utilizes a global async verification gate inside `server.js` before routes parse:

```javascript
app.use(async (req, res, next) => {
  try {
    await connectDB(); // Guarantees established connection handshake before execution
    next();
  } catch (error) {
    res.status(500).json({ success: false, error: "Database runtime connection failure." });
  }
});

```

#### 2. Graceful Error Propagation

To prevent serverless instances from hanging or freezing intermediate routing channels, database connection exceptions do not forcefully invoke destructive terminal commands like `process.exit(1)`. Instead, errors bubble out smoothly (`throw error`), allowing cloud runtime containers to recycle cleanly.

---

## 🔗 API Reference

### Auth Service Core (`/api/auth`)

```text
POST   /api/auth/register       - Profile initiation (Email / Security Key verification)
POST   /api/auth/login          - Access validation & secure cross-domain cookie injection
POST   /api/auth/google-login   - Identity parsing via Google verified tokens
GET    /api/auth/me             - Identity resolution endpoint
POST   /api/auth/logout         - Active token termination

```

### Tenant Service Core (`/api/tenant`)

```text
GET    /api/tenant/settings     - Retrieve active tenant customization branding
PUT    /api/tenant/settings     - Update tenant configuration layout
POST   /api/tenant/events       - Multi-tenant structured event instantiation
GET    /api/tenant/events/list  - Query contextual data scoped to current organizer

```

### Ticket Service Core (`/api/tickets`)

```text
POST   /api/tickets/orders      - Initiate custom inventory ledger entry & sign Razorpay payment hash
POST   /api/tickets/verify      - Cryptographic validation of incoming webhook signatures
GET    /api/tickets/me          - Query user-scoped ticket ownership registry

```

---

## 📄 License

MIT License — Copyright (c) 2026 Deekshith D.

---

**Last System Baseline Sync:** June 19, 2026

**Architecture Status:** 🟢 Stable & Live on Vercel

```

```