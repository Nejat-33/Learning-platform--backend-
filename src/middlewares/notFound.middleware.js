 export const notFoundmiddleware = (req, res, next)=>{
    res.status(404).json({
        sucess: false,
        message: 'route not found'
    })
 }