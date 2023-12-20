import { GoogleGenerativeAI } from '@google/generative-ai'
// mine
import { API } from './api.js'

const genAI = new GoogleGenerativeAI(API.gemini)

async function getText(txt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const result = await model.generateContent(txt)
  const { response } = await result
  return response
}

export { getText }
