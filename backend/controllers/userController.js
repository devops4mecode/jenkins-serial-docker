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

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body

        if (!currentPassword || newPassword || confirmPassword) return res.status(400).json({ message: "All fields are required" })

        const foundUser = await User.findOne({ username }).exec()

        if (!foundUser) return res.status(401).json({ message: "Unauthorized" })

        const match = await bcrypt.compare(currentPassword, foundUser.password)

        if (!match) return res.status(400).json({ message: "Current Password Not Match" })

        if (newPassword != confirmPassword) return res.status(400).json({ message: "Check Your Input" })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => { }

module.exports = {
    getUser,
    getAllUsers,
    updateUser,
    changePassword
}