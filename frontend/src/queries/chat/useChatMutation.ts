import { useMutation } from "@tanstack/react-query";
import { askChatbot } from "@/services/chat/chatService";
import type { Chat } from "@/interfaces/chat.interface";

export const useChatMutation = (onSuccess: (data: Chat) => void) => {
  return useMutation({
    mutationFn: askChatbot,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};
