const Report = require("../models/ReportModel")
const Chart = require("../models/ChartModel");
const { convertYearStart, convertYearEnd, convertDayStart, convertDayEnd } = require("../utils/timezone");

const getChartData = async (req, res) => {
    try {
        const { year } = req.query

        const match_query = { $gte: convertYearStart(year), $lte: convertYearEnd(year) }

        const [totalGeneratedPerYear, totalRedeemedPerYear, targetYearChart] = await Promise.all([
            // totalGenerated
            Chart.aggregate([
                { $match: { "createdAt": match_query } },
                {
                    $group: {
                        _id: null,
                        totalAmountGenerated: { $sum: "$amountGenerated" }
                    }
                }
            ]),
            // totalRedeemed
            Chart.aggregate([
                { $match: { "createdAt": match_query } },
                {
                    $group: {
                        _id: null,
                        totalAmountRedeemed: { $sum: "$amountRedeemed" }
                    }
                }
            ]),
            // targetYearChart
            Chart.aggregate([
                { $match: { "year": parseInt(year) } },
                {
                    $group: {
                        _id: "$month",
                        totalAmountRedeemed: { $sum: "$amountRedeemed" },
                        totalAmountGenerated: { $sum: "$amountGenerated" }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
        ])

        // Response Data
        const returnData = {
            totalGenerated: totalGeneratedPerYear[0]?.totalAmountGenerated || 0,
            totalRedeemed: totalRedeemedPerYear[0]?.totalAmountRedeemed || 0,
            targetYearChart: targetYearChart || []
        }

        return res.json(returnData)

    } catch (error) {
        return res.status(404).json({ error: error.message })
    }
}

const getSummaryData = async (req, res) => {
    try {
        let { startDate, endDate } = req.query

        if (!startDate) startDate = '1970-01-01'

        const match_query = { createdAt: { $gte: convertDayStart(startDate), $lte: convertDayEnd(endDate) } }

        // NEEDED STUFF
        // Total Count Redeemed - redeemedCountPerDay
        // Total Amount Redeemed - totalAmountRedeemed
        // Total Generated Count - amountGeneratedPerDay
        // Total Redeemed Count - amountRedeemedPerDay
        // Top Ten Redeemed - topTenRedeemPerDay
        // Most Redeemed (Percentage) - Count in here

        const [
            amountGeneratedPerDay,
            amountRedeemedPerDay,
            topTenRedeemPerDay,
            redeemedCountPerDay,
            totalAmountRedeemed,
        ] = await Promise.all([
            // amountGeneratedPerDay
            Report.aggregate([
                { $match: match_query },
                { $unwind: "$amountGeneratedPerDay" },
                { $group: { _id: { amount: "$amountGeneratedPerDay.amount" }, count: { $sum: "$amountGeneratedPerDay.count" } } },
            ]),
            // amountRedeemedPerDay,
            Report.aggregate([
                { $match: match_query },
                { $unwind: "$amountRedeemedPerDay" },
                { $group: { _id: { amount: "$amountRedeemedPerDay.amount" }, count: { $sum: "$amountRedeemedPerDay.count" } } },
            ]),
            // topTenRedeemPerDay,
            Report.aggregate([
                { $match: match_query },
                { $unwind: "$topTenRedeemPerDay" },
                {
                    $group: {
                        _id: "$topTenRedeemPerDay.name",
                        count: { $sum: "$topTenRedeemPerDay.count" },
                        totalCredit: { $sum: "$topTenRedeemPerDay.totalCredit" }
                    }
                },
                { $sort: { totalCredit: -1 } },
                { $limit: 10 },
                {
                    $group: {
                        _id: null,
                        topTenRedeemPerDay: {
                            $push: {
                                name: "$_id",
                                count: "$count",
                                totalCredit: "$totalCredit"
                            }
                        }
                    }
                },
            ]),
            // redeemedCountPerDay
            Report.aggregate([
                { $match: match_query },
                { $group: { _id: null, redeemedCountPerDay: { $sum: "$redeemedCountPerDay" }, } }
            ]),
            // totalAmountRedeemed
            Report.aggregate([
                { $match: match_query },
                { $group: { _id: null, totalAmountRedeemed: { $sum: "$totalAmountRedeemed" }, } }
            ]),
        ])

        // Here count the mostRedeemed percentage, no need save in report
        const returnData = {
            // overallRedeemedCount: overallRedeemedCount[0]?.overallRedeemedCount || 0,
            overallGeneratedCount: amountGeneratedPerDay
                .map(({ _id, count }) => ({ amount: _id.amount, count }))
                .sort((a, b) => a.amount - b.amount) || [],
            redeemedCount: amountRedeemedPerDay
                .map(({ _id, count }) => ({ amount: _id.amount, count }))
                .sort((a, b) => a.amount - b.amount) || [],
            topTen: topTenRedeemPerDay[0]?.topTenRedeemPerDay.map(({ name, count, totalCredit }) => ({
                name,
                count,
                totalCredit,
            })).sort((a, b) => b.totalCredit - a.totalCredit) || [],
            totalAmountRedeemed: totalAmountRedeemed[0]?.totalAmountRedeemed || 0,
            mostRedeemed: amountRedeemedPerDay
                .map(({ _id, count }) => ({
                    amount: _id.amount,
                    percentage:
                        redeemedCountPerDay[0]?.redeemedCountPerDay !== 0
                            ? (count / redeemedCountPerDay[0]?.redeemedCountPerDay) * 100
                            : 0,
                }))
                .sort((a, b) => a.amount - b.amount) || [],
            overallRedeemedCount: redeemedCountPerDay[0]?.redeemedCountPerDay || 0,
        };
        return res.status(200).json(returnData);
    } catch (error) {
        return res.status(404).json({ error: error.message })
    }
}

module.exports = {
    getChartData,
    getSummaryData
};