import { GoogleGenerativeAI } from '@google/generative-ai'
// mine
import { API } from './api.js'

const genAI = new GoogleGenerativeAI(API.gemini)

async function getText(msg, history) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  const chat = model.startChat(history)

  const result = await chat.sendMessage(msg)
  const { response } = await result
  return response
}

export { getText }
