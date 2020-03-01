const mongoose = require('mongoose');
const Promise = require('bluebird');
let debug = console.error;
const RETRY_TIMEOUT = 3000;

module.exports = function initDB(MONGODB_URL, opts) {
  mongoose.Promise = Promise;
  const options = global.Object.assign(
    {
      autoReconnect: true,
      useNewUrlParser: true, // 5.xx
      // useMongoClient: true,
      // keepAlive: 30000,
      reconnectInterval: RETRY_TIMEOUT,
      reconnectTries: 10000,
    },
    opts || {},
  );

  let isConnectedBefore = false;

  const connect = function() {
    return mongoose
      .connect(MONGODB_URL, options)
      .catch(err => debug('Mongoose connect(...) failed with err: ', err));
  };

  connect();

  mongoose.connection.on('error', function() {
    debug('Could not connect to MongoDB');
  });

  mongoose.connection.on('disconnected', function() {
    debug('Lost MongoDB connection...');
    if (!isConnectedBefore) {
      setTimeout(() => connect(), RETRY_TIMEOUT);
    }
  });
  mongoose.connection.on('connected', function() {
    isConnectedBefore = true;
    debug('Connection established to MongoDB');
  });

  mongoose.connection.on('reconnected', function() {
    debug('Reconnected to MongoDB');
  });

  // Close the Mongoose connection, when receiving SIGINT
  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      debug('Force to close the MongoDB connection after SIGINT');
      process.exit(0);
    });
  });

  return mongoose;
};
