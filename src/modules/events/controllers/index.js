const nanoid = require('nanoid');
const { eventModel } = require('../models/event');
const { notifyCreator } = require('./schedular');

module.exports = {
  get_events: async (req, res) => {
    try {
      const { auth } = req;
      let events = await eventModel.find({ userID: auth.id }).exec();
      events = events.map(function(event) {
        return event.publicKeys();
      });
      res.send(events);
    } catch (error) {
      res.send({ code: 400, error });
    }
  },
  post_event: async (req, res) => {
    try {
      const { body, auth } = req;
      const {
        name = '',
        eventDescription = '',
        startDate = null,
        endDate = null
      } = body;

      const newEvent = await eventModel.create({
        id: nanoid(),
        name,
        eventDescription,
        startDate,
        endDate,
        userID: auth.id
      });

      notifyCreator({
        userId: auth.id,
        endDate,
        id: newEvent.id,
        text: eventDescription,
        chatId: auth.connectToTelegramID
      });

      res.send(newEvent.publicKeys());
    } catch (error) {
      res.send({ code: 400, message: error.message });
    }
  },

  event_delete_all: async (req, res) => {
    try {
      const { auth } = req;
      const deletedEvents = await eventModel
        .find({
          userID: auth.id
        })
        .remove()
        .exec();

      res.send(`UserID ${userID} events has been deleted`);
    } catch (error) {
      res.send({ code: 400, error });
    }
  },
  update_event: async (req, res) => {
    try {
      const { body } = req;
      const {
        name = '',
        eventDescription = '',
        startDate = null,
        endDate = null
      } = body;

      const event = await eventModel.findOneAndUpdate(
        req.params.id,
        { name, eventDescription, startDate, endDate },
        { new: true }
      );

      if (!event) {
        return res
          .status(404)
          .send(`The event with the given ID ${req.params.id} was not found.`);
      }

      const obj = event.publicKeys();
      res.send(obj);
    } catch (error) {
      res.send({ code: 400, error });
    }
  },
  delete_event: async (req, res) => {
    try {
      const event = await eventModel.findOne({ id: req.params.id });
      if (!event) {
        return res
          .status(404)
          .send('The event with the given ID was not found.');
      }

      const deletedEvent = await eventModel.findOneAndRemove({
        id: req.params.id
      });

      res.send(event);
    } catch (error) {
      res.send({ code: 400, error });
    }
  },
  get_event: async (req, res) => {
    try {
      const event = await eventModel.findOne({ id: req.params.id });

      if (!event) {
        return res
          .status(404)
          .send('The event with the given ID was not found.');
      }

      const obj = event.publicKeys();
      res.send(obj);
    } catch (error) {
      res.send({ code: 400, error });
    }
  }
};
