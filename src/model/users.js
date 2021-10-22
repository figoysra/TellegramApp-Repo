const connection = require('../config/db')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../helpers/env")

const usersModel = {
    getAllData: () => new Promise((resolve,reject)=>{
        connection.query(`select * from users`, (err, result)=>{
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    }),
    getList: (search, field, typeSort, limit, offset) => new Promise((resolve, reject)=>{
        connection.query(`select * from users where displayName LIKE '%${search}' 
        ORDER BY ${field} ${typeSort} LIMIT ${limit} OFFSET ${offset}`, (err, result)=>{
            if(err){
                reject(err)
            }else{
                // console.log(result)
                resolve(result)
            }
        });
    }),
    login: (body) => new Promise((resolve, reject) =>{
        const {email} = body
        connection.query(`select * from users where email = '${email}'`, (err, result)=>{
            if(err){
                reject(err)
            }else{
                if(result.length <= 0){
                    resolve(result)
                }else{
                    const user = result[0]
                    const payload = {
                        id : user.id,
                        email: user.email
                    }
                    const token= jwt.sign(payload, JWT_SECRET)
                    resolve({result, token})
                }
            }
        })
    }),
    register: (body) => new Promise ((resolve, reject)=>{
        const {email, password, displayName, image, username, bio, numberPhone} = body
        connection.query(
            `INSERT INTO users (email, password, displayName, profilePicture, username, bio, numberPhone)
            value ('${email}', '${password}','${displayName}', '${image}', '${username}', '${bio}', '${numberPhone}')`,
            (err, result)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
    }),
    getdetails : (id) => new Promise((resolve, reject)=>{
        connection.query(`select * from users where id = ${id}`, (err,result)=>{
            if(err){
                reject(err)
            }else{
                if(result <= 0){
                    reject(err)
                }else{
                    resolve(result)
                }
            }
        })
    }),
    update: (id, data) => new Promise ((resolve, reject)=>{
        const {
            email, password, displayName, image, username, bio, numberPhone
        } = data
        connection.query(`UPDATE users SET email ='${email}', password='${password}', displayName='${displayName}', profilePicture='${image}', username='${username}', bio='${bio}', numberPhone='${numberPhone}' WHERE id=${id}`, (err,result)=>{
            if(err){
                // console.log(err)
                reject(err)
            }else{
                // console.log("success")
                resolve(result)
            }
        })
    }),
    destroy: (id) => new Promise((resolve, reject) => {
    connection.query(`DELETE FROM users WHERE id=${id}`, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
        });
    }),
}

module.exports = usersModel