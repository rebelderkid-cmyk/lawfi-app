import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// System prompt for the legal assistant
const SYSTEM_PROMPT = `You are a helpful AI legal assistant for LawFI, a platform that provides legal information and guidance.

IMPORTANT GUIDELINES:
1. You provide legal INFORMATION and GUIDANCE, NOT legal advice
2. Always remind users that you're not a replacement for a licensed attorney
3. Encourage users to consult with a licensed attorney for their specific situation
4. Ask about the user's jurisdiction (state/country) as laws vary by location
5. Provide step-by-step guidance when explaining legal processes
6. Use clear, simple language - avoid legal jargon when possible
7. If you're uncertain about something, say so clearly
8. Never claim to create an attorney-client relationship

Your role is to:
- Explain legal concepts in plain language
- Guide users through legal processes step-by-step
- Help users understand their rights and obligations
- Provide checklists of documents needed for various legal matters
- Direct users to appropriate resources and professionals

Always be empathetic, patient, and thorough in your responses.`;

export async function POST(req: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Call Claude API with streaming
    // Using Claude 3 Haiku - Fast, efficient, and available on all tiers
    const stream = await anthropic.messages.stream({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      temperature: 0.4, // Lower temperature for more consistent legal guidance
      system: SYSTEM_PROMPT,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    });

    // Create a ReadableStream for streaming response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              const text = chunk.delta.text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);

    // Handle Anthropic-specific errors
    if (error.status === 400) {
      return NextResponse.json(
        { error: 'Credit balance too low. Please add credits to your Anthropic account at https://console.anthropic.com/settings/plans' },
        { status: 400 }
      );
    }

    if (error.status === 404) {
      return NextResponse.json(
        { error: 'Model not available. Please check your account tier at https://console.anthropic.com/' },
        { status: 404 }
      );
    }

    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your ANTHROPIC_API_KEY in .env.local' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error. Check server logs for details.' },
      { status: 500 }
    );
  }
}
