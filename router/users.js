const {Router}=require('express')
const Users=require('../models/users')
const Categories=require('../models/categories')
const Products=require('../models/products')
const router=Router()
const {strictcheckauth}=require('../middleware/usermiddleware')

router.get('/',async(req,res)=>{
    let categoris=await Categories.find({})
    console.log('rewrrte',categoris);
    res.render('home',{
        user:req.user,
        categories:categoris
    })
})
router.get('/signup/',(req,res)=>{
    res.render('./users/signup')
})
router.get('/signin/',(req,res)=>{
    res.render('./users/signin')
})
router.post('/register',async(req,res)=>{
    const {uname,unumber,upassword,cpassword,uemail}=req.body
    try
    {
        if(upassword==cpassword){
            await Users.create({
                firstname:uname,
                emaild:uemail,
                number:unumber,
                password: upassword,
            })
            res.redirect('/user/signin')
        }
        else{
            res.render('./users/signup',{
                err:'Password not matched'
            }) 
        }
    }catch(error){
        if (error.code === 11000 && error.keyPattern.emaild) {
            res.render('./users/signup',{
                err:'Already registered with Email Id!'
            }) 
        }
         else if(error.code === 11000 && error.keyPattern.number) {
            res.render('./users/signup',{
                err:'Already registered with Number!'
            }) 
        }
        else{
            throw err
        }
    }
})

router.post('/login',async(req,res)=>{
    const {unumber,upassword}=req.body
    try {
        const token =await Users.matchPassword(unumber,upassword)
        return res.cookie('token',token).redirect('/')
    } catch (error) {
        console.log(error.Error);
        res.render('./users/signin',{
            err:error
        }) 
    }
})

router.get('/logout',async(req,res)=>{
    res.clearCookie('token')
    res.redirect('/')
})
router.get('/catitems/:catid',strictcheckauth,async(req,res)=>{


        const catid = req.params.catid;
        console.log('cat',catid);
        let products=await Products.find({catid:catid}).populate('catid');
        res.render('./users/products',{
            data:products,
            user:req.user,

        }) 
    
})
router.get('/viewproducts/:pid',strictcheckauth,async(req,res)=>{
    const pid = req.params.pid;
    console.log('pid',pid);

    let products=await Products.find({_id:pid});
    console.log('tyu',products);
    res.render('./users/viewproducts',{
        products,
        user:req.user,

    })
})

module.exports=router