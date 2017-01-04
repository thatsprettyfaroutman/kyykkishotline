'use strict';

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
var CHANNEL = '@luffis';
var PUBLIC_CHANNEL = '@luffis';

var app = (0, _express2.default)();
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.get('/', function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname, 'index.html'));
});

app.post('/send', function (req, res) {
  var message = req.body.message;
  if (message && message.length) {
    _slack2.default.chat.postMessage({
      token: TOKEN,
      channel: CHANNEL,
      text: message,
      as_user: true
    }, function () {
      _slack2.default.chat.postMessage({
        token: TOKEN,
        channel: PUBLIC_CHANNEL,
        text: '🍍  *' + message + '*',
        as_user: true
      }, function () {
        res.sendStatus(200);
      });
    });
  } else {
    res.sendStatus(412);
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Kyykkis Hotline Online!');
});
