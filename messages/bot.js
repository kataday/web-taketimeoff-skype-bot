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
    // const card = new builder.ThumbnailCard(session);
    // card.buttons([
    //   new builder.CardAction(session).title('有給休暇').value('paidVacation').type('imBack')
    // ]).text(`どの休暇を申請しますか？`);
    //
    // const message = new builder.Message(session);
    // message.addAttachment(card);

    // session.send(`こんにちは。休暇申請のお手伝いをさせて頂きます。`);
    // we can end the conversation here
    // the buttons will provide the appropriate message
    // session.endConversation(message);
    // builder.Prompts.choice(session, 'どの休暇を申請しますか？', ['有給休暇'], {
    //   maxRetries: 3,
    //   retryPrompt: 'Ooops, what you wrote is not a valid option, please try again'
    // });

    var msg = new builder.Message(session).text("Thank you for expressing interest in our premium golf shirt! What color of shirt would you like?").suggestedActions(builder.SuggestedActions.create(session, [
      builder.CardAction.imBack(session, "productId=1&color=green", "Green"),
      builder.CardAction.imBack(session, "productId=1&color=blue", "Blue"),
      builder.CardAction.imBack(session, "productId=1&color=red", "Red")
    ]));
    session.send(msg);


  }
]);

module.exports = bot;
