// This file implements the Genkit flow for summarizing chat history.

'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

/**
 * @fileOverview Summarizes chat history on demand.
 *
 * - summarizeChatHistory - A function that handles the summarization of chat history.
 * - SummarizeChatHistoryInput - The input type for the summarizeChatHistory function.
 * - SummarizeChatHistoryOutput - The return type for the summarizeChatHistory function.
 */

const SummarizeChatHistoryInputSchema = z.object({
  chatHistory: z.string().describe('The complete chat history to summarize.'),
});

export type SummarizeChatHistoryInput = z.infer<
  typeof SummarizeChatHistoryInputSchema
>;

const SummarizeChatHistoryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the chat history.'),
});

export type SummarizeChatHistoryOutput = z.infer<
  typeof SummarizeChatHistoryOutputSchema
>;

export async function summarizeChatHistory(
  input: SummarizeChatHistoryInput
): Promise<SummarizeChatHistoryOutput> {
  return summarizeChatHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeChatHistoryPrompt',
  input: {
    schema: z.object({
      chatHistory: z.string().describe('The complete chat history to summarize.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of the chat history.'),
    }),
  },
  prompt: `Summarize the following chat history in a concise manner:\n\n{{{chatHistory}}}`,
});

const summarizeChatHistoryFlow = ai.defineFlow<
  typeof SummarizeChatHistoryInputSchema,
  typeof SummarizeChatHistoryOutputSchema
>(
  {
    name: 'summarizeChatHistoryFlow',
    inputSchema: SummarizeChatHistoryInputSchema,
    outputSchema: SummarizeChatHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
