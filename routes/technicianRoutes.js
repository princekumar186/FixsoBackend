const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    technicianValidation,
    validate
} = require("../middleware/validation");

const {
    addTechnician,
    getAllTechnicians,
    getTechnicianById,
    updateTechnician,
    deleteTechnician,
    getAssignedJobs,
    getMyAssignedJobs
} = require("../controllers/technicianController");

// =============================
// Public Routes
// =============================
/**
 * @swagger
 * /api/technicians:
 *   get:
 *     tags:
 *       - Technicians
 *     summary: Get all technicians
 *     responses:
 *       200:
 *         description: List of technicians
 */
router.get("/", getAllTechnicians);


// Get My Assigned Jobs
router.get(
    "/my-jobs",
    protect,
    getMyAssignedJobs
);

/**
 * @swagger
 * /api/technicians/{id}:
 *   get:
 *     tags:
 *       - Technicians
 *     summary: Get technician by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Technician details
 *       404:
 *         description: Technician not found
 */
router.get("/:id", getTechnicianById);

// =============================
// Admin Routes
// =============================

// Add Technician
/**
 * @swagger
 * /api/technicians:
 *   post:
 *     tags:
 *       - Technicians
 *     summary: Add a technician
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Technician added successfully
 *       401:
 *         description: Unauthorized
 */

router.post(
    "/",
    protect,
    adminOnly,
    technicianValidation,
    validate,
    addTechnician
);

// Update Technician
/**
 * @swagger
 * /api/technicians/{id}:
 *   put:
 *     tags:
 *       - Technicians
 *     summary: Update technician
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
 *         description: Technician updated successfully
 */
router.put(
    "/:id",
    protect,
    adminOnly,
    technicianValidation,
    validate,
    updateTechnician
);

// Delete Technician
/**
 * @swagger
 * /api/technicians/{id}:
 *   delete:
 *     tags:
 *       - Technicians
 *     summary: Delete technician
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
 *         description: Technician deleted successfully
 */
router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteTechnician
);

// Get Assigned Jobs
/**
 * @swagger
 * /api/technicians/{id}/jobs:
 *   get:
 *     tags:
 *       - Technicians
 *     summary: Get assigned jobs
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
 *         description: Assigned jobs fetched successfully
 */
router.get(
    "/:id/jobs",
    protect,
    adminOnly,
    getAssignedJobs
);

module.exports = router;