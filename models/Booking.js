const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },

    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Technician",
        default: null
    },

    assignedAt: {
        type: Date,
        default: null
    },

    bookingDate: {
        type: Date,
        required: true
    },

    bookingTime: {
        type: String,
        required: true
    },

    customerName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    pincode: {
        type: String,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "Accepted",
            "Technician Assigned",
            "On The Way",
            "Started",
            "Completed",
            "Cancelled"
        ],
        default: "Pending"
    },

    paymentStatus: {
        type: String,
        enum: [
            "Pending",
            "Paid"
        ],
        default: "Pending"
    },
    razorpayOrderId: {
        type: String,
        default: null
    },

    razorpayPaymentId: {
        type: String,
        default: null
    },

}, {
    timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);