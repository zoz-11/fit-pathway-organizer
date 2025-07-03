
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, Users, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";

const Messages = () => {
  const { user, profile, isLoading: isLoadingAuth } = useAuth();
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [selectedParticipantName, setSelectedParticipantName] = useState<string | null>(null);

  const { data: conversations, isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations', user?.id, profile?.role],
    queryFn: async () => {
      if (!user || !profile) return [];

      if (profile.role === 'athlete') {
        // Fetch trainers associated with this athlete
        const { data, error } = await supabase
          .from('trainer_athletes')
          .select('trainer:profiles!trainer_id(*)')
          .eq('athlete_id', user.id)
          .eq('status', 'accepted');

        if (error) throw error;
        return data.map(item => item.trainer);
      } else if (profile.role === 'trainer') {
        // Fetch athletes associated with this trainer
        const { data, error } = await supabase
          .from('trainer_athletes')
          .select('athlete:profiles!athlete_id(*)')
          .eq('trainer_id', user.id)
          .eq('status', 'accepted');

        if (error) throw error;
        return data.map(item => item.athlete);
      }
      return [];
    },
    enabled: !!user && !!profile,
  });

  useEffect(() => {
    if (conversations && conversations.length > 0 && !selectedParticipantId) {
      setSelectedParticipantId(conversations[0].id);
      setSelectedParticipantName(conversations[0].full_name);
    }
  }, [conversations, selectedParticipantId]);

  if (isLoadingAuth || isLoadingConversations) {
    return (
      <AppLayout>
        <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
          <Card className="w-1/3 flex flex-col">
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
          <Card className="flex-1 flex flex-col">
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
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div className="space-y-1">
              {conversations && conversations.length > 0 ? (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedParticipantId(conv.id);
                      setSelectedParticipantName(conv.full_name);
                    }}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b transition-colors ${
                      selectedParticipantId === conv.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''
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
                          {/* <span className="text-xs text-gray-500">{conversation.time}</span> */}
                        </div>
                        {/* <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <Badge className="mt-2 bg-blue-600 text-white text-xs">
                            {conversation.unread} new
                          </Badge>
                        )} */}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-muted-foreground text-center">No conversations yet.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        {selectedParticipantId && selectedParticipantName ? (
          <ChatWindow participantId={selectedParticipantId} participantName={selectedParticipantName} />
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Select a conversation to start chatting.</p>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Messages;
