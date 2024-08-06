const {Router}=require('express')
const Users=require('../models/users')
const Categories=require('../models/categories')
const Products=require('../models/products')
const router=Router()
const {strictcheckauth}=require('../middleware/usermiddleware')
const {validateTokenForUser} =require('../services/userauth')

router.get('/',async(req,res)=>{
    let categoris=await Categories.find({})
    console.log('rewrrte',categoris);
    console.log('req.uses',req.users);
    res.render('home',{
        user:req.users,
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
    let user=req.users
    await Users.updateOne(
        { _id: user._id },
        {$set: {
            islogin: false,
        }}
    )
    res.clearCookie('token')
    res.redirect('/')
})
router.get('/catitems/:catid',strictcheckauth,async(req,res)=>{


        const catid = req.params.catid;
        console.log('cat',catid);
        let products=await Products.find({catid:catid}).populate('catid');
        res.render('./users/products',{
            data:products,
            user:req.users,

        }) 
    
})
router.get('/viewproducts/:pid',strictcheckauth,async(req,res)=>{
    const pid = req.params.pid;
    console.log('pid',pid);

    let products=await Products.find({_id:pid});
    console.log('tyu',products);
    res.render('./users/viewproducts',{
        products,
        user:req.users,

    })
})
router.get('/chats',strictcheckauth,async(req,res)=>{
    
    let users=await Users.find({_id: { $ne: req.users._id }});
    res.render('./users/userchat',{
        users:users,
        user:req.users,
    });
})

router.get('/api/user/:id',strictcheckauth,async(req,res)=>{
    try {
        const user = await Users.find({_id:req.params.id}).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('user',user);
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
})
const passport = require('passport');
var userProfile;


router.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '611049563211-h1s1joisluq7gmuq2acfdilerm1gtfm4.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/user/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
router.get('/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] })
);
 
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/user/error' }),
  async function(req, res) {
    try {

    // Successful authentication, redirect success.
    let uname= userProfile.name.givenName
    let email= userProfile.emails[0].value
    console.log('Authenticated user:', uname, email);
    const user =await Users.findOne({ emaild:email})
    if(user){
        const token =await Users.oauthlogin(email)
        console.log('token',token);
        return res.cookie('token',token).redirect('/')

    }
    else{
        console.log('register');
        let googleid= userProfile.id
        
        const newUser =  await Users.create({
            firstname:uname,
            emaild:email,
            googleid:googleid
        })
        console.log('newUser',newUser);
        const token =await Users.oauthlogin(email)
        console.log('token',token);
        
        return res.cookie('token',token).redirect('/')
    }
    } catch (err) {
        console.error('OAuth callback error:', err);
        res.status(500).json({ error: 'OAuth callback failed' });
    }
});
module.exports=router