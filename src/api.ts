/**
 * Example API Client Utilities
 * Use these utilities to interact with the backend API
 */

// Health Check
export async function checkHealth() {
  const response = await fetch('/api/health');
  return response.json();
}

// Get Available Models
export async function getAvailableModels() {
  const response = await fetch('/api/ai/models');
  const data = await response.json();
  return data.data.models;
}

// Generate Content (Single Shot)
export async function generateContent(prompt: string, options?: {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}) {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      model: options?.model || 'gemini-2.0-flash',
      temperature: options?.temperature || 0.7,
      maxOutputTokens: options?.maxOutputTokens || 2048,
    }),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to generate content');
  }
  return data.data;
}

// Chat (Multi-turn Conversation)
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function chat(messages: Message[], options?: {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}) {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      model: options?.model || 'gemini-2.0-flash',
      temperature: options?.temperature || 0.7,
      maxOutputTokens: options?.maxOutputTokens || 2048,
    }),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to get chat response');
  }
  return data.data;
}

// Example Usage
export async function exampleUsage() {
  try {
    // 1. Check server health
    console.log('Checking server health...');
    const health = await checkHealth();
    console.log('Health:', health);

    // 2. Get available models
    console.log('\nGetting available models...');
    const models = await getAvailableModels();
    console.log('Available models:', models);

    // 3. Generate content
    console.log('\nGenerating content...');
    const generated = await generateContent('What is TypeScript?', {
      maxOutputTokens: 512,
    });
    console.log('Generated:', generated.content);

    // 4. Chat
    console.log('\nStarting chat...');
    let messages: Message[] = [
      { role: 'user', content: 'Hello, who are you?' },
    ];
    
    let response = await chat(messages);
    console.log('Assistant:', response.content);

    messages.push(
      { role: 'user', content: 'Hello, who are you?' },
      { role: 'assistant', content: response.content },
      { role: 'user', content: 'What is 2+2?' }
    );

    response = await chat(messages);
    console.log('Assistant:', response.content);
  } catch (error) {
    console.error('Error:', error);
  }
}
