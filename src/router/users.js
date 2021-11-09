const express = require("express")

const {getList, getDetail, update, login, register, destroy, forgetPassword, getReceiver, updateStatus} = require("../controller/users")

const authentication = require("../midAuth/authentication")
const upload = require("../midAuth/upload")

const usersRouter = express.Router()

usersRouter
    .get('/allusers', authentication, getList) 
    .get('/users/', authentication, getDetail)
    .get('/receiverData/:id', authentication, getReceiver)
    .post('/register', register)
    .post('/login', login)
    .put('/users/',authentication, upload, update)
    .put('/updateStatus', authentication, updateStatus )
    .delete('/users/', authentication, destroy)
    .post('/forgetPassword', forgetPassword)

module.exports = usersRouter