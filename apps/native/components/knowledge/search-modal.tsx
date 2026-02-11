import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ApiError } from "@/lib/api-client"
import { type SearchResultItem, searchBookmarks } from "@/lib/search-api"
import { SearchInput } from "./search-input"
import { SearchResults } from "./search-results"

type SearchMode = "keyword" | "hybrid"

export function SearchModal({
  visible,
  onClose,
  onSelectResult,
}: {
  visible: boolean
  onClose: () => void
  onSelectResult: (id: string) => void
}) {
  const insets = useSafeAreaInsets()
  const [query, setQuery] = useState("")
  const [searchMode, setSearchMode] = useState<SearchMode>("hybrid")
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modeUsed, setModeUsed] = useState<string | null>(null)
  const [fallbackReason, setFallbackReason] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setQuery("")
      setResults([])
      setError(null)
      setModeUsed(null)
      setFallbackReason(null)
    }
  }, [visible])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setError(null)
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await searchBookmarks({
          q: query,
          mode: searchMode,
          signal: controller.signal,
        })
        setResults(response.items)
        setModeUsed(response.modeUsed)
        setFallbackReason(response.fallbackReason || null)
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return
        }
        if (err instanceof ApiError && err.status === 401) {
          setError("请先登录")
        } else {
          setError("搜索失败，请重试")
        }
      } finally {
        setIsLoading(false)
      }
    }, 280)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, searchMode])

  const handleRefresh = async () => {
    if (!query.trim()) {
      return
    }

    setIsRefreshing(true)
    try {
      const response = await searchBookmarks({
        q: query,
        mode: searchMode,
      })
      setResults(response.items)
      setModeUsed(response.modeUsed)
      setFallbackReason(response.fallbackReason || null)
      setError(null)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("请先登录")
      } else {
        setError("搜索失败，请重试")
      }
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Modal animationType="slide" onRequestClose={onClose} visible={visible}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable hitSlop={8} onPress={onClose} style={styles.backButton}>
            <Ionicons color="#262626" name="arrow-back" size={24} />
          </Pressable>
          <View style={styles.searchInputWrapper}>
            <SearchInput onChangeText={setQuery} value={query} />
          </View>
          <Pressable hitSlop={8} onPress={onClose} style={styles.closeButton}>
            <Ionicons color="#262626" name="close" size={24} />
          </Pressable>
        </View>

        {/* Mode Switcher */}
        <View style={styles.modeSwitcher}>
          <ScrollView contentContainerStyle={styles.modeContainer} horizontal>
            <Pressable
              onPress={() => setSearchMode("keyword")}
              style={[styles.modeButton, searchMode === "keyword" && styles.modeButtonActive]}
            >
              <Text style={[styles.modeText, searchMode === "keyword" && styles.modeTextActive]}>
                关键词
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSearchMode("hybrid")}
              style={[styles.modeButton, searchMode === "hybrid" && styles.modeButtonActive]}
            >
              <Text style={[styles.modeText, searchMode === "hybrid" && styles.modeTextActive]}>
                智能搜索
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Fallback Notice */}
        {fallbackReason && modeUsed !== searchMode && (
          <View style={styles.notice}>
            <Ionicons color="#f59e0b" name="information-circle-outline" size={16} />
            <Text style={styles.noticeText}>已切换到关键词搜索</Text>
          </View>
        )}

        {/* Results */}
        <SearchResults
          error={error}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          onSelectResult={(id) => {
            onSelectResult(id)
            onClose()
          }}
          results={results}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    padding: 4,
  },
  searchInputWrapper: {
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modeSwitcher: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
  },
  modeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: "#f5f5f5",
  },
  modeButtonActive: {
    backgroundColor: "#262626",
  },
  modeText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#525252",
  },
  modeTextActive: {
    color: "#fff",
  },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fef3c7",
  },
  noticeText: {
    fontSize: 12,
    color: "#92400e",
  },
})
