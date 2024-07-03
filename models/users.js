const mongoose=require('mongoose')
const {createHmac,randomBytes} = require('crypto');
const {createTokenForUser,validateTokenForUser}=require('../services/userauth')
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
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    salt:{
        type:String,
    }
})

Userschema.pre('save',function (next){
    const user=this
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
    return token

});
const User=mongoose.model('user',Userschema)
module.exports=User