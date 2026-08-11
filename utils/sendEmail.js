const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    host: "smtp-relay.brevo.com",

    port: 587,

    secure: false,

    family: 4,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    requireTLS: true,

    tls: {
        rejectUnauthorized: false
    },

    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000

});


// ================================
// SMTP CONNECTION TEST
// ================================

transporter.verify((error, success) => {

    if (error) {

        console.error("❌ SMTP Verify Error:", error);

    } else {

        console.log("✅ SMTP Server Ready");

    }

});


// ================================
// SEND EMAIL
// ================================

const sendEmail = async (to, subject, text) => {

    try {

        console.log("📧 Starting email send...");
        console.log("📧 To:", to);
        console.log("📧 From:", process.env.SENDER_EMAIL);

        const info = await transporter.sendMail({

            from: `FixSo <${process.env.SENDER_EMAIL}>`,

            to: to,

            subject: subject,

            text: text

        });

        console.log("✅ Email Sent Successfully");

        console.log("📨 Message ID:", info.messageId);

        return info;

    } catch (error) {

        console.error("❌ Email Error:", error);

        throw error;

    }

};


module.exports = sendEmail;