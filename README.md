# Eatoes Admin

![Eatoes Admin Banner](https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1200&h=400)

> **Modern Restaurant Management Dashboard** designed for efficiency, scalability, and real-time operations.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) 
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) 
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) 
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) 
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) 
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🚀 Live Demo

| Component | Status | URL |
|-----------|--------|-----|
| **Frontend** | ![Deployed](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel) | [eatoes-admin.vercel.app](https://eatoes-admin.vercel.app/) |
| **Backend API** | ![Deployed](https://img.shields.io/badge/Deployed-Render-46E3B7?style=flat-square&logo=render) | [eatoes-admin-gweo.onrender.com](https://eatoes-admin-gweo.onrender.com) |

## ✨ Key Features

### 🍽️ Menu Management
- **Responsive Grid Layout**: Adaptive display for all screen sizes.
- **Debounced Search**: Optimized search with 300ms delay to reduce API load.
- **Optimistic UI**: Instant availability toggling with automatic rollback.
- **Advanced Filtering**: Filter by category, price, and status.

### 📦 Orders Dashboard
- **Real-time Tracking**: Monitor order status from Pending to Delivered.
- **Live Updates**: Status breakdown and revenue metrics.
- **Pagination**: Efficient server-side pagination for large datasets.

### 📊 Analytics
- **Top Sellers**: Aggregated insights on best-performing items.
- **Revenue Stats**: Daily, weekly, and monthly revenue tracking.

## 🛠️ Tech Stack

### Client Side
- **Framework**: React 18 + TypeScript + Vite
- **State Management**: React Query (TanStack Query) + Context API
- **Styling**: Tailwind CSS + Lucide React Icons
- **HTTP Client**: Axios with Interceptors

### Server Side
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB Atlas with Mongoose
- **Validation**: Joi Schema Validation
- **Architecture**: Controller-Service-Repository Pattern

## 🔧 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/eatos
CORS_ORIGIN=https://eatoes-admin.vercel.app
NODE_ENV=production
```

### Frontend (`client/.env`)
```env
VITE_API_URL=https://eatoes-admin-gweo.onrender.com/api
```

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/anjim999/Eatoes-Admin.git
   ```

2. **Install Dependencies**
   ```bash
   # Backend
   cd server && npm install
   
   # Frontend
   cd ../client && npm install
   ```

3. **Run Locally**
   ```bash
   # Terminal 1 (Backend)
   npm run dev
   
   # Terminal 2 (Frontend)
   npm run dev
   ```

---
