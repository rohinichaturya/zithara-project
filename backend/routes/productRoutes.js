const express = require("express");
const mongoose = require("mongoose");
const Product = require("../Models/Products");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Create a new product
router.post("/", protect, admin, async (req, res) => {
    try {
        const { sku, name, ...rest } = req.body;

        let existingProduct = await Product.findOne({ sku });
        if (existingProduct) {
            return res.status(400).json({ message: "Product with this SKU already exists" });
        }

        const product = new Product({ name, sku, ...rest, user: req.user.id });
        await product.save();

        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Update product details
router.put("/:id", protect, admin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        Object.assign(product, req.body);
        const updatedProduct = await product.save();

        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Fetch all products with category, gender & other filters
router.get("/", async (req, res) => {
    try {
        const { category, collection, material, brand, color, gender, occasion, minPrice, maxPrice, sortBy, search, limit } = req.query;
        let query = {};

        // ✅ Case-insensitive category filtering
        if (category && category.toLowerCase() !== "all") {
            query.category = new RegExp(`^${category}$`, "i");
        }

        if (collection && collection.toLowerCase() !== "all") query.collections = new RegExp(`^${collection}$`, "i");
        if (material) query.material = { $in: material.split(",") };
        if (brand) query.brand = { $in: brand.split(",") };
        if (color) query.colors = { $in: color.split(",") };
        if (occasion) query.occasion = occasion;

        // ✅ Gender Filtering (Supports Multiple Values)
        if (gender) {
            const genderArray = gender.split(",").map(g => new RegExp(`^${g}$`, "i"));
            query.gender = { $in: genderArray };
        }

        // ✅ Price filtering
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // ✅ Search Logic (First check for category match, then general search)
        if (search) {
            const categoryMatch = await Product.findOne({ category: new RegExp(`^${search}$`, "i") });

            if (categoryMatch) {
                query.category = new RegExp(`^${search}$`, "i"); // ✅ Search term is a category
            } else {
                query.$or = [
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ];
            }
        }

        // ✅ Sorting logic
        let sort = {};
        if (sortBy) {
            if (sortBy === "priceAsc") sort = { price: 1 };
            else if (sortBy === "priceDesc") sort = { price: -1 };
            else if (sortBy === "popularity") sort = { rating: -1 };
        }

        // ✅ Fetch and return products
        const products = await Product.find(query).sort(sort).limit(Number(limit) || 0).lean();
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


// ✅ Fetch a single product by ID
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(req.params.id);
        if (product) res.json(product);
        else res.status(404).json({ message: "Product Not Found" });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Fetch best seller product
router.get("/best-seller", async (req, res) => {
    try {
        const bestSeller = await Product.findOne().sort({ rating: -1 }).lean();
        if (!bestSeller) return res.status(404).json({ message: "No best seller found" });

        res.json(bestSeller);
    } catch (error) {
        console.error("Error fetching best seller:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Fetch new arrivals
router.get("/new-arrivals", async (req, res) => {
    try {
        const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8).lean();
        if (!newArrivals.length) return res.status(404).json({ message: "No new arrivals found" });

        res.json(newArrivals);
    } catch (error) {
        console.error("Error fetching new arrivals:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Fetch similar products
router.get("/similar/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(400).json({ message: "Product not found" });

        const similarProducts = await Product.find({
            _id: { $ne: req.params.id },
            gender: product.gender,
            category: product.category,
        }).limit(4).lean();

        res.json(similarProducts);
    } catch (error) {
        console.error("Error fetching similar products:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Delete a product
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        await product.deleteOne();
        res.json({ message: "Product removed" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
