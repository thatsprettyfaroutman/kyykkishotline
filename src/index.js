import slack from 'slack'
//import env from './env'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'

const TOKEN = process.env.SLACK_BOT_TOKEN
const CHANNEL = '#juorukerho'
const MESSAGE_LIFETIME = 120000

const messageBase = {
  token: TOKEN,
  channel: CHANNEL,
  as_user: true,
}

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

const timeoutRemoveMessage = (channel,ts) => {
  console.log('[INFO] Posted: ' + ts)
  setTimeout(() => {
    slack.chat.delete({
      ...messageBase,
      channel,
      ts
    }, (err, data) => {
      console.log('[INFO] Removed: ' + ts)
    })
  }, MESSAGE_LIFETIME)
}

app.post('/seuraa', (req, res) => {
  slack.chat.postMessage({
    ...messageBase,
    text: '*SEURAAAA!*'
  }, (err, data) => { 
    console.log(err)
    timeoutRemoveMessage(data.channel, data.ts) 
    res.sendStatus(200) 
  }) 
})

app.post('/kahvia', (req, res) => {
  slack.chat.postMessage({
    ...messageBase,
    text: '*KAHVIAAA!*'
  }, (err, data) => { 
    timeoutRemoveMessage(data.channel, data.ts) 
    res.sendStatus(200) 
  }) 
})

app.post('/tillintallin', (req, res) => {
  slack.chat.postMessage({
    ...messageBase,
    text: ':tillintallin:'
  }, (err, data) => { 
    timeoutRemoveMessage(data.channel, data.ts) 
    res.sendStatus(200) 
  }) 
})

app.post('/vittuluffis', (req, res) => {
  slack.chat.postMessage({
    ...messageBase,
    text: '*Vittu Luffis* :tillintallin::bee:'
  }, (err, data) => { 
    timeoutRemoveMessage(data.channel, data.ts) 
    res.sendStatus(200) 
  }) 
})

app.post('/nalka', (req, res) => {
  slack.chat.postMessage({
    ...messageBase,
    text: '*NÄLKÄÄÄÄÄÄ*'
  }, (err, data) => { 
    timeoutRemoveMessage(data.channel, data.ts) 
    res.sendStatus(200) 
  }) 
})

app.post('/rahkaa', (req, res) => {
  slack.chat.postMessage({
    ...messageBase,
    text: '*RAHKAAAAA*'
  }, (err, data) => { 
    timeoutRemoveMessage(data.channel, data.ts) 
    res.sendStatus(200) 
  }) 
})

app.post('/tuntiviel', (req, res) => {
    slack.chat.postMessage({
    ...messageBase,
    text: '*Tunti vielä* :tillintallin:'
  }, (err, data) => {
    timeoutRemoveMessage(data.channel, data.ts)
        res.sendStatus(200)
      })
    })

app.post('/millonsaalahtee', (req, res) => {
  slack.chat.postMessage({
    ...messageBase,
    text: '*Millon saa lähtee?* :tillintallin::tillintallin::tillintallin:'
  }, (err, data) => {
    timeoutRemoveMessage(data.channel, data.ts)
    res.sendStatus(200)
  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Kyykkis Hotline Online!')
})
