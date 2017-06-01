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
    const card = new builder.HeroCard(session).images(null);
    card.buttons([
      new builder.CardAction(session).title('有給休暇').value('有給休暇').type('imBack')
    ]).text(`どの休暇を申請しますか？`);

    const message = new builder.Message(session);
    message.addAttachment(card);

    session.send(`こんにちは。休暇申請のお手伝いをさせて頂きます。`);
    session.endConversation(message);
  }
]);

bot.dialog('有給休暇', [
  (session, args, next) => {
    session.send(`有給休暇申請ですね。取得する日を教えてください。`);
    session.beginDialog('/editDate');
  },
  (session, result) => {
    session.send(`${result.takeDate}ですね。`);
    session.privateConversationData.takeDate = result.takeDate;

    const card = new builder.HeroCard(session).images(null);
    card.buttons([
      new builder.CardAction(session).title('OK').value('ok').type('imBack'),
      new builder.CardAction(session).title('日付を訂正する').value('日付を訂正する').type('imBack')
    ]).text(`これでよろしいですか？`);

    const message = new builder.Message(session);
    message.addAttachment(card);

    session.send(message);
  }
])
.triggerAction({matches: /^有給休暇/i})
.cancelAction('CancelTakePaidVacation', '中止しました。', {
  matches: /^cancel$/,
  onSelectAction: (session, args) => {
    session.endConversation(`中止しました。`);
  },
  confirmPrompt: `本当に中止しても良いですか？`
})
// .beginDialogAction('Total', 'Total', {matches: /^total$/})
// .beginDialogAction('HelpAddNumber', 'Help', {
//   matches: /^help$/,
//   dialogArgs: {
//     action: 'AddNumber'
//   }
// });

bot.dialog('/editDate', [
  (session, args, next) => {
    if (!session.privateConversationData.year) {
      builder.Prompts.number(session, `何年ですか？`, {maxRetries: 3});
    } else {
      next();
    }
  },
  (session, results, next) => {
    if (results.response) {
      session.privateConversationData.year = results.response;
    }
    if (!session.privateConversationData.month) {
      builder.Prompts.number(session, `何月ですか？`, {maxRetries: 3});
    } else {
      next();
    }
  },
  (session, results, next) => {
    if (results.response) {
      session.privateConversationData.month = results.response;
    }
    if (!session.privateConversationData.day) {
      builder.Prompts.number(session, `何日ですか？`, {maxRetries: 3});
    } else {
      next();
    }
  },
  (session, results, next) => {
    if (results.response) {
      session.privateConversationData.day = results.response;
    }
    session.endDialogWithResult({ takeDate: `${session.privateConversationData.year}年${session.privateConversationData.month}月${session.privateConversationData.day}日` });
  }
]);

bot.dialog('ok', [
  (session, args, next) => {
    console.log(session.privateConversationData.takeDate);
  }
])
.triggerAction({matches: /^ok/i})
// .cancelAction('CancelTakePaidVacation', '中止しました。', {
//   matches: /^cancel$/,
//   onSelectAction: (session, args) => {
//     session.endConversation(`中止しました。`);
//   },
//   confirmPrompt: `本当に中止しても良いですか？`
// })
// .beginDialogAction('Total', 'Total', {matches: /^total$/})
// .beginDialogAction('HelpAddNumber', 'Help', {
//   matches: /^help$/,
//   dialogArgs: {
//     action: 'AddNumber'
//   }
// });

bot.dialog('日付を訂正する', [
  (session, args, next) => {
    console.log(session.privateConversationData.takeDate);
  }
])
.triggerAction({matches: /^日付を訂正する/i})
// .cancelAction('CancelTakePaidVacation', '中止しました。', {
//   matches: /^cancel$/,
//   onSelectAction: (session, args) => {
//     session.endConversation(`中止しました。`);
//   },
//   confirmPrompt: `本当に中止しても良いですか？`
// })
// .beginDialogAction('Total', 'Total', {matches: /^total$/})
// .beginDialogAction('HelpAddNumber', 'Help', {
//   matches: /^help$/,
//   dialogArgs: {
//     action: 'AddNumber'
//   }
// });

module.exports = bot;
