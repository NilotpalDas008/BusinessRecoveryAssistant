"use client";

import { useState } from "react";
import { Sparkles, MessageSquare, Send, X, Bot, Zap, Share2, FileText, ChevronUp, ChevronDown } from "lucide-react";

export function AIAssistant() {
  const [minimized, setMinimized] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "ai" | "user"; text: string }>>([
    {
      role: "ai",
      text: "Hi! I'm your AI Business Advisor. How can I help optimize your customer retention today?",
    },
  ]);

  const quickActions = [
    { label: "Analyze Reviews", icon: Bot, promptText: "Analyze our latest 30-day Google reviews and list top complaint causes." },
    { label: "Generate WhatsApp Campaign", icon: Zap, promptText: "Generate a high-converting 20% discount WhatsApp recovery template." },
    { label: "Generate Instagram Post", icon: Share2, promptText: "Create a promotional Instagram post featuring our 5-star customer feedback." },
    { label: "Business Summary", icon: FileText, promptText: "Give me a 1-paragraph summary of business health and customer retention." },
  ];

  const handleSend = (textToSend?: string) => {
    const messageText = textToSend || prompt;
    if (!messageText.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: messageText }]);
    setPrompt("");

    // Simulate AI response after short delay
    setTimeout(() => {
      let aiReply = "Analyzing business intelligence metrics... ReviveAI processed your request successfully.";

      if (messageText.toLowerCase().includes("whatsapp")) {
        aiReply = "Generated WhatsApp Campaign: 'Hi [Customer]! We noticed your feedback on Friday. Here is 20% OFF (REVIVE20) for your next order!'";
      } else if (messageText.toLowerCase().includes("instagram")) {
        aiReply = "Generated IG Post: 'Loved by over 1,400+ food lovers! 🌟 Thank you for making ABC Restaurant your favorite spot. Use code REVIVE20 this weekend!'";
      } else if (messageText.toLowerCase().includes("summary")) {
        aiReply = "Business Summary: Overall rating is 4.6 ⭐ with an AI Health Score of 91%. 12 negative reviews detected and 84 customers successfully recovered this month!";
      }

      setMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full">
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Panel Header */}
        <div className="bg-[#111113] p-3.5 px-4 flex items-center justify-between border-b border-[#27272A]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">AI Business Advisor</h4>
              <span className="text-[10px] text-emerald-400 font-medium">• Online & Guarding</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(!minimized)}
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-[#27272A]"
              title={minimized ? "Expand" : "Minimize"}
            >
              {minimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Panel Content */}
        {!minimized && (
          <div className="p-4 space-y-3">
            {/* Chat History */}
            <div className="h-44 overflow-y-auto space-y-2 text-xs pr-1">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl max-w-[90%] leading-relaxed ${
                    m.role === "ai"
                      ? "bg-[#111113] border border-[#27272A] text-zinc-200"
                      : "bg-blue-600 text-white ml-auto font-medium"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Quick Actions</span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                {quickActions.map((qa, i) => {
                  const Icon = qa.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSend(qa.promptText)}
                      className="p-2 rounded-lg bg-[#111113] border border-[#27272A] hover:border-blue-500/40 hover:text-blue-300 text-zinc-300 text-left truncate flex items-center gap-1.5 transition-colors"
                    >
                      <Icon className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{qa.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask your AI advisor..."
                className="flex-1 bg-[#111113] border border-[#27272A] rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => handleSend()}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
