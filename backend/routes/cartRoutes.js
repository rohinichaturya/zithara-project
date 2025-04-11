const express = require("express");
const Cart = require("../Models/Cart");
const Product = require("../Models/Products");
const { protect } = require("../middleware/authMiddleware");
const mongoose = require('mongoose');

const router = express.Router();

const getCart = async (userId) => {
    try {
        return await Cart.findOne({ user: userId }).populate('products.productId');
    } catch (error) {
        console.error("Error fetching cart:", error);
        return null;
    }
};

// Add to cart or update quantity
router.post("/", async (req, res) => {
    const { productId, quantity, userId } = req.body;

    try {
        // Validate input
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const quantityNum = parseInt(quantity, 10) || 1;
        let cart = await Cart.findOne({ user: userId });

        if (cart) {
            // Check if product already exists in cart
            const productIndex = cart.products.findIndex(
                p => p.productId.toString() === productId
            );

            if (productIndex > -1) {
                // Update quantity if product exists
                cart.products[productIndex].quantity += quantityNum;
            } else {
                // Add new product to cart
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0]?.url || '',
                    price: product.price,
                    quantity: quantityNum
                });
            }

            // Recalculate total price
            cart.totalPrice = cart.products.reduce(
                (total, item) => total + (item.price * item.quantity),
                0
            );

            cart = await cart.save();
            return res.status(200).json(cart);
        } else {
            // Create new cart
            const newCart = await Cart.create({
                user: userId,
                products: [{
                    productId,
                    name: product.name,
                    image: product.images[0]?.url || '',
                    price: product.price,
                    quantity: quantityNum
                }],
                totalPrice: product.price * quantityNum
            });

            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error("Cart operation error:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Update cart item quantity
router.put("/", async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Validate input
        if (!userId || !productId || quantity < 1) {
            return res.status(400).json({ 
                message: "Invalid request data",
                details: { userId, productId, quantity }
            });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(
            p => p.productId.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Update quantity
        cart.products[productIndex].quantity = quantity;

        // Recalculate total price
        cart.totalPrice = cart.products.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );

        const updatedCart = await cart.save();
        return res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Update cart error:", error);
        return res.status(500).json({ 
            message: "Server Error",
            error: error.message 
        });
    }
});

// Remove item from cart
router.delete("/", async (req, res) => {
    const { productId, userId } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const initialLength = cart.products.length;
        cart.products = cart.products.filter(
            p => p.productId.toString() !== productId
        );

        if (cart.products.length === initialLength) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Recalculate total price
        cart.totalPrice = cart.products.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );

        const updatedCart = await cart.save();
        return res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Remove item error:", error);
        return res.status(500).json({ 
            message: "Server Error",
            error: error.message 
        });
    }
});

// Get cart
router.get("/", async (req, res) => {
    const { userId } = req.query;

    try {
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const cart = await Cart.findOne({ user: userId }).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        return res.status(200).json(cart);
    } catch (error) {
        console.error("Get cart error:", error);
        return res.status(500).json({ 
            message: "Server Error",
            error: error.message 
        });
    }
});

// Merge guest cart with user cart
router.post("/merge", protect, async (req, res) => {
    const { userId } = req.body;

    try {
        const userCart = await Cart.findOne({ user: req.user._id });
        if (!userCart) {
            return res.status(404).json({ message: "User cart not found" });
        }

        const guestCart = await Cart.findOne({ user: userId });
        if (!guestCart) {
            return res.status(404).json({ message: "Guest cart not found" });
        }

        // Merge products
        guestCart.products.forEach(guestItem => {
            const existingItem = userCart.products.find(
                item => item.productId.toString() === guestItem.productId.toString()
            );

            if (existingItem) {
                existingItem.quantity += guestItem.quantity;
            } else {
                userCart.products.push(guestItem);
            }
        });

        // Recalculate total price
        userCart.totalPrice = userCart.products.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );

        await userCart.save();
        await Cart.deleteOne({ user: userId });

        return res.status(200).json(userCart);
    } catch (error) {
        console.error("Merge cart error:", error);
        return res.status(500).json({ 
            message: "Server Error",
            error: error.message 
        });
    }
});

module.exports = router;