import { requestJson } from "./api-client"

export interface SearchResultItem {
  id: string
  title: string
  description: string | null
  url: string | null
  type: string
  folderName: string | null
  folderEmoji: string | null
  createdAt: string
  score: number
  matchReasons: string[]
  platform?: string | null
}

export interface SearchResponse {
  items: SearchResultItem[]
  modeUsed: "keyword" | "semantic" | "hybrid"
  fallbackReason?: string
}

export function searchBookmarks(params: {
  q: string
  mode?: "keyword" | "hybrid"
  limit?: number
  signal?: AbortSignal
}): Promise<SearchResponse> {
  const searchParams = new URLSearchParams()
  searchParams.set("q", params.q)
  searchParams.set("mode", params.mode || "hybrid")
  searchParams.set("limit", String(params.limit || 20))

  return requestJson<SearchResponse>(`/api/search?${searchParams}`, {
    signal: params.signal,
  })
}
