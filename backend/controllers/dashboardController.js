const Serial = require("../models/SerialModel");
const User = require("../models/UserModel");
const moment = require("moment");

// const { startDate, endDate } = req.body
// TESTING
const getSerialsData = async (req, res) => {
    try {
        const startDate = moment().startOf('year').toDate();
        const endDate = moment().endOf('day').toDate();

        const [
            overallRedeemedCount,
            redeemedCounts,
            overallGeneratedCount,
            totalAmountRedeemed,
            topRedeemUser
        ] = await Promise.all([
            // overallRedeemedCount
            Serial.aggregate([
                {
                    $match: {
                        serialStatus: false,
                        updatedAt: { $gte: startDate, $lte: endDate }
                    }
                },
                { $count: "count" }
            ]),
            // redeemedCounts
            Serial.aggregate([
                {
                    $match: {
                        serialStatus: false,
                        updatedAt: { $gte: startDate, $lt: endDate }
                    }
                },
                { $group: { _id: "$givenCredit", count: { $sum: 1 } } },
            ]),
            // overallGeneratedCount
            Serial.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate, $lt: endDate }
                    }
                },
                { $group: { _id: "$givenCredit", count: { $sum: 1 } } },
            ]),
            // totalAmountRedeemed
            Serial.aggregate([
                {
                    $match: {
                        serialStatus: false,
                        updatedAt: { $gte: startDate, $lt: endDate }
                    }
                },
                { $group: { _id: "givenCredit", sum: { $sum: "$givenCredit" } } },
            ]),
            // topRedeemUser
            Serial.aggregate([
                {
                    $match: {
                        serialStatus: false,
                        updatedAt: { $gte: startDate, $lt: endDate }
                    }
                },
                {
                    $group: {
                        _id: "$redemptionAcc",
                        count: { $sum: 1 },
                        totalGivenCredit: { $sum: "$givenCredit" } 
                    }
                },
                {
                    $sort: { totalGivenCredit: -1 }
                },
                { $limit: 10 }
            ]),
        ]);

        const mostRedeemed = [10, 30, 50, 100];

        const percentages = await Serial.aggregate([
            {
                $match: {
                    serialStatus: false,
                    updatedAt: { $gte: startDate, $lt: endDate },
                    givenCredit: { $in: mostRedeemed }
                }
            },
            {
                $group: {
                    _id: "$givenCredit",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 1,
                    percentage: { $multiply: [{ $divide: ["$count", overallRedeemedCount[0].count] }, 100] }
                }
            }
        ]);

        const percentagesMap = new Map(percentages.map(({ _id, percentage }) => [_id, percentage]));

        const result = {
            overallRedeemedCount: overallRedeemedCount[0].count,
            redeemedCount: redeemedCounts,
            overallGeneratedCount,
            totalAmountRedeemed: totalAmountRedeemed[0].sum,
            mostRedeemed: mostRedeemed.map(_id => ({ _id, percentage: percentagesMap.get(_id) || 0 })),
            topRedeemUser
        };

        res.json(result);

    } catch (error) {
        return res.status(400).json({ message: "Something wrong" });
    }
};

module.exports = {
    getSerialsData
};