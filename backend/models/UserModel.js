const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

const User = mongoose.model('User', UserSchema)

const createDefaultSuperadmin = async () => {
    try {
        const adminUsername = 'superadmin'
        const adminPassword = 'password'

        const existingAdmin = await User.findOne({ username: adminUsername })
        if (existingAdmin) {
            console.log('Default superadmin account already exists')
            return
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10)
        const newAdmin = new User({ username: adminUsername, password: hashedPassword })
        await newAdmin.save()

        console.log('Default superadmin account created')
    } catch (error) {
        console.error(error)
    }
}

createDefaultSuperadmin()

module.exports = User