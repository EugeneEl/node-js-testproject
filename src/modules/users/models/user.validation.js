const Joi = require('joi');

const userSchema = {
  id: Joi.string()
      .min(3)
      .max(50),
  name: Joi.string()
      .min(3)
      .max(50),
  connectToTelegramID: Joi.string()
      .min(3)
      .max(50),
  email: Joi.string()
      .min(5)
      .max(255)
      .email(),
  password: Joi.string()
      .min(5)
      .max(255),
  gender: Joi.string()
      .min(5)
      .max(255),
  country: Joi.string()
      .min(5)
      .max(255),
  city: Joi.string()
      .min(5)
      .max(255),
  phone: Joi.string()
      .min(5)
      .max(255),
  description: Joi.string()
      .min(5)
      .max(255),
};

module.exports = userSchema;
