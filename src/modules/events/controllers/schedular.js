const fetch = require('node-fetch');
const { bot } = require('../../telegram');

const events = {};

const notifyCreator = ({ endDate, id, text, chatId, userId }) => {
  if (!events[id]) {
    const notifyDate = new Date(endDate).getTime() - 60000;
    const timeout = notifyDate - Date.now();
    console.log(timeout);

    if (timeout > 0) {
      events[id] = true;
      setTimeout(() => {
        if (!events[id]) throw new Error(`event ${id} not found`);
        bot.sendMessage(chatId, text);
        fetch('http://0.0.0.0:8001/notify', {
            method: 'POST',
            body: JSON.stringify({ userId, text }),
            headers: { 'content-type': 'application/json' },
        })
            .then(res => res.text())
            .then(body => console.log(body));
      }, timeout);
    }
  }
};

module.exports = {
  notifyCreator,
};
