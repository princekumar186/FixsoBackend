const Review = require("../models/Review");

// Add Review
const addReview = async (req, res) => {
    try {

        const user = req.user.id;
        const { service, rating, comment } = req.body;


        const review = await Review.create({
            user,
            service,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            message: "Review Added Successfully",
            data: review
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// Get Reviews By Service
const getReviews = async (req, res) => {

    try {

        const reviews = await Review.find({
            service: req.params.serviceId
        })
        .populate("user", "fullName profileImage");

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// Delete Review
const deleteReview = async (req, res) => {

    try {

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found."
            });
        }

        // Only review owner or admin can delete
        if (
            review.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: "Review Deleted Successfully"
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
    addReview,
    getReviews,
    deleteReview
};