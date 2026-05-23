/**
 * Example: Using the API from React Components
 * Shows different patterns for consuming the backend API
 */

// Pattern 1: Direct Fetch (Simple)
async function simpleExample() {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Hello' }),
  });
  const data = await response.json();
  console.log(data.data.content);
}

// Pattern 2: Using Helper Functions
import { generateContent, chat } from './api';

async function helperExample() {
  // Generate content
  const result = await generateContent('What is React?');
  console.log(result.content);

  // Chat conversation
  const chatResult = await chat([
    { role: 'user', content: 'Hi there!' }
  ]);
  console.log(chatResult.content);
}

// Pattern 3: React Hook with Error Handling
import { useState } from 'react';

export function useChatAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const sendMessage = async (messages: any[]) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          model: 'gemini-2.0-flash',
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      return data.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
}

// Pattern 4: Custom Component with API Integration
import React from 'react';

interface Props {
  onResponse: (text: string) => void;
}

export function AIChat({ onResponse }: Props) {
  const [input, setInput] = useState('');
  const { sendMessage, loading, error } = useChatAPI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await sendMessage([
        { role: 'user', content: input }
      ]);
      
      onResponse(result.content);
      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type something..."
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

// Pattern 5: Using Different Models
async function multiModelExample() {
  const models = ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'];

  for (const model of models) {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Explain AI',
        model,
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    console.log(`${model}:`, data.data.content);
  }
}

// Pattern 6: Streaming Long Responses
async function longResponseExample() {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Write a detailed article about AI',
      maxOutputTokens: 4000,
    }),
  });

  const data = await response.json();
  
  // Split response into chunks for progressive display
  const text = data.data.content;
  const sentences = text.split('.').filter((s: string) => s.trim());
  
  for (const sentence of sentences) {
    console.log(sentence.trim() + '.');
    await new Promise(resolve => setTimeout(resolve, 100)); // Delay for effect
  }
}

// Pattern 7: Error Recovery with Retry Logic
async function retryExample(maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Test' }),
      });

      const data = await response.json();

      if (data.success) {
        return data.data;
      }

      throw new Error(data.error);
    } catch (err) {
      lastError = err;
      console.log(`Attempt ${i + 1} failed, retrying...`);
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError;
}

// Pattern 8: Type-Safe API Client Class
class AIClient {
  private baseUrl = '/api';
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async generate(prompt: string, options?: {
    model?: string;
    temperature?: number;
    maxOutputTokens?: number;
  }) {
    const response = await fetch(`${this.baseUrl}/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, ...options }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  async chat(messages: Array<{ role: string; content: string }>) {
    const response = await fetch(`${this.baseUrl}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  async getModels() {
    const response = await fetch(`${this.baseUrl}/ai/models`);
    const data = await response.json();
    return data.data.models;
  }
}

// Usage
const client = new AIClient();
const result = await client.generate('Hello world');
