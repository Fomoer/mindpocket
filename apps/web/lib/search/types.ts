export const SEARCH_MODES = ["keyword", "semantic", "hybrid"] as const

export type SearchMode = (typeof SEARCH_MODES)[number]

export type SearchScope = "compact" | "full"

export type SearchMatchReason = "title" | "description" | "content" | "url" | "tag" | "semantic"

export function parseSearchMode(
  input?: string | null,
  fallback: SearchMode = "keyword"
): SearchMode {
  if (input === "keyword" || input === "semantic" || input === "hybrid") {
    return input
  }
  return fallback
}

export function parseSearchScope(input?: string | null): SearchScope {
  return input === "compact" ? "compact" : "full"
}
