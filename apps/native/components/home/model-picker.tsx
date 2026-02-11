import { Ionicons } from "@expo/vector-icons"
import { Modal, Pressable, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { chatModels } from "@/lib/mock-data"

interface ModelPickerProps {
  visible: boolean
  selectedModel: string
  onSelect: (modelId: string) => void
  onClose: () => void
}

export function ModelPicker({ visible, selectedModel, onSelect, onClose }: ModelPickerProps) {
  const insets = useSafeAreaInsets()

  const handleSelect = (modelId: string) => {
    onSelect(modelId)
    onClose()
  }

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <Pressable onPress={onClose} style={styles.backdrop} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.handleBar} />
        <Text style={styles.title}>选择模型</Text>
        {chatModels.map((model) => {
          const isSelected = model.id === selectedModel
          return (
            <Pressable
              key={model.id}
              onPress={() => handleSelect(model.id)}
              style={[styles.modelItem, isSelected && styles.modelItemSelected]}
            >
              <View style={styles.modelInfo}>
                <Text style={[styles.modelName, isSelected && styles.modelNameSelected]}>
                  {model.name}
                </Text>
                <Text style={styles.modelDesc}>{model.description}</Text>
              </View>
              {isSelected && <Ionicons color="#262626" name="checkmark" size={20} />}
            </Pressable>
          )
        })}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  handleBar: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e5e5e5",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#262626",
    marginBottom: 12,
  },
  modelItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  modelItemSelected: {
    backgroundColor: "#f5f5f5",
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#262626",
  },
  modelNameSelected: {
    fontWeight: "600",
  },
  modelDesc: {
    fontSize: 13,
    color: "#a3a3a3",
    marginTop: 2,
  },
})
