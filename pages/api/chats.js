// pages/api/chats.js
import dbConnect from '@/lib/dbConnect';
import Chat from '@/models/Chat';

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === 'GET') {
      
      if (req.query.chatId && req.query.chatId !== 'undefined') {
        try {
          const chat = await Chat.findOne({ chatId: req.query.chatId });
          
          if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
          }
          
          return res.status(200).json({ chat });
        } catch (error) {
          console.error('Error fetching chat:', error);
          return res.status(500).json({ message: 'Error fetching chat', error: error.message });
        }
      }
      
      
      try {
        const chats = await Chat.find({})
          .sort({ updatedAt: -1 })
          .select('chatId title updatedAt createdAt')
          .limit(20);
        
        return res.status(200).json({ chats });
      } catch (error) {
        console.error('Error fetching chats:', error);
        return res.status(500).json({ message: 'Error fetching chats', error: error.message });
      }
    }

    if (req.method === 'POST') {
      try {
        const { chatId, messages } = req.body;
        
        if (!chatId) {
          return res.status(400).json({ message: 'Chat ID is required' });
        }
        
        let chat = await Chat.findOne({ chatId });
        
        if (!chat) {
          
          chat = new Chat({
            chatId,
            messages: messages || []
          });
        } else {
          
          if (messages) {
            chat.messages = messages;
          }
        }
        
        await chat.save();
        
        return res.status(200).json({ chat });
      } catch (error) {
        console.error('Error updating chat:', error);
        return res.status(500).json({ message: 'Error updating chat', error: error.message });
      }
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}