"use strict";
const useEmulator = (process.env.NODE_ENV == 'development');
const builder = require("botbuilder");
const botbuilder_azure = require("botbuilder-azure");
const connector = useEmulator
  ? new builder.ChatConnector()
  : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
  });
const path = require('path');

const bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

bot.dialog('/', [(session, args, next) => {
    const card = new builder.ThumbnailCard(session);
    card.buttons([
      new builder.CardAction(session).title('有給休暇').value('paidVacation').type('imBack')
    ]).text(`どの休暇を申請しますか？`);

    const message = new builder.Message(session);
    message.addAttachment(card);

    session.send(`こんにちは。どの休暇申請のお手伝いをさせて頂きます。`);
    // we can end the conversation here
    // the buttons will provide the appropriate message
    session.endConversation(message);
  }
]);

module.exports = bot;
