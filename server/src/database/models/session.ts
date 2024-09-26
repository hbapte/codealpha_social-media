// src/database/models/session.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

interface Session extends Document {
    userId: string;
    sessionToken: string;
    expiresAt: Date;
}

const sessionSchema: Schema = new Schema({
    userId: { type: String, required: true },
    sessionToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, {timestamps: true});

const Session: Model<Session> = mongoose.model<Session>('Session', sessionSchema);

export default Session;
