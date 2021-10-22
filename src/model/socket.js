const connection = require("../config/db")

const socketModel = {
    insertMessage : (payload) => new Promise((resolve, reject)=>{
        const {sender, receiver, msg} = payload
        // console.log(payload.receiver)
        connection.query(`insert into chat (sender, receiver, message) value (${sender}, ${receiver},"${msg}")`, (err, result)=>{
            if (err) {
                reject(err);
            } else {
            // console.log(result)
                resolve(result);
            }
        })
    }),
    getMessage : (payload) => new Promise((resolve, reject)=>{
        const {sender, receiver} = payload
        console.log(payload.receiver)
        connection.query(
            `SELECT * FROM chat WHERE (sender =${sender} AND receiver = ${receiver}) OR (sender=${receiver} AND receiver=${sender})`,
            (err, result) =>{
                if (err) {
                    // console.log(err)
                    reject(err);
                } else {
                // console.log(result)
                    resolve(result);
                }
            })
    }),
    getSenderReceiver : (id) => new Promise((resolve, reject)=>{
        // console.log(id)
        connection.query(
            `SELECT * FROM chat where sender = '${id}' OR receiver = '${id}'`, (err,result)=>{
                if (err) {
                    // console.log(err)
                    reject(err);
                } else {
                    // console.log(result)
                    resolve(result);
                }
            }
        )
    })
}
module.exports = socketModel