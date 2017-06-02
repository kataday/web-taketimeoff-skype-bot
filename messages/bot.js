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
    if(
      !session.privateConversationData.year &&
      !session.privateConversationData.month &&
      !session.privateConversationData.day
    ) {
      session.send(`有給休暇申請ですね。取得する日を教えてください。`);
    }

    session.beginDialog('/editDate');
  },
  (session, result) => {
    session.send(`${result.takeDate}ですね。`);
    session.privateConversationData.takeDate = result.takeDate;

    // builder.Prompts.confirm(session, `これで良いですか？`, {maxRetries: 3});
    // const card = new builder.HeroCard(session).images(null);
    // card.buttons([
    //   new builder.CardAction(session).title('はい').value('yes').type('imBack'),
    //   new builder.CardAction(session).title('日付を訂正する').value('no').type('imBack')
    // ])
    //
    // const message = new builder.Message(session);
    // message.addAttachment(card);
    //
    // session.send(message);

    // TODO: confirm()の選択肢として、「yes/no」以外が設定できないか？
    // builder.Prompts.confirm(session, `これで良いですか？`, {
    //   maxRetries: 3,
    //   listStyle: builder.ListStyle.button
    // });

    builder.Prompts.choice(session, `これで良いですか？`, {
      'はい': true,
      '日付を訂正する': false
    }, {
      listStyle: builder.ListStyle.button
    });
  },
  (session, results, next) => {
    console.log(results);
    if (!results.response.index) {
      session.send('ここまでは良い感じ');
    } else {
        // 日付を訂正するため、年月日のどれを訂正するか選択してもらう
        builder.Prompts.choice(session, `訂正する項目を選択してください。`, {
          '年': 'year',
          '月': 'month',
          '日': 'day'
        }, {
          listStyle: builder.ListStyle.button
        });
    }
  },
  (session, results, next) => {
    if (results.response) {
      if(results.response.index == 0) session.privateConversationData.year = null;
      if(results.response.index == 1) session.privateConversationData.month = null;
      if(results.response.index == 2) session.privateConversationData.day = null;

      session.beginDialog('/editDate');
    }
  },
  (session, results, next) => {
    session.replaceDialog('有給休暇');
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
