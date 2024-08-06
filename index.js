const express=require('express')
const path=require('path')
const app=express()
const cookieparser =require('cookie-parser')
const Port=4000
const userrouter=require('./router/users')
const adminrouter=require('./router/admins')
const mongoose =require('mongoose')
const Categories=require('./models/categories')
const fs = require('fs');
const session = require('express-session');
const passport = require('passport');
const { Server } = require("socket.io");
const http = require("http");
const {joinRoom,leaveRoom} = require("./room.js");

const {checkAuthforUser}=require('./middleware/usermiddleware')

app.use(express.urlencoded ({ extended: false }));

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))
// 
app.use(cookieparser())
app.use(express.static(path.resolve('./public'))); //Serves resources from public folder
app.use(checkAuthforUser())

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

app.use(passport.initialize());
app.use(passport.session());
const server = http.createServer(app);
const io = new Server(server);
mongoose.connect("mongodb://127.0.0.1:27017/neptune").then(() =>
    console.log("Mongodb connected")
  );
io.on('connection',async(socket)=>{
  let rid
  socket.on('chatto',async(roomid)=>{
    console.log('Room ID:', roomid);
    try {
      rid = await joinRoom(roomid);
      if (rid) {
        socket.join(rid);
      } else {
        console.error('Failed to join room');
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  })
  
  socket.on('send-message', (message) => {
    if (rid) {
      socket.to(rid).emit("receive-message", message);
    } else {
      console.error('No room ID found');
    }
  });

  socket.on("disconnect", () => {
    // leave room
    leaveRoom(rid);
  });
})
app.get('/',async(req,res)=>{
    let categoris=await Categories.find({})
    console.log('rewrrte',categoris);

    res.render('home',{
        user:req.users,
        categories:categoris
    })
})

app.use('/user',userrouter)

app.use('/admin',adminrouter)

server.listen(Port,()=>{
    console.log('hrhge');
})

// Asynchronous programming
// Express.js
// Middleware
// Database integration ORM --> ( https://sequelize.org/  )
// Authentication, Authorisation (Login/ Sign Up)
// → streams, websocket, async/await, commonJS/EJS, 
// server-side Rendering ( .ejs files)
// Testing (optional)
// Basic libraries (axios, fs, express)
// Error Handling
// Session management  (JWT token, other tokens) 
// File Uploads
// Background Jobs (CronJobs)
// Caching/Logging (store logs on server)
// Internationalization (i18n)
// Micro Services 
// Dockerization 
// WebSockets 
// OAuth Authentication (Google sign in) 
// Search text
// AWS and AWS Lambda (serverless computing)
// Blockchain Integration 
// Apache spark or Apache flink