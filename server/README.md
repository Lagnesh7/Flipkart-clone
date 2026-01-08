# E-commerce Backend

A complete Node.js and Express backend for the e-commerce platform with MySQL database integration.

## Features

- **Authentication**: User registration, login, JWT tokens, password reset
- **Product Management**: CRUD operations for products with filtering and search
- **Orders**: Order creation, payment processing with Stripe, order tracking
- **User Management**: Profile management, addresses, wishlist
- **Admin Dashboard**: User management, product management, order management
- **Wishlist**: Save favorite items
- **Reviews & Ratings**: Product reviews with rating system
- **Payment Integration**: Stripe payment processing

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Installation

1. **Clone or extract the project**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create MySQL Database**
   ```sql
   CREATE DATABASE ecommerce_db;
   ```

4. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and update:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=ecommerce_db
   JWT_SECRET=your_secret_key
   STRIPE_SECRET_KEY=your_stripe_key
   FRONTEND_URL=http://localhost:5173
   ```

## Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/user-auth` - Check user authentication
- `GET /api/v1/auth/admin-auth` - Check admin authentication
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Users
- `GET /api/v1/user` - Get all users (admin only)
- `GET /api/v1/user/:userId` - Get user by ID
- `PUT /api/v1/user/:userId` - Update user profile
- `PUT /api/v1/user/:userId/deactivate` - Deactivate account
- `GET /api/v1/user/:userId/addresses` - Get user addresses
- `POST /api/v1/user/:userId/addresses` - Add address
- `PUT /api/v1/user/:userId/addresses/:addressId` - Update address
- `DELETE /api/v1/user/:userId/addresses/:addressId` - Delete address

### Products
- `GET /api/v1/product` - Get all products
- `GET /api/v1/product/filtered-products` - Get filtered products
- `GET /api/v1/product/:productId` - Get product by ID
- `POST /api/v1/product` - Create product (admin only)
- `PUT /api/v1/product/:productId` - Update product (admin only)
- `DELETE /api/v1/product/:productId` - Delete product (admin only)
- `GET /api/v1/product/:productId/reviews` - Get product reviews
- `POST /api/v1/product/:productId/reviews` - Add product review

### Orders
- `GET /api/v1/order` - Get user orders
- `GET /api/v1/order/:orderId` - Get order details
- `POST /api/v1/order/create-checkout-session` - Create Stripe checkout
- `POST /api/v1/order/verify-payment` - Verify payment and create order
- `GET /api/v1/order/admin/all` - Get all orders (admin)
- `PUT /api/v1/order/admin/:orderId` - Update order status (admin)
- `DELETE /api/v1/order/admin/delete-all` - Delete all orders (admin)

### Wishlist
- `GET /api/v1/wishlist` - Get user wishlist
- `POST /api/v1/wishlist` - Add to wishlist
- `DELETE /api/v1/wishlist/:productId` - Remove from wishlist

## Database Schema

The database includes the following tables:
- `users` - User accounts
- `products` - Product catalog
- `product_images` - Product images
- `categories` - Product categories
- `brands` - Product brands
- `orders` - Customer orders
- `order_items` - Items in orders
- `reviews` - Product reviews
- `wishlist` - User wishlist
- `user_addresses` - Delivery addresses
- `cart` - Shopping cart items

## Environment Variables

```env
PORT=8080
NODE_ENV=development

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommerce_db
DB_PORT=3306

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISH_KEY=pk_test_xxxxx

# Frontend
FRONTEND_URL=http://localhost:5173
```

## Testing with Stripe

Use these test card details for development:
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3-digit number

## Admin Account Setup

After running the server for the first time, manually create an admin account:

```sql
INSERT INTO users (name, email, password, phone, role) VALUES (
    'Admin',
    'admin@example.com',
    '$2a$10/hashed_password_here',
    '9999999999',
    1
);
```

Or use the register endpoint with:
```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "admin123",
  "phone": "9999999999"
}
```

Then update role to 1 in the database.

## Project Structure

```
server/
├── config/
│   ├── database.js          # MySQL connection
│   └── initDb.js            # Database initialization
├── controllers/             # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── orderController.js
│   └── wishlistController.js
├── routes/                  # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── wishlistRoutes.js
├── middleware/              # Express middleware
│   └── auth.js
├── server.js                # Entry point
├── package.json
└── .env                     # Environment variables
```

## Common Issues

### Database Connection Error
- Ensure MySQL is running
- Check DB credentials in `.env`
- Verify database exists: `CREATE DATABASE ecommerce_db;`

### Stripe Errors
- Use test keys from Stripe dashboard
- Keys must be valid and not expired

### CORS Issues
- Update `FRONTEND_URL` in `.env` to match your frontend URL

## License

ISC
