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
            `SELECT c.id, c.sender, sender.displayName as senderName, sender.profilePicture as senderProfilePic, 
            c.receiver,receiver.displayName, receiver.profilePicture, c.message, 
            c.createdAt FROM chat as c 
            left join users as sender on c.sender = sender.id 
            left join users as receiver on c.receiver = receiver.id  WHERE (sender =${sender} AND receiver = ${receiver}) OR (sender=${receiver} AND receiver=${sender})`,
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
    destroyMessage : (id) => new Promise((resolve, reject)=>{
        connection.query(`DELETE FROM chat where id = ${id}`, (err, result)=>{
            if (err) {
                // console.log(err)
                reject(err);
            } else {
            // console.log(result)
                resolve(result);
            }
        })
    }),
    getContact : (id) => new Promise((resolve, reject)=>{
        // console.log(id)
        connection.query(
            `SELECT c.id, c.sender, sender.displayName, sender.profilePicture, 
            c.receiver,receiver.displayName, receiver.profilePicture, c.message, 
            c.createdAt FROM chat as c 
            left join users as sender on c.sender = sender.id 
            left join users as receiver on c.receiver = receiver.id 
            where c.sender = ${id} group by c.receiver ORDER BY c.createdAt DESC`, (err,result)=>{
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