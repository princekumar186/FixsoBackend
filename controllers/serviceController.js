const Service = require("../models/Service");

const addService = async (req, res) => {

    try {

        const {
            name,
            category,
            description,
            price,
            duration
        } = req.body;

        const image = req.file ? req.file.filename : "";


        const service = await Service.create({
            name,
            category,
            description,
            price,
            image,
            duration
        });

        res.status(201).json({
            success: true,
            message: "Service Added Successfully",
            data: service
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const getAllServices = async (req, res) => {

    try {

        const services = await Service.find();

        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};
const getServiceById = async (req, res) => {
    try {

        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found."
            });
        }

        res.status(200).json({
            success: true,
            data: service
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};
const updateService = async (req, res) => {

    try {

        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!service) {

            return res.status(404).json({
                success: false,
                message: "Service not found."
            });

        }

        res.status(200).json({
            success: true,
            message: "Service Updated Successfully",
            data: service
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};
const deleteService = async (req, res) => {

    try {

        const service = await Service.findByIdAndDelete(req.params.id);

        if (!service) {

            return res.status(404).json({
                success: false,
                message: "Service not found."
            });

        }

        res.status(200).json({
            success: true,
            message: "Service Deleted Successfully"
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
    addService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};