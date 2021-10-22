const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../helpers/env")
const { failed } = require("../helpers/response")

const authentication = (req, res, next) =>{
    const token = req.headers.token
    jwt.verify(token, JWT_SECRET, (err, decoded)=>{
        if(err){
            failed(res.status(401), 401, err)
        }else{
            req.userId = decoded.id;
            next();
        }
    })
}
module.exports = authentication;