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

module.exports = {
    getUser,
    getAllUsers,
    updateUser,
}