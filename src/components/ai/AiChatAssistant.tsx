import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, RefreshCw, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuthProvider";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AiChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI fitness coach. I can help you with workout advice, nutrition tips, and answer any fitness-related questions. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-fitness-coach', {
        body: {
          message: currentInput,
          userProfile: profile,
          workoutHistory: []
        }
      });

      if (error) {
        console.error('Edge function error details:', error);
        throw new Error(`AI service error: ${error.message || 'Unknown error'}`);
      }

      if (!data || !data.response) {
        console.error('Invalid response data:', data);
        throw new Error('Invalid response from AI service');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      toast.success('AI response received!');
    } catch (error) {
      console.error('Detailed error in sendMessage:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      handleApiError(error, `AI Chat Error: ${errorMessage}`);
      
      const errorResponse: Message = {
        role: 'assistant',
        content: `I apologize, but I'm experiencing technical difficulties right now. Please check your network connection and ensure the Supabase Edge Functions are properly deployed. If the problem continues, contact support.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared! I'm your AI fitness coach. How can I help you today?",
      timestamp: new Date()
    }]);
    setError(null);
    toast.info('Chat history cleared');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
          <CardTitle>AI Fitness Coach</CardTitle>
        </div>
        <div className="flex gap-2">
          {error && (
            <div className="flex items-center text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Connection Error</span>
            </div>
          )}
          <Button variant="ghost" size="sm-icon" onClick={clearChat}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex items-center gap-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking</span>
                  <span className="animate-pulse text-sm text-gray-600 dark:text-gray-400">.</span>
                  <span className="animate-pulse delay-100 text-sm text-gray-600 dark:text-gray-400">.</span>
                  <span className="animate-pulse delay-200 text-sm text-gray-600 dark:text-gray-400">.</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-900/50 mt-4">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about fitness..."
              disabled={isLoading}
              className="flex-1 bg-white dark:bg-gray-800"
            />
            <Button 
              size="default"
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
