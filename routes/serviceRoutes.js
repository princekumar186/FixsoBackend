const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    addService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
} = require("../controllers/serviceController");

const {
    serviceValidation,
    validate
} = require("../middleware/validation");


//Get All Services
/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of all services
 */
router.get("/", getAllServices);

//Get Service By ID
/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service found
 *       404:
 *         description: Service not found
 */
router.get("/:id", getServiceById);

//Update Service
/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update service
 *     tags: [Services]
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
 *         description: Service updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, adminOnly, upload.single("image"), updateService);

//Delete Service
/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete service
 *     tags: [Services]
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
 *         description: Service deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, adminOnly, deleteService);

//Add Service
/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Add a new service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: AC Repair
 *               description:
 *                 type: string
 *                 example: Professional AC repair service
 *               price:
 *                 type: number
 *                 example: 499
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Service added successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/",
    protect,
    adminOnly,
    upload.single("image"),
    serviceValidation,
    validate,
    addService
);

module.exports = router;