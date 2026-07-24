const User = require("../models/User");
const Service = require("../models/Service");
const Booking = require("../models/Booking");

const getDashboard = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalServices = await Service.countDocuments();

        const totalBookings = await Booking.countDocuments();

        const pendingBookings = await Booking.countDocuments({
            status: "Pending"
        });

        const completedBookings = await Booking.countDocuments({
            status: "Completed"
        });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalServices,
                totalBookings,
                pendingBookings,
                completedBookings
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const updateProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.fullName = req.body.fullName || user.fullName;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;

        if (req.file) {
            user.profileImage = req.file.filename;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            data: user
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

module.exports = {
    getDashboard,
    updateProfile
};