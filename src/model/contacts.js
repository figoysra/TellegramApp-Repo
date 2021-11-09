const connection = require("../config/db")

const contacts = {
    addContact : (id, body) => new Promise((resolve, reject)=>{
        const {contactTwo} = body
        connection.query(`insert into contacts (contactOne, contactTwo) value (${id}, ${contactTwo}), ( ${contactTwo},  ${id})`, (err, result)=>{
            if (err) {
                reject(err);
            } else {
            // console.log(result)
                resolve(result);
            }
        })
    }),
    getContact: (payload) => new Promise ((resolve, reject)=>{
        const { id, search }= payload
        console.log(search)
        connection.query(`
            select contacts.id, contacts.contactOne, contacts.contactTwo, cTwo.displayName, cTwo.profilePicture, cTwo.isOnline
            from contacts left join users as cTwo on contacts.contactTwo = cTwo.id 
            where contactOne = ${id} and cTwo.displayName like '%${search}%'`, 
            (err,result)=>{
            if (err) {
                reject(err);
            } else {
            // console.log(result)
                resolve(result);
            }
        });
    }),
    destroy : (id) =>  new Promise ((resolve, reject)=>{
        connection.query(`
            DELETE FROM users WHERE id=${id}`, 
            (err,result)=>{
            if (err) {
                reject(err);
            } else {
            // console.log(result)
                resolve(result);
            }
        });
    }), 
}
module.exports = contacts;