// "use strict";
// const useEmulator = (process.env.NODE_ENV == 'development');
// const builder = require("botbuilder");
// const botbuilder_azure = require("botbuilder-azure");
// const connector = useEmulator
//   ? new builder.ChatConnector()
//   : new botbuilder_azure.BotServiceConnector({
//     appId: process.env['MicrosoftAppId'],
//     appPassword: process.env['MicrosoftAppPassword'],
//     stateEndpoint: process.env['BotStateEndpoint'],
//     openIdMetadata: process.env['BotOpenIdMetadata']
//   });
// const path = require('path');
//
// const bot = new builder.UniversalBot(connector);
// bot.localePath(path.join(__dirname, './locale'));
//
// bot.dialog('/', function(session) {
//   session.send('You said ' + session.message.text + '!!!');
// });
//
// module.exports = bot;


var calling = require('botbuilder-calling');

// Create calling bot
var connector = new calling.CallConnector({
    callbackUrl: 'https://localhost:3978/api/calls',
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword']
});
var bot = new calling.UniversalCallBot(connector);

// Add root dialog
bot.dialog('/', function (session) {
    session.send('Watson... come here!');
});

module.exports = bot;
