import { Request, Response } from 'express';
import notificationRepository from './notificationRepository';
import httpStatus from 'http-status';

interface User {
    id: string;
    names?: string;
    role?: string;
}

const createNotification = async (req: Request, res: Response) => {
    const { type, content, link } = req.body;
    const userId = req.params.userId;

    try {
        const newNotification = await notificationRepository.createNotification(userId, type, content, link);
        res.status(httpStatus.CREATED).json({ notification: newNotification });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

const getNotifications = async (req: Request, res: Response) => {

    const user = req.user as User;
    const userId = user?.id; 

    try {
        const notifications = await notificationRepository.getNotificationsByUserId(userId);
        res.status(httpStatus.OK).json({ notifications });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

const markNotificationAsRead = async (req: Request, res: Response) => {
    const notificationId = req.params.notificationId; // ID of the notification to be marked as read

    try {
        const updatedNotification = await notificationRepository.markAsRead(notificationId);
        if (!updatedNotification) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'Notification not found' });
        }
        res.status(httpStatus.OK).json({ notification: updatedNotification });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

export default {
    createNotification,
    getNotifications,
    markNotificationAsRead,
};
