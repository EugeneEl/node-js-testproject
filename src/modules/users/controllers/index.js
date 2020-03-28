const nanoid = require('nanoid');
const crypto = require('crypto');
const CONFIG = require('../../../config');
const jwtService = require('../services/jwt');
const { userModel } = require('../models/user');
const { bot } = require('../../telegram');

module.exports = {
  auth: async (req, res) => {
    try {
      const { body } = req;
      const { password = '', email = '' } = body;

      const hash = crypto
          .createHmac('sha256', CONFIG.secret)
          .update(password)
          .digest('hex');

      const findedUser = await userModel.findOne({
        email,
        password: hash,
      });

      if (!findedUser) throw new Error('Missing user! Check your credentials');

      const token = generateToken(findedUser.id);
      findedUser.token = token;

      const obj = findedUser.publicKeys();
      res.send(obj);
    } catch (error) {
      res.send({ code: 400, error: error.message });
    }
  },

  register: async (req, res) => {
    try {
      const { body } = req;
      const {
        name = '', password = '', email = '', gender = '', country = '',
        city = '', phone = '', description = '',
      } = body;
      console.log("register");
      console.log(name, password, email);

      const existingUser = await userModel.findOne({
        email,
      });

      if (existingUser) {
        throw new Error(`User with ${email} already registered`);
      }

      const hash = crypto
          .createHmac('sha256', CONFIG.secret)
          .update(password)
          .digest('hex');

      const newUser = await userModel.create({
        id: nanoid(),
        name, email, password: hash, gender, country,
        city, phone, description,
      });
      const token = generateToken(newUser.id);

      newUser.token = token;

      res.send(newUser.publicKeys());
    } catch (error) {
      res.send({ code: 400, message: error.message });
    }
  },

  update_user: async (req, res) => {
    try {
      const { body, params } = req;
      const user = await userModel.findOneAndUpdate(
          { id: params.id }, body, { new: true },
      );

      if (!user) {
        return res
            .status(404)
            .send('The user with the given ID was not found.');
      }

      bot.sendMessage(body.connectToTelegramID, 'Success connected!');

      res.send(user.publicKeys());
    } catch (error) {
      res.send({ code: 400, error: error.message });
    }
  },

  delete_user: async (req, res) => {
    try {
      const user = await userModel.findOne({ id: req.params.id });

      if (!user) {
        return res
            .status(404)
            .send('The user with the given ID was not found.');
      }

      const deleteUser = await userModel.findOneAndRemove({
        id: req.params.id
      });

      res.send(user);
    } catch (error) {
      res.send({ code: 400, error });
    }
  },

  get_user: async (req, res) => {
    try {
      const user = await userModel.findOne({ id: req.params.id });

      if (!user) {
        return res
            .status(404)
            .send('The user with the given ID was not found.');
      }

      const obj = user.publicKeys();
      res.send(obj);
    } catch (error) {
      res.send({ code: 400, error });
    }
  }
};

function generateToken(userId) {
  const token = jwtService.createToken({
    id: userId,
    expirationDate: Date.now() + 1209600000
  });
  return token;
}
