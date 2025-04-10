'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useState} from 'react';
import {generateChatTitle} from '@/ai/flows/generate-chat-title';
import {summarizeChatHistory} from '@/ai/flows/summarize-chat-history';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [chatResponse, setChatResponse] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (userInput.trim() !== '') {
      setChatHistory([...chatHistory, `User: ${userInput}`]);
      // Simulate AI response (replace with actual AI integration)
      const aiResponse = `AI: This is a dummy response for: ${userInput}`;
      setChatResponse(aiResponse);
      setChatHistory([...chatHistory, `User: ${userInput}`, aiResponse]);

      // Generate chat title
      const chatTitle = await generateChatTitle({chatHistory: chatHistory.join('\n')});
      console.log(`Chat title: ${chatTitle.title}`);

      // Summarize chat history
      const chatSummary = await summarizeChatHistory({chatHistory: chatHistory.join('\n')});
      console.log(`Chat summary: ${chatSummary.summary}`);

      setUserInput(''); // Clear the input after submitting
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-2xl p-4">
        <CardHeader>
          <CardTitle>ChatVisor</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Chat History Display */}
          <div className="mb-4">
            {chatHistory.map((message, index) => (
              <div key={index} className="mb-2">
                {message}
              </div>
            ))}
            {chatResponse}
          </div>

          {/* Input Area */}
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter your message..."
              value={userInput}
              onChange={handleInputChange}
            />
            <Button onClick={handleSubmit}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
