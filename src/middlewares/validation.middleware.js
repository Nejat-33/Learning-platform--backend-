

export const validation = function (schema){
    return function(req, res, next){
        const validationdata = {
            body: req.body,
            param: req.param,
            query: req.query
        }
        const {error, value} = schema.validate(validationdata, {
            abortEarly: false,
            stillUnkown: true
        })

        if(error){
            const error = error.details.map((detail)=> detail.message)
            return res.status(400).json({
                sucess: false,
                message: 'validation error',
                error
            })
        }
        req.body = value.body
        req.param = value.param
        req.query = value.query


        next()
    }
}