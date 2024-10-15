import { Notification } from '../../database/models/notification';

// Create a notification with specified content
const createNotification = async (userId: string, type: string, content: string, link: string) => {
    const notification = new Notification({ userId, type, content, link });
    return await notification.save();
};

// Notify a user with a custom or default notification message
const notifyUser = async (
    actionType: string, 
    userId: string, 
    actorId: string, 
    link: string, 
    customContent?: string // Optional custom notification content
) => {
    let content = customContent || ''; // Use custom content if provided, otherwise fallback to default

    // Default content based on action type if customContent is not provided
    if (!customContent) {
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
    }

    // Create and save the notification
    return await createNotification(userId, actionType, content, link);
};

// Get all notifications for a user, sorted by date
const getNotificationsByUserId = async (userId: string) => {
    return await Notification.find({ userId }).sort({ createdAt: -1 }); // Sort notifications by date
};

// Mark a notification as read
const markAsRead = async (notificationId: string) => {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
};

export default {
    createNotification,
    getNotificationsByUserId,
    markAsRead,
    notifyUser,
};
