const Serial = require('../models/SerialModel')
const User = require('../models/UserModel')

// @desc Get all serials 
// @route GET /serials/all
// @access Private
const getAllSerials = async (req, res) => {
    // Get all serials from MongoDB
    const serials = await Serial.find().lean()

    // If no serials 
    if (!serials?.length) {
        return res.status(400).json({ message: 'No serials found' })
    }
    res.json(serials)
}

// @desc Get all serials
// @route GET /serials/status?serialStatus=${serialStatus}
// @access Private
const getDetailsBySerialNo = async (req, res) => {
    try {
        const { serialNo } = req.query




        const serial = await Serial.findOne({ serialNo })
        res.json(serial)
    } catch (error) {
        return res.status(400).json({ message: "Something wrong" })
    }
}

// @desc Get all serials
// @route GET /serials/status?serialStatus=${serialStatus}
// @access Private
const getSerialsByStatus = async (req, res) => {
    try {
        const { serialStatus } = req.query
        const serials = await Serial.find({ serialStatus })
        res.json(serials)
    } catch (error) {
        return res.status(400).json({ message: "Something wrong" })
    }
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

        const serials = [];

        for (let i = 0; i < amountToGenerate; i++) {
            const serialNo = generateSerialNumber();
            const serial = new Serial({
                givenCredit,
                remarkName,
                serialNo,
                redemptionAcc: "",
                serialStatus: true,
            });

            const savedSerial = await serial.save(); // save the document to MongoDB

            serials.push(savedSerial);
        }

        return res.status(200).json({ serials });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// @desc Get Serial(s) Details
// @route Get /serials/details?redemptionAcc=${redemptionAcc}&serialNo=${serialNo}
// @access Public
const getSerialDetails = async (req, res) => {
    try {
        const { redemptionAcc, serialNo } = req.query;

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
            return res.status(400).json({ message: "Invalid code, check your input or this code already been redeemed" })
        }
        return res.json(foundSerialNo)
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// @desc Redeem Serial(s)
// @route Patch /serials/redeem?redemptionAcc=${redemptionAcc}&serialNo=${serialNo}
// @access Public
const redeemSerials = async (req, res) => {
    try {
        const { redemptionAcc, serialNo } = req.query;

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

            return res.status(200).json({ message: `Successfully redeem, your wallet will be topup RM${foundSerialNo.givenCredit.toFixed(2)}` });
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

    let firstDigitIsZero = true;
    while (firstDigitIsZero || serial.length !== 16) {
        serial = '';
        for (let i = 0; i < 15; i++) {
            serial += chars[Math.floor(Math.random() * chars.length)];
        }
        // Ensure the first digit is not '0'
        serial = Math.floor(Math.random() * 9) + 1 + serial;
        firstDigitIsZero = serial[0] === '0';
    }

    return serial;
}

module.exports = {
    getAllSerials,
    getDetailsBySerialNo,
    getSerialsByStatus,
    generateSerials,
    getSerialDetails,
    redeemSerials,
}