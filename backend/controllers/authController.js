const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) return res.status(400).json({ message: "All fields must be filled" })

        const foundUser = await User.findOne({ username }).exec()

        if (!foundUser) return res.status(401).json({ message: "Unauthorized" })

        const match = await bcrypt.compare(password, foundUser.password)

        if (!match) return res.status(401).json({ message: "Unauthorized" })

        const accessToken = jwt.sign(
            {
                _id: foundUser._id,
                username: foundUser.username
            },
            process.env.ACCESS_TOKEN_SECRET,
            // { expiresIn: "7d" }
        );

        // Send accessToken containing username and roles
        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


module.exports = {
    login,
}