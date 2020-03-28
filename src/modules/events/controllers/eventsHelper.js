// const nanoid = require('nanoid');
const { eventModel } = require('../models/event');
const { userModel } = require('../../users/models/user');
const { notifyCreator } = require('./schedular');

const findUserAndNotify = async (event) => {
  const user = await userModel.findOne({ id: event.userID });

  if (!user) throw new Error('User not found');
  if (user && !user.connectToTelegramID) {
    throw new Error(`User ${user.name} not have telegram ID`);
  }

  return await notifyCreator({
    userId: user.id,
    endDate: event.endDate,
    id: event.id,
    text: event.eventDescription,
    chatId: user.connectToTelegramID,
  });
};

module.exports = {
  scheduleEvents: async () => {
    try {
      const events = await eventModel.find({
        endDate: {
          $gte: Date.now(), $lte: Date.now() + 86400000,
        },
      });

      if (!events || (events && events.length === 0)) {
        throw new Error('Sheduled events not found');
      }

      // eslint-disable-next-line no-undef
      return await Promise.all(events.map(findUserAndNotify));
    } catch (error) {
      console.log(error.message);
      return false;
    }
  },
};
