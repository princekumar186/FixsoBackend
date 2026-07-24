const protect = require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

const {
    createOrder,
    verifyPayment
} = require("../controllers/paymentController");
//create-order
/**
 * @swagger
 * /api/payment/create-order:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Create Razorpay order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Order created successfully
 *       400:
 *         description: Invalid request
 */

router.post(
    "/create-order",
    protect,
    createOrder
);
//verify
/**
 * @swagger
 * /api/payment/verify:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Verify Razorpay payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Invalid signature
 */
router.post(
    "/verify",
    protect,
    verifyPayment
);

module.exports = router;