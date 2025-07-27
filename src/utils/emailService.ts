import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || 'library@example.com';

// Create a transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Interface for email data
export interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Send an email
 * @param emailData The email data to send
 * @returns Promise with the result of the email sending
 */
export const sendEmail = async (emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    if (!EMAIL_USER || !EMAIL_PASS) {
      throw new Error('Email credentials not configured');
    }

    const mailOptions = {
      from: `"Library Management System" <${EMAIL_FROM}>`,
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email',
    };
  }
};

/**
 * Verify email configuration by sending a test email
 * @returns Promise with the result of the verification
 */
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log('Email server connection verified');
    return true;
  } catch (error) {
    console.error('Email server connection failed:', error);
    return false;
  }
};

export default {
  sendEmail,
  verifyEmailConfig,
};