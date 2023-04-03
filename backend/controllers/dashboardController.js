const Serial = require("../models/SerialModel");
const User = require("../models/UserModel");

// @desc Get ALL count for all the credit
// @route GET /serials/count?status=false
// @access Private
const getTotalRedeemedCount = async (req, res) => {
    try {
        const counts = await Serial.aggregate([
            {
                $match: {
                    serialStatus: req.query.status === "true" ? true : false,
                },
            },
            {
                $count: "count",
            },
        ]);
        res.json(counts);
    } catch (error) {
        return res.status(400).json({ message: "Something wrong" });
    }
};

// @desc Get ALL count for each credit respectively (10, 30, 50, 100)
// @route GET /serials/totalGenerated
// @access Private
const getTotalGeneratedCount = async (req, res) => {
    try {
        const counts = await Serial.aggregate([
            {
                $group: {
                    _id: "$givenCredit",
                    count: { $sum: 1 },
                },
            },
        ]);
        res.json(counts);
    } catch (error) {
        return res.status(400).json({ message: "Something wrong" });
    }
};

// @desc Get count FOR REDEEMED SERIAL ONLY (10, 30, 50, 100)
// @route GET /serials/totalGenerated
// @access Private
const getRedeemedSerialCount = async (req, res) => {
    try {
        const counts = await Serial.aggregate([
            {
                $match: {
                    serialStatus: false,
                },
            },
            {
                $group: {
                    _id: "$givenCredit",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);
        res.json(counts);
    } catch (error) {
        return res.status(400).json({ message: "Something wrong" });
    }
};


// @desc get the total RM of all the redeemed serial number
// @route
// @access Private
const calculateTotalAmountRedeemed = async (req, res) => {
    try {
        const total = await Serial.aggregate([
            {
                $match: {
                    serialStatus: false,
                },
            },
            {
                $group: {
                    _id: "givenCredit",
                    sum: {
                        $sum: "$givenCredit",
                    },
                },
            },
        ]);
        res.json(total);
    } catch (error) {
        return res.status(400).json({ message: "Something wrong" });
    }
};

module.exports = {
    getTotalRedeemedCount,
    getTotalGeneratedCount,
    getRedeemedSerialCount,
    calculateTotalAmountRedeemed,
};
