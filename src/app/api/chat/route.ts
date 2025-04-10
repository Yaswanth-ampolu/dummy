import {generateChatTitle} from '@/ai/flows/generate-chat-title';
import {summarizeChatHistory} from '@/ai/flows/summarize-chat-history';
import {NextResponse} from 'next/server';

export async function POST(req: Request) {
  try {
    const {userInput, chatHistory} = await req.json();

    // Simulate AI response (replace with actual AI integration)
    const aiResponse = `This is a dummy response for: ${userInput}`;

    // Generate chat title
    const chatTitle = await generateChatTitle({
      chatHistory: chatHistory.join('\n'),
    });
    console.log(`Chat title: ${chatTitle.title}`);

    // Summarize chat history
    const chatSummary = await summarizeChatHistory({
      chatHistory: chatHistory.join('\n'),
    });
    console.log(`Chat summary: ${chatSummary.summary}`);

    return NextResponse.json({response: aiResponse});
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      {error: 'Failed to process chat input'},
      {status: 500}
    );
  }
}
