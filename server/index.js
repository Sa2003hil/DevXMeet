const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');




const io = new Server({
    cors: true
});
const app = express();

app.use(bodyParser.json());
const emailToSocketMapping = new Map();

// this is for catching the new socket server / connection 
// and then passing it to the io server
io.on('connection', socket => {
    console.log('New Connection');
    // signaling code
    socket.on('join-room', data => {
        const { roomId, emailId } = data;

        console.log('User', emailId, 'Joined Room', roomId);

        emailToSocketMapping.set(emailId, socket.id); // store the socket id against the email id
        socket.join(roomId); // join the room

        socket.emit('joined-room', { roomId });

        socket.broadcast.to(roomId).emit('user-joined', emailId); // broadcast to the room that a new user has joined
    })
})

app.listen(8000, () => console.log(`HTTP server listening on port 8000`));
io.listen(8001);