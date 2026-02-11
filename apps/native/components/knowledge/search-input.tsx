import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, TextInput, View } from "react-native"

export function SearchInput({
  value,
  onChangeText,
  placeholder = "搜索收藏...",
  autoFocus = true,
}: {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  autoFocus?: boolean
}) {
  return (
    <View style={styles.container}>
      <Ionicons color="#a3a3a3" name="search-outline" size={18} />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#d4d4d4"
        returnKeyType="search"
        style={styles.input}
        value={value}
      />
      {value.length > 0 && (
        <Ionicons color="#a3a3a3" name="close-circle" onPress={() => onChangeText("")} size={18} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#262626",
  },
})
