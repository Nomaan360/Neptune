const mongoose =require('mongoose')
const {createTokenForAdmin}=require('../services/adminauth')

const adminSchema=new mongoose.Schema({
    admin_name:{
        type:String,
        required:true,
        unique:true
    },
    admin_password:{
        type:String,
        required:true
    }
})

adminSchema.static("matchPassword",async function (adminname, password) {
    console.log('name',adminname);
    console.log('password',password);
    const admin = await this.find({ admin_name: adminname, admin_password: password });

    console.log('admin',admin);
    if (!admin ||admin=='[]'|| admin.length === 0) 
    {
        throw new Error("User Not found");
    }
    let token= createTokenForAdmin(admin)
    console.log('token,',token);
    return token

});


const Admin=mongoose.model('admin',adminSchema)

module.exports=Admin