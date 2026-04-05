'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { sendMessage } from './actions';

type Message = { role: 'user' | 'assistant'; content: string };

const QUICK_QUESTIONS = [
  'Co mam dziś ugotować?',
  'Co kupić w sobotę?',
  'Co się kończy w lodówce?',
  'Ile białka miałem w tym tygodniu?',
  'Kiedy płacę czynsz?',
  'Ile wydałem w tym miesiącu?',
  'Mam kurczaka i makaron — co ugotować?',
];

export default function AgentClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Cześć! Jestem Agentem Loszki. Znam Wasz plan obiadów, spiżarnię, budżet i rachunki. O co pytasz? 🏠',
    },
  ]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');

    const newMessages: Message[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);

    startTransition(async () => {
      const response = await sendMessage(newMessages.slice(-10));
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    });
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="px-6 py-4 border-b border-zinc-200 bg-white">
        <h1 className="text-xl font-bold text-zinc-800">🤖 Agent Loszki</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Zna plan obiadów · spiżarnię · budżet · rachunki</p>
      </div>

      {/* Quick questions */}
      <div className="px-6 pt-4 flex flex-wrap gap-2 bg-zinc-50 border-b border-zinc-100">
        {QUICK_QUESTIONS.map(q => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            disabled={isPending}
            className="text-xs px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-zinc-600 hover:border-emerald-400 hover:text-emerald-700 transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
        <div className="w-full pb-3" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-sm'
                  : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-sm'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
            </div>
          </div>
        ))}
        {isPending && (
          <div className="flex justify-start">
            <div className="bg-white border border-zinc-200 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-zinc-200 bg-white">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Napisz cokolwiek... (Enter = wyślij)"
            rows={1}
            className="flex-1 px-4 py-2.5 text-sm border border-zinc-200 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isPending || !input.trim()}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            Wyślij
          </button>
        </div>
      </div>
    </div>
  );
}
