import { Request, Response, NextFunction } from 'express';
import { sendEmail } from '../utils/emailService';
import Notification from '../models/notificationModel';
import mongoose from 'mongoose';

/**
 * Send an overdue notification to a single reader
 */
export const sendOverdueNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { to, readerName, subject, message, overdueBooks } = req.body;

    if (!to || !readerName || !subject || !message || !overdueBooks) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
      return;
    }

    // Send the email
    const emailResult = await sendEmail({
      to,
      subject,
      html: message.replace(/\n/g, '<br>') // Convert newlines to HTML breaks
    });

    // Create a notification record
    const notification = new Notification({
      readerId: overdueBooks[0]?.readerId || new mongoose.Types.ObjectId(),
      readerName,
      readerEmail: to,
      subject,
      message,
      bookTitles: overdueBooks.map((book: any) => book.bookTitle),
      status: emailResult.success ? 'sent' : 'failed',
      sentAt: new Date(),
      errorMessage: emailResult.error
    });

    await notification.save();

    res.status(200).json({
      success: emailResult.success,
      messageId: emailResult.messageId,
      error: emailResult.error
    });
  } catch (error: any) {
    console.error('Error sending overdue notification:', error);
    next(error);
  }
};

/**
 * Send bulk overdue notifications to multiple readers
 */
export const sendBulkOverdueNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { notifications } = req.body;

    if (!notifications || !Array.isArray(notifications) || notifications.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No notifications provided'
      });
      return;
    }

    const results = [];
    const notificationRecords = [];

    // Process each notification
    for (const notification of notifications) {
      const { to, readerName, subject, message, overdueBooks } = notification;

      if (!to || !readerName || !subject || !message || !overdueBooks) {
        results.push({
          success: false,
          error: 'Missing required fields'
        });
        continue;
      }

      // Send the email
      const emailResult = await sendEmail({
        to,
        subject,
        html: message.replace(/\n/g, '<br>') // Convert newlines to HTML breaks
      });

      results.push(emailResult);

      // Create a notification record
      notificationRecords.push({
        readerId: overdueBooks[0]?.readerId || new mongoose.Types.ObjectId(),
        readerName,
        readerEmail: to,
        subject,
        message,
        bookTitles: overdueBooks.map((book: any) => book.bookTitle),
        status: emailResult.success ? 'sent' : 'failed',
        sentAt: new Date(),
        errorMessage: emailResult.error
      });
    }

    // Save all notification records
    if (notificationRecords.length > 0) {
      await Notification.insertMany(notificationRecords);
    }

    // Calculate summary
    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    res.status(200).json({
      success: successCount > 0,
      message: `${successCount} of ${results.length} notifications sent successfully`,
      results,
      summary: {
        total: results.length,
        sent: successCount,
        failed: failedCount
      }
    });
  } catch (error: any) {
    console.error('Error sending bulk overdue notifications:', error);
    next(error);
  }
};

/**
 * Send a test email to verify configuration
 */
export const sendTestEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { to, name } = req.body;

    if (!to) {
      res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
      return;
    }

    const testMessage = `
      <h1>Test Email from Library Management System</h1>
      <p>Hello ${name || 'there'},</p>
      <p>This is a test email to verify that the email notification system is working correctly.</p>
      <p>If you received this email, it means the system is properly configured.</p>
      <p>Best regards,<br>Library Management System</p>
    `;

    const emailResult = await sendEmail({
      to,
      subject: 'Test Email - Library Management System',
      html: testMessage
    });

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        messageId: emailResult.messageId,
        message: 'Test email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: emailResult.error,
        message: 'Failed to send test email'
      });
    }
  } catch (error: any) {
    console.error('Error sending test email:', error);
    next(error);
  }
};

/**
 * Get notification statistics
 */
export const getNotificationStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalSent, totalFailed, sentToday, recentNotifications] = await Promise.all([
      Notification.countDocuments({ status: 'sent' }),
      Notification.countDocuments({ status: 'failed' }),
      Notification.countDocuments({
        status: 'sent',
        sentAt: { $gte: today }
      }),
      Notification.find()
        .sort({ sentAt: -1 })
        .limit(10)
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSent,
        totalFailed,
        sentToday,
        recentNotifications
      }
    });
  } catch (error: any) {
    console.error('Error getting notification stats:', error);
    next(error);
  }
};

/**
 * Get notification history with pagination
 */
export const getNotificationHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find()
        .sort({ sentAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments()
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        notifications,
        total,
        page,
        totalPages
      }
    });
  } catch (error: any) {
    console.error('Error getting notification history:', error);
    next(error);
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
      return;
    }

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    next(error);
  }
};

/**
 * Retry a failed notification
 */
export const retryFailedNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
      return;
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
      return;
    }

    // Send the email again
    const emailResult = await sendEmail({
      to: notification.readerEmail,
      subject: notification.subject,
      html: notification.message.replace(/\n/g, '<br>')
    });

    // Update the notification status
    notification.status = emailResult.success ? 'sent' : 'failed';
    notification.sentAt = new Date();
    notification.errorMessage = emailResult.error;
    await notification.save();

    res.status(200).json({
      success: emailResult.success,
      messageId: emailResult.messageId,
      error: emailResult.error
    });
  } catch (error: any) {
    console.error('Error retrying notification:', error);
    next(error);
  }
};