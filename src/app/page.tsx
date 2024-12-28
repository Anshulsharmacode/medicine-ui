'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface Message {
  type: 'user' | 'bot';
  content: string;
  medicines?: {
    medicine_name: string;
    composition: string;
    uses: string;
    sideeffects: string;
    image_url?: string;
    manufacturer: string;
    excellent_review_percentage: string;
    average_review_percentage: string;
    poor_review_percentage: string;
    price: string;
    packsizelabel: string;
    type: string;
  }[];
}

interface MedicineCardProps {
  medicine: {
    medicine_name: string;
    composition: string;
    uses: string;
    sideeffects: string;
    image_url?: string;
    manufacturer: string;
    excellent_review_percentage: string;
    average_review_percentage: string;
    poor_review_percentage: string;
    price: string;
    packsizelabel: string;
    type: string;
  };
}

const MedicineCard = ({ medicine }: MedicineCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300">
      <div 
        className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <h4 className="font-semibold text-white">{medicine.medicine_name}</h4>
          <p className="text-sm text-gray-400">{medicine.composition}</p>
          <p className="text-sm text-gray-400">{medicine.uses}</p>
        </div>
  
        {isExpanded ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-300" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-300" />
        )}
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-600">
          {medicine.image_url && (
            <Image 
              src={medicine.image_url} 
              alt={medicine.medicine_name}
              className="w-full h-48 object-contain rounded-md"
              loading="lazy"
              width={1920} // Specify width for optimization
              height={1080} // Specify height for optimization
            />
          )}
          <div className="mt-2">
            <p className="text-sm text-gray-400">Side Effects: {medicine.sideeffects}</p>
            <p className="text-sm text-gray-400">Manufacturer: {medicine.manufacturer}</p>
            <p className="text-sm text-gray-400">Price: {medicine.price}₹</p>
            <p className="text-sm text-gray-400">Pack Size: {medicine.packsizelabel}</p>
            <p className="text-sm text-gray-400">Type: {medicine.type}</p>
            <div className="mt-2">
              <p className="text-sm text-gray-400">Reviews:</p>
              <p className="text-sm text-gray-400">Excellent: {medicine.excellent_review_percentage}%</p>
              <p className="text-sm text-gray-400">Average: {medicine.average_review_percentage}%</p>
              <p className="text-sm text-gray-400">Poor: {medicine.poor_review_percentage}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://medicine-ai.onrender.com/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          text: userMessage,
          limit: 10
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        type: 'bot',
        content: data.gemini_answer.replace(/\*/g, '').trim(),
        medicines: data.data.map((med: { [key: string]: string }) => ({
          medicine_name: med.medicine_name,
          composition: med.composition,
          uses: med.uses,
          sideeffects: med.sideeffects,
          image_url: med.image_url,
          manufacturer: med.manufacturer,
          excellent_review_percentage: med.excellent_review_percentage,
          average_review_percentage: med.average_review_percentage,
          poor_review_percentage: med.poor_review_percentage,
          price: med.price,
          packsizelabel: med.packsizelabel,
          type: med.type
        }))
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">
            Medicine AI Assistant
          </h1>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-6 ${
                  message.type === 'user'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-800 text-gray-200'
                } shadow-lg`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                {message.medicines && message.medicines.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="font-semibold text-lg mb-4">Suggested Medicines:</h3>
                    {message.medicines.map((med, idx) => (
                      <MedicineCard key={idx} medicine={med} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100" />
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-gray-800 shadow-lg p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about medicines, conditions, or treatments..."
              className="flex-1 rounded-xl border-2 border-gray-600 p-4 
                       bg-gray-700 text-white focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-8 py-4 
                       rounded-full hover:bg-blue-700 
                       disabled:bg-gray-400 disabled:cursor-not-allowed 
                       transition-all duration-300 font-semibold shadow-lg"
            >
              ⬆️
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}