const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const protect = require("../middleware/authMiddleware");

const {
    registerValidation,
    loginValidation,
    validate
} = require("../middleware/validation");

const {
    register,
    login,
    getProfile,
    updateProfile
} = require("../controllers/authController");

// Register
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Prince Kumar
 *               email:
 *                 type: string
 *                 example: prince@gmail.com
 *               password:
 *                 type: string
 *                 example: Prince@123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation Error
 */
router.post(
    "/register",
    registerValidation,
    validate,
    register
);

// Login
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: prince@gmail.com
 *               password:
 *                 type: string
 *                 example: Prince@123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
    "/login",
    loginValidation,
    validate,
    login
);

// Profile
/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get logged in user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", 
    protect, 
    getProfile);

//Update_Profile  
/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */  
router.put(
    "/profile",
    protect,
    upload.single("image"),
    updateProfile
);

module.exports = router;