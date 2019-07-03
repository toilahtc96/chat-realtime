const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('#message-ip')
const $messageFormButton = document.querySelector("#message-button")
const $sendLocationButton = document.querySelector("#send-location")
const $messages = document.querySelector("#messages")

//Templates
const messageTemplate = document.querySelector('#mesage-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML
    //Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    //new message element
    const $newMessage = $messages.lastElementChild

    //Height of the last message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible Height

    const visibleHeight = $messages.offsetHeight

    // Height of message container

    const contentHeight = $messages.scrollHeight

    //How far have I scrolled

    const scrollOffset = $messages.scrollTop + visibleHeight

    if (contentHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }


}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
socket.on('locationMessage', (location) => {
    console.log(location)
    const html = Mustache.render(locationTemplate, {
        username: location.username,
        url: location.url,
        createdAt: moment(location.createdAt).format('hh:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {

    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        if (error) {
            return console.log(error)
        }
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        console.log('delivered!')
    })
})
document.querySelector("#send-location").addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('GEO location is not supported by your browser.')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        $sendLocationButton.setAttribute('disabled', 'disabled')
        socket.emit('sendLocation', {
                longitude: position.coords.longitude,
                latitude: position.coords.latitude
            },
            (error) => {
                if (error) { console.log(error) }
                $sendLocationButton.removeAttribute('disabled')
                console.log('send position ')
            })

    })
})


socket.emit('join', { username, room }, (error) => {
    if (error) {
        location.href = '/'
        alert(error)

    }
})