import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuthProvider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatWindowProps {
  participantId: string;
  participantName: string;
}

export const ChatWindow = ({ participantId, participantName }: ChatWindowProps) => {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useMessages(participantId);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      sendMessage.mutate({ receiverId: participantId, content: newMessage });
      setNewMessage("");
    }
  };

  if (isLoading) {
    return (
      <Card className="flex flex-col h-[500px]">
        <CardHeader>
          <CardTitle>Chat with {participantName}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-4">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-10 w-1/2 ml-auto" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader>
        <CardTitle>Chat with {participantName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-4">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${msg.sender_id === user?.id
                        ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}
                    `}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs opacity-75 mt-1 block">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground">Start a conversation!</div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};