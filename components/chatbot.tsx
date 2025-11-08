'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, X } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  id: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper function to generate a simple hash of a string
  const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const timestamp = Date.now();
    const userMessage: Message = { 
      role: 'user', 
      content: input,
      id: `user-${timestamp}-${simpleHash(input)}`
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending message to API...');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message,
        id: `assistant-${Date.now()}-${simpleHash(data.message.substring(0, 20))}`
      }]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = 'Sorry, I encountered an error. Please try again later.';
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: errorMessage,
          id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Open chat"
      >
        <Bot size={24} />
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 max-h-[80vh] flex flex-col shadow-xl">
      <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <h3 className="font-semibold">CarbonAI Assistant</h3>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 p-1 rounded-full"
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Bot size={32} className="mx-auto mb-2 text-primary" />
            <p>Hello! I'm your CarbonAI assistant. How can I help you reduce your carbon footprint today?</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.role === 'assistant' && (
                    <Bot size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.role === 'user' && (
                    <User size={16} className="mt-0.5 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-center justify-start">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about reducing your carbon footprint..."
            className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isLoading}
            className="shrink-0"
          >
            <Send size={16} />
          </Button>
        </div>
      </form>
    </Card>
  );
}
