const session = require('express-session');
const express = require('express');
const ConnectMongo = require('connect-mongo')(session);
const constant = require('./constant');
const debug = require('debug')(constant.debug_name + ':index');
debug.enabled = true;
const { Nuxt, Builder } = require('nuxt');
const app = express();

let socketApi = require('./server/controller/socketmanager.js');

// Import and Set Nuxt.js options
const config = require('./nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

let initDb = require('./server/common/mongoose_connect');
let mongoose = initDb(constant.mongodb_connect_str);
mongoose.Promise = require('bluebird');

let mongoosePlugin = require('./server/common/mongoose_plugin');
mongoose.plugin(mongoosePlugin);

let db = mongoose.connection;
db.once('open', function() {
  let userModel = require('./server/database/User');
  let userRole = userModel.getUserRole();
  let Utility = require('./server/common/utility');

  let CarAttr = require('./server/database/CarAttr');

  userModel.countDocuments({ email: 'admin@admin.com' }).then(number => {
    if (!number) {
      userModel.create({
        fullName: 'admin',
        email: 'admin@admin.com',
        password: Utility.createPassword('admin'),
        role: userRole.Super_Admin,
      });
    }
  });
  userModel.estimatedDocumentCount().then(number => {
    let promise = [];
    if (number < 50) {
      for (let i = 0; i < 50; i++) {
        promise.push(
          userModel.create({
            email: `user${i}@gmail.com`,
            password: Utility.createPassword('123456'),
            firstName: 'first',
            lastName: 'last',
            fullName: `user ${i}`,
            role:
              Utility.getRandomInt(0, 2) == 1
                ? userRole.Driver
                : userRole.Member,
          }),
        );
      }
    }
    return Promise.all(promise);
  });
});

app.use(
  session({
    store: new ConnectMongo({ mongooseConnection: db }),
    name: 'page_session', // The cookie key value corresponding to the session id
    secret: constant.SecrectKey, // Sign the cookie associated with the session id
    resave: false, // Whether to resave session information each time a request is made
    rolling: true, // Refresh the expiration time of the browser's corresponding cookie after the request
    saveUninitialized: false, // Whether to save an uninitialized session
    cookie: {
      maxAge: 1000 * 60 * 5, // Set the effective time of the session, in milliseconds
    },
  }),
);

// if (config.dev) {
//   var cors = require('cors')

//   // var whitelist = [Constant.base_url]
//   var corsOptions = {
//     origin: /^http:\/\/localhost/i
//   }
//   app.use(cors(corsOptions))
// }

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  // app.use(/\/api\/auth/, (req, res, next) => {
  //   next()
  // })

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  let http = require('http');
  let server = http.createServer(app);
  server.listen(port);

  // include socket
  let io = socketApi.io;
  io.listen(server);
  global.socketApi = socketApi;

  debug(`Server listening on ${host}:${port}`);
}
start();

process.on('unhandledRejection', function(p, why) {
  debug('FOUND ERROR!!!!', p, why);
});

process.on('uncaughtException', function(exception) {
  debug('uncaughtException', exception); // to see your exception details in the console
  // if you are on production, maybe you can send the exception details to your
  // email as well ?
});
