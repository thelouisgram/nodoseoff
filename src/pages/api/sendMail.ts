import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail's SMTP settings
    auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER, // Sender's email address
        pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD, // Email password or app password
    },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        // Respond with an error for non-POST methods
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { to, subject, text } = req.body;

    // Check for missing request body data
    if (!to || !subject || !text) {
        return res.status(400).json({ error: 'Missing required data (to, subject, or text)' });
    }

    try {
        // Send the email
        await transporter.sendMail({
            from: process.env.NEXT_PUBLIC_EMAIL_USER, // Sender's email address
            to, // Recipient's email address
            subject, // Email subject
            text, // Email text body
        });

        // Email sent successfully
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        // Log error and respond with error message
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
    }
}
