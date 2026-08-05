const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,

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

// SMTP Connection Test
transporter.verify((error, success) => {

    if (error) {
        console.log("❌ SMTP Verify Error:", error);
    } else {
        console.log("✅ SMTP Server Ready");
    }

});

const sendEmail = async (to, subject, text) => {

    try {

        await transporter.sendMail({

            from: `FixSo <${process.env.SENDER_EMAIL}>`,
            to: to,
            subject: subject,
            text: text

        });

        console.log("✅ Email Sent Successfully");

    } catch (error) {

        console.error("❌ Email Error:", error);

        throw error;

    }

};

module.exports = sendEmail;