import botData from '../botData.js'
const { bot } = botData

function startConversationBtn(msg) {
  button(
    msg,
    [['New conversation']],
    'To start a new conversation click the button below 👇'
  )
}

function endConversationBtn(msg) {
  button(
    msg,
    [['End conversation']],
    'To end the conversation click the button below 👇'
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

export { startConversationBtn, endConversationBtn }
