require('dotenv').config();
// const bycrypt = require('bcryptjs')


const {DATABASE_URL}=process.env;
// const client=require('socket.io').listen(3002).sockets;
const mongoString = DATABASE_URL
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require("cors");
// const http = require('http').createServer(app);
// const socketio = require('socket.io');
// const io = socketio(http); 
const authRoutes = require('./Routes/authRoute');
const cookieParser = require('cookie-parser');
const express=require('express');
const app=express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
// const server=require('http').createServer(app);
// const io=require('socket.io')(server,{cors:{origin:"*"}})
const io = new Server(server);

// console.log("io-->",io)


const Room=require('./Model/Room')
const Message=require('./Model/Message')

// app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);

//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// now we'll connect to mongodb
mongoose.set('strictQuery', true);

mongoose.connect(mongoString, { useNewUrlParser: true })
const con = mongoose.connection

con.on('open', () => {
    console.log("connected")
})



//Now the socket logic
const { addUser, getUser, removeUser } = require('./util');

app.set('view engine','ejs')
app.get('/',(req,res)=>{
    // res.send("hello")
res.render('home')
    
})

server.listen(3002, () => {
    console.log(`listening on port 3002`);
});


io.on('connection', (socket) => {
    console.log(socket.id);
    Room.find().then(result => {
        console.log("result--->",result)
        socket.emit('output-rooms', result)
    })
    socket.on('create-room', name => {
        const room = new Room({ name });
        room.save().then(result => {
            io.emit('room-created', result)
        })
    })
    socket.on('join', ({ name, room_id, user_id }) => {
        const { error, user } = addUser({
            socket_id: socket.id,
            name,
            room_id,
            user_id
        })
        socket.join(room_id);
        if (error) {
            console.log('join error', error)
        } else {
            console.log('join user', user)
        }
    })
    
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
    })
});













