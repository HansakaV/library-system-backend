# Email Notification System for Library Management

This document provides instructions on how to test the email notification system for overdue books in the Library Management application.

## Setup

1. Make sure you have the following environment variables set in your `.env` file:

```
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=library-management@example.com
```

For Gmail, you'll need to create an App Password:
- Go to your Google Account > Security
- Enable 2-Step Verification if not already enabled
- Go to App passwords
- Select "Mail" and "Other (Custom name)"
- Enter "Library Management" and click "Generate"
- Use the generated password as your EMAIL_PASS

## Running the Application

1. Start the backend server:
```
cd node-server-class-master
npm run dev
```

2. Start the frontend application:
```
cd frontend/library-mangement
npm run dev
```

3. Navigate to the Notifications page in the application

## Testing Email Functionality

### Single Notification

1. On the Notifications page, you'll see a list of readers with overdue books
2. Click the "Preview" button next to a reader to see the email that will be sent
3. Click "Send Now" to send the notification to that reader

### Bulk Notifications

1. Select multiple readers using the checkboxes
2. Click the "Send to Selected" button at the top of the page to send notifications to all selected readers

## Implementation Details

The email notification system consists of the following components:

### Backend

1. **Email Service** (`src/utils/emailService.ts`): Handles sending emails using Nodemailer
2. **Notification Model** (`src/models/notificationModel.ts`): Stores notification history
3. **Notification Controller** (`src/controllers/notificationController.ts`): Handles API endpoints for sending notifications
4. **Notification Routes** (`src/routes/notificationRoutes.ts`): Defines API routes for notification functionality

### Frontend

1. **Notification Service** (`src/services/notificationService.ts`): Makes API calls to the backend
2. **Notifications Page** (`src/pages/NotificationsPage.tsx`): UI for sending notifications

## Troubleshooting

If emails are not being sent:

1. Check that your email credentials are correct in the `.env` file
2. Make sure your email provider allows sending from less secure apps or using app passwords
3. Check the server logs for any error messages
4. Verify that the backend server is running and accessible from the frontend