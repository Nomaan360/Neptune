const Admins=require('../models/admins')
const Users=require('../models/users')
const Category=require('../models/categories')
const Products=require('../models/products')



function adminsignin(req,res){
    if(!req.admin){
        res.render('./admin/signin')
    }
    else{
        res.redirect('/admin/dashboard')
    }
}

function adminlogout(req,res){
    res.clearCookie('admintoken')
    res.redirect('/admin')
}

async function adminlogin(req,res){
    console.log('rete',req.body);
    const { adminname,password}=req.body
    try {
        let token=await Admins.matchPassword(adminname,password)
        console.log('ER',token);
        res.cookie('admintoken',token)
        res.redirect('/admin/dashboard')
    } 
    catch (error) {
        console.log('error',error);
        return res.render('./admin/signin',{
            error :"incorrect password or email"
        })
    }
}

async function admindashboard(req,res){
    let category=await Category.find({})
    let users=await Users.find({})
    let products=await Products.find({})

    if(!req.admin){
        console.log('ads');
        
        res.redirect('/admin/')
    }
    else {
        
        res.render('./admin/dashboard',{
            products:products,
            users:users,
            category:category,
        })
        
    } 
}
async function adminuser(req,res){
    let users=await Users.find({})
    console.log('user',users);
    return res.render('./admin/users',{
        data :users
    })
}
async function admincategory(req,res){
    let users=await Category.find({})
    console.log('user',users);
    return res.render('./admin/categories',{
        data :users
    })
}
function admincategorypage(req,res){
    return res.render('./admin/addcategory')
}

async function adminpostcategory(req,res){
    const cat=req.body.cat
    const categories = await Category.find({ category_name: cat });
    let errors
    if(categories.length!=0){
        errors ='Already Added'
    }
    else if(!cat || cat=='') {
        errors='Category should not be empty'
    }
    if(!cat || cat==''||categories.length!=0){
        return res.render('./admin/addcategory',{
            error :errors
        })

    }
    Category.create({
        category_name:cat
    })

    return res.redirect('/admin/categories')
}

async function adminproducts(req,res){
    let users=await Products.find({}).populate('catid');
    console.log('user',users);
    return res.render('./admin/products',{
        data :users
    })
}
async function adminproductpage(req,res){
    const category = await Category.find({});

    return res.render('./admin/addproduct',{
        categories :category
    })
}

async function adminpostproduct(req,res){
    const {pname,pprice,catid}=req.body
    const category = await Category.find({});

    let errors
    if(!pname || !pprice ||!req.file.filename ||!catid) {
        errors='Fields should not be empty'
    }
    if(!pname || !pprice || !req.file.filename ||!catid) {
        return res.render('./admin/addproduct',{
            error :errors,
            categories :category

        })
    }
    Products.create({
        productname:pname,
        price:pprice,
        pic:`adminimg/${req.file.filename}`,
        catid:catid,
    })

    res.redirect('/admin/products')
}
module.exports={adminsignin,adminlogout,adminlogin,admindashboard,adminuser,admincategory,admincategorypage,adminpostcategory,adminproducts,adminproductpage,adminpostproduct}