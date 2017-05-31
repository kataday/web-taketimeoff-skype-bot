"use strict";
// require('dotenv').config();
const useEmulator = (process.env.NODE_ENV == 'development');
const bot = require('./bot.js');

if (useEmulator) {
  const restify = require('restify');
  const server = restify.createServer();
  server.listen(3978, function() {
    console.log('bot endpont at http://localhost:3978/api/messages');
  });
  // server.post('/api/messages', bot.connector('*').listen());
  server.post('/api/calls', bot.connector.listen());
} else {
  module.exports = {
    default: bot.connector('*').listen()
  }
}
