const express = require("express");
const Checkout = require("../Models/Checkout");
const Cart = require("../Models/Cart");
const Product = require("../Models/Products");
const Order = require("../Models/Order");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

// ✅ Add a new checkout item
router.post("/", protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;
  
    // Check if checkoutItems array exists and is not empty
    if (!checkoutItems || checkoutItems.length === 0) {
      return res.status(400).json({ message: "No items in checkout" });
    }
  
    // Validate each checkout item
    for (const item of checkoutItems) {
      if (!item.productId || item.productId.trim() === "") {
        return res.status(400).json({ message: "Product ID is required for all checkout items" });
      }
      if (!item.image || item.image.trim() === "") {
        return res.status(400).json({ message: "Image URL is required for all checkout items" });
      }
    }
  
    // Validate shipping address
    if (!shippingAddress || !shippingAddress.postalcode) {
      return res.status(400).json({ message: "Shipping address with postal code is required" });
    }
  
    try {
      const newCheckout = await Checkout.create({
        user: req.user._id,
        checkoutItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
        paymentStatus: "Paid",
        isPaid: true,
      });
  
      console.log(`Checkout created for user: ${req.user._id}`);
      res.status(201).json(newCheckout);
    } catch (error) {
      console.error("Error Creating checkout session:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });
  



router.put("/:id/pay", protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;

    try{
        const checkout = await Checkout.findById(req.params.id);

        if(!checkout){
            return re.status(404).json({ message: "Checkout not found" });
        }

        if(paymentStatus == "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus,
            checkout.paymentDetails = paymentDetails,
            checkout.paidAt = Date.now();
            await checkout.save();

            res.status(200).json(checkout);
        } else {
            res.status(400).json({ message: "Invalid Payment Status" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});




router.post("/:id/finalize", protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);

        if(!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        if(checkout.isPaid && !checkout.isFinalized) {
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails,
            });


            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();


            await Cart.findOneAndDelete({ user: checkout.user });
            res.status(201).json(finalOrder);
        } else if (checkout.isFinalized) {
            res.status(400).json({ message:"Checkout already finalized" });
        } else {
            res.status(400).json({ message: "Checkout is not paid" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Delete a checkout item


module.exports = router;