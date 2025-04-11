const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: false },
  color: { type: String, required: false },
  quantity: { type: Number, required: true },
},{ _id: false }
);

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    orderItems: [OrderItemSchema],
    shippingAddress: {
        address: { type:String, required: true},
        city: { type:String, required: true},
        postalcode: { type:String, required: true},
        country: { type:String, required: true},
    },
    paymentMethod: {
        type: String,
        required: true,   
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
         type:Boolean,
         default: false,
    },
    deliveredAt: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        default: "pending",
    },
    status: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Processing",
    },
},{ timestamps: true });

module.exports = mongoose.model("order", orderSchema);
