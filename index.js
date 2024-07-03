const express=require('express')
const path=require('path')
const app=express()
const cookieparser =require('cookie-parser')
const Port=8000
const userrouter=require('./router/users')
const adminrouter=require('./router/admins')
const mongoose =require('mongoose')
const Categories=require('./models/categories')
const fs = require('fs');

const {checkAuthforUser}=require('./middleware/usermiddleware')

app.use(express.urlencoded ({ extended: false }));

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))
// 
app.use(cookieparser())
app.use(express.static(path.resolve('./public'))); //Serves resources from public folder
app.use(checkAuthforUser())

mongoose.connect("mongodb://127.0.0.1:27017/neptune").then(() =>
    console.log("Mongodb connected")
  );
app.get('/',async(req,res)=>{
    console.log('fs',fs);
    let categoris=await Categories.find({})
    console.log('rewrrte',categoris);

    res.render('home',{
        user:req.user,
        categories:categoris
    })
})

app.use('/user',userrouter)

app.use('/admin',adminrouter)

app.listen(Port,()=>{
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