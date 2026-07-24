const User = require("../models/User");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/sendEmail");

const sendOtp = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({
                success: false,
                message: "Email is required."
            });

        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        await Otp.deleteMany({ email });
        await Otp.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendEmail(
            email,
            "FixSo Password Reset OTP",
            `Your OTP is ${otp}. It is valid for 5 minutes.`
        );

        return res.status(200).json({
            success: true,
            message: "OTP Sent Successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};
const verifyOtp = async (req, res) => {

    try {

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required."
            });
        }

        const otpData = await Otp.findOne({ email }).sort({ createdAt: -1 });

        if (!otpData) {
            return res.status(404).json({
                success: false,
                message: "OTP not found."
            });
        }

        if (otpData.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired."
            });
        }

        if (otpData.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP Verified Successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};
const bcrypt = require("bcryptjs");

const resetPassword = async (req, res) => {

    try {

        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {

            return res.status(400).json({
                success: false,
                message: "Email, OTP and Password are required."
            });

        }

        const otpData = await Otp.findOne({ email }).sort({ createdAt: -1 });

        

        if (!otpData) {

            return res.status(404).json({
                success: false,
                message: "OTP not found."
            });

        }


        if (otpData.expiresAt < new Date()) {

            return res.status(400).json({
                success: false,
                message: "OTP Expired."
            });

        }

        if (otpData.otp !== otp) {

            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate(
            { email },
            { password: hashedPassword }
        );

        await Otp.deleteOne({ email });

        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

module.exports = {
    sendOtp,
    verifyOtp,
    resetPassword
};