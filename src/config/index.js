const development = require('./development.json');
const production = require('./production.json');

const environment = { development, production };

module.exports = Object.assign(
    environment[process.env.NODE_ENV],
    {
      serverName: 'test',
      secret: 'calendarsecret',
      database: {
        connectURI: 'mongodb://root:calendar123@ds353957.mlab.com:53957/calendar',
      },
    }
);
