import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Initialize OpenAI with the API key from environment variables
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('OpenAI API key is not set');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: false // Set to false for security in production
  });
  try {
    console.log('Received request to /api/chat');
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    if (!body.messages || !Array.isArray(body.messages)) {
      console.error('Invalid request: messages array is missing or invalid');
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      );
    }
    
    const { messages } = body;
    const userMessage = messages[messages.length - 1]?.content || '';
    
    if (!userMessage.trim()) {
      console.error('Empty user message');
      return NextResponse.json(
        { error: 'Message content cannot be empty' },
        { status: 400 }
      );
    }

    console.log('Sending message to OpenAI API...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are CarbonAI, a helpful assistant that helps users understand and reduce their carbon footprint. Provide clear, actionable advice about sustainability, energy efficiency, and reducing environmental impact."
        },
        ...messages.map((msg: { role: string; content: string }) => ({
          role: msg.role === 'user' ? 'user' : 'assistant' as const,
          content: msg.content
        }))
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });
    
    const responseMessage = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    
    console.log('Received response from OpenAI API');
    return NextResponse.json({ message: responseMessage });
    
  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Error processing your request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
