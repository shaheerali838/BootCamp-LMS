import transporter from "../config/email.js";

const sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
    });
};

export default sendEmail;