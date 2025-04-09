const { JWT_SECRET } = require('./config')
const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(403).json({massage: "Authorization header is missing"})
    }

    const token = authHeader.split(' ')[1]

    try {
        const decode = jwt.verify(token, JWT_SECRET)

        req.userId = decode.userId
        next();
    } catch (error) {
        return res.status(403).json({massage: "invalid Token"})
    }
}

module.exports = {
    authMiddleware
}