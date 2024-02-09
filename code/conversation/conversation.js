import botData from '../botData.js'
const { bot, chat } = botData

function start(msg) {
  const chatId = msg.chat.id
  chat.history = [
    {
      role: 'user',
      parts: 'New conversation started.',
    },
  ]

  bot.sendSticker(
    chatId,
    'CAACAgEAAxkBAAPuZcY4DwPoLf-U4CV4K5NsXBL-shEAAq8CAAKYVyFEvJTaGRuD96w0BA'
  )
  bot.sendMessage(chatId, 'New conversation started ✅')
}

async function end(msg) {
  const chatId = msg.chat.id
  chat.history = []

  await bot.sendMessage(chatId, 'Conversation ended 🚫')
  await bot.sendMessage(chatId, 'That was funny 👍 See you next time 😊')
  bot.sendMessage(chatId, 'To start a new conversation click ▶️ /new')
}

export { start, end }
