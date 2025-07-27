import { Router } from 'express';
import {
  sendOverdueNotification,
  sendBulkOverdueNotifications,
  sendTestEmail,
  getNotificationStats,
  getNotificationHistory,
  deleteNotification,
  retryFailedNotification
} from '../controllers/notificationController';
import { authenticateToken } from '../middlewares/authenticateToken';

const notificationRoutes = Router();

// Send notifications
notificationRoutes.post('/send-overdue', sendOverdueNotification);
notificationRoutes.post('/send-bulk-overdue', sendBulkOverdueNotifications);
notificationRoutes.post('/test-email', sendTestEmail);

notificationRoutes.get('/stats', getNotificationStats);
notificationRoutes.get('/history', getNotificationHistory);

notificationRoutes.delete('/:id', authenticateToken, deleteNotification);
notificationRoutes.post('/retry/:id', authenticateToken, retryFailedNotification);

export default notificationRoutes;
