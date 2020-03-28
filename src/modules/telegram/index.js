const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

const token = config.telegram_api;
const bot = new TelegramBot(token, { polling: true });

const startBot = () => {
  bot.onText(/\/connect/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, chatId);
  });
};

module.exports = {
  startBot,
  bot,
};
