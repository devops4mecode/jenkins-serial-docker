const User = require('../models/UserModel')
const Serial = require('../models/SerialModel')
const bcrypt = require('bcrypt')

// @desc Update a user
// @route PATCH /users
// @access Private
const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// @desc GET All Users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
}


// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => { }


const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body

        // return res.json({ currentPassword, newPassword, confirmPassword })
        // res.json(req.user)
        
        if (!currentPassword || !newPassword || !confirmPassword) return res.status(400).json({ message: "All fields are required" })

        if (newPassword != confirmPassword) return res.status(400).json({ message: "Check Your Input" })

        // Post with accessToken, and in "req" will have "req.user" || refer verifyJWT.js
        const { _id, password } = await User.findOne({ _id: req.user }).exec()

        const match = await bcrypt.compare(currentPassword, password)

        if (!match) return res.status(400).json({ message: "Current Password Not Match" })

        const newHash = await bcrypt.hash(newPassword, 10)

        const updatedPassword = await User.findOneAndUpdate({ _id }, { password: newHash })

        return res.status(200).json({ message: "Password Updated Successfully" })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getUser,
    getAllUsers,
    updateUser,
    changePassword
}