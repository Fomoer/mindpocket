import { requestJson, requestVoid } from "./api-client"

export interface BookmarkItem {
  id: string
  type: string
  title: string
  description: string | null
  url: string | null
  coverImage: string | null
  isFavorite: boolean
  createdAt: string
  folderId: string | null
  folderName: string | null
  folderEmoji: string | null
  platform: string | null
}

interface FetchBookmarksParams {
  type?: string
  platform?: string
  limit?: number
  offset?: number
}

interface FetchBookmarksResult {
  bookmarks: BookmarkItem[]
  total: number
  hasMore: boolean
}

export function fetchBookmarks(params: FetchBookmarksParams = {}): Promise<FetchBookmarksResult> {
  const searchParams = new URLSearchParams()
  if (params.type) {
    searchParams.set("type", params.type)
  }
  if (params.platform) {
    searchParams.set("platform", params.platform)
  }
  searchParams.set("limit", String(params.limit ?? 20))
  searchParams.set("offset", String(params.offset ?? 0))

  return requestJson<FetchBookmarksResult>(`/api/bookmarks?${searchParams}`)
}

export async function deleteBookmark(id: string): Promise<void> {
  await requestVoid(`/api/bookmarks/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
}
