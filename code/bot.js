import express from 'express'
import botData from './botData.js'
import * as AI from './ai.js'
import * as BUTTONS from './buttons/buttons.js'
import * as CONVERSATION from './conversation/conversation.js'

const { bot, chat } = botData
const app = express()
app.use(express.json())

const webhookUrl = `${process.env.WEBHOOK_URL}/bot${process.env.TELEGRAM_BOT_TOKEN}`
bot.setWebHook(webhookUrl)

bot.setMyCommands([
  { command: '/new', description: 'Start a new conversation' },
  { command: '/end', description: 'End the current conversation' },
])

bot.on('message', async (msg) => {
  if (
    chat.history.length === 0 &&
    msg.text !== 'New conversation' &&
    msg.text !== '/new'
  ) {
    BUTTONS.startConversationBtn(msg)
    return
  }

  if (msg.text === 'New conversation' || msg.text === '/new') {
    await CONVERSATION.start(msg)
    BUTTONS.endConversationBtn(msg)
    return
  }

  if (msg.text === 'End conversation' || msg.text === '/end') {
    CONVERSATION.end(msg)
    return
  }

  const chatId = msg.chat.id

  const loaderGif =
    'https://www.gstatic.com/lamda/images/bard_sparkle_processing_v2.gif'
  const thinkingMsg = await bot.sendAnimation(chatId, loaderGif, {
    caption: "I'm thinking 🤔🤔🤔",
  })
  const thinkingMsgId = thinkingMsg.message_id

  try {
    chat.history.push({
      role: 'user',
      parts: msg.text,
    })

    const aiRes = await AI.getText(msg.text, chat.history)
    bot.deleteMessage(chatId, thinkingMsgId)

    if (!aiRes) {
      bot.sendMessage(chatId, `I can't answer your question. Move on.`, {
        parse_mode: 'markdown',
      })
      return
    }

    const aiText = aiRes.text()

    bot.sendMessage(chatId, aiText, { parse_mode: 'markdown' })

    chat.history.push({
      role: 'model',
      parts: aiText,
    })
  } catch (err) {
    bot.deleteMessage(chatId, thinkingMsgId)
    await CONVERSATION.end(msg)

    bot.sendMessage(
      chatId,
      `We are sorry, something went wrong. Please try again. \n\`${err.message}\``,
      { parse_mode: 'markdown' }
    )
  }
})

app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body)
  res.sendStatus(200)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Bot is active')
})
