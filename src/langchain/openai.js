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
  const formattedMessages = []

  messages.forEach(message => {
    switch (message.name) {
      case 'System':
        formattedMessages.push(new AIChatMessage(message.text))
        break
      case 'Human':
        formattedMessages.push(new HumanChatMessage(message.text))
        break
      case 'AI':
      default:
        formattedMessages.push(new SystemChatMessage(message.text))
    }
  })

  return formattedMessages
}

export default model
