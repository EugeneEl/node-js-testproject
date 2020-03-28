const Joi = require('joi');

const eventSchema = {
  id: Joi.string()
    .min(3)
    .max(50),
  name: Joi.string()
    .min(3)
    .max(50),
  eventDescription: Joi.string()
    .min(5)
    .max(255),
  startDate: Joi.date().iso(),
  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate')),
  userID: Joi.string()
};

module.exports = eventSchema;
