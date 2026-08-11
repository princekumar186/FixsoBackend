const sendEmail = async (to, subject, text) => {

    try {

        console.log("📧 Starting Brevo API email...");
        console.log("📧 To:", to);
        console.log("📧 From:", process.env.SENDER_EMAIL);

        const response = await fetch(
            "https://api.brevo.com/v3/smtp/email",
            {
                method: "POST",

                headers: {
                    "accept": "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json"
                },

                body: JSON.stringify({

                    sender: {
                        name: "FixSo",
                        email: process.env.SENDER_EMAIL
                    },

                    to: [
                        {
                            email: to
                        }
                    ],

                    subject: subject,

                    textContent: text

                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error("❌ Brevo API Error:", data);

            throw new Error(
                data.message || "Brevo email sending failed"
            );

        }

        console.log("✅ Email Sent Successfully");
        console.log("📨 Brevo Response:", data);

        return data;

    } catch (error) {

        console.error("❌ Email Error:", error);

        throw error;

    }

};

module.exports = sendEmail;