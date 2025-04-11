const express = require("express");
const Product = require("../Models/Products");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();



router.post("/", protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            countInStock,
            sku,
            category,
            brand,
            colors,
            collections,
            material,
            gender,
            occasion,
            images,
            isFeatured,
            isPublished,
            rating,
            numReviews,
            tags,
            dimensions,
            weight,
            metadata
        } = req.body;

        const newProduct = new Product({
            name,
            description,
            price,
            countInStock,
            sku,
            category,
            brand,
            colors,
            collections,
            material,
            gender,
            occasion,
            images: Array.isArray(images)
                ? images.map((img) => (typeof img === "string" ? { url: img, altText: "Product Image" } : img))
                : [],
            isFeatured: isFeatured ?? false,
            isPublished: isPublished ?? false,
            rating: rating || 0,
            numReviews: numReviews || 0,
            tags: tags || [],
            dimensions,
            weight,
            metadata
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ message: "Failed to create product", error: error.message });
    }
});


// ✅ PUBLIC: Create Product (No Authentication)
router.post("/public", async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            countInStock,
            sku,
            category,
            brand,
            colors,
            collections,
            material,
            gender,
            occasion,
            images,
            isFeatured,
            isPublished,
            rating,
            numReviews,
            tags,
            dimensions,
            weight,
            metadata
        } = req.body;

        const newProduct = new Product({
            name,
            description,
            price,
            countInStock,
            sku,
            category,
            brand,
            colors,
            collections,
            material,
            gender,
            occasion,
            images: Array.isArray(images)
                ? images.map((img) => (typeof img === "string" ? { url: img, altText: "Product Image" } : img))
                : [],
            isFeatured: isFeatured ?? false,
            isPublished: isPublished ?? false,
            rating: rating || 0,
            numReviews: numReviews || 0,
            tags: tags || [],
            dimensions,
            weight,
            metadata
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ message: "Failed to create product", error: error.message });
    }
});



// ✅ GET All Products (Admin)
router.get("/", protect, admin, async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ GET Single Product by ID (Admin)
router.get("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ UPDATE Product by ID (Admin) --> "Save Changes" Feature
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const {
            name,
            description,
            price,
            countInStock,
            sku,
            category,
            brand,
            colors,
            collections,
            material,
            gender,
            occasion,
            images,
            isFeatured,
            isPublished,
            rating,
            numReviews,
            tags,
            dimensions,
            weight,
            metadata
        } = req.body;

        // Updating fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.countInStock = countInStock || product.countInStock;
        product.sku = sku || product.sku;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.colors = colors || product.colors;
        product.collections = collections || product.collections;
        product.material = material || product.material;
        product.gender = gender || product.gender;
        product.occasion = occasion || product.occasion;
        product.images = Array.isArray(images)
  ? images.map((img) => (typeof img === "string" ? { url: img, altText: "Product Image" } : img))
  : product.images;
        product.isFeatured = isFeatured ?? product.isFeatured;
        product.isPublished = isPublished ?? product.isPublished;
        product.rating = rating || product.rating;
        product.numReviews = numReviews || product.numReviews;
        product.tags = tags || product.tags;
        product.dimensions = dimensions || product.dimensions;
        product.weight = weight || product.weight;
        product.metadata = metadata || product.metadata;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({ message: "Failed to update product", error: error.message });
    }
});

// ✅ DELETE Product by ID (Admin)
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const productId = req.params.id;
        
        // Use findByIdAndDelete to remove the product
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        console.log(`Product with ID: ${productId} deleted successfully`);
        res.json({ message: "Product removed successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});




module.exports = router;
