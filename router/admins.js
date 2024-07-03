const {Router}=require('express')
const {checkAuthforAdmin}=require('../middleware/adminmiddleware')
const router=Router()
const multer  = require('multer')
const path=require('path')

const {adminsignin,adminlogout,adminlogin,admindashboard,adminuser,admincategory,admincategorypage,adminpostcategory,adminproducts,adminproductpage,adminpostproduct}=require('../controllers/admincontroller')
// const upload = multer({ dest: './public/adminimg/' })
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/adminimg/`))
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`
      cb(null,filename)
    }
  })
  
  const upload = multer({ storage: storage })


router.get('/',adminsignin)
router.get('/logout',adminlogout)

router.post('/login',adminlogin)

router.get('/dashboard',checkAuthforAdmin,admindashboard)

router.get('/users',checkAuthforAdmin,adminuser)
router.get('/categories',checkAuthforAdmin,admincategory)

router.get('/addcategory',checkAuthforAdmin,admincategorypage)

router.post('/postcategory',checkAuthforAdmin,adminpostcategory)

router.get('/products',checkAuthforAdmin,adminproducts)

router.get('/addproduct',checkAuthforAdmin,adminproductpage)
router.post('/postproduct',checkAuthforAdmin,upload.single('pimage'),adminpostproduct)
module.exports=router