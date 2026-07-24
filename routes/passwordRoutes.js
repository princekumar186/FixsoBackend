const express = require("express");

const router = express.Router();

const {
    sendOtp,
    verifyOtp,
    resetPassword
} = require("../controllers/passwordController");
//send-otp
/**
 * @swagger
 * /api/password/send-otp:
 *   post:
 *     tags:
 *       - Password
 *     summary: Send OTP for password reset
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post("/send-otp", sendOtp);
//verify-otp
/**
 * @swagger
 * /api/password/verify-otp:
 *   post:
 *     tags:
 *       - Password
 *     summary: Verify OTP
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post("/verify-otp", verifyOtp);
//reset-password
/**
 * @swagger
 * /api/password/reset-password:
 *   post:
 *     tags:
 *       - Password
 *     summary: Reset user password
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post("/reset-password", resetPassword);

module.exports = router;