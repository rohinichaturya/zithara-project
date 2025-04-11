const mongoose = require('mongoose');
const Product = require("../Models/Products");

const CartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
}, { _id: false });

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    guestId: {
        type: String,
        unique: true,
        sparse: true
    },
    products: {
        type: [CartItemSchema],
        default: []
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamps on save
CartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Recalculate total price before saving
CartSchema.pre('save', function(next) {
    if (this.isModified('products')) {
        this.totalPrice = this.products.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );
    }
    next();
});

module.exports = mongoose.model('Cart', CartSchema);