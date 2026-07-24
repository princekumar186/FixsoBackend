const errorHandler = (err, req, res, next) => {

    console.error(err);

    // Duplicate Key Error
    if (err.code === 11000) {

        const field = Object.keys(err.keyPattern)[0];

        return res.status(409).json({
            success: false,
            message: `${field} already exists.`
        });

    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {

        return res.status(400).json({
            success: false,
            message: "Invalid ID."
        });

    }

    // Default Error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

};

module.exports = errorHandler;