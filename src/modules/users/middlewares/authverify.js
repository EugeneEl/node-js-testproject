const jwtService = require('../services/jwt');
const { userModel } = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.send({ error: 'Authorization header not set!' });
      return false;
    }

    const jwtToken = authorization.split('Bearer ')[1];
    const userData = jwtService.verifyToken(jwtToken); // { id, expire }

    const expirationDate = userData.expirationDate;
    if (Date.now() >= expirationDate) {
      res.send({ error: 'Token has been expired' });
      return false;
    }

    const findedUser = await userModel.findOne({
      id: userData.id,
    });

    if (!findedUser) {
      res.send({ error: 'User not found!' });
      return false;
    }

    // eslint-disable-next-line require-atomic-updates
    req.auth = findedUser;

    next();
  } catch (error) {
    res.send({ error: error.message });
  }
};
