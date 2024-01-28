const express = require('express');
const bodyParser = require('body-parser');
const { Server, Socket } = require('socket.io');


const io = new Server();
const app = express();

// this is for catching the new socket server / connection 
// and then passing it to the io server
io.on('connnection', socket => {
    // signaling code
})

app.listen(8000, () => console.log(`HTTP server listening on port 8000`));
io.listen(8001, () => console.log(`Socket server listening on port 8001`));