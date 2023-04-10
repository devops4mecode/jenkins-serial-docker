const Serial = require("../models/SerialModel");
const User = require("../models/UserModel");


const getSerialsData = async (req, res) => {
    try {
        const totalRedeemedCount = await Serial.aggregate([
            { $match: { serialStatus: req.query.status === "true" ? true : false } },
            { $count: "count" },
        ]);

        const totalGeneratedCount = await Serial.aggregate([
            { $group: { _id: "$givenCredit", count: { $sum: 1 } } },
        ]);

        const redeemedSerialCount = await Serial.aggregate([
            { $match: { serialStatus: false } },
            { $group: { _id: "$givenCredit", count: { $sum: 1 } } },
        ]);

        const totalAmountRedeemed = await Serial.aggregate([
            { $match: { serialStatus: false } },
            { $group: { _id: "givenCredit", sum: { $sum: "$givenCredit" } } },
        ]);

        const mostRedeemed = [{ _id: 10 }, { _id: 30 }, { _id: 50 }, { _id: 100 },]

        const percentages = mostRedeemed.map(({ _id }) => {
            const count = redeemedSerialCount.flat().find((obj) => obj._id === _id)?.count || 0;
            const total = totalRedeemedCount[0]?.count || 0;
            return {
                _id,
                percentage: total > 0 ? (count / total) * 100 : 0,
            };
        });

        res.json({
            totalRedeemedCount,
            totalGeneratedCount,
            redeemedSerialCount,
            totalAmountRedeemed,
            mostRedeemed: percentages,
        });
    } catch (error) {
        return res.status(400).json({ message: "Something wrong" });
    }
};

module.exports = {
    getSerialsData
};