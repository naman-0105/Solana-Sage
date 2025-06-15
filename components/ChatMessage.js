//components/ChatMessage.js
import CodeBlock from './CodeBlock';
import ExplanationPanel from './ExplanationPanel';

export default function ChatMessage({ message }) {
  if (message.role === 'user') {
    return (
      <div className="chat-message-user mb-4 bg-gray-800 p-4 rounded-lg">
        <div className="font-medium text-sm text-gray-500 mb-1">You</div>
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    );
  }

  return (
    <div className="chat-message-ai mb-4 bg-gray-600 p-4 rounded-lg">
      <div className="font-medium text-sm text-gray-500 mb-1">Solana Sage AI</div>
      <div className="flex flex-col xl:flex-row gap-4 w-full min-w-0">
        <div className="w-full xl:w-1/3 min-w-0 flex-shrink">
          <ExplanationPanel explanation={message.explanation || message.content} />
        </div>
        {message.code && (
          <div className="w-full xl:w-2/3 min-w-0 flex-shrink">
            <CodeBlock code={message.code} />
          </div>
        )}
      </div>
    </div>
  );
}