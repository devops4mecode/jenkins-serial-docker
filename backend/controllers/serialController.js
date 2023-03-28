const Serial = require('../models/SerialModel')
const User = require('../models/UserModel')

// @desc Get all serials 
// @route GET /serials
// @access Private
const getAllSerials = async (req, res) => {
    // Get all serials from MongoDB
    const serials = await Serial.find().lean()

    // If no serials 
    if (!serials?.length) {
        return res.status(400).json({ message: 'No serials found' })
    }

    // Add username to each serial before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const serialsWithUser = await Promise.all(serials.map(async (serial) => {
        const user = await User.findById(serial.userID).lean().exec()
        return { ...serial, username: user.username }
    }))

    res.json(serialsWithUser)
}

module.exports = {
    getAllSerials
}