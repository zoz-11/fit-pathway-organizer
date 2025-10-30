import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuthProvider";
import { v4 as uuidv4 } from "uuid";
import { MessageEncryption } from "@/lib/encryption";

// Mock data for messages
const MOCK_MESSAGES = {
  enabled: true, // Set to true to use mock data, false to use real data
  conversations: [
    {
      id: "1",
      full_name: "John Smith",
      role: "trainer",
      messages: [
        {
          id: "101",
          sender_id: "1",
          recipient_id: "current_user",
          content: "Hi there! How is your training going?",
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: "102",
          sender_id: "current_user",
          recipient_id: "1",
          content:
            "It's going well! I completed all the exercises you recommended.",
          created_at: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
        },
        {
          id: "103",
          sender_id: "1",
          recipient_id: "current_user",
          content: "Great job! I've prepared a new workout plan for you.",
          created_at: new Date(Date.now() - 79200000).toISOString(), // 22 hours ago
        },
      ],
    },
    {
      id: "2",
      full_name: "Sarah Johnson",
      role: "trainer",
      messages: [
        {
          id: "201",
          sender_id: "2",
          recipient_id: "current_user",
          content: "Don't forget about our session tomorrow!",
          created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        },
        {
          id: "202",
          sender_id: "current_user",
          recipient_id: "2",
          content: "I'll be there, thanks for the reminder.",
          created_at: new Date(Date.now() - 39600000).toISOString(), // 11 hours ago
        },
      ],
    },
  ],
};

export const useMessages = (participantId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", user?.id, participantId],
    queryFn: async () => {
      if (!user || !participantId) return [];

      // Use mock data if enabled
      if (MOCK_MESSAGES.enabled) {
        const conversation = MOCK_MESSAGES.conversations.find(
          (c) => c.id === participantId,
        );

        if (conversation) {
          // Replace 'current_user' with actual user ID
          return conversation.messages.map((msg) => ({
            ...msg,
            sender_id:
              msg.sender_id === "current_user" ? user.id : msg.sender_id,
            recipient_id:
              msg.recipient_id === "current_user" ? user.id : msg.recipient_id,
          }));
        }

        return [];
      }

      // Real data fetch
      const { data, error } = await supabase
        .from("messages")
        .select(
          "*, sender:profiles!sender_id(full_name), recipient:profiles!recipient_id(full_name)",
        )
        .or(
          `and(sender_id.eq.${user.id},recipient_id.eq.${participantId}),and(sender_id.eq.${participantId},recipient_id.eq.${user.id})`,
        )
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      // Decrypt messages if they have encrypted_metadata
      const decryptedMessages = await Promise.all(
        (data || []).map(async (msg: any) => {
          if (msg.encrypted_metadata && msg.encrypted_metadata.algorithm !== "none") {
            try {
              // Decrypt using sender's ID (the one who encrypted it)
              const decryptedContent = await MessageEncryption.decryptMessage(
                msg.content,
                msg.encrypted_metadata,
                msg.sender_id
              );
              return { ...msg, content: decryptedContent };
            } catch (error) {
              console.error("Failed to decrypt message:", error);
              return msg; // Return original if decryption fails
            }
          }
          return msg;
        })
      );
      
      return decryptedMessages;
    },
    enabled: !!user && !!participantId,
  });

  const sendMessage = useMutation({
    mutationFn: async ({
      recipientId,
      content,
    }: {
      recipientId: string;
      content: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      // Use mock data if enabled
      if (MOCK_MESSAGES.enabled) {
        const newMessage = {
          id: uuidv4(),
          sender_id: user.id,
          recipient_id: recipientId,
          content,
          created_at: new Date().toISOString(),
        };

        // Find conversation or create new one
        const conversationIndex = MOCK_MESSAGES.conversations.findIndex(
          (c) => c.id === recipientId,
        );

        if (conversationIndex >= 0) {
          MOCK_MESSAGES.conversations[conversationIndex].messages.push(
            newMessage,
          );
        }

        return newMessage;
      }

      // Real data send
      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        recipient_id: recipientId,
        content,
      });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", user?.id, variables.recipientId],
      });
    },
  });

  return { messages, isLoading, sendMessage };
};

export const useConversations = () => {
  const { user } = useAuth();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Use mock data if enabled
      if (MOCK_MESSAGES.enabled) {
        return MOCK_MESSAGES.conversations;
      }

      // Real data fetch would go here
      // This is just a placeholder for the real implementation
      return [];
    },
    enabled: !!user,
  });

  return { conversations, isLoading };
};
