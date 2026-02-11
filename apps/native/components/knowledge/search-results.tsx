import { Ionicons } from "@expo/vector-icons"
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native"
import type { SearchResultItem as SearchResultItemType } from "@/lib/search-api"
import { SearchResultItem } from "./search-result-item"

export function SearchResults({
  results,
  isLoading,
  error,
  onSelectResult,
  onRefresh,
  isRefreshing,
}: {
  results: SearchResultItemType[]
  isLoading: boolean
  error: string | null
  onSelectResult: (id: string) => void
  onRefresh: () => void
  isRefreshing: boolean
}) {
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#737373" size="small" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons color="#d4d4d4" name="alert-circle-outline" size={48} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  if (results.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons color="#d4d4d4" name="search-outline" size={48} />
        <Text style={styles.emptyText}>没有找到相关内容</Text>
        <Text style={styles.emptyHint}>试试其他关键词</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons color="#737373" name="search-outline" size={16} />
        <Text style={styles.headerText}>搜索结果 ({results.length})</Text>
      </View>
      <FlatList
        data={results}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
        renderItem={({ item }) => (
          <SearchResultItem item={item} onPress={() => onSelectResult(item.id)} />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
  },
  headerText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#737373",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#a3a3a3",
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#a3a3a3",
  },
  emptyHint: {
    fontSize: 13,
    color: "#d4d4d4",
  },
})
