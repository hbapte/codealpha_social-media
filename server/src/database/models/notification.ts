// server\src\database\models\notification.ts
import mongoose, { Schema, Document } from 'mongoose';

interface INotification extends Document {
  userId: mongoose.Types.ObjectId; // The user who receives the notification
  type: string; // e.g., 'like', 'comment', 'follow'
  content: string; // e.g., 'User X liked your post'
  link: string; // URL to the post or profile
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
    link: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
