import TelegramBot from 'node-telegram-bot-api'
// mine
import { API } from './api.js'
import * as AI from './ai.js'

const bot = new TelegramBot(API.tgBot, { polling: true })
const chat = {
  history: [],
}

bot.on('message', async (msg) => {
  if (chat.history.length === 0 && msg.text !== 'New conversation') {
    startConversationBtn(msg)
    return
  }

  if (msg.text === 'New conversation') {
    startConversation(msg)
    endConversationBtn(msg)
    return
  }

  if (msg.text === 'End conversation') {
    endConversation(msg)
    return
  }

  const chatId = msg.chat.id

  const thinkingMsg = await bot.sendMessage(chatId, `I'm thinking...`, {
    parse_mode: 'markdown',
  })
  const thinkingMsgId = thinkingMsg.message_id

  try {
    chat.history.push({
      role: 'user',
      parts: msg.text,
    })

    const aiRes = await AI.getText(msg.text, chat.history)
    bot.deleteMessage(chatId, thinkingMsgId)

    bot.sendMessage(chatId, aiRes.text(), { parse_mode: 'markdown' })

    chat.history.push({
      role: 'model',
      parts: aiRes.text(),
    })
  } catch (err) {
    bot.deleteMessage(chatId, thinkingMsgId)
    endConversation(msg)

    bot.sendMessage(
      chatId,
      `We are so sorry, something went wrong. Please try again. \n\`${err.message}\``,
      { parse_mode: 'markdown' }
    )
  }
})

function startConversation(msg) {
  const chatId = msg.chat.id
  chat.history = [
    {
      role: 'user',
      parts: 'New conversation started.',
    },
  ]

  bot.sendMessage(chatId, 'New conversation started.')
}

function endConversation(msg) {
  const chatId = msg.chat.id
  chat.history = []

  bot.sendMessage(
    chatId,
    'Conversation ended. To start a new conversation click /start'
  )
}

function startConversationBtn(msg) {
  button(
    msg,
    [['New conversation']],
    'To start a new conversation click the button'
  )
}

function endConversationBtn(msg) {
  button(
    msg,
    [['End conversation']],
    'To end the conversation click the button'
  )
}

function button(msg, keyboard, msgText) {
  const chatId = msg.chat.id
  const opts = {
    reply_markup: {
      keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  }
  bot.sendMessage(chatId, msgText, opts)
}
