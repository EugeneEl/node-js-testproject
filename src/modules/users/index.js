const { validation, authverify } = require('./middlewares/');
const userConfig = require('./config.json');
const userValidationSchema = require('./models/user.validation');
const userRoutes = Object.values(userConfig.routes);

module.exports = (MWStore, RouteStore, ValidationStore) => {
  MWStore.set({
    validation: validation(RouteStore, ValidationStore), authverify,
  });
  RouteStore.set({ users: userRoutes });
  ValidationStore.set({ users: userValidationSchema });

  return {
    // local config
    config: require('./config.json'),
    // list of controllers
    controller: require('./controllers/index.js'),
  };
};
