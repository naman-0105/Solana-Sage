// pages/api/deleteChat.js
import dbConnect from '@/lib/dbConnect';
import Chat from '@/models/Chat';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { chatId } = req.query;

  if (!chatId) {
    return res.status(400).json({ message: 'Chat ID is required' });
  }

  try {
    await dbConnect();
    
    const result = await Chat.deleteOne({ chatId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ message: 'Error deleting chat' });
  }
}