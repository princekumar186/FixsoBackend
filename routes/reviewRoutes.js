const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addReview,
    getReviews,
    deleteReview
} = require("../controllers/reviewController");

const {
    reviewValidation,
    validate
} = require("../middleware/validation");

// Add Review
/**
 * @swagger
 * /api/reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Add a review
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - service
 *               - rating
 *               - comment
 *             properties:
 *               service:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/",
    protect,
    reviewValidation,
    validate,
    addReview
);

// Get Reviews by Service
/**
 * @swagger
 * /api/reviews/{serviceId}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get reviews by service
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 *       404:
 *         description: Service not found
 */
router.get("/:serviceId", getReviews);

// Delete Review
/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
router.delete("/:id", protect, deleteReview);

module.exports = router;