import TelegramBot from 'node-telegram-bot-api'
import { API } from './api.js'

const botData = {
  bot: new TelegramBot(API.tgBot, { polling: true }),
  chat: {
    history: [],
  },
}

export default botData
