import pool from "../config/database.js";
import bcryptjs from "bcryptjs";

export const seedDatabase = async () => {
    try {
        console.log("🌱 Seeding database with sample data...");

        // Create admin user
        const adminPassword = await bcryptjs.hash("admin123", 10);
        await pool.query(
            "INSERT IGNORE INTO users (id, name, email, password, phone, role) VALUES (1, 'Admin', 'store@flipkart.com', ?, '9999999999', 1)",
            [adminPassword]
        );

        // Create test user
        const userPassword = await bcryptjs.hash("test123", 10);
        await pool.query(
            "INSERT IGNORE INTO users (id, name, email, password, phone, role) VALUES (2, 'Test User', 'test@test.com', ?, '9876543210', 0)",
            [userPassword]
        );

        // Create brands
        const brands = [
            { name: "Apple", logo: "" },
            { name: "Samsung", logo: "" },
            { name: "Sony", logo: "" },
            { name: "LG", logo: "" },
            { name: "Nike", logo: "" },
            { name: "Adidas", logo: "" },
        ];

        for (const brand of brands) {
            await pool.query(
                "INSERT IGNORE INTO brands (name, logo) VALUES (?, ?)",
                [brand.name, brand.logo]
            );
        }

        // Create categories
        const categories = [
            "Electronics",
            "Fashion",
            "Appliances",
            "Home",
            "Furniture",
            "Beauty, Toys and More",
        ];

        for (const category of categories) {
            await pool.query(
                "INSERT IGNORE INTO categories (name) VALUES (?)",
                [category]
            );
        }

        // Add sample products
        const sampleProducts = [
{
    name: "Apple iPhone 17 Pro Max (512GB) - Midnight Black",
    description: "6.8-inch Super Retina XDR display with ProMotion. A17 Bionic chip. Pro camera system with 48MP Main and enhanced night mode.",
    price: 149900,
    discountPrice: 139900,
    stock: 40,
    category: "Electronics",
    brand: "Apple",
    seller: "Flipkart",
    rating: 4.6,
    ratingCount: 850,
    image: "https://www.mobileana.com/wp-content/uploads/2025/06/Apple-iPhone-17-Pro-Max-Cosmic-Orange.webp"
},
            {
                name: "Samsung Galaxy S23 Ultra 5G (256GB)",
                description: "200MP camera, S Pen included, 5000mAh battery",
                price: 124999,
                discountPrice: 109999,
                stock: 35,
                category: "Electronics",
                brand: "Samsung",
                seller: "Flipkart",
                rating: 4.6,
                ratingCount: 890,
                image: "https://cdn.mos.cms.futurecdn.net/Xq8br942qhpRuGKQeXHXoU.jpg"
            },
            {
                name: "Sony WH-1000XM5 Wireless Headphones",
                description: "Industry Leading Noise Canceling, 30 Hours Battery",
                price: 34990,
                discountPrice: 28990,
                stock: 100,
                category: "Electronics",
                brand: "Sony",
                seller: "Flipkart",
                rating: 4.7,
                ratingCount: 2100,
                image: "https://www.sony.co.in/image/b20d6d097590058b010fb5a7b75970c9?fmt=png-alpha&wid=676&hei=400"
            },
            {
                name: "Nike Air Max 270 Running Shoes",
                description: "Comfortable running shoes with Air Max technology",
                price: 12995,
                discountPrice: 9995,
                stock: 200,
                category: "Fashion",
                brand: "Nike",
                seller: "Flipkart",
                rating: 4.3,
                ratingCount: 567,
                image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/pyyixbczj6u5kiwhpjik/W+AIR+MAX+270.png"
            },
            {
                name: "LG 55 inch OLED TV (OLED55C2PSC)",
                description: "4K Ultra HD Smart OLED TV with Dolby Vision IQ",
                price: 149990,
                discountPrice: 119990,
                stock: 20,
                category: "Appliances",
                brand: "LG",
                seller: "Flipkart",
                rating: 4.8,
                ratingCount: 340,
                image: "https://vasanthandco.in/images/productimages/2126__product__Televisions__lg-55inch-139cm-oled55c2psc-4k-ultra-hd-smart-oled-tv-1.png"
            },
            {
                name: "Adidas Ultraboost 22 Running Shoes",
                description: "Premium running shoes with Boost midsole",
                price: 16999,
                discountPrice: 11999,
                stock: 150,
                category: "Fashion",
                brand: "Adidas",
                seller: "Flipkart",
                rating: 4.4,
                ratingCount: 423,
                image: "https://www.stripe3.com/cdn/shop/files/IE1770_1_FOOTWEAR_Photography_SideLateralCenterView_grey.jpg?v=1689607754&width=1946"
            }
        ];

        for (const product of sampleProducts) {
            // Get category and brand IDs
            const [[category]] = await pool.query("SELECT id FROM categories WHERE name = ?", [product.category]);
            const [[brand]] = await pool.query("SELECT id FROM brands WHERE name = ?", [product.brand]);

            if (category && brand) {
                // Check if product already exists
                const [existing] = await pool.query("SELECT id FROM products WHERE name = ?", [product.name]);
                
                if (existing.length === 0) {
                    const [result] = await pool.query(
                        "INSERT INTO products (name, description, price, discountPrice, stock, category_id, brand_id, seller, rating, ratingCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        [product.name, product.description, product.price, product.discountPrice, product.stock, category.id, brand.id, product.seller, product.rating, product.ratingCount]
                    );

                    // Add product image
                    await pool.query(
                        "INSERT INTO product_images (product_id, url, isMain) VALUES (?, ?, true)",
                        [result.insertId, product.image]
                    );
                }
            }
        }

        console.log("✓ Database seeding completed");
    } catch (error) {
        if (error.code !== "ER_DUP_ENTRY") {
            console.error("Error seeding database:", error);
        } else {
            console.log("✓ Data already exists, skipping seed");
        }
    }
};
