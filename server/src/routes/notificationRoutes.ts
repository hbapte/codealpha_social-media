// src/routes/notificationRoutes.ts
import { Router } from 'express';
import notificationController from '../modules/notification/notificationController';
import notificationValidation from '../modules/notification/notificationValidation';
import validateRequest from '../middlewares/validation';
import authMiddleware from '../middlewares/authorization';
import sessionMiddleware from '../middlewares/sessionMiddleware';

const notificationRouter = Router();

notificationRouter.post('/:userId', sessionMiddleware, notificationValidation.validateCreateNotification, validateRequest, notificationController.createNotification);
notificationRouter.get('/', sessionMiddleware, notificationController.getNotifications);
notificationRouter.patch('/:notificationId/read', sessionMiddleware, notificationValidation.validateMarkAsRead, validateRequest, notificationController.markNotificationAsRead);

export default notificationRouter;
