
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, MessageCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { toast } from "sonner";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: "Mike Johnson",
      role: "Personal Trainer",
      lastMessage: "Great job on today's workout!",
      time: "2 min ago",
      unread: 2
    },
    {
      id: 2,
      name: "Sarah Smith",
      role: "Nutritionist",
      lastMessage: "Your meal plan is ready",
      time: "1 hour ago",
      unread: 0
    },
    {
      id: 3,
      name: "Support Team",
      role: "Customer Support",
      lastMessage: "How can we help you today?",
      time: "1 day ago",
      unread: 0
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Mike Johnson",
      content: "Hi! How are you feeling after yesterday's workout?",
      time: "10:30 AM",
      isTrainer: true
    },
    {
      id: 2,
      sender: "You",
      content: "Pretty good! A bit sore but in a good way.",
      time: "10:35 AM",
      isTrainer: false
    },
    {
      id: 3,
      sender: "Mike Johnson",
      content: "That's exactly what we want to hear! The soreness means your muscles are adapting.",
      time: "10:36 AM",
      isTrainer: true
    },
    {
      id: 4,
      sender: "Mike Johnson",
      content: "Great job on today's workout! Your form is really improving.",
      time: "2:15 PM",
      isTrainer: true
    }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    toast.success('Message sent!');
    setNewMessage('');
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-200px)] flex gap-6 p-4 md:p-6">
        {/* Conversations List */}
        <Card className="w-1/3 flex flex-col">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div className="space-y-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`p-3 cursor-pointer hover:bg-gray-50 border-l-4 ${
                    selectedChat === conv.id ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{conv.name}</p>
                        <p className="text-xs text-gray-600">{conv.role}</p>
                      </div>
                    </div>
                    {conv.unread > 0 && (
                      <div className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                        {conv.unread}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">{conv.lastMessage}</p>
                  <p className="text-xs text-gray-400 mt-1">{conv.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {conversations.find(c => c.id === selectedChat)?.name}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {conversations.find(c => c.id === selectedChat)?.role}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-4">
            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isTrainer ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[70%] ${
                    message.isTrainer 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'bg-blue-600 text-white'
                  } rounded-lg p-3`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isTrainer ? 'text-gray-500' : 'text-blue-100'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex gap-2 border-t pt-4">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage}>
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
