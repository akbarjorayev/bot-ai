import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_TOKEN)

async function getText(msg, history) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  const chat = model.startChat(history)

  const result = await chat.sendMessage(msg)
  const { response } = await result

  return response ? response : false
}

export { getText }
