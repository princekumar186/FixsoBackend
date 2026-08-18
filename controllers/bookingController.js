const Booking = require("../models/Booking");
const Service = require("../models/Service");
const User = require("../models/User");
const Technician = require("../models/Technician");

const createBooking = async (req, res) => {

    try {

        const {
            service,
            bookingDate,
            bookingTime,
            customerName,
            phone,
            address,
            city,
            pincode
        } = req.body;

        // Logged-in user
        const user = req.user.id;

        // ===============================
        // 1. Check Service ID
        // ===============================

        const serviceData = await Service.findById(service);

        if (!serviceData) {
            return res.status(404).json({
                success: false,
                message: "Service not found."
            });
        }

        // ===============================
        // 2. Check Service Active
        // ===============================

        if (!serviceData.isActive) {
            return res.status(400).json({
                success: false,
                message: "This service is currently unavailable."
            });
        }

        // ===============================
        // 3. Validate Booking Date
        // ===============================

        const selectedDate = new Date(bookingDate);

        if (isNaN(selectedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking date."
            });
        }

        const today = new Date();

        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return res.status(400).json({
                success: false,
                message: "Booking date cannot be in the past."
            });
        }

        // ===============================
        // 4. Check Duplicate Booking
        // ===============================

        const existingBooking = await Booking.findOne({
            user,
            service,
            bookingDate: selectedDate,
            bookingTime,
            status: {
                $nin: ["Cancelled"]
            }
        });

        if (existingBooking) {
            return res.status(409).json({
                success: false,
                message: "You already have a booking for this service at this date and time."
            });
        }

        // ===============================
        // 5. Backend Calculates Amount
        // ===============================

        const totalAmount = serviceData.price;

        // ===============================
        // 6. Create Booking
        // ===============================

        const booking = await Booking.create({
            user,
            service,
            bookingDate: selectedDate,
            bookingTime,
            customerName,
            phone,
            address,
            city,
            pincode,
            totalAmount
        });

        // ===============================
        // 7. Return Booking
        // ===============================

        const populatedBooking = await Booking.findById(booking._id)
            .populate("user", "fullName email phone")
            .populate("service", "name category price image duration");

        return res.status(201).json({
            success: true,
            message: "Booking Created Successfully",
            data: populatedBooking
        });

    } catch (error) {

        console.error("Create Booking Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const getAllBookings = async (req, res) => {

    try {

        const bookings = await Booking.find()
            .populate("user", "fullName email phone")
            .populate("service", "name category price");

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};
const getBookingById = async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id)
            .populate("user", "fullName email phone")
            .populate("service", "name category price");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        // 👈 ISI JAGAH ye code add karna hai

        if (
            booking.user._id.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};
const updateBookingStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking Status Updated",
            data: booking
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};
const deleteBooking = async (req, res) => {

    try {

        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};
const assignTechnician = async (req, res) => {

    try {

        const { technicianId } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            {
                technician: technicianId,
                status: "Technician Assigned",
                assignedAt: new Date()
            },
            {
                new: true
            }
        )
            .populate("technician", "fullName phone specialization");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Technician Assigned Successfully",
            data: booking
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const updateTechnicianJobStatus = async (req, res) => {
    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        // Technician hi apni assigned booking update kare
        if (req.user.role !== "technician") {
            return res.status(403).json({
                success: false,
                message: "Only technician can update job status."
            });
        }

        // Booking me technician assigned hai ya nahi
        if (!booking.technician) {
            return res.status(400).json({
                success: false,
                message: "No technician assigned to this booking."
            });
        }

        // Logged-in User ka technician profile find karo

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.role !== "technician") {
            return res.status(403).json({
                success: false,
                message: "Only technician can update job status."
            });
        }

        const technician = await Technician.findOne({
            email: user.email
        });

        if (!technician) {
            return res.status(404).json({
                success: false,
                message: "Technician profile not found."
            });
        }

        // Check karo ki ye booking isi technician ko assigned hai
        if (booking.technician.toString() !== technician._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not assigned to this booking."
            });
        }

        const { status } = req.body;

        // Allowed status
        const allowedStatuses = [
            "Started",
            "Completed"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Use Started or Completed."
            });
        }

        // Status flow control
        if (status === "Started") {

            if (booking.status !== "Technician Assigned") {
                return res.status(400).json({
                    success: false,
                    message: "Booking must be Technician Assigned before starting."
                });
            }

        }

        if (status === "Completed") {

            if (booking.status !== "Started") {
                return res.status(400).json({
                    success: false,
                    message: "Booking must be Started before completing."
                });
            }

        }

        booking.status = status;

        await booking.save();

        const updatedBooking = await Booking.findById(booking._id)
            .populate("user", "fullName email phone")
            .populate("service", "name category price image duration")
            .populate("technician", "fullName phone specialization");

        return res.status(200).json({
            success: true,
            message: `Booking status updated to ${status}`,
            data: updatedBooking
        });

    } catch (error) {

        console.error("Update Technician Job Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

const cancelBooking = async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        // ==========================================
        // 1. User can cancel only their own booking
        // ==========================================

        if (
            booking.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to cancel this booking."
            });
        }

        // ==========================================
        // 2. Already cancelled
        // ==========================================

        if (booking.status === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking is already cancelled."
            });
        }

        // ==========================================
        // 3. Completed booking cannot be cancelled
        // ==========================================

        if (booking.status === "Completed") {
            return res.status(400).json({
                success: false,
                message: "Completed booking cannot be cancelled."
            });
        }

        // ==========================================
        // 4. Started booking cannot be cancelled
        // ==========================================

        if (booking.status === "Started") {
            return res.status(400).json({
                success: false,
                message: "Started booking cannot be cancelled."
            });
        }

        // ==========================================
        // 5. Cancel booking
        // ==========================================

        booking.status = "Cancelled";

        await booking.save();

        // ==========================================
        // 6. Return updated booking
        // ==========================================

        const updatedBooking = await Booking.findById(booking._id)
            .populate("user", "fullName email phone")
            .populate("service", "name category price image duration")
            .populate("technician", "fullName phone specialization");

        return res.status(200).json({
            success: true,
            message: "Booking Cancelled Successfully",
            data: updatedBooking
        });

    } catch (error) {

        console.error("Cancel Booking Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking,
    assignTechnician,
    updateTechnicianJobStatus,
    cancelBooking
};