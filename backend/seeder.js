const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./Models/Products"); // Ensure correct file path
const User = require("./Models/Users");
const Cart = require("./Models/Cart");
const products = require("./data/products"); // Ensure this is an array

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => console.error("MongoDB Connection Error:", error));

const seedData = async () => {
    try {
        // Delete existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        // Create Admin User
        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "123456", // Hashing recommended in production
            role: "admin",
        });

        const userID = createdUser._id;

        // Add user ID to each product
        const sampleProducts = products.map((product) => ({
            ...product,
            user: userID,
        }));

        // Insert products into the database
        await Product.insertMany(sampleProducts);

        console.log("Product data seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding the data:", error);
        process.exit(1);
    }
};

seedData();