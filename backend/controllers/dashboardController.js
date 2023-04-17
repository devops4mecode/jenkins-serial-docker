const Serial = require("../models/SerialModel");
const User = require("../models/UserModel");
const moment = require("moment");

// TESTING
const getSerialsData = async (req, res) => {
    // const { startDate, endDate } = req.body
    try {
        // TEST 2023
        // const startDate = moment().startOf('year').toDate();
        // const endDate = moment().endOf('day').toDate();

        // 2022
        const startDate = moment().year(2022).startOf('year').toDate();
        const endDate = moment().year(2022).endOf('year').toDate();

        const [
            overallRedeemedCount,
            redeemedCounts,
            overallGeneratedCount,
            totalAmountRedeemed,
            topRedeemUser,
            totalRedeemedThroughYear,
            totalGeneratedThroughYear,
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
                        updatedAt: { $gte: startDate, $lte: endDate }
                    }
                },
                { $group: { _id: "$givenCredit", count: { $sum: 1 } } },
            ]),
            // overallGeneratedCount
            Serial.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                { $group: { _id: "$givenCredit", count: { $sum: 1 } } },
            ]),
            // totalAmountRedeemed
            Serial.aggregate([
                {
                    $match: {
                        serialStatus: false,
                        updatedAt: { $gte: startDate, $lte: endDate }
                    }
                },
                { $group: { _id: "givenCredit", sum: { $sum: "$givenCredit" } } },
            ]),
            // topRedeemUser
            Serial.aggregate([
                {
                    $match: {
                        serialStatus: false,
                        updatedAt: { $gte: startDate, $lte: endDate }
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
            // totalRedeemedThroughYear
            Serial.aggregate([
                {
                    $match: {
                        serialStatus: false,
                        updatedAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$updatedAt" },
                            month: { $month: "$updatedAt" },
                        },
                        givenCredit: { $sum: "$givenCredit" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        month: "$_id.month",
                        year: "$_id.year",
                        givenCredit: 1
                    }
                },
                {
                    $sort: {
                        year: 1,
                        month: 1
                    }
                }
            ]),
            // totalGeneratedThroughYear
            Serial.aggregate([
                {
                    $match: {
                        // serialStatus: true,
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        givenCredit: { $sum: "$givenCredit" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        month: "$_id.month",
                        year: "$_id.year",
                        givenCredit: 1
                    }
                },
                {
                    $sort: {
                        year: 1,
                        month: 1
                    }
                }
            ]),
        ]);

        const mostRedeemed = [10, 30, 50, 100];

        const percentages = await Serial.aggregate([
            {
                $match: {
                    serialStatus: false,
                    updatedAt: { $gte: startDate, $lte: endDate },
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
            topRedeemUser,
            totalRedeemedThroughYear,
            totalGeneratedThroughYear,
        };

        res.json(result);

    } catch (error) {
        return res.status(400).json({ message: "Something wrong" });
    }
};

module.exports = {
    getSerialsData
};