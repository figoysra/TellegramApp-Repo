const bcrypt = require('bcrypt')
const fs = require('fs')
const usersModel = require('../model/users')
const jwt = require("jsonwebtoken");
const {success, successLogin, failed} = require('../helpers/response')
const sendEmail = require('../helpers/mail')
const {JWT_SECRET} = require("../helpers/env")

const users = {
    getList: (req, res) =>{
        try {
            const id = req.userId;
            const { query } = req;
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
                    console.log(err)
                    failed(res.status(401), 401, err);
                });
        } catch (error) {
            
            failed(res.status(401), 401, error);
        }
    },
    getDetail : (req, res)=>{
        try {
            const id = req.userId;
            // console.log(id)
            usersModel 
                .getdetails(id)
                .then((result)=>{
                    success(res.status(200), result[0], "get details data success");
                }).catch((err)=>{
                    failed(res.status(404), 404, err);
                })
        } catch (error) {
            failed(res.status(401), 401, err);
        }
    },
    login : (req, res) =>{
        try {
            const { body } = req;
            usersModel
                .login(body)
                .then((data)=>{
                    if (data.length <= 0) {
                        failed(res.status(404), 404, 'Wrong Emails');
                    } else {
                        const hash = data[0].password;
                        // console.log(data)
                        bcrypt.compare(body.password, hash, (error, checkpass) => {
                        if (error) {
                            failed(res.status(401), 401, error);
                        } else if (checkpass === true) {
                            const payload = {
                                id: data[0].id,
                                email: data[0].email,
                            };
                            const token = jwt.sign(payload, JWT_SECRET);
                            successLogin(res, data[0], token);
                        } else {
                            failed(res.status(404), 404, 'Wrong Password');
                        }
                        });
                    }
                }).catch((error)=>{
                    failed(res.status(404), 404, error);
                })
        }
        catch(err){
            failed(res.status(401), 401, err);
        }
    },
    register: (req, res) =>{
        try {
            const { body } = req;
            usersModel
            .login(body)
            .then((data)=>{
                // console.log(data)
                if(data.length <= 0){
                    bcrypt.hash(body.password, 10, (err, hash)=>{
                        if(err){
                            failed(res.status(401), 401, err)
                        }else{
                            const username = body.displayName.replace(/\s/g, '');
                            const data = {
                                email : body.email,
                                password: hash,
                                image :'defaultImage.jpg',
                                displayName : body.displayName,
                                username : username,
                                bio : `Hello Everyone ! I am ${body.displayName}`,
                                numberPhone : body.numberPhone,
                                isOnline: 2,
                            }
                            
                            usersModel
                                .register(data)
                            .then((result)=>{
                                success(res.status(200), result, "Registration Successfull")
                            }).catch((err)=>{
                                console.log(err)
                                failed(res.failed(404), 404, err)
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
            failed(res.status(401), 401, error);
        }
    }, 
    update : (req, res) =>{
        try {
            const id = req.userId;
            const { body } = req
            usersModel.getdetails(id)
            .then((result)=>{
                
                const data = {
                    email : body.email,
                    displayName : body.displayName,
                    image : req.file ? req.file.filename : result[0].profilePicture,
                    username : body.username,
                    bio : body.bio,
                    numberPhone : body.numberPhone,
                };
                const validasi = req.file ? "yes"  : "no"
                usersModel
                    .update(id, data)
                    .then((data) => {
                        if (result[0].profilePicture === "defaultImage.jpg" || validasi === "no") {
                            success(res, data, "update data success");
                        }else{
                            fs.unlink(`./uploads/${result[0].profilePicture}`, (err) => {
                            if (err) {
                                console.log(err)
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
    },
    getReceiver : (req, res) =>{
        try {
            const { id } = req.params;
            usersModel.getdetails(id)
                .then((result)=>{
                    success(res.status(200), result[0], "get details data success");
                }).catch((err)=>{
                    failed(res.status(404), 404, err);
                })

        } catch (error) {
            failed(res.status(401), 401, err);
        }
    },
    updateStatus : (req, res) =>{
        try {
            const { body } = req
            const id = req.userId;
            usersModel.getdetails(id)
            .then((result)=>{
                const data = {
                    isOnline: body.isOnline,
                    timeOnline: body.timeOnline
                };
                usersModel
                    .updateStatus(id, data)
                    .then((data) => {
                        success(res, data, "update data success");
                    })
                    .catch((error) => {
                    // console.log(error)
                    failed(res.status(404), 404, error);
                    });
            }).catch((err)=>{
                failed(res.status(404), 404, err)
            })
        } catch (error) {
            failed(res.status(401), 401, error);
        }
    },

}
module.exports = users