const {validateTokenForAdmin} =require('../services/adminauth')
function checkAuthforAdmin(req,res,next) {
   
        console.log('middleware');
        let token =req.cookies['admintoken']
        if(!token){
            console.log('err');
            res.redirect('/admin/')

        }
        try {
            let payload= validateTokenForAdmin(token)
            req.admin=payload
        } catch (error) {
            console.log('err',error);
            
            res.redirect('/admin/')

        }
        return next()

    
    
}

module.exports={
    checkAuthforAdmin
}