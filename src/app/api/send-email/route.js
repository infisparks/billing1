// src/app/api/send-email/route.js
import nodemailer from 'nodemailer';

const senderEmail = "mudassirs472@gmail.com"; // Replace with your email
const senderPassword = "jpdx dtbt fvbm gtwf"; // Replace with your password

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: senderEmail,
        pass: senderPassword,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export async function POST(req) {
    try {
        const { recipientEmail, appointmentDetails } = await req.json(); // Read body once

        console.log('Sending email to:', recipientEmail);
        console.log('Appointment Details:', appointmentDetails);

        const mailOptions = {
            from: senderEmail,
            to: recipientEmail,
            subject: 'Appointment Approved',
            text: `Your appointment has been approved!\n\nDetails:\n${appointmentDetails}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(JSON.stringify({ error: 'Error sending email.', details: error.message }), { status: 500 });
    }
}
