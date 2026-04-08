
export default function rolevalidate (...allaowedroles)  {
    return function(req, res, next) {
        if(!allaowedroles.includes(req.user.role)){
        return res.status(403).json({
            message: 'forbidden: insufficient permission'
        })
    }
    next()
}
}