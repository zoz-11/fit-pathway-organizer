
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, Users, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "sonner";

interface Message {
  id: number;
  content: string;
  time: string;
  isTrainer: boolean;
  senderName: string;
  senderAvatar?: string;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar?: string;
  isTrainer: boolean;
}

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<number>(1);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const conversations: Conversation[] = [
    {
      id: 1,
      name: "Coach Sarah",
      lastMessage: "Great job on today's workout! Keep it up!",
      time: "2 min ago",
      unread: 2,
      avatar: "/placeholder.svg",
      isTrainer: true
    },
    {
      id: 2,
      name: "Fitness Community",
      lastMessage: "Anyone tried the new HIIT routine?",
      time: "1 hour ago",
      unread: 5,
      isTrainer: false
    },
    {
      id: 3,
      name: "Dr. Mike (Nutritionist)",
      lastMessage: "Your meal plan has been updated",
      time: "3 hours ago",
      unread: 0,
      avatar: "/placeholder.svg",
      isTrainer: true
    }
  ];

  const messages: Message[] = [
    {
      id: 1,
      content: "Hi! How did your workout go today?",
      time: "10:30 AM",
      isTrainer: true,
      senderName: "Coach Sarah",
      senderAvatar: "/placeholder.svg"
    },
    {
      id: 2,
      content: "It was challenging but I managed to complete all sets!",
      time: "10:32 AM",
      isTrainer: false,
      senderName: "You"
    },
    {
      id: 3,
      content: "That's fantastic! I can see you're really pushing yourself. Remember to stay hydrated and get proper rest.",
      time: "10:35 AM",
      isTrainer: true,
      senderName: "Coach Sarah",
      senderAvatar: "/placeholder.svg"
    },
    {
      id: 4,
      content: "Thanks for the reminder! Should I increase the weights for next session?",
      time: "10:37 AM",
      isTrainer: false,
      senderName: "You"
    },
    {
      id: 5,
      content: "Great job on today's workout! Keep it up!",
      time: "10:40 AM",
      isTrainer: true,
      senderName: "Coach Sarah",
      senderAvatar: "/placeholder.svg"
    }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    toast.success("Message sent successfully!");
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
        {/* Conversations List */}
        <Card className="w-1/3 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Messages
              </CardTitle>
              <Button size="sm" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b transition-colors ${
                    selectedConversation === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>
                        {conversation.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">
                          {conversation.name}
                          {conversation.isTrainer && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Trainer
                            </Badge>
                          )}
                        </h3>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <Badge className="mt-2 bg-blue-600 text-white text-xs">
                          {conversation.unread} new
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedConv?.avatar} />
                <AvatarFallback>
                  {selectedConv?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{selectedConv?.name}</CardTitle>
                {selectedConv?.isTrainer && (
                  <Badge variant="secondary" className="text-xs">
                    Professional Trainer
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isTrainer ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.isTrainer 
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isTrainer ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex gap-2 border-t pt-4 px-4 pb-4 bg-gray-50 dark:bg-gray-900/50">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={handleKeyPress}
                className="flex-1 bg-white dark:bg-gray-800"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Messages;
