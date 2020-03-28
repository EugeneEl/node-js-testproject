const eventConfig = require('./config.json');
const eventValidationSchema = require('./models/event.validation');
const eventRoutes = Object.values(eventConfig.routes);
const schedule = require('node-schedule');
const eventHelper = require('../events/controllers/eventsHelper');

module.exports = (MWStore, RouteStore, ValidationStore) => {
  RouteStore.set({ events: eventRoutes });
  ValidationStore.set({ events: eventValidationSchema });

  return {
    // local config
    config: eventConfig,
    // list of controllers
    controller: require('./controllers/index.js')
  };
};

// выбрать из бд все события у которых dateEnd > dateNow
// и для каждого из них применить notifyCreator
// делать выборку каждые 12 часов

setTimeout(() => {
  eventHelper.scheduleEvents();

  schedule.scheduleJob('*/10 * * * *', function() {
    console.log('Schedule job');
    eventHelper.scheduleEvents();
  });
}, 1000);
