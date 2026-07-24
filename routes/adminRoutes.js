const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    getDashboard,
    updateProfile
} = require("../controllers/adminController");

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get admin dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 */
router.get("/dashboard", protect, adminOnly, getDashboard);
//
///**
// * @swagger
// * /api/admin/profile:
// *   put:
// *     tags:
// *       - Admin
// *     summary: Update admin profile
// *     security:
// *       - bearerAuth: []
// *     requestBody:
// *       required: false
// *       content:
// *         multipart/form-data:
// *           schema:
// *             type: object
// *             properties:
// *               fullName:
// *                 type: string
// *               phone:
// *                 type: string
// *               address:
// *                 type: string
// *               image:
// *                 type: string
// *                 format: binary
// *     responses:
// *       200:
// *         description: Profile updated successfully
// */
//router.put(
//    "/profile",
//    protect,
//    adminOnly,
//    upload.single("image"),
//    updateProfile
//);

module.exports = router;