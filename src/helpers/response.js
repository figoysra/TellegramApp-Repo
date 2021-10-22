const response = {
    success: (res, result, msg) =>{
        const success = {
            status : "success",
            result,
            code: 200,
            message: msg
        }
        res.json(success)
    },
    successLogin : (res, result, token, msg) =>{
        const successLogin = {
            status : "success",
            result,
            code: 200,
            message: msg,
            token : token

        }
        res.json(successLogin)
    },
    failed : (res, code, err) => {
        if(code === 500){
            const failed = {
                status : "failed",
                data : null,
                errorCode : 500,
                error : err,
                message: 'There was an error on the server and the request could not be completed'
            }
            res.json(failed)
        }else if(code === 404){
            const failed = {
                status : "failed",
                data : null,
                errorCode : 404,
                error : err,
                message: 'Your Request not Found'
            }
            res.json(failed)
        }else if(code === 401){
            const failed = {
                status : "failed",
                data : null,
                errorCode : 401,
                error : err,
                message: 'Unauthorized'
            }
            res.json(failed)
        }
    }
}
module.exports = response