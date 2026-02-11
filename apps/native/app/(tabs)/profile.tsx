import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "../../lib/auth-context"

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { authClient, serverUrl, switchServer } = useAuth()
  const { data: session, isPending } = authClient.useSession()

  const [showServerModal, setShowServerModal] = useState(false)
  const [serverInput, setServerInput] = useState(serverUrl)
  const [isSaving, setIsSaving] = useState(false)

  const user = session?.user
  const displayName = user?.name || "用户"
  const email = user?.email || ""
  const avatarLetter = (user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()

  const handleSaveServer = async () => {
    const trimmed = serverInput.trim()
    if (!trimmed) {
      Alert.alert("错误", "请输入服务器地址")
      return
    }

    setIsSaving(true)
    try {
      await switchServer(trimmed)
      setShowServerModal(false)
      router.replace("/login")
    } catch {
      Alert.alert("错误", "保存失败，请重试")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = () => {
    Alert.alert("退出登录", "确定要退出登录吗？", [
      { text: "取消", style: "cancel" },
      {
        text: "退出",
        style: "destructive",
        onPress: async () => {
          try {
            await authClient.signOut()
            router.replace("/login")
          } catch {
            Alert.alert("错误", "退出失败，请重试")
          }
        },
      },
    ])
  }

  if (isPending) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color="#171717" size="large" />
      </View>
    )
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* 用户信息卡片 */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <Text style={styles.userName}>{displayName}</Text>
        {email ? <Text style={styles.userEmail}>{email}</Text> : null}
      </View>

      {/* 设置区域 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>设置</Text>
        <View style={styles.card}>
          <Pressable
            onPress={() => {
              setServerInput(serverUrl)
              setShowServerModal(true)
            }}
            style={styles.row}
          >
            <View style={styles.rowLeft}>
              <Ionicons color="#262626" name="server-outline" size={20} />
              <Text style={styles.rowLabel}>服务器地址</Text>
            </View>
            <View style={styles.rowRight}>
              <Text numberOfLines={1} style={styles.rowValue}>
                {serverUrl}
              </Text>
              <Ionicons color="#a3a3a3" name="chevron-forward" size={18} />
            </View>
          </Pressable>
        </View>
      </View>

      {/* 操作区域 */}
      <View style={styles.section}>
        <View style={styles.card}>
          <Pressable onPress={handleSignOut} style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons color="#ef4444" name="log-out-outline" size={20} />
              <Text style={[styles.rowLabel, styles.dangerText]}>退出登录</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* 服务器设置 Modal */}
      <Modal
        animationType="slide"
        onRequestClose={() => setShowServerModal(false)}
        transparent
        visible={showServerModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>服务器设置</Text>
              <Pressable onPress={() => setShowServerModal(false)}>
                <Ionicons color="#262626" name="close" size={24} />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>服务器地址</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSaving}
              keyboardType="url"
              onChangeText={setServerInput}
              placeholder="http://example.com"
              placeholderTextColor="#a3a3a3"
              style={styles.input}
              value={serverInput}
            />
            <Text style={styles.inputHint}>修改后需要重新登录</Text>

            <View style={styles.modalButtons}>
              <Pressable
                disabled={isSaving}
                onPress={() => setShowServerModal(false)}
                style={[styles.button, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </Pressable>
              <Pressable
                disabled={isSaving}
                onPress={handleSaveServer}
                style={[styles.button, styles.saveButton]}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>保存</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  userCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#fff",
  },
  userName: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#262626",
  },
  userEmail: {
    marginTop: 4,
    fontSize: 14,
    color: "#a3a3a3",
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#a3a3a3",
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    justifyContent: "flex-end",
  },
  rowLabel: {
    fontSize: 16,
    color: "#262626",
  },
  rowValue: {
    fontSize: 14,
    color: "#a3a3a3",
    maxWidth: 180,
  },
  dangerText: {
    color: "#ef4444",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#262626",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#262626",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#262626",
    backgroundColor: "#fafafa",
  },
  inputHint: {
    fontSize: 12,
    color: "#a3a3a3",
    marginTop: 8,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#262626",
  },
  saveButton: {
    backgroundColor: "#171717",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
})
