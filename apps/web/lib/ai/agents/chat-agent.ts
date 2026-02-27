import {
  type LanguageModel,
  stepCountIs,
  ToolLoopAgent,
  type ToolLoopAgentOnFinishCallback,
  type ToolLoopAgentOnStepFinishCallback,
  type ToolSet,
} from "ai"
import { createGetInformationTool } from "@/lib/ai/tools/get-information-tool"

interface CreateChatAgentParams {
  model: LanguageModel
  systemPrompt: string
  userId: string
  useKnowledgeBase: boolean
  onFinish?: ToolLoopAgentOnFinishCallback<ToolSet>
  onStepFinish?: ToolLoopAgentOnStepFinishCallback<ToolSet>
}

export function createChatAgent({
  model,
  systemPrompt,
  userId,
  useKnowledgeBase,
  onFinish,
  onStepFinish,
}: CreateChatAgentParams) {
  return new ToolLoopAgent({
    model,
    instructions: systemPrompt,
    tools: useKnowledgeBase ? { getInformation: createGetInformationTool(userId) } : {},
    stopWhen: stepCountIs(useKnowledgeBase ? 3 : 1),
    onFinish,
    onStepFinish,
  })
}
