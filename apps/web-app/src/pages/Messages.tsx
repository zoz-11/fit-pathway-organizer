import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, Users, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuthProvider";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversations } from "@/hooks/useMessages";

const Messages = () => {
  const { user, profile, loading: isLoadingAuth } = useAuth();
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [selectedParticipantName, setSelectedParticipantName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Use the new hook for conversations
  const { conversations, isLoading: isLoadingConversations } = useConversations();

  const filteredConversations = conversations?.filter(c => 
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (filteredConversations && filteredConversations.length > 0 && !selectedParticipantId) {
      setSelectedParticipantId(filteredConversations[0].id);
      setSelectedParticipantName(filteredConversations[0].full_name);
    }
  }, [filteredConversations, selectedParticipantId]);

  if (isLoadingAuth || isLoadingConversations) {
    return (
      <AppLayout>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-full">
          <Card className="md:col-span-1 flex flex-col">
            <CardHeader>
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-10 w-full" />
            </CardHeader>
            <CardContent className="flex-1 p-0 space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
          <Card className="md:col-span-2 flex flex-col">
            <CardHeader>
              <Skeleton className="h-10 w-full" />
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <Skeleton className="h-full w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-full">
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Messages
              </CardTitle>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  // TODO: Implement new chat functionality
                  console.log('New chat clicked');
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-y-auto">
            <div className="space-y-1">
              {filteredConversations && filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedParticipantId(conv.id);
                      setSelectedParticipantName(conv.full_name);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedParticipantId(conv.id);
                        setSelectedParticipantName(conv.full_name);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedParticipantId === conv.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {conv.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm truncate">
                            {conv.full_name}
                            {conv.role === 'trainer' && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Trainer
                              </Badge>
                            )}
                          </h3>
                        </div>
                        {conv.messages && conv.messages.length > 0 && (
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.messages[conv.messages.length - 1].content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-muted-foreground text-center">No conversations found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          {selectedParticipantId && selectedParticipantName ? (
            <ChatWindow participantId={selectedParticipantId} participantName={selectedParticipantName} />
          ) : (
            <Card className="flex-1 flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a conversation to start chatting.</p>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Messages;
