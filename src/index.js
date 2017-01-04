import slack from 'slack'
import env from './env'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'

const TOKEN = process.env.SLACK_BOT_TOKEN
const CHANNEL = '@luffis'
const PUBLIC_CHANNEL = '@luffis'

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

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
        text: '🍍  *' + message + '*',
        as_user: true,
      }, () => {
        res.sendStatus(200)
      })
    })
  } else {
    res.sendStatus(412)
  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Kyykkis Hotline Online!')
})
