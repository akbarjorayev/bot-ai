import botData from '../botData.js'
import * as BUTTONS from '../buttons/buttons.js'

const { bot, chat } = botData

async function start(msg) {
  const chatId = msg.chat.id
  chat.history = [
    {
      role: 'user',
      parts: 'New conversation started.',
    },
  ]

  await bot.sendSticker(
    chatId,
    'CAACAgEAAxkBAAPuZcY4DwPoLf-U4CV4K5NsXBL-shEAAq8CAAKYVyFEvJTaGRuD96w0BA' // ⌨️
  )
  await bot.sendMessage(chatId, 'New conversation started ✅')
  await bot.sendMessage(chatId, 'To end current conversation click ▶️ /end')
}

async function end(msg) {
  const chatId = msg.chat.id
  chat.history = []

  await bot.sendMessage(chatId, 'Conversation ended 🚫')
  await bot.sendMessage(chatId, 'That was funny 👍 See you next time 😊')
  await bot.sendMessage(chatId, 'To start a new conversation click ▶️ /new')

  BUTTONS.startConversationBtn(msg)
}

export { start, end }
