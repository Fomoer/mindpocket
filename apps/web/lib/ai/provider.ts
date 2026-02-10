import { devToolsMiddleware } from "@ai-sdk/devtools"
import { gateway, wrapLanguageModel } from "ai"
import { chatModels, DEFAULT_CHAT_MODEL } from "./models"

export function getChatModel(modelId?: string) {
  const selectedId = modelId ?? DEFAULT_CHAT_MODEL
  const isValid = chatModels.some((m) => m.id === selectedId)

  //  dev 启动 ai sdk  vercel  devtools
  if (process.env.NODE_ENV === "development") {
    const model = wrapLanguageModel({
      model: gateway(isValid ? selectedId : DEFAULT_CHAT_MODEL),
      middleware: devToolsMiddleware(),
    })
    return model
  }

  return gateway(isValid ? selectedId : DEFAULT_CHAT_MODEL)
}

export function getTitleModel() {
  return gateway("deepseek/deepseek-v3.2")
}
