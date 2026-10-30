'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Send,
  Sparkles,
  BookOpen,
  HelpCircle,
  Briefcase,
  Calendar,
  Zap,
  Terminal,
  User,
  RotateCcw,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'Explain AVL Tree Rotations (LL, RR, LR, RL) with ASCII diagrams',
  'Conduct a Mock Technical Interview on Dijkstra Algorithm (Medium)',
  'How does Kahn Algorithm for Topological Sorting work in C?',
  'Explain the Josephus Problem recurrence relation J(n, k)',
  'Create a 7-day intensive SRM exam study plan for Stacks & Trees',
  'What is the difference between Separate Chaining and Linear Probing?',
];

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your **DSA Mastery AI Tutor & Mentor** powered by the latest Gemini Flash model.

I can help you with:
- 📖 Deep theoretical explanations with ASCII diagrams
- ⚡ Time & space complexity derivations (Big-O, Omega, Theta)
- 🎯 SRM University exam question prep (2, 5, 10, 13, 16 marks)
- 💼 FAANG technical mock interviews & problem breakdown
- 🧪 C pointer & memory debugging (malloc, free, padding)

Select a quick topic below or type your question!`,
      timestamp: '10:00 AM',
    },
  ]);

  const [input, setInput] = useState('');
  const [activePersona, setActivePersona] = useState<'tutor' | 'mentor' | 'interview' | 'planner'>('tutor');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: '10:00 AM',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          feature: activePersona,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.data,
          timestamp: '10:00 AM',
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        toast.error(data.error || 'Failed to get AI response');
      }
    } catch (err: any) {
      toast.error('Network error contacting AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="w-8 h-8 text-rose-500" />
            AI Tutor & FAANG DSA Mentor
          </h1>
          <p className="text-muted text-sm mt-1">
            Instant 1-on-1 tutoring, mock interviews, and tailored study plans powered by Gemini Flash.
          </p>
        </div>

        {/* Persona Selectors */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {[
            { id: 'tutor', label: 'AI Tutor', icon: BookOpen },
            { id: 'mentor', label: 'FAANG Mentor', icon: Sparkles },
            { id: 'interview', label: 'Mock Interview', icon: Briefcase },
            { id: 'planner', label: 'Study Planner', icon: Calendar },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActivePersona(item.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activePersona === item.id ? 'bg-rose-600 text-white shadow' : 'text-muted'
                }`}
              >
                <Icon size={13} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="px-3 py-1.5 rounded-full bg-card border border-card-border hover:border-rose-500/50 text-muted hover:text-foreground text-xs whitespace-nowrap transition-all shadow-sm"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-2xl bg-card border border-card-border p-6 min-h-[480px] max-h-[580px] overflow-y-auto space-y-6 flex flex-col">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3.5 ${
              msg.sender === 'user' ? 'flex-row-reverse ml-auto max-w-xl' : 'max-w-3xl'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
              }`}
            >
              {msg.sender === 'user' ? <User size={16} /> : <Brain size={16} />}
            </div>

            <div
              className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-gray-100 dark:bg-gray-800/60 text-foreground border border-card-border rounded-tl-none'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans leading-relaxed">{msg.text}</pre>
              <div
                className={`text-[10px] text-right ${
                  msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-muted p-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Gemini AI is crafting your detailed response...
          </div>
        )}
      </div>

      {/* Prompt Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${activePersona.toUpperCase()} anything about DSA (e.g. explain Dijkstra algorithm)...`}
          className="flex-1 px-4 py-3 rounded-xl bg-card border border-card-border text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow transition-all disabled:opacity-50"
        >
          <Send size={15} /> Send
        </button>
      </form>
    </div>
  );
}
