const crypto = require("crypto");
const Booking = require("../models/Booking");
const razorpay = require("../utils/razorpay");

// ==========================================
// Create Razorpay Order
// ==========================================

const createOrder = async (req, res) => {

    try {

        const { bookingId } = req.body;

        // ==========================================
        // 1. Booking ID required
        // ==========================================

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required."
            });
        }

        // ==========================================
        // 2. Find Booking
        // ==========================================

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        // ==========================================
        // 3. User can pay only own booking
        // ==========================================

        if (
            booking.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to pay for this booking."
            });
        }

        // ==========================================
        // 4. Booking must be Completed
        // ==========================================

        if (booking.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message: "Payment is allowed only after booking completion."
            });
        }

        // ==========================================
        // 5. Already Paid
        // ==========================================

        if (booking.paymentStatus === "Paid") {
            return res.status(400).json({
                success: false,
                message: "Booking is already paid."
            });
        }

        // ==========================================
        // 6. Amount from Database
        // ==========================================

        const amount = booking.totalAmount;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking amount."
            });
        }

        // ==========================================
        // 7. Create Razorpay Order
        // ==========================================

        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `booking_${booking._id}`
        };

        const order = await razorpay.orders.create(options);

        // ==========================================
        // 8. Save Razorpay Order ID
        // ==========================================

        booking.razorpayOrderId = order.id;

        await booking.save();

        // ==========================================
        // 9. Response
        // ==========================================

        return res.status(200).json({
            success: true,
            message: "Payment Order Created Successfully",
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                bookingId: booking._id
            }
        });

    } catch (error) {

        console.error("Create Payment Order Error:", error);

        return res.status(500).json({
            success: false,
            message: "Payment Order Creation Failed"
        });

    }

};


// ==========================================
// Verify Razorpay Payment
// ==========================================

const verifyPayment = async (req, res) => {

    try {

        const {
            bookingId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // ==========================================
        // 1. Required fields
        // ==========================================

        if (
            !bookingId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "All payment details are required."
            });
        }

        // ==========================================
        // 2. Find Booking
        // ==========================================

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        // ==========================================
        // 3. User can pay only own booking
        // ==========================================

        if (
            booking.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to pay for this booking."
            });
        }

        // ==========================================
        // 4. Already Paid
        // ==========================================

        if (booking.paymentStatus === "Paid") {
            return res.status(400).json({
                success: false,
                message: "Booking is already paid."
            });
        }

        // ==========================================
        // 5. Check Razorpay Order ID
        // ==========================================

        if (
            !booking.razorpayOrderId ||
            booking.razorpayOrderId !== razorpay_order_id
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid Razorpay Order ID."
            });
        }

        // ==========================================
        // 6. Verify Razorpay Signature
        // ==========================================

        const body =
            razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {

            return res.status(400).json({
                success: false,
                message: "Invalid Payment Signature."
            });

        }

        // ==========================================
        // 7. Payment Successful
        // ==========================================

        booking.paymentStatus = "Paid";
        booking.razorpayPaymentId = razorpay_payment_id;

        await booking.save();

        // ==========================================
        // 8. Response
        // ==========================================

        return res.status(200).json({
            success: true,
            message: "Payment Verified Successfully",
            data: booking
        });

    } catch (error) {

        console.error("Verify Payment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Payment Verification Failed"
        });

    }

};


module.exports = {
    createOrder,
    verifyPayment
};