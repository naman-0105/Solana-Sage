// pages/api/newchat.js
import dbConnect from '@/lib/dbConnect';
import Chat from '@/models/Chat';
import { generateChatId } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const chatId = generateChatId();

    const chat = new Chat({
      chatId,
      title: 'New Chat',
      messages: []
    });
    
    await chat.save();
    res.status(201).json({ 
      chatId,
      chat: {
        chatId,
        title: 'New Chat',
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      }
    });
  } catch (error) {
    console.error('Error creating new chat:', error);
    res.status(500).json({ message: 'Error creating new chat' });
  }
}