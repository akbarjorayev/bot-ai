import TelegramBot from 'node-telegram-bot-api'
// mine
import { API } from './api.js'
import * as Gemini from './gemini.js'

const bot = new TelegramBot(API.tgBot, { polling: true })

bot.on('message', async (msg) => {
  const chatId = msg.chat.id

  try {
    const geminiRes = await Gemini.getText(msg.text)
    bot.sendMessage(chatId, geminiRes.text(), { parse_mode: 'markdown' })
  } catch (err) {
    bot.sendMessage(
      chatId,
      `We are so sorry, something went wrong. Please try again. ${err.message}`,
      { parse_mode: 'markdown' }
    )
  }
})
