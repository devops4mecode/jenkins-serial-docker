const Serial = require("../models/SerialModel");

// @desc Get Serial(s) Details
// @route Get /serials/details?redemptionAcc=${redemptionAcc}&serialNo=${serialNo}
// @access Public
const getSerialDetails = async (req, res) => {
    try {
        const { redemptionAcc, serialNo } = req.query;

        if (!redemptionAcc || !serialNo) {
            return res
                .status(400)
                .json({ message: "All fields must be provided" });
        }
        if (serialNo.length < 16 || serialNo.length > 16) {
            return res.status(400).json({ message: "Invalid Serial Number" })
        }
        const foundSerialNo = await Serial.findOne(
            { serialNo },
            { _id: 0, serialStatus: 1, givenCredit: 1, serialNo: 1 }
        );
        if (!foundSerialNo) {
            return res.status(400).json({ message: "Invalid Serial Number, Check your input" })
        }
        if (foundSerialNo.serialStatus !== true) {
            return res.status(400).json({
                message:
                    "Invalid code, check your input or this code already been redeemed",
            });
        }
        return res.json(foundSerialNo);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// @desc Redeem Serial(s)
// @route Patch /serials/redeem?redemptionAcc=${redemptionAcc}&serialNo=${serialNo}
// @access Public
const redeemSerials = async (req, res) => {
    try {
        const { redemptionAcc, serialNo } = req.query;

        if (!redemptionAcc || !serialNo) {
            return res.status(400).json({
                message: "All fields must be provided in order to redeem",
            });
        }

        const foundSerialNo = await Serial.findOne(
            { serialNo },
            { serialStatus: 1, givenCredit: 1, serialNo: 1 }
        );

        if (foundSerialNo.serialStatus !== true) {
            return res.status(400).json({ message: "Already been redeemed" });
        }
        if (!foundSerialNo) {
            return res
                .status(400)
                .json({ message: "Serial Number Invalid, Check your input" });
        } else {
            // set the serialStatus to false to indicate that the serial has been redeemed
            foundSerialNo.serialStatus = false;
            // save the redemptionAcc in the foundSerialNo object
            foundSerialNo.redemptionAcc = redemptionAcc;
            // save the updated document
            await foundSerialNo.save();

            return res.status(200).json({
                message: `Successfully redeem, your wallet will be topup RM${foundSerialNo.givenCredit.toFixed(
                    2
                )}`,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getSerialDetails,
    redeemSerials
}