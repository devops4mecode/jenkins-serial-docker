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
        return res.status(400).json({ error: error.message });
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

        // Find using 2 conditions
        const foundSerialNo = await Serial.findOne({ serialNo, serialStatus: true });

        if (!foundSerialNo) return res.status(400).json({ message: `Invalid Serial Number, Check your input or already been redeemed` })

        // Quick Save
        foundSerialNo.serialStatus = false
        await foundSerialNo.save()

        res.status(200).json({ message: `Successfully redeem, your wallet will be topup RM${foundSerialNo.givenCredit.toFixed(2)}`, });

        foundSerialNo.redemptionAcc = redemptionAcc
        await foundSerialNo.save()

        return

    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};

const sourceAbbreviations = { 'l7': 'L7', 'tng': 'TNG', 'spay': 'SPAY' };

const generateSerialsByPlayer = async (req, res) => {
    try {
        let { givenCredit, amountToGenerate, remarkName, walletBalance, source } = req.query;

        if (!givenCredit || !amountToGenerate || !remarkName || !walletBalance) {
            return res.status(400).json({ message: "All fields must be provided" });
        }

        let serials = [];

        if (walletBalance < (givenCredit * amountToGenerate)) {
            return res.status(400).json("Insufficient balance")
        }

        // Generate additional serials
        for (let i = 0; i < amountToGenerate; i++) {
            serials.push(generateSerialNumber());
        }

        // Check for duplicates and replace them
        const anyDuplicate = await Serial.find({ serialNo: { $in: serials } });
        anyDuplicate.forEach(duplicate => {
            let newSerial = generateSerialNumber();
            while (serials.includes(newSerial) || anyDuplicate.map(d => d.serialNo).includes(newSerial)) {
                newSerial = generateSerialNumber();
            }
            serials.splice(serials.indexOf(duplicate.serialNo), 1, newSerial);
        });

        // Return only the requested number of unique serials
        serials = serials.slice(0, amountToGenerate);

        let remarkSource = sourceAbbreviations[source]

        let newRemarkName = `${remarkSource}.${remarkName}`

        const serialDocs = [];
        for (let j = 0; j < serials.length; j++) {
            const serialDoc = new Serial({
                givenCredit,
                remarkName: newRemarkName,
                serialNo: serials[j],
                redemptionAcc: "",
                serialStatus: true,
            });
            await serialDoc.save();
            serialDocs.push(serialDoc);
        }
        return res.json({ serialDocs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

function generateSerialNumber() {
    let serial = "";
    const chars = "1234567890";

    for (let i = 0; i < 16; i++) {
        serial += chars[Math.floor(Math.random() * chars.length)];
    }
    return serial;
}

module.exports = {
    generateSerialsByPlayer,
    getSerialDetails,
    redeemSerials,
}