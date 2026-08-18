const Technician = require("../models/Technician");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Booking = require("../models/Booking");

// Add Technician
const addTechnician = async (req, res) => {

    try {

        const {
            fullName,
            email,
            phone,
            password,
            specialization,
            experience,
            city,
            profileImage
        } = req.body;

        // ==============================
        // 1. Check User already exists
        // ==============================

        const existingUser = await User.findOne({
            $or: [
                { email },
                { phone }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email or Phone already registered."
            });
        }

        // ==============================
        // 2. Hash Password
        // ==============================

        const hashedPassword = await bcrypt.hash(password, 10);

        // ==============================
        // 3. Create User Account
        // ==============================

        const user = await User.create({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role: "technician",
            profileImage: profileImage || ""
        });

        // ==============================
        // 4. Create Technician Profile
        // ==============================

        const technician = await Technician.create({
            fullName,
            email,
            phone,
            specialization,
            experience,
            city,
            profileImage: profileImage || ""
        });

        // ==============================
        // 5. Success Response
        // ==============================

        return res.status(201).json({
            success: true,
            message: "Technician Added Successfully",
            data: {
                technicianId: technician._id,
                userId: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                specialization: technician.specialization,
                experience: technician.experience,
                city: technician.city,
                profileImage: technician.profileImage
            }
        });

    } catch (error) {

        console.error("Add Technician Error:", error);

        // ==============================
        // Duplicate Key
        // ==============================

        if (error.code === 11000) {

            const field = Object.keys(error.keyPattern)[0];

            return res.status(409).json({
                success: false,
                message: `${field} already exists.`
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get All Technicians
const getAllTechnicians = async (req, res) => {

    try {

        const technicians = await Technician.find();

        res.status(200).json({
            success: true,
            count: technicians.length,
            data: technicians
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// Get Technician By ID
const getTechnicianById = async (req, res) => {

    try {

        const technician = await Technician.findById(req.params.id);

        if (!technician) {
            return res.status(404).json({
                success: false,
                message: "Technician not found."
            });
        }

        res.status(200).json({
            success: true,
            data: technician
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// Update Technician
const updateTechnician = async (req, res) => {

    try {

        const technician = await Technician.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Technician Updated Successfully",
            data: technician
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// Delete Technician
const deleteTechnician = async (req, res) => {

    try {

        const technician = await Technician.findByIdAndDelete(req.params.id);

        if (!technician) {
            return res.status(404).json({
                success: false,
                message: "Technician not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Technician Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const Booking = require("../models/Booking");

const getAssignedJobs = async (req, res) => {
    try {

        const technician = await Technician.findById(req.params.id);

        if (!technician) {
            return res.status(404).json({
                success: false,
                message: "Technician not found."
            });
        }

        const jobs = await Booking.find({
            technician: technician._id
        })
            .populate("service", "name price")
            .populate("user", "fullName phone");

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });

    } catch (error) {

        console.error("Get Assigned Jobs Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get My Assigned Jobs - Technician
const getMyAssignedJobs = async (req, res) => {

    try {

        // Logged-in technician ka User ID
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Check technician role
        if (user.role !== "technician") {
            return res.status(403).json({
                success: false,
                message: "Only technicians can access assigned jobs."
            });
        }

        // User email se Technician profile find karo
        const technician = await Technician.findOne({
            email: user.email
        });

        if (!technician) {
            return res.status(404).json({
                success: false,
                message: "Technician profile not found."
            });
        }

        // Technician ki assigned bookings
        const jobs = await Booking.find({
            technician: technician._id
        })
            .populate("service", "name price category duration image")
            .populate("user", "fullName email phone");

        return res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });

    } catch (error) {

        console.error("Get My Assigned Jobs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

module.exports = {
    addTechnician,
    getAllTechnicians,
    getTechnicianById,
    updateTechnician,
    deleteTechnician,
    getAssignedJobs,
    getMyAssignedJobs
};