import apiClient from "@/services/apiClient";
import type { CreateChatParam } from "./chatService.param";
import type { Chat } from "@/interfaces/chat.interface";

export const askChatbot = async ({ text }: CreateChatParam): Promise<Chat> => {
  const response = await apiClient.post<{ chat: Chat }>("spring", "/api/chat", {
    text,
  });

  return response.data.chat;
};
