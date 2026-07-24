const mongoose = require("mongoose");

const technicianSchema = new mongoose.Schema(
{
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },

    specialization: {
        type: String,
        required: true
    },

    experience: {
        type: Number,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    profileImage: {
        type: String,
        default: ""
    },

    isAvailable: {
        type: Boolean,
        default: true
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Technician", technicianSchema);