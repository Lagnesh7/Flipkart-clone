# Full Stack Web Application

This project is a **full-stack web application** built using **React (Vite)** for the frontend and **Node.js + Express** for the backend.  
It follows a clean **client–server architecture** with proper separation of concerns, modular code structure, and scalable design.

---

# 📌 FRONTEND (Client)

The frontend is built using **React with Vite** and styled using **Tailwind CSS**.  
It handles all user interactions, UI rendering, routing, and API communication.
---

## 📄 Frontend Pages

The application consists of the following major pages:

### 🔐 Authentication Pages
- **Login Page** – User login using email and password
- **Signup Page** – New user registration
- **Forgot Password Page** – OTP-based password reset flow

### 👤 User Pages
- **Profile Page** – View user profile details
- **Edit Profile Page** – Update personal info, skills, and settings

### 🛍 Product Pages
- **Product Listing Page** – Displays all available products
- **Product Details Page** – Shows detailed information of a selected product

### ❤️ Wishlist Page
- Add or remove products from the wishlist
- View all saved products

### 🛒 Orders Pages
- **Checkout Page** – Place an order
- **Orders Page** – View past orders and order status

---

## 🔗 Frontend → Backend Communication

- API base URL is stored in `.env`
- Axios / Fetch is used for HTTP requests
- JWT token is stored securely and sent via headers
- Protected routes are guarded on both frontend and backend

---

# 📌 BACKEND (Server)

The backend is built using **Node.js and Express.js**, following an **MVC-like structure**.  
It provides REST APIs for authentication, users, products, orders, and wishlist.

---


---

## 🔐 Authentication Middleware

- JWT tokens are validated using `middleware/auth.js`
- Protected routes require a valid token
- Unauthorized requests are blocked automatically

---

# 🔄 COMPLETE APPLICATION FLOW

### 1️⃣ User Authentication
- User registers or logs in
- Backend generates a JWT token
- Token is stored on the frontend
- Token is sent with every protected request

---

### 2️⃣ User Interaction
- User browses products
- Adds products to wishlist
- Places orders
- Views order history

---

### 3️⃣ Data Handling
- Frontend sends requests to backend APIs
- Backend validates requests and authentication
- Controllers handle business logic
- Data is stored and retrieved from the database

---

### 4️⃣ Secure Access
- JWT middleware protects sensitive routes
- Only authorized users can access personal data
- Role-based logic can be extended easily

---

# ⚙️ Setup Instructions

## Frontend
```bash
cd client
npm install
npm run dev


