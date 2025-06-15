// pages/chat.js - Dark mode version
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import ChatSidebar from "@/components/ChatSidebar";
import ChatMessage from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function Chat() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const { chatId } = router.query;
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!chatId || chatId === "undefined") return;

    async function fetchMessages() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/chats?chatId=${chatId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data.chat) {
          setMessages(data.chat.messages || []);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    }

    setMessages([]);
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
}, [input]);

  useEffect(() => {
    const handleRouteChange = () => {
      const query = new URLSearchParams(window.location.search);
      const newChatId = query.get("chatId");
      if (newChatId && newChatId !== chatId) {
        router.push(`/chat?chatId=${newChatId}`, undefined, { shallow: false });
      }
    };
    

    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [chatId, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatId) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          chatId,
          messages: messages,
        }),
      });

      const data = await response.json();

      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await fetch("/api/newchat", {
        method: "POST",
      });
      const data = await response.json();
      setRefreshTrigger((prev) => prev + 1);
      router.push(`/chat?chatId=${data.chatId}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Solana Sage</title>
      </Head>
      <div className="flex h-screen overflow-hidden bg-gray-900">
        <ChatSidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          refreshTrigger={refreshTrigger}
        />

        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-4 min-w-0 bg-gray-800">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <h2 className="text-2xl font-semibold mb-2 text-white">
                  Welcome to Solana Sage
                </h2>
                <p className="text-center max-w-md text-gray-300">
                  Describe the Solana smart contract you want to build, and I&apos;ll
                  generate the code and explain how it works.
                </p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
                {isLoading && (
                  <div className="chat-message-ai mb-4">
                    <div className="font-medium text-sm text-gray-400 mb-1">
                      Solana Sage AI
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse"></div>
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <footer className="border-t border-gray-700 bg-gray-800 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe the Solana smart contract you want to build..."
                rows={1}
                ref={textareaRef}
                className="flex-1 resize-none p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 max-h-[9rem] overflow-y-auto"
                disabled={isLoading}
              />

              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600 disabled:text-gray-400"
              >
                <Send size={18} />
              </Button>
            </form>
          </footer>
        </main>
      </div>
    </>
  );
}
