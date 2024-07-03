const JWT = require("jsonwebtoken");
const secret = "$captain@123";
function createTokenForUser(user) {
    const payload ={
        _id: user._id,
        user_name:user.firstname,
        user_password: user.password,
    }
    const token=JWT.sign(payload,secret)
    return token
}
function validateTokenForUser(token) {
   
    const payload=JWT.verify(token,secret)
    return payload
}
module.exports={
    createTokenForUser,validateTokenForUser
}