const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const CONFIG = require('./config');
const mainModule = require('./modules/main');
const MWStore = require('./modules/main/MwStore');
const RouteStore = require('./modules/main/RouteStore');
const ValidationStore = require('./modules/main/ValidationStore');
const TelegramBot = require('./modules/telegram/index');

const port = process.env.PORT || CONFIG.port || 6666;
const app = express();
const server = http.createServer(app);

TelegramBot.startBot();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public'));
});

const modules = [
  require('./modules/users/index.js')(MWStore, RouteStore, ValidationStore),
  require('./modules/events/index.js')(MWStore, RouteStore, ValidationStore)
];

const AllMiddlewares = MWStore.middlewares;

modules.forEach(({ config, controller }) => {
  Object.values(config.routes).forEach(route => {
    const _middlewares = [];

    (route.middlewares || []).forEach(mwName =>
      _middlewares.push(AllMiddlewares[mwName])
    );

    app[route.method](
      `/api${route.path}`,
      _middlewares,
      controller[route.controller]
    );
  });
});

process.on('uncaughtException', (error = {}) => {
  console.log(error);
  // setTimeout(() => process.exit(1), 1000);
});

server.listen(port, '0.0.0.0', () =>
  console.log(`API running at :${port} port`)
);
