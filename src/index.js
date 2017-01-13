import slack from 'slack'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import env from 'node-env-file'
import fetch from 'node-fetch'

const DEV = process.env.NODE_ENV === 'development'

if (DEV) {
  env(path.join(process.cwd(), '.env'))
}

const TOKEN = process.env.BOT_TOKEN
const CHANNEL = process.env.TARGET_CHANNEL
const MESSAGE_LIFETIME = DEV ? 10000 : 120000
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

const getRandomTigerGif = () => {
  return fetch('http://api.giphy.com/v1/gifs/search?q=tiger&api_key=dc6zaTOxFJmzC')
    .then(res => res.json())
    .then(res => res.data)
    .then(images => {
      const selected = parseInt(Math.random() * images.length, 10)
      return `*TIKRU* ${images[selected].url}`
    })
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
    url: '/tikrugif',
    linkText: 'Tikru Gif',
    text: getRandomTigerGif,
  }, {
    url: '/millonsaalahtee',
    linkText: 'Millon saa lähtee?',
    text: 'Millon saa lähtee? :tillintallin::tillintallin::tillintallin:',
  }, {
    url: '/parina',
    linkText: 'Pärisee',
    text: ':bee:',
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
  const messageLinks = messages
    .filter(message => messages.length % 2 === 0 || message.url !== '/parina')
    .map(({url, linkText}) => ({url, linkText}))

  res.send(messageLinks)
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
    new Promise((resolve) => {
      if (typeof message.text === 'function') {
        message.text().then(asyncMessage => {
          resolve(sendMessage({...MESSAGE_BASE, text: asyncMessage}))
        })
      } else {
        resolve(sendMessage({...MESSAGE_BASE, text: message.text }))
      }
    })
      .then(data => {
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



// Tikru Cafe

app.post('/tikrucafe', (req, res) => {
  console.log('NEW ORDER TIKRU CAFE', req.body)
  res.sendStatus(200)
})



// Listen
app.listen(process.env.PORT || 3000, () => {
  console.log(`Kyykkis Hotline Online! Harassing Kyykkis on channel: ${CHANNEL} (port: ${process.env.PORT || 3000})`)
})
