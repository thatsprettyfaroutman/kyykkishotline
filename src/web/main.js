import 'App/main.css'
import 'whatwg-fetch'


// Methods

const handleLinkClick = e => {
  const link = e.target

  fetch(link.href, { method: 'POST' })
  link.classList.add('active')
  setTimeout(() => { link.classList.remove('active') }, 400)

  e.preventDefault()
  return false
}



// Init, fetch messages, render and bind

fetch('/messages', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(res => res.json())
  .then(messages => messages.forEach(message => {
    const section = document.getElementsByTagName('section')[0]
    const link = document.createElement('a')
    link.href = message.url
    link.innerHTML = message.linkText
    link.addEventListener('click', handleLinkClick)
    section.appendChild(link)
  }))
