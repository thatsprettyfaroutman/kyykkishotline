'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slack = require('slack');

var _slack2 = _interopRequireDefault(_slack);

var _env = require('./env');

var _env2 = _interopRequireDefault(_env);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TOKEN = process.env.SLACK_BOT_TOKEN;
var CHANNEL = '#juorukerho';
var MESSAGE_LIFETIME = 20000;

var messageBase = {
  token: TOKEN,
  channel: CHANNEL,
  as_user: true
};

var app = (0, _express2.default)();
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.get('/', function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname, 'index.html'));
});

var timeoutRemoveMessage = function timeoutRemoveMessage(channel, ts) {
  console.log('[INFO] Posted: ' + ts);
  setTimeout(function () {
    _slack2.default.chat.delete(_extends({}, messageBase, {
      channel: channel,
      ts: ts
    }), function (err, data) {
      console.log('[INFO] Removed: ' + ts);
    });
  }, MESSAGE_LIFETIME);
};

app.post('/seuraa', function (req, res) {
  _slack2.default.chat.postMessage(_extends({}, messageBase, {
    text: '*SEURAAAA!*'
  }), function (err, data) {
    timeoutRemoveMessage(data.channel, data.ts);
    res.sendStatus(200);
  });
});

app.post('/kahvia', function (req, res) {
  _slack2.default.chat.postMessage(_extends({}, messageBase, {
    text: '*KAHVIAAA!*'
  }), function (err, data) {
    timeoutRemoveMessage(data.channel, data.ts);
    res.sendStatus(200);
  });
});

app.post('/tillintallin', function (req, res) {
  _slack2.default.chat.postMessage(_extends({}, messageBase, {
    text: ':tillintallin:'
  }), function (err, data) {
    timeoutRemoveMessage(data.channel, data.ts);
    res.sendStatus(200);
  });
});

app.post('/vittuluffis', function (req, res) {
  _slack2.default.chat.postMessage(_extends({}, messageBase, {
    text: '*Vittu Luffis* :tillintallin::bee:'
  }), function (err, data) {
    timeoutRemoveMessage(data.channel, data.ts);
    res.sendStatus(200);
  });
});

/*
app.post('/send', (req, res) => {
  const message = req.body.message
  if (message && message.length) {
    slack.chat.postMessage({
      token: TOKEN,
      channel: CHANNEL,
      text: message,
      as_user: true,
    }, () => {
      slack.chat.postMessage({
        token: TOKEN,
        channel: PUBLIC_CHANNEL,
        text: `:tillintallin: *${message}*`,
        as_user: true,
      }, () => {
        res.sendStatus(200)
      })
    })
  } else {
    res.sendStatus(412)
  }
})
*/

app.listen(process.env.PORT || 3000, function () {
  console.log('Kyykkis Hotline Online!');
});
