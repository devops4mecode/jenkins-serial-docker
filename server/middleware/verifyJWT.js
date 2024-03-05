const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ') || !authHeader) {
        return res.status(401).json({ message: 'Unauthorized, Authorization token required' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const { _id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        req.user = await User.findOne({ _id }).select('_id')
        next()

        // const { _id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
        //     (error, decoded) => {
        //         if (error) {
        //             return res.status(403).json({ message: 'Forbidden' })
        //         }
        //         req.user = decoded.UserInfo.username
        //         req.roles = decoded.UserInfo.roles
        //         next()
        //     }
        // )
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: "Request is not authorized" })
    }
}

module.exports = verifyJWT 


