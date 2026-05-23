import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { addInput } from '../db.js';
import { RequestWithUser } from '../middleware/auth.js';

const router = Router();

// Groq API Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

interface GenerateContentBody {
  prompt: string;
  model?: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
}

/**
 * POST /api/ai/generate
 * Generate content using Groq API
 */
router.post('/generate', async (req: RequestWithUser, res: Response) => {
  try {
    const {
      prompt,
      model = 'mixtral-8x7b-32768',
      temperature = 0.7,
      topP = 1,
      maxTokens = 2048
    } = req.body as GenerateContentBody;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    if (!GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'GROQ_API_KEY is not configured'
      });
    }

    const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature,
        top_p: topP,
        max_tokens: maxTokens,
      }),
    });

    const data = await response.json() as any;

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.error?.message || 'Failed to generate content'
      });
    }

    const content = data.choices[0]?.message?.content || '';

    // persist input
    await addInput({
      id: nanoid(),
      userId: req.user?.userId,
      route: '/api/ai/generate',
      payload: { prompt, model, temperature, topP, maxTokens },
      response: data,
      createdAt: new Date().toISOString(),
    })

    return res.json({
      success: true,
      data: {
        content,
        model,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        }
      }
    });
  } catch (error) {
    console.error('Generate content error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate content'
    });
  }
});

/**
 * POST /api/ai/chat
 * Stream chat responses using Groq API
 */
router.post('/chat', async (req: RequestWithUser, res: Response) => {
  try {
    const {
      messages,
      model = 'mixtral-8x7b-32768',
      temperature = 0.7,
      maxTokens = 2048
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
      });
    }

    if (!GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'GROQ_API_KEY is not configured'
      });
    }

    // Convert messages to Groq format
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role || 'user',
      content: msg.content
    }));

    const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    const data = await response.json() as any;

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.error?.message || 'Failed to process chat'
      });
    }

    const content = data.choices[0]?.message?.content || '';

    // persist chat input
    await addInput({
      id: nanoid(),
      userId: req.user?.userId,
      route: '/api/ai/chat',
      payload: { messages, model, temperature, maxTokens },
      response: data,
      createdAt: new Date().toISOString(),
    })

    return res.json({
      success: true,
      data: {
        content,
        model,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        }
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process chat'
    });
  }
});

/**
 * GET /api/ai/models
 * Get available models
 */
router.get('/models', (_req: Request, res: Response) => {
  const models = [
    'mixtral-8x7b-32768',
    'llama2-70b-4096',
    'gemma-7b-it',
  ];

  return res.json({
    success: true,
    data: { models }
  });
});

export default router;
