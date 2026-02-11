import { Ionicons } from "@expo/vector-icons"
import { Pressable, StyleSheet, Text, View } from "react-native"
import type { SearchResultItem as SearchResultItemType } from "@/lib/search-api"

const typeIconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  link: "link-outline",
  article: "document-text-outline",
  video: "videocam-outline",
  image: "image-outline",
}

const matchReasonLabels: Record<string, string> = {
  title: "标题",
  description: "描述",
  content: "内容",
  url: "链接",
  tag: "标签",
  semantic: "语义",
}

export function SearchResultItem({
  item,
  onPress,
}: {
  item: SearchResultItemType
  onPress: () => void
}) {
  const icon = typeIconMap[item.type] || "link-outline"
  const date = new Date(item.createdAt).toLocaleDateString("zh-CN")

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <Ionicons color="#a3a3a3" name={icon} size={18} />
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
      </View>

      {item.description && (
        <Text numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>
      )}

      <View style={styles.footer}>
        <View style={styles.tags}>
          {item.matchReasons.slice(0, 3).map((reason) => (
            <View key={reason} style={styles.tag}>
              <Text style={styles.tagText}>{matchReasonLabels[reason] || reason}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.date}>{date}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#262626",
  },
  description: {
    marginTop: 6,
    fontSize: 13,
    color: "#737373",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  tags: {
    flexDirection: "row",
    gap: 6,
    flex: 1,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "#f5f5f5",
  },
  tagText: {
    fontSize: 11,
    color: "#737373",
  },
  date: {
    fontSize: 11,
    color: "#a3a3a3",
  },
})
