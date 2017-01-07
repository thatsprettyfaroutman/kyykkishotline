'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slack = require('slack');

var _slack2 = _interopRequireDefault(_slack);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _nodeEnvFile = require('node-env-file');

var _nodeEnvFile2 = _interopRequireDefault(_nodeEnvFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.env.NODE_ENV === 'development') {
  (0, _nodeEnvFile2.default)(_path2.default.join(process.cwd(), '.env'));
}

var TOKEN = process.env.BOT_TOKEN;
var CHANNEL = process.env.TARGET_CHANNEL;
var MESSAGE_LIFETIME = 120000;
var MESSAGE_BASE = {
  token: TOKEN,
  channel: CHANNEL,
  as_user: true
};

if (!CHANNEL) {
  throw new Error('CHANNEL not set');
}

var messages = [{
  url: '/seuraa',
  text: '*SEURAAAA!*'
}, {
  url: '/kahvia',
  text: '*KAHVIAAA!*'
}, {
  url: '/tillintallin',
  text: ':tillintallin:'
}, {
  url: '/vittuluffis',
  text: '*Vittu Luffis* :tillintallin::bee:'
}, {
  url: '/nalka',
  text: '*NÄLKÄÄÄÄÄÄ*'
}, {
  url: '/rahkaa',
  text: '*RAHKAAAAA*'
}, {
  url: '/tuntiviel',
  text: '*Tunti vielä* :tillintallin:'
}, {
  url: '/millonsaalahtee',
  text: '*Millon saa lähtee?* :tillintallin::tillintallin::tillintallin:'
}];

var app = (0, _express2.default)();
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.get('/', function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname, 'index.html'));
});

var sendMessage = function sendMessage(message) {
  return new Promise(function (resolve, reject) {
    _slack2.default.chat.postMessage(message, function (err, data) {
      resolve(data);
    });
  });
};

var removeMessage = function removeMessage(message) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      _slack2.default.chat.delete(message, function (err, data) {
        resolve(data);
      });
    }, MESSAGE_LIFETIME);
  });
};

// Create post request handlers for messages
messages.forEach(function (message) {
  app.post(message.url, function (req, res) {
    sendMessage(_extends({}, MESSAGE_BASE, {
      text: message.text
    })).then(function (data) {
      res.sendStatus(200);
      console.log('[INFO] POSTED: ' + message.text + ' (' + data.ts + ')');
      return removeMessage(_extends({}, MESSAGE_BASE, {
        channel: data.channel,
        ts: data.ts
      }));
    }).then(function (data) {
      console.log('[INFO] REMOVED: ' + message.text + ' (' + data.ts + ')');
    });
  });
});

// Listen
app.listen(process.env.PORT || 3000, function () {
  console.log('Kyykkis Hotline Online! Harassing Kyykkis on channel: ' + CHANNEL + ' (port: ' + (process.env.PORT || 3000) + ')');
});
