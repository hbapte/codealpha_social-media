// src/modules/notification/notificationValidation.ts
import { body, param } from 'express-validator';

const validateCreateNotification = [
    param('userId').isMongoId().withMessage('Invalid user ID'),
    body('type').isString().notEmpty().withMessage('Type is required'),
    body('content').isString().notEmpty().withMessage('Content is required'),
    body('link').isURL().withMessage('Link must be a valid URL'),
];

const validateMarkAsRead = [
    param('notificationId').isMongoId().withMessage('Invalid notification ID'),
];

export default {
    validateCreateNotification,
    validateMarkAsRead,
};
