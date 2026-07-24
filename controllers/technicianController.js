const Technician = require("../models/Technician");

// Add Technician
const addTechnician = async (req, res) => {

    try {

        const technician = await Technician.create(req.body);

        res.status(201).json({
            success: true,
            message: "Technician Added Successfully",
            data: technician
        });

    } catch (error) {

        console.error(error);

        if (error.code === 11000) {

            const field = Object.keys(error.keyPattern)[0];

            return res.status(409).json({
                success: false,
                message: `${field} already exists.`
            });

        }

        res.status(500).json({
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

        const jobs = await Booking.find({
            technician: req.params.id
        })
            .populate("service", "name price")
            .populate("user", "fullName phone");

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
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
    addTechnician,
    getAllTechnicians,
    getTechnicianById,
    updateTechnician,
    deleteTechnician,
    getAssignedJobs
};