// server\src\database\models\user.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {  
  names: string;
  email: string;
  role: string;
  username: string;
  password: string;
  bio?: string;
  avatar?: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
  emailVerified: boolean;
  emailVerificationToken: string;
  emailVerificationTokenCreated: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const userSchema: Schema = new Schema({
  names: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  role: { type: String, default: 'user' },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationTokenCreated: { type: Date, default: Date.now },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, {timestamps: true});

export const User = mongoose.model<IUser>('User', userSchema);  // Ensure this is exported with the interface

export default User;  
