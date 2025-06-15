// components/ExplanationPanel.js
import ReactMarkdown from 'react-markdown';

export default function ExplanationPanel({ explanation }) {
  return (
    <div className="explanation-panel p-4 bg-white rounded-lg shadow-md border border-gray-200 overflow-y-auto" style={{ height: 'calc(100vh - 250px)' }}>
      <h3 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-2">How This Works</h3>
      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
        <h4 className="text-md font-medium mb-2 text-gray-800">Solana Program Features:</h4>
        <ReactMarkdown>{explanation}</ReactMarkdown>
      </div>
    </div>
  );
}