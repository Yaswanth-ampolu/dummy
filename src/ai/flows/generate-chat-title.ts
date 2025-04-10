'use server';
/**
 * @fileOverview A chat title generation AI agent.
 *
 * - generateChatTitle - A function that handles the chat title generation process.
 * - GenerateChatTitleInput - The input type for the generateChatTitle function.
 * - GenerateChatTitleOutput - The return type for the generateChatTitle function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateChatTitleInputSchema = z.object({
  chatHistory: z.string().describe('The chat history to generate a title from.'),
});
export type GenerateChatTitleInput = z.infer<typeof GenerateChatTitleInputSchema>;

const GenerateChatTitleOutputSchema = z.object({
  title: z.string().describe('The generated title for the chat.'),
});
export type GenerateChatTitleOutput = z.infer<typeof GenerateChatTitleOutputSchema>;

export async function generateChatTitle(input: GenerateChatTitleInput): Promise<GenerateChatTitleOutput> {
  return generateChatTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatTitlePrompt',
  input: {
    schema: z.object({
      chatHistory: z.string().describe('The chat history to generate a title from.'),
    }),
  },
  output: {
    schema: z.object({
      title: z.string().describe('The generated title for the chat.'),
    }),
  },
  prompt: `You are an expert chat title generator.

  Generate a short, descriptive title for the chat history below:

  Chat History: {{{chatHistory}}}
  `,
});

const generateChatTitleFlow = ai.defineFlow<
  typeof GenerateChatTitleInputSchema,
  typeof GenerateChatTitleOutputSchema
>({
  name: 'generateChatTitleFlow',
  inputSchema: GenerateChatTitleInputSchema,
  outputSchema: GenerateChatTitleOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
