import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'your-verified-sender@example.com'; // Use a verified sender email from SendGrid

if (!SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not defined in environment variables.');
    // Optionally throw an error or handle this more robustly
} else {
    sgMail.setApiKey(SENDGRID_API_KEY);
}

export { sgMail, SENDER_EMAIL };