"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface Message {
  type: "user" | "bot";
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
    <div className="bg-slate-800/90 rounded-lg shadow-sm border border-slate-700">
      <div
        className="p-5 cursor-pointer flex justify-between items-start hover:bg-slate-750 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold text-base text-slate-100 leading-tight">
            {medicine.medicine_name}
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            {medicine.uses}
          </p>
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 bg-slate-700/50 rounded-full text-xs font-medium text-slate-300">
              {medicine.type}
            </span>
            <span className="text-slate-400 text-sm">•</span>
            <span className="text-slate-400 text-sm font-medium">
              ₹{medicine.price}
            </span>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="h-5 w-5 text-slate-400 mt-1" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-slate-400 mt-1" />
        )}
      </div>

      {isExpanded && (
        <div className="p-5 border-t border-slate-700 space-y-6">
          {medicine.image_url && (
            <div className="relative h-48 bg-slate-900 rounded-lg overflow-hidden">
              <Image
                src={medicine.image_url || ""}
                alt={medicine.medicine_name}
                className="w-full h-full object-contain"
                width={480}
                height={480}
                loading="lazy"
              />
            </div>
          )}

          {/* Key Information */}
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-slate-400 mb-2">
                Composition
              </h5>
              <p className="text-slate-200 text-sm leading-relaxed">
                {medicine.composition}
              </p>
            </div>

            <div>
              <h5 className="text-sm font-medium text-slate-400 mb-2">
                Side Effects
              </h5>
              <p className="text-slate-200 text-sm leading-relaxed">
                {medicine.sideeffects}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <h5 className="text-sm font-medium text-slate-400 mb-1">
                  Manufacturer
                </h5>
                <p className="text-slate-200 text-sm">
                  {medicine.manufacturer}
                </p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-slate-400 mb-1">
                  Pack Size
                </h5>
                <p className="text-slate-200 text-sm">
                  {medicine.packsizelabel}
                </p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-slate-400 mb-1">
                  Type
                </h5>
                <p className="text-slate-200 text-sm">{medicine.type}</p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-slate-400 mb-1">
                  Price
                </h5>
                <p className="text-slate-200 text-sm">₹{medicine.price}</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-2">
              <h5 className="text-sm font-medium text-slate-400 mb-3">
                Customer Reviews
              </h5>
              <div className="space-y-2.5">
                {[
                  {
                    label: "Excellent",
                    value: medicine.excellent_review_percentage,
                    color: "bg-emerald-500/80",
                  },
                  {
                    label: "Average",
                    value: medicine.average_review_percentage,
                    color: "bg-amber-500/80",
                  },
                  {
                    label: "Poor",
                    value: medicine.poor_review_percentage,
                    color: "bg-red-500/80",
                  },
                ].map((review) => (
                  <div key={review.label} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-slate-300">
                      {review.label}
                    </div>
                    <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${review.color} rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${review.value}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-slate-300 tabular-nums">
                      {review.value}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
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
    setInput("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("https://medicine-ai.onrender.com/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          text: userMessage,
          limit: 10,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: data.gemini_answer.replace(/\*/g, "").trim(),
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
            type: med.type,
          })),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:min-h-screen min-h-[93vh] bg-slate-950 font-inter">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">
            Medicine AI Assistant
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Get Info about medications and treatments
          </p>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-lg p-5 ${
                  message.type === "user"
                    ? "bg-slate-800 text-slate-100"
                    : "bg-slate-900 text-slate-100"
                } shadow-sm border border-slate-800`}
              >
                <p className="whitespace-pre-wrap leading-relaxed text-sm">
                  {message.content}
                </p>
                {message.medicines && message.medicines.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium text-sm text-slate-300">
                      Suggested Medicines
                    </h3>
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
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse delay-75" />
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse delay-150" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900 border-t border-slate-800 p-6">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-row gap-3 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about medicines, conditions, or treatments..."
              className="flex-1 rounded-lg border border-slate-700 px-4 py-3
                       bg-slate-800 text-slate-100 placeholder-slate-400
                       focus:outline-none focus:ring-1 focus:ring-slate-600 
                       focus:border-slate-600 text-sm"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-slate-700 text-slate-100 px-6 py-3 
                       rounded-lg hover:bg-slate-600
                       disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed 
                       transition-colors duration-200 text-sm font-medium
                       border border-slate-600"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
