import slack from 'slack'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import env from 'node-env-file'

const DEV = process.env.NODE_ENV === 'development'

if (DEV) {
  env(path.join(process.cwd(), '.env'))
}

const TOKEN = process.env.BOT_TOKEN
const CHANNEL = process.env.TARGET_CHANNEL
const MESSAGE_LIFETIME = DEV ? 5000 : 120000
const MESSAGE_BASE = {
  token: TOKEN,
  channel: CHANNEL,
  as_user: true,
}

if (!TOKEN) {
  throw new Error('BOT_TOKEN not set in .env')
}

if (!CHANNEL) {
  throw new Error('TARGET_CHANNEL not set in .env')
}

const messages = [
  {
    url: '/seuraa',
    linkText: 'Seuraa',
    text: '*SEURAAAA!*',
  }, {
    url: '/kahvia',
    linkText: 'Kahvia',
    text: '*KAHVIAAA!*',
  }, {
    url: '/tillintallin',
    linkText: 'Tillintallin',
    text: ':tillintallin:',
  }, {
    url: '/vittuluffis',
    linkText: 'Vittu Luffis',
    text: '*Vittu Luffis* :tillintallin::bee:',
  }, {
    url: '/nalka',
    linkText: 'Nälkä',
    text: '*NÄLKÄÄÄÄÄÄ*',
  }, {
    url: '/rahkaa',
    linkText: 'Rahkaa',
    text: '*RAHKAAAAA*',
  }, {
    url: '/tuntiviel',
    linkText: 'Tunti viel',
    text: '*Tunti vielä* :tillintallin:',
  }, {
    url: '/millonsaalahtee',
    linkText: 'Millon saa lähtee?',
    text: '*Millon saa lähtee?* :tillintallin::tillintallin::tillintallin:',
  },
]

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'web')))

if ( DEV ) {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config =  require('../webpack.config.js')
  const compiler = webpack(config)
  app.use(webpackHotMiddleware(compiler))
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }))
}

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'web', 'index.html'))
})

app.get('/messages', (req, res) => {
  res.send(messages)
})

const sendMessage = (message) => {
  return new Promise(resolve => {
    slack.chat.postMessage(message, (err, data) => {
      resolve(data)
    })
  })
}

const removeMessage = message => {
  return new Promise(resolve => {
    setTimeout(() => {
      slack.chat.delete(message, (err, data) => {
        resolve(data)
      })
    }, MESSAGE_LIFETIME)
  })
}

// Create post request handlers for messages
messages.forEach(message => {
  app.post(message.url, (req, res) => {
    sendMessage({
      ...MESSAGE_BASE,
      text: message.text
    }).then(data => {
      res.sendStatus(200)
      console.log(`[INFO] POSTED: ${message.text} (${data.ts})`)
      return removeMessage({
        ...MESSAGE_BASE,
        channel: data.channel,
        ts: data.ts
      })
    }).then(data => {
      console.log(`[INFO] REMOVED: ${message.text} (${data.ts})`)
    })
  })
})

// Listen
app.listen(process.env.PORT || 3000, () => {
  console.log(`Kyykkis Hotline Online! Harassing Kyykkis on channel: ${CHANNEL} (port: ${process.env.PORT || 3000})`)
})
