const User = require('../models/UserModel')
const Serial = require('../models/SerialModel')
const bcrypt = require('bcrypt')

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

module.exports = {
    getAllUsers,
    updateUser,
}