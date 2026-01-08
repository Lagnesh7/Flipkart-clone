# Backend Setup Checklist

## ✅ Pre-Setup (Before Starting)

- [ ] Download and install Node.js (v16+)
- [ ] Download and install MySQL (v8+)
- [ ] Create a Stripe account and get API keys
- [ ] Clone/extract backend folder to `c:\Users\ASUS\Downloads\server`

## 📥 Installation Steps

### Step 1: Install Dependencies
```bash
cd c:\Users\ASUS\Downloads\server
npm install
```
- [ ] All packages installed successfully
- [ ] `node_modules` folder created

### Step 2: Create MySQL Database
Open MySQL command line or MySQL Workbench:
```sql
CREATE DATABASE ecommerce_db;
```
- [ ] Database created successfully
- [ ] Can see `ecommerce_db` in database list

### Step 3: Configure Environment Variables

Copy and rename file:
- [ ] `.env.example` copied to `.env`

Update `.env` file with:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_db
JWT_SECRET=change_this_to_random_string
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISH_KEY=pk_test_xxxxx
FRONTEND_URL=http://localhost:5173
```

- [ ] DB_HOST configured
- [ ] DB_USER configured
- [ ] DB_PASSWORD configured
- [ ] DB_NAME = ecommerce_db
- [ ] JWT_SECRET set (use any random string)
- [ ] STRIPE_SECRET_KEY added
- [ ] STRIPE_PUBLISH_KEY added
- [ ] FRONTEND_URL set

### Step 4: Start the Server

Development mode:
```bash
npm run dev
```

- [ ] Server starts without errors
- [ ] See message: "✓ Server is running on http://localhost:8080"
- [ ] See message: "✓ Database tables initialized successfully"

## 🧪 Testing the Backend

### Health Check
```bash
curl http://localhost:8080/api/v1/health
```
- [ ] Returns `{"success": true, "message": "Server is running"}`

### User Registration
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```
- [ ] Returns success response with userId

### User Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123"
  }'
```
- [ ] Returns token
- [ ] Returns user object

### Get All Products
```bash
curl http://localhost:8080/api/v1/product
```
- [ ] Returns products array
- [ ] Returns success: true

### Get User Auth (requires token)
```bash
curl http://localhost:8080/api/v1/auth/user-auth \
  -H "Authorization: your_token_from_login"
```
- [ ] Returns `"ok": true` with user data

## 🔐 Default Test Accounts

After server starts, use these credentials:

**Regular User:**
- [ ] Email: `test@test.com`
- [ ] Password: `test123`
- [ ] Can login successfully

**Admin User:**
- [ ] Email: `store@flipkart.com`
- [ ] Password: `admin123`
- [ ] Can login successfully
- [ ] Has admin access (role: 1)

## 💳 Stripe Setup

- [ ] Create Stripe account at stripe.com
- [ ] Go to API Keys section
- [ ] Copy Secret Key: `sk_test_xxxxx`
- [ ] Copy Publishable Key: `pk_test_xxxxx`
- [ ] Paste both keys in `.env`

Test cards available:
- [ ] Card 4242 4242 4242 4242 for success
- [ ] Use any future expiry date
- [ ] Use any 3-digit CVC

## 🗄️ Database Verification

Check tables in MySQL:
```sql
USE ecommerce_db;
SHOW TABLES;
```

Should see these tables:
- [ ] users
- [ ] products
- [ ] product_images
- [ ] categories
- [ ] brands
- [ ] reviews
- [ ] orders
- [ ] order_items
- [ ] wishlist
- [ ] user_addresses
- [ ] cart

## 🔌 API Endpoints Testing

### Products
- [ ] GET /api/v1/product - List all products
- [ ] GET /api/v1/product/:id - Get product details
- [ ] POST /api/v1/product - Create product (admin)

### Orders
- [ ] GET /api/v1/order - Get user orders
- [ ] POST /api/v1/order/create-checkout-session - Create Stripe session

### Wishlist
- [ ] GET /api/v1/wishlist - Get wishlist
- [ ] POST /api/v1/wishlist - Add to wishlist
- [ ] DELETE /api/v1/wishlist/:productId - Remove from wishlist

### Users
- [ ] GET /api/v1/user/:userId - Get user profile
- [ ] GET /api/v1/user/:userId/addresses - Get addresses
- [ ] POST /api/v1/user/:userId/addresses - Add address

## 🔗 Frontend Integration

Update frontend `.env`:
```
VITE_SERVER_URL=http://localhost:8080
VITE_STRIPE_PUBLISH_KEY=pk_test_xxxxx
```

- [ ] Frontend .env updated
- [ ] VITE_SERVER_URL points to localhost:8080
- [ ] Stripe keys match backend keys

Start frontend:
```bash
cd c:\Users\ASUS\Downloads\client
npm install
npm run dev
```

- [ ] Frontend runs on http://localhost:5173
- [ ] Backend API accessible from frontend

## 🧹 Troubleshooting Checklist

If you encounter issues:

### Connection Issues
- [ ] MySQL is running (`net start MySQL80` on Windows)
- [ ] Database exists: `ecommerce_db`
- [ ] .env credentials are correct
- [ ] Port 8080 is not in use

### Database Issues
- [ ] Created database: `CREATE DATABASE ecommerce_db;`
- [ ] Check DB_NAME in .env
- [ ] Check DB_USER and DB_PASSWORD
- [ ] Tables auto-created on first run

### Stripe Issues
- [ ] Stripe keys are valid (starts with sk_test_ and pk_test_)
- [ ] Keys are not expired
- [ ] Both SECRET and PUBLISH keys added to .env

### Auth Issues
- [ ] JWT_SECRET is set in .env
- [ ] Token in Authorization header
- [ ] Format: `Authorization: token_string`
- [ ] Not: `Authorization: Bearer token_string`

### Frontend Issues
- [ ] Frontend .env has VITE_SERVER_URL
- [ ] Server running on same URL
- [ ] CORS enabled (should be automatic)

## 📊 Performance Checklist

- [ ] Database queries optimized with indexes
- [ ] Password hashing working (bcryptjs)
- [ ] JWT tokens properly validated
- [ ] CORS enabled for frontend
- [ ] Error handling implemented
- [ ] Response times acceptable

## 🚀 Production Readiness

Before deploying to production:

- [ ] Change JWT_SECRET to strong random string
- [ ] Update NODE_ENV to "production"
- [ ] Add rate limiting middleware
- [ ] Enable HTTPS
- [ ] Use production Stripe keys (sk_live, pk_live)
- [ ] Set appropriate CORS origin
- [ ] Setup environment variables on server
- [ ] Database backups configured
- [ ] Error logging setup
- [ ] Monitor server performance

## 📝 Documentation Review

- [ ] Read README.md
- [ ] Review API_DOCUMENTATION.md
- [ ] Check QUICK_START.md
- [ ] Import postman_collection.json to Postman

## ✨ Final Verification

Run complete test sequence:

1. [ ] Server starts: `npm run dev`
2. [ ] Health check passes
3. [ ] User can register
4. [ ] User can login
5. [ ] Can fetch products
6. [ ] Can create order
7. [ ] Frontend connects
8. [ ] Full flow works end-to-end

## 📞 Support Resources

If stuck:
1. Check terminal for error messages
2. Review error response status codes
3. Verify .env configuration
4. Check database tables exist
5. Test with Postman collection
6. Review API documentation

---

## 🎉 Setup Complete When:

- ✅ All items checked above
- ✅ Server running without errors
- ✅ All API endpoints working
- ✅ Frontend can communicate with backend
- ✅ Tests passing

**You're ready to develop! 🚀**
