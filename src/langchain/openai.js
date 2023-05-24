import {ChatOpenAI} from 'langchain/chat_models/openai'
import { HumanChatMessage, AIChatMessage, SystemChatMessage } from "langchain/schema"

let model = {}
if (process.env.OPENAI_API_KEY) {
  model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY
  })
}

/**
 * Transform Quasar model to OpenAI model
 */
model.transformMessages = function (messages) {
  const transformedMessages = []
  messages.forEach(message => {
    const yaml =`\n---
created: ${message.created || message.updated}`

    switch (message.name) {
      case 'System':
        transformedMessages.push(new AIChatMessage(message.text + yaml))
        break
      case 'Human':
        transformedMessages.push(new HumanChatMessage(message.text + yaml))
        break
      case 'AI':
      default:
        transformedMessages.push(new SystemChatMessage(message.text + yaml))
    }
  })

  return transformedMessages
}

export default model
