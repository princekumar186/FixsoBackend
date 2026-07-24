const Booking = require("../models/Booking");

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
            pincode,
            totalAmount
        } = req.body;

        const user = req.user.id;

        const booking = await Booking.create({
            user,
            service,
            bookingDate,
            bookingTime,
            customerName,
            phone,
            address,
            city,
            pincode,
            totalAmount
        });

        res.status(201).json({
            success: true,
            message: "Booking Created Successfully",
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
module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking,
    assignTechnician
};