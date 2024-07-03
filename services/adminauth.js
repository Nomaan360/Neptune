const JWT = require("jsonwebtoken");
const secret = "$uperMan@123";
function createTokenForAdmin(admin) {
    const payload ={
        _id: admin._id,
        admin_name:admin.admin_name,
        admin_password: admin.admin_password,
    }
    const token=JWT.sign(payload,secret)
    return token
}
function validateTokenForAdmin(token) {
   
    const payload=JWT.verify(token,secret)
    return payload
}
module.exports={
    createTokenForAdmin,validateTokenForAdmin
}