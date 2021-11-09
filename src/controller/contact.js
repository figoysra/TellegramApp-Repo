const contactmodels = require('../model/contacts')
const {success, failed} = require('../helpers/response')

const contacts = {
    getList: (req, res) =>{
        try {
            const id = req.userId;
            const { query } = req;
            const search = query.search === undefined ? "" : query.search;
            contactmodels
                .getContact(search, id)
                .then((response) => {
                    // console.log(response)
                    success(res.status(200), response, "get all contacts success");
                })
                .catch((err) => {
                    console.log(err)
                    failed(res.status(401), 401, err);
                });
        } catch (error) {
            console.log(error)
            failed(res.status(401), 401, error);
        }
    },
    insert: (req, res) =>{
        try {
            const id = req.userId;
            const { body } = req;
            // const {}
            contactmodels
            .checkContact(body)
            .then((data)=>{
                // console.log(data)
                if(data.length <= 0){
                    contactmodels
                    .addContact(id, body)
                    .then((result)=>{
                        success(res, result, "insert contact success")
                    })
                    .catch((err)=>{
                        failed(res.status(401), 401, err);
                    })
                }else{
                    failed(res.status(401), 401, "You Already add the Contacts");
                }
            }).catch((err)=>{
                console.log(err)
                failed(res.status(404), 404, err)
            })
        } catch (error) {
            failed(res.status(401), 401, error);
        }
    }, 
    // destroy: (req, res) =>{
    //     try {
    //         const id = req.userId;
    //         usersModel.getdetails(id).then((result)=>{
    //             if(result.length <= 0){
    //                 failed(res.status(404), 404, "Your Request is not Found");
    //             }else{
    //                 usersModel
    //                     .destroy(id)
    //                     .then((data)=>{
    //                         if(result[0].profilePicture === "defaultImage.jpg"){
    //                             success(res.status(200), data, "delete data success")
    //                         }else{
    //                             fs.unlink(`./uploads/${result[0].profilePicture}`, (err) => {
    //                             if (err) {
    //                                 failed(res.status(401), 401, err);
    //                             } else {
    //                                 success(res, data, "delete data success");
    //                             }
    //                             });
    //                         }
    //                     }).catch((err)=>{
    //                         failed(res.status(404), 404, err)
    //                     })
            
    //             }
    //         })
    //     } catch (error) {
    //         failed(res.status(401), 401, err)
    //     }
    // },

}
module.exports = contacts