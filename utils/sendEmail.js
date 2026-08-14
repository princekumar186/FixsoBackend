const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 2525,
    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
});

transporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP Verify Error:", error);
    } else {
        console.log("✅ SMTP Server Ready");
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        console.log("📧 Starting email send...");
        console.log("📧 To:", to);
        console.log("📧 From:", process.env.SENDER_EMAIL);

        const info = await transporter.sendMail({
            from: `FixSo <${process.env.SENDER_EMAIL}>`,
            to,
            subject,
            text
        });

        console.log("✅ Email Sent Successfully");
        console.log("📧 Message ID:", info.messageId);

        return info;

    } catch (error) {
        console.error("❌ Email Error:", error);
        throw error;
    }
};

module.exports = sendEmail;