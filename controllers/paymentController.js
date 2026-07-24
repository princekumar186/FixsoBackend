const crypto = require("crypto");
const Booking = require("../models/Booking");
const razorpay = require("../utils/razorpay");

const createOrder = async (req, res) => {

    try {

        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Amount is required."
            });
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Payment Order Creation Failed"
        });

    }

};
const verifyPayment = async (req, res) => {

    try {

        const {
            bookingId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {

            return res.status(400).json({
                success: false,
                message: "Invalid Payment Signature"
            });

        }

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                paymentStatus: "Paid",
               // razorpayOrderId: razorpay_order_id,
               // razorpayPaymentId: razorpay_payment_id
            },
            {
                new: true
            }
        );
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment Verified Successfully",
            data: booking
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Payment Verification Failed"
        });

    }

};

module.exports = {
    createOrder,
    verifyPayment
};