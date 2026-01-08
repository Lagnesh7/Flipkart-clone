# Backend Setup Complete ✓

Your complete E-commerce backend has been created at: `c:\Users\ASUS\Downloads\server`

## 📁 Project Structure

```
server/
├── config/
│   ├── database.js              # MySQL connection setup
│   └── initDb.js                # Database table initialization
├── controllers/                 # Business logic
│   ├── authController.js        # User authentication
│   ├── userController.js        # User management
│   ├── productController.js     # Product CRUD & reviews
│   ├── orderController.js       # Orders & Stripe payments
│   └── wishlistController.js    # Wishlist operations
├── routes/                      # API endpoints
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── wishlistRoutes.js
├── middleware/
│   └── auth.js                  # JWT authentication & admin checks
├── utils/
│   └── seeder.js                # Database seeding
├── server.js                    # Main entry point
├── package.json                 # Dependencies
├── .env.example                 # Environment template
├── .gitignore
├── README.md                    # Full documentation
├── QUICK_START.md               # Quick setup guide
├── API_DOCUMENTATION.md         # Detailed API docs
└── postman_collection.json      # Postman test collection
```

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd c:\Users\ASUS\Downloads\server
npm install
```

### 2. Create MySQL Database
```sql
CREATE DATABASE ecommerce_db;
```

### 3. Setup Environment
Copy `.env.example` to `.env` and update:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce_db
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
FRONTEND_URL=http://localhost:5173
```

### 4. Start Server
```bash
npm run dev
```

Server runs on: `http://localhost:8080`

## 📚 What's Included

### Authentication ✓
- User registration & login
- JWT token-based auth
- Password reset functionality
- Admin role verification
- Secure password hashing with bcryptjs

### Products ✓
- Create, Read, Update, Delete products
- Product filtering by category, price, rating
- Product images management
- Product reviews & ratings system
- Search functionality

### Orders ✓
- Shopping cart management
- Stripe payment integration
- Order creation & tracking
- Order status management
- Admin order management

### Users ✓
- User profile management
- Multiple delivery addresses
- User deactivation
- Admin user management

### Wishlist ✓
- Add/remove items from wishlist
- View wishlist
- Move items to cart

### Additional Features ✓
- CORS enabled for frontend
- Error handling middleware
- Database auto-initialization
- Input validation
- Consistent JSON responses

## 🔌 API Routes

### Base URL
```
http://localhost:8080/api/v1
```

### Auth Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/user-auth` - Verify user token
- `GET /auth/admin-auth` - Verify admin token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

### Product Endpoints
- `GET /product` - Get all products
- `GET /product/filtered-products` - Filter products
- `GET /product/:productId` - Get product details
- `POST /product` - Create product (admin)
- `PUT /product/:productId` - Update product (admin)
- `DELETE /product/:productId` - Delete product (admin)
- `GET /product/:productId/reviews` - Get reviews
- `POST /product/:productId/reviews` - Add review

### Order Endpoints
- `GET /order` - Get user orders
- `POST /order/create-checkout-session` - Create Stripe session
- `POST /order/verify-payment` - Verify payment
- `GET /order/admin/all` - Get all orders (admin)
- `PUT /order/admin/:orderId` - Update order status (admin)

### Wishlist Endpoints
- `GET /wishlist` - Get wishlist
- `POST /wishlist` - Add to wishlist
- `DELETE /wishlist/:productId` - Remove from wishlist

### User Endpoints
- `GET /user/:userId` - Get user profile
- `PUT /user/:userId` - Update profile
- `GET /user/:userId/addresses` - Get addresses
- `POST /user/:userId/addresses` - Add address
- `PUT /user/:userId/addresses/:addressId` - Update address
- `DELETE /user/:userId/addresses/:addressId` - Delete address

## 🔐 Default Test Accounts

**User Account:**
- Email: `test@test.com`
- Password: `test123`

**Admin Account:**
- Email: `store@flipkart.com`
- Password: `admin123`

## 💳 Stripe Test Cards

| Card | Expiry | CVC | Status |
|------|--------|-----|--------|
| 4242 4242 4242 4242 | Any future | Any 3 | ✓ Success |
| 5555 5555 5555 4444 | Any future | Any 3 | ✓ Success |
| 378282246310005 | Any future | Any 3 | ✓ Amex |

## 🗄️ Database Schema

Tables created automatically:
- `users` - User accounts
- `products` - Product catalog
- `product_images` - Product images
- `categories` - Product categories
- `brands` - Product brands
- `reviews` - Product reviews
- `orders` - Customer orders
- `order_items` - Order items
- `wishlist` - User wishlists
- `user_addresses` - Delivery addresses
- `cart` - Shopping cart

## 📦 Dependencies

### Core
- `express` - Web framework
- `mysql2` - MySQL driver
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Authentication
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens

### Payment
- `stripe` - Payment processing

### Development
- `nodemon` - Auto-reload server

## 🔧 Configuration

All configuration in `.env`:

```
PORT=8080
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommerce_db
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISH_KEY=pk_test_xxxxx
FRONTEND_URL=http://localhost:5173
```

## 🐛 Troubleshooting

### MySQL Connection Error
```bash
# Windows: Start MySQL
net start MySQL80

# Mac: Start MySQL
brew services start mysql

# Linux: Start MySQL
sudo service mysql start
```

### Port Already in Use
Change `PORT` in `.env` or kill process on port 8080

### Database Not Found
```sql
CREATE DATABASE ecommerce_db;
```

### Table Already Exists Error
Safe to ignore - tables are already initialized

## 📖 Documentation Files

- **README.md** - Full project documentation
- **QUICK_START.md** - Quick setup guide
- **API_DOCUMENTATION.md** - Complete API reference
- **postman_collection.json** - Postman test collection

## ✅ Next Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE ecommerce_db;
   ```

3. **Configure .env**
   - Copy `.env.example` to `.env`
   - Update database credentials
   - Add Stripe keys

4. **Start Server**
   ```bash
   npm run dev
   ```

5. **Test Endpoints**
   - Use Postman collection
   - Or test with curl commands

6. **Connect Frontend**
   - Update frontend `.env`
   - Set `VITE_SERVER_URL=http://localhost:8080`

## 🎯 Features Checklist

- ✅ User Authentication
- ✅ Product Management
- ✅ Product Filtering & Search
- ✅ Shopping Cart
- ✅ Stripe Payment Integration
- ✅ Order Management
- ✅ Wishlist
- ✅ Product Reviews & Ratings
- ✅ User Profiles & Addresses
- ✅ Admin Dashboard Features
- ✅ JWT Token Security
- ✅ Password Hashing
- ✅ CORS Support
- ✅ Error Handling
- ✅ Database Auto-initialization

## 🔗 Frontend Integration

Update your frontend's `.env`:
```
VITE_SERVER_URL=http://localhost:8080
VITE_STRIPE_PUBLISH_KEY=pk_test_xxxxx
```

The frontend is already configured to communicate with this backend!

## 📞 Support Files

- Check error messages in terminal
- Review API_DOCUMENTATION.md for endpoint details
- Test with postman_collection.json
- Follow QUICK_START.md for setup issues

---

**Backend is ready to use! 🎉**

Start with: `npm run dev`
