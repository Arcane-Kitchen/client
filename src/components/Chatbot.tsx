import React, { useState } from 'react';
import { FiMinus, FiX } from 'react-icons/fi';
import wizardImage from '../assets/AI_Wizard.jpg';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, isUser: true };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();
      if (data.message) {
        const aiMessage = { text: data.message, isUser: false };
        setMessages([...messages, userMessage, aiMessage]);
      } else {
        console.error('No message found in the response:', data);
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 m-4 p-4 ${isCollapsed ? 'w-16 h-16' : 'w-80 bg-white rounded-lg shadow-lg'}`}>
      {isCollapsed ? (
        <div
          className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
          onClick={() => setIsCollapsed(false)}
        >
          <img src={wizardImage} alt="Wizard" className="w-12 h-12" />
        </div>
      ) : (
        <>
          <div className="flex items-center mb-2">
            <img src={wizardImage} alt="Wizard" className="w-12 h-12 mr-2" />
            <h2 className="text-lg font-bold">Ingredient Substitution Wizard</h2>
            <button
              onClick={() => setIsCollapsed(true)}
              className="ml-auto p-1 bg-gray-200 rounded-full"
            >
              <FiMinus />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="ml-2 p-1 bg-gray-200 rounded-full"
            >
              <FiX />
            </button>
          </div>
          <div className="h-64 overflow-y-auto mb-2">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {message.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border rounded-l-lg"
              placeholder="Ask about ingredient substitutions..."
            />
            <button onClick={handleSendMessage} className="p-2 bg-blue-500 text-white rounded-r-lg">Send</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;