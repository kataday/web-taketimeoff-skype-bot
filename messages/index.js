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
  server.post('/api/messages', bot.connector('*').listen());
} else {
  module.exports = {
    default: bot.connector('*').listen()
  }
}


// // var restify = require('restify');
// var calling = require('botbuilder-calling');
//
// // Setup Restify Server
// // var server = restify.createServer();
// // server.listen(process.env.port || process.env.PORT || 3978, function () {
// //    console.log('%s listening to %s', server.name, server.url);
// // });
//
// // Create calling bot
// var connector = new calling.CallConnector({
//     callbackUrl: 'https://web-taketimeoff.azurewebsites.net/api/calls?code=lR3d4p4tS9zpmuNEr7urorZAmLGgi/euuVajgiJABmDdAYC0N9ddjw==',
//     appId: process.env['MicrosoftAppId'],
//     appPassword: process.env['MicrosoftAppPassword']
// });
// var bot = new calling.UniversalCallBot(connector);
// // server.post('/api/calls', connector.listen());
//
// // Add root dialog
// bot.dialog('/', function (session) {
//     session.send('Watson... come here!');
// });
//
// module.exports = {
//   default: connector.listen()
// }
