# Quick Start Guide

## Prerequisites
- MySQL installed and running
- Node.js installed (v16+)

## Step 1: Setup Database

Open MySQL and create the database:
```sql
CREATE DATABASE ecommerce_db;
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Configure Environment

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_db
JWT_SECRET=your_secret_key_change_this
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISH_KEY=your_stripe_public_key
FRONTEND_URL=http://localhost:5173
```

## Step 4: Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✓ Database tables initialized successfully
✓ Server is running on http://localhost:8080
✓ Frontend URL: http://localhost:5173
```

## Step 5: Test the API

### Health Check
```bash
curl http://localhost:8080/api/v1/health
```

### Register a User
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "9876543210"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Frontend Integration

Update your frontend `.env` file to use:
```
VITE_SERVER_URL=http://localhost:8080
```

## Default Test Accounts

After server starts, use:

**User:**
- Email: `test@test.com`
- Password: `test123`

**Admin:**
- Email: `store@flipkart.com`
- Password: `admin123`

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** Make sure MySQL is running
```bash
# Windows
net start MySQL80

# Mac
brew services start mysql

# Linux
sudo service mysql start
```

### Port 8080 Already in Use
```
EADDRINUSE: address already in use :::8080
```
**Solution:** Change PORT in `.env` or kill the process using port 8080

### MySQL User Authentication Failed
```
Error: Access denied for user 'root'@'localhost'
```
**Solution:** Update DB_PASSWORD in `.env` with correct password

### Database Not Found
```
Error: Unknown database 'ecommerce_db'
```
**Solution:** Create the database:
```sql
CREATE DATABASE ecommerce_db;
```

## API Test Flow

1. **Register/Login** to get token
2. **Use token** in Authorization header for protected endpoints
3. **Browse products** without authentication
4. **Add to cart/wishlist** with authentication
5. **Create order** and verify payment with Stripe

## Key Features Enabled

✓ User authentication & JWT
✓ Product management (CRUD)
✓ Product filtering & search
✓ Shopping cart
✓ Stripe payment integration
✓ Order management
✓ Wishlist
✓ Product reviews & ratings
✓ User profiles & addresses
✓ Admin dashboard features

## Next Steps

1. Add product images to database
2. Configure Stripe test keys
3. Create admin account
4. Add sample products
5. Test end-to-end flow with frontend

## Documentation

- **Full API Docs:** See `API_DOCUMENTATION.md`
- **Database Schema:** See `config/initDb.js`
- **Project Structure:** See `README.md`

## Support

For issues:
1. Check error messages in terminal
2. Verify `.env` configuration
3. Ensure MySQL is running
4. Check database tables are created
5. Review API documentation for endpoint details
