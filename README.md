# Eatoes Admin

A full-stack restaurant admin dashboard built with **TypeScript**, **React 18**, **Node.js/Express**, and **MongoDB**. This project demonstrates modern web development practices including optimistic UI updates, debounced search, and MongoDB aggregation pipelines.

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel](https://eatoes-admin.vercel.app/)
- **Backend API**: [Deployed on Render](https://eatoes-admin-gweo.onrender.com)

## Key Features

### Menu Management
- **Responsive Grid Layout**: Displays all menu items in a structured, adaptive grid.
- **Optimized Search**: Implements debounced search (300ms delay) to minimize API calls (Challenge 1).
- **Advanced Filtering**: Allows filtering by category, price range, and availability status.
- **CRUD Operations**: Complete support for adding, editing, and deleting menu items.
- **Optimistic UI Updates**: Instant availability toggling with automatic rollback on failure (Challenge 3).

### Orders Dashboard
- **Order Tracking**: Visual status indicators for efficient order monitoring.
- **Status Filtering**: Filter orders by current status (Pending, Preparing, Ready, etc.).
- **Efficient Pagination**: Handles large order volumes with server-side pagination.
- **Live Status Updates**: Dropdown interface for quick status transitions.
- **Detailed Order Views**: Expandable rows revealing full order contents and totals.

### Analytics & Insights
- **Top Sellers**: Aggregation pipeline to identify top 5 best-selling items (Challenge 2).
- **Revenue Metrics**: Real-time calculation of total revenue and order counts.
- **Status Distribution**: Statistical breakdown of orders by their current stage.

### User Experience
- **Theme Support**: Integrated Dark/Light mode toggle.
- **Responsive Design**: Mobile-first approach ensuring usability across all devices.
- **Robust Error Handling**: User-friendly toast notifications and loading states.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Query |
| **Backend** | Node.js, Express, TypeScript, Mongoose |
| **Database** | MongoDB (Atlas) |
| **Validation** | Joi |
| **State Management** | Context API + React Query |

## 📁 Project Structure

```
eatos/
├── server/                    # Backend API
│   ├── src/
│   │   ├── config/           # DB connection, environment
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Validation, error handling
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── validators/       # Joi schemas
│   │   ├── scripts/          # Seed script
│   │   ├── app.ts
│   │   └── index.ts
│   └── package.json
│
├── client/                    # Frontend App
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Theme, Toast contexts
│   │   ├── hooks/            # Custom hooks (useDebounce, etc.)
│   │   ├── pages/            # Page components
│   │   ├── services/         # API calls
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eatos.git
   cd eatos
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

4. **Seed the Database**
   ```bash
   cd ../server
   npm run seed
   ```

5. **Start Development Servers**

   Backend (Terminal 1):
   ```bash
   cd server
   npm run dev
   ```

   Frontend (Terminal 2):
   ```bash
   cd client
   npm run dev
   ```

6. **Open in Browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/eatos
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Menu Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Get all menu items (with filters) |
| GET | `/api/menu/search?q=query` | Search menu items |
| GET | `/api/menu/top-sellers` | Get top 5 selling items |
| GET | `/api/menu/:id` | Get single menu item |
| POST | `/api/menu` | Create new menu item |
| PUT | `/api/menu/:id` | Update menu item |
| DELETE | `/api/menu/:id` | Delete menu item |
| PATCH | `/api/menu/:id/availability` | Toggle availability |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders (with pagination) |
| GET | `/api/orders/stats` | Get order statistics |
| GET | `/api/orders/:id` | Get single order |
| POST | `/api/orders` | Create new order |
| PATCH | `/api/orders/:id/status` | Update order status |

### Query Parameters

**GET /api/menu**
- `category`: Filter by category (Appetizer, Main Course, Dessert, Beverage)
- `isAvailable`: Filter by availability (true/false)
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

## 🎯 Technical Challenges Implemented

### Challenge 1: Search with Debouncing
```typescript
// Custom hook implementation
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}
```

### Challenge 2: MongoDB Aggregation
```typescript
// Top sellers aggregation pipeline
Order.aggregate([
  { $unwind: '$items' },
  { $group: { _id: '$items.menuItem', totalQuantity: { $sum: '$items.quantity' } } },
  { $lookup: { from: 'menuitems', localField: '_id', foreignField: '_id', as: 'menuItem' } },
  { $sort: { totalQuantity: -1 } },
  { $limit: 5 }
]);
```

### Challenge 3: Optimistic UI Updates
```typescript
// React Query mutation with optimistic update
useMutation({
  mutationFn: (id) => menuService.toggleAvailability(id),
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['menu'] });
    // Update cache optimistically
  },
  onError: (err, id, context) => {
    // Rollback on error
    queryClient.setQueryData(['menu'], context?.previousData);
  }
});
```

## 🖼 Screenshots

*Add screenshots of your application here*

## 🚀 Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Frontend (Vercel)
1. Create a new site on Netlify
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add `_redirects` file: `/* /index.html 200`

## 📝 License

MIT
