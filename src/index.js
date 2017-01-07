import slack from 'slack'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import env from 'node-env-file'

env(path.join(process.cwd(), '.env'))

const DEV = process.env.NODE_ENV === 'development'
const TOKEN = process.env.BOT_TOKEN
const CHANNEL = process.env.TARGET_CHANNEL
const MESSAGE_LIFETIME = 120000
const MESSAGE_BASE = {
  token: TOKEN,
  channel: CHANNEL,
  as_user: true,
}

if (!CHANNEL) {
  throw new Error('CHANNEL not set')
}

const messages = [
  {
    url: '/seuraa',
    text: '*SEURAAAA!*',
  }, {
    url: '/kahvia',
    text: '*KAHVIAAA!*',
  }, {
    url: '/tillintallin',
    text: ':tillintallin:',
  }, {
    url: '/vittuluffis',
    text: '*Vittu Luffis* :tillintallin::bee:',
  }, {
    url: '/nalka',
    text: '*NÄLKÄÄÄÄÄÄ*',
  }, {
    url: '/rahkaa',
    text: '*RAHKAAAAA*',
  }, {
    url: '/tuntiviel',
    text: '*Tunti vielä* :tillintallin:',
  }, {
    url: '/millonsaalahtee',
    text: '*Millon saa lähtee?* :tillintallin::tillintallin::tillintallin:',
  },
]

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

const sendMessage = (message) => {
  return new Promise((resolve, reject) => {
    slack.chat.postMessage(message, (err, data) => {
      resolve(data)
    })
  })
}

const removeMessage = message => {
  return new Promise((resolve, reject) => {
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
