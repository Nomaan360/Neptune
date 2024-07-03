const mongoose=require('mongoose')

const Productschema=new mongoose.Schema({
    productname:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    pic:{
        type:String,
        default: "/images/default.png",
    },
    catid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
    },
})

const Products=mongoose.model('products',Productschema)
module.exports=Products