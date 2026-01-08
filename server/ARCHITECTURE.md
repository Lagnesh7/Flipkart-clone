# 📊 Backend Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       FRONTEND (React + Vite)                   │
│              (Port 5173) - c:\Users\ASUS\Downloads\client       │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTP/JSON
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                      CORS Middleware                             │
│            Allows requests from http://localhost:5173            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│              EXPRESS SERVER (Port 8080)                          │
│         c:\Users\ASUS\Downloads\server\server.js                │
├─────────────────────────────────────────────────────────────────┤
│  API Routes                                                       │
│  ├── /api/v1/auth        (6 endpoints)   AuthController         │
│  ├── /api/v1/user        (8 endpoints)   UserController         │
│  ├── /api/v1/product     (8 endpoints)   ProductController      │
│  ├── /api/v1/order       (7 endpoints)   OrderController        │
│  └── /api/v1/wishlist    (3 endpoints)   WishlistController     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
    ┌────────┐  ┌──────────┐  ┌────────────┐
    │ MySQL  │  │  Stripe  │  │ JWT Tokens │
    │ Database   │ Payment  │  │ in Headers │
    └────────┘  └──────────┘  └────────────┘
```

## Request Flow

```
1. User Request (Frontend)
   └─→ GET /api/v1/product
       ├─ Header: Authorization: token (if protected)
       └─ Body: JSON data (if POST/PUT)

2. Express Router
   └─→ Route Match
       └─ /api/v1/product → productRoutes.js
          └─ GET / → getAllProducts handler

3. Authentication Middleware (if protected)
   └─→ Verify JWT token
       ├─ Valid → continue
       └─ Invalid → return 401 error

4. Controller Logic
   └─→ productController.js
       └─ getAllProducts()
          ├─ Query database
          ├─ Format response
          └─ Send JSON

5. Database Query
   └─→ MySQL Connection Pool
       ├─ Execute SQL
       ├─ Return results
       └─ Release connection

6. Response
   └─→ JSON Response
       ├─ Status: 200/201/4xx/5xx
       ├─ Body: {success, message, data}
       └─ Headers: Content-Type: application/json
```

## Database Schema Relationships

```
┌──────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA                           │
├──────────────────────────────────────────────────────────────┤

  users (id, name, email, password, role, isActive)
    │
    ├──→ orders (id, user_id, orderId, totalPrice, status)
    │     └──→ order_items (order_id, product_id, quantity)
    │
    ├──→ wishlist (user_id, product_id)
    │
    ├──→ reviews (user_id, product_id, rating, comment)
    │
    └──→ user_addresses (user_id, name, phone, address)

  categories (id, name) ◄──── products (category_id)
  brands (id, name)      ◄──── products (brand_id)
                              │
                              ├──→ product_images (product_id)
                              │
                              └──→ reviews (product_id)
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────┐
│            AUTHENTICATION FLOW                      │
├─────────────────────────────────────────────────────┤

1. User Registration
   └─→ POST /api/v1/auth/register
       ├─ Input: {name, email, password, phone}
       ├─ Hash password with bcryptjs
       ├─ Store in users table
       └─ Response: {success, userId}

2. User Login
   └─→ POST /api/v1/auth/login
       ├─ Input: {email, password}
       ├─ Find user in database
       ├─ Compare passwords (bcrypt)
       ├─ Generate JWT token (7 days)
       └─ Response: {success, token, user}

3. Subsequent Requests
   └─→ Any protected endpoint
       ├─ Header: Authorization: jwt_token
       ├─ authMiddleware verifies token
       ├─ Extract user data from token
       ├─ Continue to controller
       └─ Access req.user.id

4. JWT Token Structure
   └─→ Encoded with secret key
       ├─ Header: {typ: "JWT", alg: "HS256"}
       ├─ Payload: {id, email, role, iat, exp}
       └─ Signature: HMACSHA256(header.payload, secret)
```

## Payment Flow (Stripe)

```
┌──────────────────────────────────────────────────────────┐
│           STRIPE PAYMENT FLOW                           │
├──────────────────────────────────────────────────────────┤

1. Add to Cart
   └─→ Frontend stores in localStorage
       └─ No backend involved

2. Checkout
   └─→ POST /api/v1/order/create-checkout-session
       ├─ Input: {products, frontendURL, customerEmail}
       ├─ Create line items from products
       ├─ Call Stripe API
       └─ Response: {session_id, checkout_url}

3. Stripe Redirect
   └─→ Frontend redirects to Stripe
       ├─ User enters card details
       ├─ Stripe processes payment
       └─ Redirects back (success or failed)

4. Verify Payment
   └─→ POST /api/v1/order/verify-payment
       ├─ Input: {sessionId, products, address}
       ├─ Retrieve session from Stripe
       ├─ Check payment_status === "paid"
       ├─ Create order in database
       ├─ Add order items
       ├─ Update product stock
       └─ Response: {success, orderId}

5. Order Created
   └─→ Database
       ├─ orders table: 1 row
       ├─ order_items table: N rows
       └─ products table: stock updated
```

## File Organization

```
Controllers (Business Logic)
│
├── authController.js
│   ├── register()
│   ├── login()
│   ├── checkUserAuth()
│   ├── checkAdminAuth()
│   └── resetPassword()
│
├── userController.js
│   ├── getUserById()
│   ├── updateUserProfile()
│   ├── addUserAddress()
│   └── getUserAddresses()
│
├── productController.js
│   ├── getAllProducts()
│   ├── getFilteredProducts()
│   ├── createProduct()
│   ├── updateProduct()
│   ├── deleteProduct()
│   ├── getProductReviews()
│   └── addProductReview()
│
├── orderController.js
│   ├── getUserOrders()
│   ├── createCheckoutSession()
│   ├── verifyPayment()
│   ├── getAllOrders() [admin]
│   └── updateOrderStatus() [admin]
│
└── wishlistController.js
    ├── getWishlist()
    ├── addToWishlist()
    └── removeFromWishlist()


Routes (API Endpoints)
│
├── authRoutes.js
│   └── /api/v1/auth/*
│
├── userRoutes.js
│   └── /api/v1/user/*
│
├── productRoutes.js
│   └── /api/v1/product/*
│
├── orderRoutes.js
│   └── /api/v1/order/*
│
└── wishlistRoutes.js
    └── /api/v1/wishlist/*


Middleware
│
├── auth.js
│   ├── authMiddleware()      - Verify JWT token
│   ├── adminMiddleware()     - Check admin role
│   └── errorHandler()        - Global error handling
│
└── CORS
    └── Allow requests from frontend


Database
│
├── config/database.js
│   └── MySQL connection pool
│
├── config/initDb.js
│   └── Create tables on startup
│
└── Tables
    ├── users
    ├── products
    ├── categories
    ├── brands
    ├── product_images
    ├── reviews
    ├── orders
    ├── order_items
    ├── wishlist
    ├── user_addresses
    └── cart
```

## API Response Format

```
All endpoints return JSON in this format:

Success Response:
{
  "success": true,
  "message": "Operation completed",
  "data": { ... }          // Optional, depends on endpoint
}

Error Response:
{
  "success": false,
  "message": "Error description"
}

Status Codes:
200 - OK (GET, PUT, DELETE)
201 - Created (POST - new resource)
400 - Bad Request (validation error)
401 - Unauthorized (no/invalid token)
403 - Forbidden (insufficient permissions)
404 - Not Found (resource doesn't exist)
500 - Server Error (unexpected error)
```

## Security Layers

```
┌─────────────────────────────────────────────────────┐
│           SECURITY ARCHITECTURE                     │
├─────────────────────────────────────────────────────┤

Layer 1: CORS
└─→ Only allow requests from registered frontend URL
    └─ Blocks cross-origin attacks

Layer 2: Input Validation
└─→ Check request data format and content
    └─ Prevents invalid/malicious data

Layer 3: Authentication
└─→ JWT token verification
    └─ Ensures user is logged in

Layer 4: Authorization
└─→ Role-based access control
    └─ Admin-only endpoints protected

Layer 5: Password Security
└─→ Bcryptjs hashing
    └─ Passwords never stored in plain text

Layer 6: Error Handling
└─→ Generic error messages
    └─ Don't leak sensitive information
```

## Deployment Architecture

```
Production Setup (Example)

┌──────────────────────────────────────┐
│   Frontend (Vercel/Netlify)         │
│   - React + Vite                     │
│   - VITE_SERVER_URL= prod URL       │
└────────────────┬─────────────────────┘
                 │
            HTTPS │
                 │
┌────────────────▼─────────────────────┐
│   Backend (Heroku/Railway/AWS)      │
│   - Node + Express                   │
│   - Environment: production          │
│   - NODE_ENV=production              │
└────────────────┬─────────────────────┘
                 │
            HTTPS │
                 │
┌────────────────▼─────────────────────┐
│   MySQL Database (AWS RDS)          │
│   - Remote database instance         │
│   - Automated backups                │
│   - SSL connection                   │
└─────────────────────────────────────┘
```

## Performance Considerations

```
Optimizations Implemented:

1. Database Indexing
   └─→ Index on: email, category_id, user_id, etc.

2. Connection Pooling
   └─→ MySQL connection pool for efficiency

3. Error Handling
   └─→ Prevents crashes and data leaks

4. Query Optimization
   └─→ Joins for related data
   └─→ Limit and offset for pagination

5. Caching (Can add)
   └─→ Redis for session storage
   └─→ Cache frequently accessed data

6. Rate Limiting (Can add)
   └─→ Prevent abuse
   └─→ API key quotas
```

## Monitoring & Logging (Can add)

```
Recommended additions:

1. Request Logging
   └─→ Log all API requests
   └─→ Track response times

2. Error Logging
   └─→ Monitor failed requests
   └─→ Alert on critical errors

3. Database Monitoring
   └─→ Query performance
   └─→ Connection count

4. Analytics
   └─→ Popular endpoints
   └─→ User behavior patterns

5. Uptime Monitoring
   └─→ Health checks
   └─→ Automated alerts
```

---

This architecture is **production-ready** and **scalable**! 🚀
