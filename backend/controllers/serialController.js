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
        // const user = await User.findById(serial.userID).lean().exec()
        return { ...serial }
        // return { ...serial, username: user.username }
    }))

    res.json(serialsWithUser)
}

// @desc Generate Serial(s)
// @route POST /serials
// @access Private
const generateSerials = async (req, res) => {
    try {
        const { givenCredit, amountToGenerate, remarkName } = req.body;

        if (!givenCredit || !amountToGenerate || !remarkName) {
            return res.status(400).json({ message: "All fields must be provided" });
        }

        const serialNo = generateSerialNumber();
        const serial = new Serial({
            givenCredit,
            remarkName,
            serialNo,
            redemptionAcc: "",
            serialStatus: true,
        });

        await serial.save(); // save the document to MongoDB

        return res.status(200).json({ message: "Serials generated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


// @desc Get Serial(s) Details
// @route Get /serials/details
// @access Public
const getSerialDetails = async (req, res) => {
    try {
        const { redemptionAcc, serialNo } = req.body;

        if (!redemptionAcc || !serialNo) {
            return res.status(400).json({ message: "All fields must be provided" });
        }
        if (serialNo.length < 16) {
            return res.status(400).json({ message: "Length less than 16, Invalid Serial Number" })
        }
        const foundSerialNo = await Serial.findOne({ serialNo: parseInt(serialNo) }, { _id: 0, serialStatus: 1, givenCredit: 1, serialNo: 1 })
        if (!foundSerialNo) {
            return res.status(400).json({ message: "Serial Number Invalid, Check your input" })
        }
        if (foundSerialNo.serialStatus !== true) {
            return res.status(400).json({ message: "Invalid Serial Number, This Serial Number Probably been used" })
        }
        return res.json(foundSerialNo)
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// @desc Redeem Serial(s)
// @route Patch /serials
// @access Public
const redeemSerials = async (req, res) => {
    try {
        const { redemptionAcc, serialNo } = req.body;

        if (!redemptionAcc || !serialNo) {
            return res.status(400).json({ message: "All fields must be provided in order to redeem" });
        }

        const foundSerialNo = await Serial.findOne({ serialNo: parseInt(serialNo) }, { serialStatus: 1, givenCredit: 1, serialNo: 1 })

        if (foundSerialNo.serialStatus !== true) {
            return res.status(400).json({ message: "Already been redeemed" })
        }
        if (!foundSerialNo) {
            return res.status(400).json({ message: "Serial Number Invalid, Check your input" })
        } else {
            // set the serialStatus to false to indicate that the serial has been redeemed
            foundSerialNo.serialStatus = false;
            // save the redemptionAcc in the foundSerialNo object
            foundSerialNo.redemptionAcc = redemptionAcc;
            // save the updated document
            await foundSerialNo.save();

            return res.status(200).json({ message: `Successfully redeem, your wallet will be topup RM${foundSerialNo.givenCredit}` });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// FUNCTION
function generateSerialNumber() {
    let serial = '';
    const chars = '1234567890';

    for (let i = 0; i < 16; i++) {
        serial += chars[Math.floor(Math.random() * chars.length)];
    }

    return serial;
}
module.exports = {
    getAllSerials,
    generateSerials,
    getSerialDetails,
    redeemSerials,
}