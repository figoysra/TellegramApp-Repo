const bcrypt = require('bcrypt')
const fs = require('fs')
const usersModel = require('../model/users')
const {success, successLogin, failed} = require('../helpers/response')
const sendEmail = require('../helpers/mail')

const users = {
    getList: (req, res) =>{
        try {
            const { query } = req;
            const id = req.userId;
            const search = query.search === undefined ? "" : query.search;
            const field = query.field === undefined ? "id" : query.field;
            const typeSort = query.sort === undefined ? "ASC" : query.sort;
            const limit = query.limit === undefined ? 10 : query.limit;
            const page = query.page === undefined ? 1 : query.page;
            const offset = page === 1 ? 0 : (page - 1) * limit;
            usersModel
                .getList(search, field, typeSort, limit, offset)
                .then(async (response) => {
                    const getalldata = await usersModel.getAllData();
                    const data = getalldata.filter((e => e.id !== id))
                    const result = {
                        data: response.filter((e=> e.id !== id)),
                        totalPage: Math.ceil(data.length / limit),
                        page: req.query.page,
                    };
                    success(res.status(200), result, "get all users success");
                })
                .catch((err) => {
                    failed(res.status(401), 401, err);
                });
        } catch (error) {
            failed(res.status(401), 401, error);
        }
    },
    getDetail : (req, res)=>{
        try {
            const id = req.userId;
            console.log(id)
            usersModel 
                .getdetails(id)
                .then((result)=>{
                    success(res.status(200), result, "get details data success");
                }).catch((err)=>{
                    failed(res.status(404), 404, err);
                })
        } catch (error) {
            failed(res.status(401), 401, err);
        }
    },
    login : (req, res) =>{
        try {
            const{body} = req
            usersModel
                .login(body)
                .then((data)=>{
                    // console.log(data.token)
                    const hash = data.result[0].password
                    bcrypt.compare(body.password, hash, (error, checkpass)=>{
                        if(error){
                            failed(res.status(401), 401, err)
                        }else if(checkpass === true){
                            successLogin(res, data.result[0], data.token)
                        }else{
                            failed(res.status(404), 404, "Wrong Password")
                        }    
                    })
                }).catch((err)=>{
                    failed(res.status(404), 404, "Wrong Email")
                })
            }catch(err){
                failed(res.status(401), 401, error);
            }
        },
    register: (req, res) =>{
        try {
            const { body } = req
            // console.log(body)
            usersModel.login(body)
            .then((data)=>{
                console.log(data)
                if(data.length <= 0){
                    bcrypt.hash(body.password, 10, (err, hash)=>{
                        if(err){
                            failed(res.status(401), 401, err)
                        }else{
                            const data = {
                                email : body.email,
                                password: hash,
                                image : req.file ? req.file.filename : 'defaultImage.jpg',
                                displayName : body.displayName,
                                username : body.username,
                                bio : body.bio,
                                numberPhone : body.numberPhone
                            }
                            usersModel
                                .register(data)
                            .then((result)=>{
                                success(res.status(200), result, "Registration Successfull")
                            }).catch((err)=>{
                                failed(res.failed(404), 404, "err")
                            })
                        }
                    })
                }else{
                    failed(res.status(401), 401, "You already Register");
                }
            }).catch((err)=>{
                failed(res.status(404), 404, err)
            })
        } catch (error) {
            failed(res.status(404), 404, error);
        }
    }, 
    update : (req, res) =>{
        try {
            const id = req.userId;
            const { body } = req
            usersModel.getdetails(id)
            .then((result)=>{
                bcrypt.hash(body.password, 10, (err, hash)=>{
                    if(err){
                        failed(res.status(401), 401, err)
                    }else{
                        const data = {
                            email : body.email,
                            password: hash,
                            displayName : body.displayName,
                            image : req.file ? req.file.filename : 'defaultImage.jpg',
                            username : body.username,
                            bio : body.bio,
                            numberPhone : body.numberPhone
                        };
                        usersModel
                            .update(id, data)
                            .then((data) => {
                                if (result[0].profilePicture === "defaultImage.jpg") {
                                    success(res, data, "update data success");
                                }else{
                                    fs.unlink(`./uploads/${result[0].profilePicture}`, (err) => {
                                    if (err) {
                                        failed(res.status(401), 401, err);
                                    } else {
                                        // client.del("users");
                                        // console.log(result)
                                        success(res, data, "update data success");
                                    }
                                    });
                                }
                            })
                            .catch((error) => {
                            // console.log(error)
                            failed(res.status(404), 404, error);
                            });
                    }
                })
            }).catch((err)=>{
                failed(res.status(404), 404, err)
            })
        } catch (error) {
            failed(res.status(401), 401, error);
        }
    },
    destroy: (req, res) =>{
        try {
            const id = req.userId;
            // console.log(id)
            usersModel.getdetails(id).then((result)=>{
                if(result.length <= 0){
                    failed(res.status(404), 404, "Your Request is not Found");
                }else{
                    usersModel
                        .destroy(id)
                        .then((data)=>{
                            if(result[0].profilePicture === "defaultImage.jpg"){
                                success(res.status(200), data, "delete data success")
                            }else{
                                    fs.unlink(`./uploads/${result[0].profilePicture}`, (err) => {
                                    if (err) {
                                        failed(res.status(401), 401, err);
                                    } else {
                                        success(res, data, "delete data success");
                                    }
                                    });
                                }
                        }).catch((err)=>{
                            failed(res.status(404), 404, err)
                        })
            
                }
            })
        } catch (error) {
            failed(res.status(401), 401, err)
        }
    },
    forgetPassword: (req, res) =>{
        try {
            const { body } = req;
            usersModel.login(body).then((data) => {
                // console.log(data.token)
                if(data.length <= 0){
                    failed(res.status(404), 404, "Data Not Found")
                }else{
                    sendEmail(data.result[0], data.token)
                    .then((result)=>{
                        success(res, result, "Send Email Success" )
                    }).catch((err)=>{
                        failed(res.status(401), 401, err)
                    })
                }
            });
        } catch (error) {
            failed(res, 401, error)
        }
    }

}
module.exports = users