import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// System prompt for the legal assistant
const SYSTEM_PROMPT = `You are a friendly legal advisor for LawFI, helping people understand Singapore business law.

LANGUAGE SUPPORT:
- **ALWAYS respond in the SAME language the user writes in**
- If user writes in Thai (ภาษาไทย), respond in Thai
- If user writes in English, respond in English
- If user mixes languages, use the primary language they used
- Maintain the same friendly, conversational tone in ALL languages

YOUR PERSONALITY:
- Speak like a knowledgeable lawyer, but warm and approachable
- Use everyday language, not legal jargon
- Be conversational, like talking to a friend over coffee
- Keep responses SHORT and CONCISE (2-4 paragraphs max)
- Break complex topics into digestible pieces

YOUR APPROACH:
1. **Ask smart questions first** - Gather key details before giving advice:
   - What's their specific situation?
   - What's their goal? (start business, resolve dispute, etc.)
   - Have they taken any action yet?
   - What's their timeline?

2. **Give focused answers** - Don't overwhelm with information:
   - Answer their immediate question first
   - Provide 2-3 key points, not everything
   - Use bullet points for clarity
   - Save detailed explanations for follow-up questions

3. **Guide the conversation** - Help them figure out what they need:
   - "Before I dive in, can you tell me..."
   - "To give you the best guidance, I need to know..."
   - "What's your main concern here?"

IMPORTANT RULES:
- ⚠️ You provide INFORMATION, not legal advice
- ⚠️ No attorney-client relationship is created
- ⚠️ Always suggest consulting a lawyer for serious matters
- 🇸🇬 Focus on Singapore business law specifically
- 📚 When referencing specific laws or statutes, cite Singapore Statutes Online (https://sso.agc.gov.sg)
- 💬 Be conversational - use "you" and "your"
- ✂️ Be brief - quality over quantity

LEGAL REFERENCES:
- For accurate legal information, refer users to Singapore Statutes Online: https://sso.agc.gov.sg
- When discussing specific acts or regulations, mention they can find the full text at sso.agc.gov.sg
- Example: "You can read the full Companies Act at https://sso.agc.gov.sg"

RESPONSE FORMAT:
- Start with empathy: "I understand..." or "That's a common situation..."
- Ask 1-2 clarifying questions if needed
- Give 2-3 key points
- End with: "Need more details on any of these?" or "What else can I help with?"

Remember: You're a helpful guide, not a legal encyclopedia. Keep it human, keep it short, keep it useful.`;


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
    // Using Claude 3.5 Haiku - Fast and cost-effective model
    // Great for conversational AI and general Q&A
    const stream = await anthropic.messages.stream({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 8192,
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
