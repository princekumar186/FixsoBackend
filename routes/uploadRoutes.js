const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {uploadImage} = require("../controllers/uploadController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");


/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     tags:
 *       - Upload
 *     summary: Upload an image
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
 *         description: Image uploaded successfully
 *       400:
 *         description: No image uploaded
 */
router.post(
    "/image",
    protect,
    adminOnly,
    upload.single("image"),
    uploadImage
);

module.exports = router;