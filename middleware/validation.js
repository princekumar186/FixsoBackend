const { body, validationResult } = require("express-validator");

// ===============================
// Register Validation
// ===============================
const registerValidation = [

    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full Name is required.")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Full Name must be at least 3 characters.")
        .escape(),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .bail()
        .normalizeEmail()
        .isEmail()
        .withMessage("Please enter a valid email."),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .bail()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter.")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter.")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number.")
        .matches(/[!@#$%^&*]/)
        .withMessage("Password must contain at least one special character."),

    body("phone")
        .optional()
        .trim()
        .isMobilePhone("en-IN")
        .withMessage("Please enter a valid Indian phone number.")

];

// ===============================
// Login Validation
// ===============================
const loginValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .bail()
        .normalizeEmail()
        .isEmail()
        .withMessage("Please enter a valid email."),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")

];

// ===============================
// Booking Validation
// ===============================
const bookingValidation = [

    body("service")
        .notEmpty()
        .withMessage("Service is required."),

    body("bookingDate")
        .notEmpty()
        .withMessage("Booking Date is required.")
        .bail()
        .isISO8601()
        .withMessage("Invalid booking date."),

    body("bookingTime")
        .notEmpty()
        .withMessage("Booking Time is required."),

    body("customerName")
        .trim()
        .notEmpty()
        .withMessage("Customer Name is required.")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Customer Name must be at least 3 characters."),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .bail()
        .isMobilePhone("en-IN")
        .withMessage("Please enter a valid Indian phone number."),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required.")
        .bail()
        .isLength({ min: 10 })
        .withMessage("Address must be at least 10 characters."),

    body("city")
        .trim()
        .notEmpty()
        .withMessage("City is required."),

    body("pincode")
        .trim()
        .notEmpty()
        .withMessage("Pincode is required.")
        .bail()
        .isPostalCode("IN")
        .withMessage("Invalid Indian Pincode."),

    body("totalAmount")
        .notEmpty()
        .withMessage("Total Amount is required.")
        .bail()
        .isNumeric()
        .withMessage("Total Amount must be a number.")

];

// ===============================
// Service Validation
// ===============================
const serviceValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Service Name is required.")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Service Name must be at least 3 characters."),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required.")
        .bail()
        .isLength({ min: 20 })
        .withMessage("Description must be at least 20 characters."),

    body("price")
        .notEmpty()
        .withMessage("Price is required.")
        .bail()
        .isNumeric()
        .withMessage("Price must be a valid number."),

    body("duration")
        .optional()
        .trim()

];

// ===============================
// Review Validation
// ===============================
const reviewValidation = [

    body("service")
        .notEmpty()
        .withMessage("Service ID is required."),

    body("rating")
        .notEmpty()
        .withMessage("Rating is required.")
        .bail()
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5."),

    body("comment")
        .trim()
        .notEmpty()
        .withMessage("Comment is required.")
        .bail()
        .isLength({ min: 10 })
        .withMessage("Comment must be at least 10 characters.")

];

// ===============================
// Technician Validation
// ===============================
const technicianValidation = [

    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full Name is required.")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Full Name must be at least 3 characters."),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .bail()
        .normalizeEmail()
        .isEmail()
        .withMessage("Please enter a valid email."),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .bail()
        .isMobilePhone("en-IN")
        .withMessage("Please enter a valid Indian phone number."),

    body("specialization")
        .trim()
        .notEmpty()
        .withMessage("Specialization is required."),

    body("experience")
        .notEmpty()
        .withMessage("Experience is required.")
        .bail()
        .isNumeric()
        .withMessage("Experience must be a number."),

    body("city")
        .trim()
        .notEmpty()
        .withMessage("City is required.")

];

// ===============================
// Common Validation Result
// ===============================
const validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({
            success: false,
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
            }))
        });

    }

    next();

};

// ===============================
// Exports
// ===============================
module.exports = {
    registerValidation,
    loginValidation,
    bookingValidation,
    serviceValidation,
    reviewValidation,
    technicianValidation,
    validate
};