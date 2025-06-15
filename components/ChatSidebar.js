// components/ChatSidebar.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';

export default function ChatSidebar({ collapsed, setCollapsed, refreshTrigger }) {
  const [chats, setChats] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const router = useRouter();
  const { chatId } = router.query;

  useEffect(() => {
    fetchChats();
  }, [chatId, refreshTrigger]);
  
  async function fetchChats() {
    try {
      const response = await fetch('/api/chats');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setChats(data.chats || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    }
  }

  const handleNewChat = async () => {
    try {
      const response = await fetch('/api/newchat', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.chat) {
        setChats(prevChats => [data.chat, ...prevChats]);
      }
      
      router.push(`/chat?chatId=${data.chatId}`);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const navigateToChat = (e, selectedChatId) => {
    e.preventDefault();
    if (selectedChatId === chatId) return;
    router.push(`/chat?chatId=${selectedChatId}`);
  };
  
  const openDeleteDialog = (e, selectedChatId) => {
    e.preventDefault();
    e.stopPropagation();
    setChatToDelete(selectedChatId);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteChat = async () => {
    if (!chatToDelete) return;
    
    try {
      const response = await fetch(`/api/deleteChat?chatId=${chatToDelete}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setChats(prevChats => prevChats.filter(chat => chat.chatId !== chatToDelete));
        
        if (chatToDelete === chatId) {
          const firstRemainingChat = chats.find(chat => chat.chatId !== chatToDelete);
          if (firstRemainingChat) {
            router.push(`/chat?chatId=${firstRemainingChat.chatId}`);
          } else {
            handleNewChat();
          }
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    } finally {
      setDeleteDialogOpen(false);
      setChatToDelete(null);
    }
  };

  return (
    <>
      <div className={`bg-gray-850 text-white h-screen flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!collapsed && <h2 className="text-xl font-bold">Solana Sage</h2>}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        
        <div className="p-2">
          <Button 
            onClick={handleNewChat} 
            className="w-full bg-white text-gray-900 hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            {!collapsed && <span>New Chat</span>}
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div 
              key={chat.chatId}
              className={`relative group ${
                chatId === chat.chatId ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`}
            >
              <a 
                href={`/chat?chatId=${chat.chatId}`}
                onClick={(e) => navigateToChat(e, chat.chatId)}
                className="block p-3"
              >
                {collapsed ? (
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    {chat.title.charAt(0)}
                  </div>
                ) : (
                  <div>
                    <p className="font-medium truncate pr-8">{chat.title}</p>
                    <p className="text-sm text-gray-400">{formatDate(chat.updatedAt)}</p>
                  </div>
                )}
              </a>
              
              {!collapsed && (
                <button
                  onClick={(e) => openDeleteDialog(e, chat.chatId)}
                  className="absolute right-2 top-3 p-1 rounded opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white hover:bg-gray-700 transition-opacity"
                  title="Delete chat"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteChat}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}