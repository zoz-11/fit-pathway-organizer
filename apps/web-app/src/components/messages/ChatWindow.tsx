import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuthProvider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatWindowProps {
  participantId: string;
  participantName: string;
}

export const ChatWindow = ({
  participantId,
  participantName,
}: ChatWindowProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useMessages(participantId);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      sendMessage.mutate({ recipientId: participantId, content: newMessage });
      setNewMessage("");
    }
  }, [newMessage, user, participantId, sendMessage]);

  if (isLoading) {
    return (
      <Card className="flex flex-col h-[500px]">
        <CardHeader>
          <CardTitle>{t("chatWindow.title", { participantName })}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-4">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-10 w-1/2 ms-auto" />
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
    <Card className="flex flex-col h-[500px]" role="region" aria-label={t("chatWindow.ariaLabel", { participantName })}>
      <CardHeader>
        <CardTitle id="chat-title">{t("chatWindow.title", { participantName })}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-4">
        <ScrollArea className="h-full pr-4" aria-labelledby="chat-title">
          <div className="space-y-4" role="log" aria-live="polite" aria-atomic="false">
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                  role="article"
                  aria-label={msg.sender_id === user?.id ? t("chatWindow.sentMessage") : t("chatWindow.receivedMessage")}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.sender_id === user?.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }
                    `}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs opacity-75 mt-1 block">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground">
                {t("chatWindow.startConversation")}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full space-x-2" aria-label={t("chatWindow.formAriaLabel")}>
          <Input
            placeholder={t("chatWindow.placeholder")}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            aria-label={t("chatWindow.inputAriaLabel")}
            aria-required="true"
          />
          <Button type="submit" size="icon" aria-label={t("chatWindow.sendAriaLabel")} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" aria-hidden="true" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
