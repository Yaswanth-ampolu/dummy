'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useState, useEffect} from 'react';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [chatResponse, setChatResponse] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (userInput.trim() !== '') {
      setChatHistory(prev => [...prev, `User: ${userInput}`]);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({userInput: userInput, chatHistory: chatHistory}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setChatResponse(data.response);
        setChatHistory(prev => [...prev, `AI: ${data.response}`]);

        setUserInput(''); // Clear the input after submitting
      } catch (error) {
        console.error('Error submitting chat:', error);
        setChatResponse('Error processing your request. Please try again.');
      }
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
