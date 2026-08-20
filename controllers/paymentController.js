const crypto = require("crypto");

const Booking = require("../models/Booking");
const razorpay = require("../utils/razorpay");

// =====================================================
// CREATE RAZORPAY ORDER
// POST /api/payment/create-order
// =====================================================

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
        // 2. Find booking
        // ==========================================

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }
        console.log("========== PAYMENT DEBUG ==========");
        console.log("Booking User:", booking.user.toString());
        console.log("Token User:", req.user.id.toString());
        console.log("Token Role:", req.user.role);
        // ==========================================
        // 3. Check booking belongs to logged-in user
        // ==========================================

        if (booking.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to pay for this booking."
            });
        }

        // ==========================================
        // 4. Payment already completed?
        // ==========================================

        if (booking.paymentStatus === "Paid") {
            return res.status(400).json({
                success: false,
                message: "Payment is already completed for this booking."
            });
        }

        // ==========================================
        // 5. Job must be completed
        // ==========================================

        if (booking.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message: "Payment can only be made after the job is completed."
            });
        }

        // ==========================================
        // 6. Amount validation
        // ==========================================

        if (!booking.totalAmount || booking.totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking amount."
            });
        }

        // ==========================================
        // 7. Razorpay Order
        // ==========================================

        const options = {
            amount: Math.round(booking.totalAmount * 100),
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
                bookingId: booking._id,
                totalAmount: booking.totalAmount
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


// =====================================================
// VERIFY RAZORPAY PAYMENT
// POST /api/payment/verify
// =====================================================

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
                message: "All payment verification fields are required."
            });
        }

        // ==========================================
        // 2. Find booking
        // ==========================================

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        // ==========================================
        // 3. Check booking belongs to logged-in user
        // ==========================================

        if (booking.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to verify payment for this booking."
            });
        }

        // ==========================================
        // 4. Check Razorpay order ID
        // ==========================================

        if (
            booking.razorpayOrderId &&
            booking.razorpayOrderId !== razorpay_order_id
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid Razorpay Order ID."
            });
        }

        // ==========================================
        // 5. Generate expected signature
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

        // ==========================================
        // 6. Compare signature
        // ==========================================

        if (expectedSignature !== razorpay_signature) {

            return res.status(400).json({
                success: false,
                message: "Invalid Payment Signature."
            });
        }

        // ==========================================
        // 7. Already paid check
        // ==========================================

        if (booking.paymentStatus === "Paid") {

            return res.status(400).json({
                success: false,
                message: "Payment is already completed."
            });
        }

        // ==========================================
        // 8. Update payment
        // ==========================================

        booking.paymentStatus = "Paid";
        booking.razorpayOrderId = razorpay_order_id;
        booking.razorpayPaymentId = razorpay_payment_id;

        await booking.save();

        // ==========================================
        // 9. Response
        // ==========================================

        return res.status(200).json({
            success: true,
            message: "Payment Verified Successfully",
            data: {
                bookingId: booking._id,
                paymentStatus: booking.paymentStatus,
                razorpayOrderId: booking.razorpayOrderId,
                razorpayPaymentId: booking.razorpayPaymentId,
                totalAmount: booking.totalAmount
            }
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