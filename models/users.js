const mongoose=require('mongoose')
const {createHmac,randomBytes} = require('crypto');
const {createTokenForUser,validateTokenForUser}=require('../services/userauth')
const { type } = require('os');
const Userschema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    emaild:{
        type:String,
        required:true,
        unique:true
    },
    number:{
        type:Number,
    },
    googleid:{
        type:Number,
    },
    lastlogin:{
        type:String
    },
    islogin:{
        type:Boolean
    },
    password:{
        type:String,
    },
    salt:{
        type:String,
    }
})

Userschema.pre('save',function (next){
    const user=this
    if(user.googleid!=null||user.googleid!='') next()
    if(!user.isModified('password')) return
    const salt='somerandopmnum'
    const hashpass=createHmac('sha256',salt)
    .update(user.password)
    .digest('hex');
    this.salt=salt
    this.password=hashpass
    next()
})
Userschema.static("matchPassword",async function (number, password) {
    const user =await this.findOne({ number });
    if (!user) throw new Error("User Not found");

    const salt=user.salt
    const hashpass=user.password

    const userpass=createHmac('sha256',salt)
    .update(password)
    .digest('hex');

    if(userpass!==hashpass)
        throw new Error("Incorrect Password");
    let token= createTokenForUser(user)

    var date = new Date();
    var current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
    var current_time = date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
    console.log('current_time',current_time);
    console.log('current_times', date.toTimeString().split(' ')[0]); // Outputs current time

    await this.updateOne(
        { _id: user._id },
        {$set: {
            lastlogin: current_date+' '+current_time,
            islogin: true,
        }}
    )
    return token

});
Userschema.static("oauthlogin",async function (email) {
    const user =await this.findOne({ emaild:email });
    if (!user) throw new Error("User Not found");
    console.log('user',user);
    let token= createTokenForUser(user)
    
    var date = new Date();
    var current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
    var current_time = date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
    console.log('current_time',current_time);
    console.log('current_times', date.toTimeString().split(' ')[0]); // Outputs current time

    await this.updateOne(
        { _id: user._id },
        {$set: {
            lastlogin: current_date+' '+current_time,
            islogin: true,
        }}
    )
    return token

});
const User=mongoose.model('user',Userschema)
module.exports=User