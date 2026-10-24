# 🛍️ ShopVerse — Full-Stack E-Commerce Platform

ShopVerse is a full-stack e-commerce web application that allows users to browse products, search and filter items, manage their shopping cart, save delivery addresses, place orders, and view order history and invoices. It features a modern, responsive interface with a dark theme and gradient accents.

## ✨ Features

- **User Authentication** — Register and log in securely.
- **Product Catalog** — Browse products across multiple categories.
- **Search and Filtering** — Find products using search and category filters.
- **Shopping Cart** — Add products, update quantities, and manage cart items.
- **Address Management** — Manage delivery information during checkout.
- **Checkout and Order Placement** — Review order details and totals before placing orders.
- **My Orders** — View order history, order status, and order details.
- **Invoice Viewing** — View invoices for orders.
- **Admin Features** — Manage products through the admin interface.
- **Responsive UI** — Modern dark-themed interface with gradient accents and interactive notifications.

## 🛠️ Tech Stack

**Frontend**
- Next.js
- React.js
- Tailwind CSS
- Axios
- Lucide React
- Sonner

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

**Deployment**
- Vercel for the frontend
- Node.js-compatible hosting for the backend
- MongoDB Atlas or another MongoDB instance

## 🏗️ Project Architecture

```text
ShopVerse/
├── client/
│   ├── app/
│   │   ├── admin/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── login/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── profile/
│   │   └── register/
│   ├── components/
│   ├── context/
│   ├── lib/
│   └── package.json
│
└── server/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── utils/
    ├── server.js
    └── package.json
```

## 🔐 Security

- Password hashing using bcryptjs.
- JWT-based authentication.
- Protected API routes.
- Order access restricted to authorized users.
- Environment variables for sensitive configuration.
