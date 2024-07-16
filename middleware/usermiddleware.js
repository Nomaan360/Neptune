const {validateTokenForUser} =require('../services/userauth')
function checkAuthforUser() {
    return(req,res,next)=>{
        let token =req.cookies['token']
        if(!token){
            return next()

        }
        try {
            let payload= validateTokenForUser(token)
            console.log('validateTokenForUserpayload',payload);
            req.users=payload
        } catch (error) {
            // console.log('err',error);
            
            // res.redirect('/user/signin')

        }
        return next()
    }
}
function strictcheckauth(req,res,next) {
    let token =req.cookies['token']
    if(!token){
        res.redirect('/user/signin')
    }
    else{
        return next()
    }
}

module.exports={
    checkAuthforUser,strictcheckauth
}