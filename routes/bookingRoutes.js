const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking,
    assignTechnician,
    updateTechnicianJobStatus,
    cancelBooking
} = require("../controllers/bookingController");

const {
    bookingValidation,
    validate
} = require("../middleware/validation");

// Create Booking (Customer)
router.post(
    "/",
    protect,
    bookingValidation,
    validate,
    createBooking
);

// Get All Bookings (Admin)
router.get(
    "/",
    protect,
    adminOnly,
    getAllBookings
);

// Get Booking By ID (Logged In User)
router.get(
    "/:id",
    protect,
    getBookingById
);

// Update Booking Status (Admin)
router.put(
    "/:id/status",
    protect,
    adminOnly,
    updateBookingStatus
);

// Delete Booking (Admin)
router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteBooking
);

// Assign Technician (Admin)
router.put(
    "/:id/assign",
    protect,
    adminOnly,
    assignTechnician
);
router.put(
    "/:id/technician-status",
    protect,
    updateTechnicianJobStatus
);
// Cancel Booking (Customer / Admin)
router.put(
    "/:id/cancel",
    protect,
    cancelBooking
);
module.exports = router;