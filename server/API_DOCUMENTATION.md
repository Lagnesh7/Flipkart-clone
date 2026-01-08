# API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: token_here
```

---

## 1. AUTHENTICATION ENDPOINTS

### Register User
- **Endpoint:** `POST /auth/register`
- **Description:** Create a new user account
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "9876543210"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "userId": 1
  }
  ```

### Login
- **Endpoint:** `POST /auth/login`
- **Description:** Authenticate and get JWT token
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": 0
    }
  }
  ```

### Check User Auth
- **Endpoint:** `GET /auth/user-auth`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "success": true,
    "ok": true,
    "user": { ... }
  }
  ```

### Check Admin Auth
- **Endpoint:** `GET /auth/admin-auth`
- **Auth Required:** Yes (must be admin)
- **Response:**
  ```json
  {
    "success": true,
    "ok": true,
    "user": { ... }
  }
  ```

### Forgot Password
- **Endpoint:** `POST /auth/forgot-password`
- **Body:**
  ```json
  {
    "email": "john@example.com"
  }
  ```

### Reset Password
- **Endpoint:** `POST /auth/reset-password`
- **Body:**
  ```json
  {
    "resetToken": "token_from_email",
    "newPassword": "newpassword123"
  }
  ```

---

## 2. USER ENDPOINTS

### Get All Users (Admin Only)
- **Endpoint:** `GET /user`
- **Auth Required:** Yes (Admin)
- **Response:**
  ```json
  {
    "success": true,
    "total": 10,
    "users": [...]
  }
  ```

### Get User by ID
- **Endpoint:** `GET /user/:userId`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "success": true,
    "user": { ... }
  }
  ```

### Update User Profile
- **Endpoint:** `PUT /user/:userId`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "name": "John Updated",
    "phone": "9876543211"
  }
  ```

### Deactivate Account
- **Endpoint:** `PUT /user/:userId/deactivate`
- **Auth Required:** Yes

### Get User Addresses
- **Endpoint:** `GET /user/:userId/addresses`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "success": true,
    "addresses": [
      {
        "id": 1,
        "user_id": 1,
        "name": "Home",
        "phone": "9876543210",
        "state": "Maharashtra",
        "pincode": "411001",
        "address": "123 Main St",
        "isDefault": true
      }
    ]
  }
  ```

### Add Address
- **Endpoint:** `POST /user/:userId/addresses`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "name": "Office",
    "phone": "9876543210",
    "state": "Maharashtra",
    "pincode": "411001",
    "address": "456 Business Ave",
    "isDefault": false
  }
  ```

### Update Address
- **Endpoint:** `PUT /user/:userId/addresses/:addressId`
- **Auth Required:** Yes
- **Body:** Same as add address

### Delete Address
- **Endpoint:** `DELETE /user/:userId/addresses/:addressId`
- **Auth Required:** Yes

---

## 3. PRODUCT ENDPOINTS

### Get All Products
- **Endpoint:** `GET /product`
- **Response:**
  ```json
  {
    "success": true,
    "total": 50,
    "products": [
      {
        "id": 1,
        "name": "iPhone 13",
        "price": 79999,
        "discountPrice": 69999,
        "stock": 100,
        "rating": 4.5,
        "images": [
          { "url": "image_url" }
        ],
        "brand_name": "Apple",
        "category_name": "Electronics"
      }
    ]
  }
  ```

### Get Filtered Products
- **Endpoint:** `GET /product/filtered-products?category=Electronics&priceRange=[0,100000]&ratings=4`
- **Query Parameters:**
  - `category` (optional): Category name
  - `priceRange` (optional): JSON array [min, max]
  - `ratings` (optional): Minimum rating
- **Response:** Same as all products

### Get Product by ID
- **Endpoint:** `GET /product/:productId`
- **Response:**
  ```json
  {
    "success": true,
    "product": {
      "id": 1,
      "name": "iPhone 13",
      "description": "...",
      "price": 79999,
      "discountPrice": 69999,
      "stock": 100,
      "rating": 4.5,
      "ratingCount": 250,
      "images": [...],
      "reviews": [
        {
          "id": 1,
          "rating": 5,
          "comment": "Great product!",
          "user_name": "John",
          "createdAt": "2024-01-01T10:00:00Z"
        }
      ]
    }
  }
  ```

### Create Product (Admin Only)
- **Endpoint:** `POST /product`
- **Auth Required:** Yes (Admin)
- **Body:**
  ```json
  {
    "name": "iPhone 14",
    "description": "Latest iPhone",
    "price": 99999,
    "discountPrice": 89999,
    "stock": 50,
    "category": "Electronics",
    "brand": "Apple",
    "seller": "Flipkart",
    "images": ["image_url_1", "image_url_2"]
  }
  ```

### Update Product (Admin Only)
- **Endpoint:** `PUT /product/:productId`
- **Auth Required:** Yes (Admin)
- **Body:** Same as create product

### Delete Product (Admin Only)
- **Endpoint:** `DELETE /product/:productId`
- **Auth Required:** Yes (Admin)

### Get Product Reviews
- **Endpoint:** `GET /product/:productId/reviews`
- **Response:**
  ```json
  {
    "success": true,
    "reviews": [...]
  }
  ```

### Add Product Review
- **Endpoint:** `POST /product/:productId/reviews`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "rating": 5,
    "comment": "Excellent product!"
  }
  ```

---

## 4. ORDER ENDPOINTS

### Get User Orders
- **Endpoint:** `GET /order`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "success": true,
    "orders": [
      {
        "id": 1,
        "orderId": "ORDER-1234567890",
        "totalPrice": 200000,
        "totalPriceAfterDiscount": 180000,
        "orderStatus": "Processing",
        "paymentStatus": "Paid",
        "paymentMethod": "Stripe",
        "createdAt": "2024-01-01T10:00:00Z",
        "orderItems": [...]
      }
    ]
  }
  ```

### Get Order Details
- **Endpoint:** `GET /order/:orderId`
- **Auth Required:** Yes
- **Response:** Single order object

### Create Checkout Session (Stripe)
- **Endpoint:** `POST /order/create-checkout-session`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "products": [
      {
        "productId": 1,
        "name": "iPhone 13",
        "price": 79999,
        "discountPrice": 69999,
        "quantity": 1,
        "image": "image_url",
        "brandName": "Apple"
      }
    ],
    "frontendURL": "http://localhost:5173",
    "customerEmail": "john@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "session": {
      "id": "cs_test_xxxxx",
      "url": "https://checkout.stripe.com/pay/xxxxx"
    }
  }
  ```

### Verify Payment
- **Endpoint:** `POST /order/verify-payment`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "sessionId": "cs_test_xxxxx",
    "products": [...],
    "shippingAddress": {
      "name": "John",
      "phone": "9876543210",
      "state": "Maharashtra",
      "pincode": "411001",
      "address": "123 Main St"
    }
  }
  ```

### Get All Orders (Admin)
- **Endpoint:** `GET /order/admin/all`
- **Auth Required:** Yes (Admin)

### Update Order Status (Admin)
- **Endpoint:** `PUT /order/admin/:orderId`
- **Auth Required:** Yes (Admin)
- **Body:**
  ```json
  {
    "orderStatus": "Shipped",
    "notes": "Dispatched from warehouse"
  }
  ```

### Delete All Orders (Admin)
- **Endpoint:** `DELETE /order/admin/delete-all`
- **Auth Required:** Yes (Admin)

---

## 5. WISHLIST ENDPOINTS

### Get Wishlist
- **Endpoint:** `GET /wishlist`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "success": true,
    "items": [
      {
        "id": 1,
        "product_id": 5,
        "name": "Samsung TV",
        "price": 50000,
        "images": [...]
      }
    ]
  }
  ```

### Add to Wishlist
- **Endpoint:** `POST /wishlist`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "productId": 5
  }
  ```

### Remove from Wishlist
- **Endpoint:** `DELETE /wishlist/:productId`
- **Auth Required:** Yes

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## Testing Credentials

### User Account
- Email: `test@test.com`
- Password: `test123`

### Admin Account
- Email: `store@flipkart.com`
- Password: `admin123`

---

## Stripe Test Cards

For development/testing payments:

| Card Number | Expiry | CVC | Result |
|---|---|---|---|
| 4242 4242 4242 4242 | Any future date | Any 3 digits | Success |
| 5555 5555 5555 4444 | Any future date | Any 3 digits | Success |
| 378282246310005 | Any future date | Any 3 digits | Amex |

---

## Rate Limiting

Currently no rate limiting is implemented. Add rate limiting middleware for production.

## Notes

- All responses follow a consistent format with `success` and `message` fields
- Timestamps are in ISO 8601 format
- Prices are in Indian Rupees (whole numbers, in paise)
- Product IDs and User IDs are auto-incrementing integers
