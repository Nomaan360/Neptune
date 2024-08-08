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
const {joinRoom,addMessageToRoom,getMessagesFromRoom,roomsState} = require("./room.js");
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const {checkAuthforUser}=require('./middleware/usermiddleware')
const Users=require('./models/users')

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
        console.log('roomsState',roomsState);
        let msg=await getMessagesFromRoom(rid);
        console.log('msg',msg);
        socket.emit("getmessage",msg);
      } else {
        console.error('Failed to join room');
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  })
  
  socket.on('send-message', (message,userId) => {
    if (rid) {
      console.log('userId',userId);
      addMessageToRoom(rid, userId, message);
      socket.to(rid).emit("receive-message", message);
    } else {
      console.error('No room ID found');
    }
  });

  // socket.on("disconnect", () => {
  //  
  //   leaveRoom(rid);
  // });
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

// Setup the cron job to run every minute
cron.schedule('0 * * * *', async (req,res) => {
  try {
    console.log('Cron job running...');
    const date = new Date();
    const current_date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const current_time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    console.log('Current time:', current_time);
    console.log('Full time string:', date.toTimeString().split(' ')[0]);

    // Find users who should be updated
    const users = await Users.find({ islogin: true }); // Example: Find users who are currently logged in

    // Update their last login time and status
    for (const user of users) {
      await Users.updateOne(
        { _id: user._id },
        { $set: { lastlogin: `${current_date} ${current_time}`, islogin: false } }
      );
    }
    res.clearCookie('token')
    console.log('User statuses updated.');
  } catch (error) {
    console.error('Error during cron job execution:', error);
  }
});

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