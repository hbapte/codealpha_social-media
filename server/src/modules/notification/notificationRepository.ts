import { Notification } from '../../database/models/notification';

const createNotification = async (userId: string, type: string, content: string, link: string) => {
    const notification = new Notification({ userId, type, content, link });
    return await notification.save();
};

const notifyUser = async (actionType: string, userId: string, actorId: string, link: string) => {
    let content = '';

    switch (actionType) {
        case 'like':
            content = `User ${actorId} liked your post.`;
            break;
        case 'comment':
            content = `User ${actorId} commented on your post.`;
            break;
        case 'follow':
            content = `User ${actorId} started following you.`;
            break;
        default:
            throw new Error('Unknown action type');
    }

    return await createNotification(userId, actionType, content, link);
};


const getNotificationsByUserId = async (userId: string) => {
    return await Notification.find({ userId }).sort({ createdAt: -1 }); // Sort notifications by date
};

const markAsRead = async (notificationId: string) => {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
};

export default {
    createNotification,
    getNotificationsByUserId,
    markAsRead,
    notifyUser,
};
