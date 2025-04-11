const express = require("express");
const multer = require("multer");
const path = require("path");
const Product = require("../Models/Products");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary storage

router.post("/search-by-image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        // Extract only the filename without extension
        const fullImageName = path.basename(req.file.originalname);
        const imageNameWithoutExt = path.parse(fullImageName).name;  
        console.log("Extracted Image Name:", imageNameWithoutExt);

        // Search for a product where public_id contains the extracted name
        const product = await Product.findOne({ "images.public_id": { $regex: new RegExp(`^${imageNameWithoutExt}`, "i") } });

        if (!product) {
            return res.json({ success: false, message: "No matching product found" });
        }

        res.json({ success: true, product });
    } catch (error) {
        console.error("Error searching product:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
