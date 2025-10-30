import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuthProvider";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const AiChatAssistant = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        t("aiChat.initialMessage"),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "ai-fitness-coach",
        {
          body: {
            message: currentInput,
            userProfile: profile,
            workoutHistory: [],
          },
        },
      );

      if (error) {
        console.error("Edge function error details:", error);
        throw new Error(
          t("aiChat.error.serviceError", { message: error.message || t("aiChat.error.unknown") }),
        );
      }

      if (!data || !data.response) {
        console.error("Invalid response data:", data);
        throw new Error(t("aiChat.error.invalidResponse"));
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      toast.success(t("aiChat.toast.responseReceived"));
    } catch (error) { 
      console.error("Detailed error in sendMessage:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("aiChat.error.unknown");
      setError(errorMessage);
      handleApiError(error, `${t("aiChat.error.chatError")}: ${errorMessage}`);

      const errorResponse: Message = {
        role: "assistant",
        content: t("aiChat.error.technicalDifficulties"),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          t("aiChat.chatCleared"),
        timestamp: new Date(),
      },
    ]);
    setError(null);
    toast.info(t("aiChat.toast.chatCleared"));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-[500px] flex flex-col" role="region" aria-label={t("aiChat.ariaLabel")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center">
          <MessageCircle className="h-5 w-5 me-2 text-blue-600" aria-hidden="true" />
          <CardTitle>{t("aiChat.title")}</CardTitle>
        </div>
        <div className="flex gap-2">
          {error && (
            <div className="flex items-center text-red-500 text-sm" role="alert" aria-live="polite">
              <AlertCircle className="h-4 w-4 me-1" aria-hidden="true" />
              <span>{t("aiChat.connectionError")}</span>
            </div>
          )}
          <Button variant="ghost" size="sm-icon" onClick={clearChat} aria-label={t("aiChat.clearChatAriaLabel")}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" aria-label={t("aiChat.messagesAriaLabel")}>
          <div className="space-y-4" role="log" aria-live="polite" aria-atomic="false">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
                role="article"
                aria-label={message.role === "user" ? t("aiChat.userMessage") : t("aiChat.assistantMessage")}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0" aria-label={t("aiChat.botIcon")}>
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0" aria-label={t("aiChat.userIcon")}>
                    <User className="h-4 w-4 text-white" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2 justify-start" role="status" aria-live="polite">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0" aria-label={t("aiChat.botIcon")}>
                  <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex items-center gap-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400" aria-label={t("aiChat.thinkingAriaLabel")}>
                    {t("aiChat.thinking")}
                  </span>
                  <span className="animate-pulse text-sm text-gray-600 dark:text-gray-400">
                    .
                  </span>
                  <span className="animate-pulse delay-100 text-sm text-gray-600 dark:text-gray-400">
                    .
                  </span>
                  <span className="animate-pulse delay-200 text-sm text-gray-600 dark:text-gray-400">
                    .
                  </span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-900/50 mt-4" role="form" aria-label={t("aiChat.formAriaLabel")}>
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("aiChat.placeholder")}
              disabled={isLoading}
              className="flex-1 bg-white dark:bg-gray-800"
              aria-label={t("aiChat.inputAriaLabel")}
              aria-required="true"
              aria-invalid={!input.trim()}
            />
            <Button
              size="default"
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              aria-label={t("aiChat.sendAriaLabel")}
              onClick={sendMessage}
            >
              <Send className="h-4 w-4 me-2" aria-hidden="true" />
              {isLoading ? t("aiChat.sending") : t("aiChat.send")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
