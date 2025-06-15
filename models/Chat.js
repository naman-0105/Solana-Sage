import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  code: {
    type: String,
    default: null
  },
  explanation: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    default: 'New Chat'
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ChatSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);