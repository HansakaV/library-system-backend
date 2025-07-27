import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  readerId: mongoose.Types.ObjectId;
  readerName: string;
  readerEmail: string;
  subject: string;
  message: string;
  bookTitles: string[];
  status: 'sent' | 'failed';
  sentAt: Date;
  errorMessage?: string;
}

const NotificationSchema: Schema = new Schema({
  readerId: {
    type: Schema.Types.ObjectId,
    ref: 'Reader',
    required: true
  },
  readerName: {
    type: String,
    required: true
  },
  readerEmail: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  bookTitles: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['sent', 'failed'],
    default: 'sent'
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  errorMessage: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model<INotification>('Notification', NotificationSchema);