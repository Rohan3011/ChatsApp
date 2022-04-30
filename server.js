const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const config = require('./config')
const { formatMessage } = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)


// set static folder
app.use(express.static(path.join(__dirname, 'public')))

const BOTNAME = "chat bot"

// Client connection
io.on('connection', (socket) => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

        // Welcome user
        socket.emit('message', formatMessage(BOTNAME, "Welcome to chat!"))

        // Broadcast user connects
        socket.broadcast.to(user.room).emit('message',
            formatMessage(BOTNAME, `${user.username} has joined the chat.`))

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)
        console.log(user)
        if (user)
            io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    // User disconnect
    socket.on("disconnect", () => {
        const user = userLeave(socket.id)
        if (user)
            io.to(user.room).emit(
                'message',
                formatMessage(BOTNAME, `${user.username} has left the chat.`))

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })


})



server.listen(config.PORT, () => {
    console.log(`Listen on http://localhost:${config.PORT}`)
})