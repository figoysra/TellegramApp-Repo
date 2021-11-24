const connection = require('../config/db')

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
        connection.query(`select * from users where username LIKE '%${search}%' 
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
        const { email, username } = body;
            connection.query(`select * from users where email = '${email}' or username ='${username}'`, (err, result)=>{
            if(err){
                reject(err)
            }else{
                resolve(result);
            }
        })
    }),
    register: (body) => new Promise ((resolve, reject)=>{
        const {email, password, displayName, image, username, bio, numberPhone, isOnline} = body
        connection.query(
            `INSERT INTO users (email, password, displayName, profilePicture, username, bio, numberPhone, isOnline)
            value ('${email}', '${password}','${displayName}', '${image}', '${username}', '${bio}', '${numberPhone}', ${isOnline})`,
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
            email, displayName, image, username, bio, numberPhone
        } = data
        connection.query(`
        UPDATE users SET email ='${email}', displayName='${displayName}', 
        profilePicture='${image}', username='${username}', bio='${bio}', numberPhone='${numberPhone}'
        WHERE id=${id}`, (err,result)=>{
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
    updateStatus: (id, data) => new Promise ((resolve, reject)=>{
        const { isOnline, timeOnline} = data
        // console.log(data)
        // console.log(id)
        connection.query(`
            UPDATE users SET isOnline='${isOnline}',timeOnline='${timeOnline}' WHERE id = ${id}`, 
            (err,result)=>{    
            if(err){
                
                reject(err)
            }else{
                
                resolve(result)
            }
        })
    }),
}

module.exports = usersModel