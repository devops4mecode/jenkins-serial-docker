const Serial = require("../models/SerialModel");
const Receipt = require("../models/ReceiptModel");

// @desc Get all serials
// @route GET /serials/all
// @access Private
const getAllSerials = async (req, res) => {
    // Get all serials from MongoDB
    const serials = await Serial.find().lean();

    // If no serials
    if (!serials?.length) {
        return res.status(400).json({ message: "No serials found" });
    }
    res.json(serials);
};

// @desc Get all serials
// @route GET /serials/detail?serialNo=${serialNo}
// @access Private
const getDetailsBySerialNo = async (req, res) => {
    try {
        const { serialNo } = req.query;

        const serial = await Serial.findOne({ serialNo });
        res.json(serial);
    } catch (error) {
         
        return res.status(400).json({ message: "Something wrong" });
    }
};

// @desc Get all serials
// @route GET /serials/status?serialStatus=${serialStatus}
// @access Private
const getSerialsByStatus = async (req, res) => {
    try {
        const { serialStatus } = req.query;
        const serials = await Serial.find({ serialStatus });
        res.json(serials);
    } catch (error) {
        return res.status(400).json({ message: "Something wrong" });
    }
};

// @desc Generate Serial(s)
// @route POST /serials
// @access Private
const generateSerials = async (req, res) => {
    try {
        const { givenCredit, amountToGenerate, remarkName } = req.body;

        if (!givenCredit || !amountToGenerate || !remarkName) {
            return res.status(400).json({ message: "All fields must be provided" });
        }

        let serials = [];

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

        const serialDocs = [];
        for (let j = 0; j < serials.length; j++) {
            const serialDoc = new Serial({
                givenCredit,
                remarkName,
                serialNo: serials[j],
                redemptionAcc: "",
                serialStatus: true,
            });
            await serialDoc.save();
            serialDocs.push(serialDoc);
        }

        // Create a new receipt and push the serial IDs to the receipt
        const receipt = new Receipt({
            serialID: serialDocs.map((doc) => doc._id),
        });
        await receipt.save();

        return res.status(200).json({ serialDocs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// @desc Get all serials
// @route GET /serials/status?serialStatus=${serialStatus}
// @access Private
// const delSerialsByID = async (req, res) => {
//     try {
//         const { serialID } = req.body

//         for (let i = 0; i < serialID.length; i++) {
//             const removedDocs = await Serial.findOneAndRemove({ _id: serialID[i] })

//             // Search for Receipts containing the serialID
//             const receipts = await Receipt.find({ serialID: serialID[i] });

//             // Update the Receipts by removing the serialID from the array
//             for (const receipt of receipts) {
//                 receipt.serialID.pull(serialID[i]);
//                 await receipt.save();

//                 // Check if all serialID values have been removed from the Receipt
//                 if (receipt.serialID.length === 0) {
//                     await Receipt.findByIdAndRemove(receipt._id);
//                 }
//             }
//         }
//         return res.json('ok')
//     } catch (error) {
//         return res.status(400).json({ message: "Something wrong" });
//     }
// };
const delSerialsByID = async (req, res) => {
    try {
        const { serialID } = req.body;

        // Delete Serial documents using bulk operation
        await Serial.deleteMany({ _id: { $in: serialID } });

        // Update Receipts in bulk
        await Receipt.updateMany(
            { serialID: { $in: serialID } },
            { $pullAll: { serialID } },
            { multi: true }
        );

        // Remove Receipts with empty serialID array
        await Receipt.deleteMany({ serialID: { $size: 0 } });

        return res.json('ok');
    } catch (error) {
        return res.status(400).json({ message: 'Something wrong' });
    }
};



// FUNCTION
function generateSerialNumber() {
    let serial = "";
    const chars = "1234567890";

    for (let i = 0; i < 16; i++) {
        serial += chars[Math.floor(Math.random() * chars.length)];
    }
    return serial;
}

module.exports = {
    getAllSerials,
    getDetailsBySerialNo,
    getSerialsByStatus,
    generateSerials,
    delSerialsByID
};
