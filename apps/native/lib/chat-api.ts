import type { UIMessage } from "ai"
import { ApiError, requestJson, requestVoid } from "./api-client"

export type ChatApiError = ApiError
export const ChatApiError = ApiError

export interface HistoryChatItem {
  id: string
  title: string
  createdAt: string
}

export interface HistorySection {
  title: string
  data: HistoryChatItem[]
}

export interface ChatDetail {
  chat: {
    id: string
    title: string
    createdAt: string
  }
  messages: UIMessage[]
}

function formatDateLabel(value: string): string {
  const date = new Date(value)
  return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, "0")}月${String(
    date.getDate()
  ).padStart(2, "0")}日`
}

export async function fetchHistory(limit = 20): Promise<HistorySection[]> {
  const data = await requestJson<{ chats: HistoryChatItem[] }>(`/api/history?limit=${limit}`)
  const grouped = new Map<string, HistoryChatItem[]>()
  for (const chat of data.chats) {
    const label = formatDateLabel(chat.createdAt)
    const prev = grouped.get(label)
    if (prev) {
      prev.push(chat)
      continue
    }
    grouped.set(label, [chat])
  }

  return Array.from(grouped.entries()).map(([title, items]) => ({
    title,
    data: items,
  }))
}

export async function fetchChatDetail(chatId: string): Promise<ChatDetail> {
  const data = await requestJson<{
    chat: { id: string; title: string; createdAt: string }
    messages: Array<{
      id: string
      role: "user" | "assistant"
      parts: UIMessage["parts"]
      createdAt: string
    }>
  }>(`/api/chat?id=${encodeURIComponent(chatId)}`)

  return {
    chat: data.chat,
    messages: data.messages.map((message) => ({
      ...message,
      createdAt: new Date(message.createdAt),
    })),
  }
}

export async function deleteChat(chatId: string): Promise<void> {
  await requestVoid("/api/chat", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: chatId }),
  })
}
