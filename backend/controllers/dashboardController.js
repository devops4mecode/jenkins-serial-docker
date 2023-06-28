const Report = require("../models/ReportModel")
const Chart = require("../models/ChartModel");
const { convertYearStart, convertYearEnd, convertDayStart, convertDayEnd } = require("../utils/timezone");

const getChartData = async (req, res) => {
    try {
        const { year } = req.query

        const yearStart = convertYearStart(year)
        const yearEnd = convertYearEnd(year)

        const foundChart = await Chart.findOne(
            { createdAt: { $gte: yearStart, $lte: yearEnd } },
            { _id: 0 } // Exclude _id field
        )
        return res.status(200).json(foundChart)
    } catch (error) {
        return res.status(404).json({ error: error.message })
    }
}

const getSummaryData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query

        const dateStart = convertDayStart(startDate)
        const dateEnd = convertDayEnd(endDate)

        const match_query = { createdAt: { $gte: dateStart, $lte: dateEnd } }

        const [
            overallRedeemedCount,
            redeemedCount,
            totalAmountRedeemed,
            overallGeneratedCount,
            topTen,
        ] = await Promise.all([
            // overallRedeemedCount
            Report.aggregate([
                { $match: match_query },
                {
                    $group: {
                        _id: null,
                        overallRedeemedCount: { $sum: "$overallRedeemedCount" },
                    }
                }
            ]),
            // redeemedCount,
            Report.aggregate([
                { $match: match_query },
                { $unwind: "$redeemedCount" },
                {
                    $group: {
                        _id: { amount: "$redeemedCount.amount" },
                        count: { $sum: "$redeemedCount.count" }
                    }
                },
            ]),
            // totalAmountRedeemed
            Report.aggregate([
                { $match: match_query },
                {
                    $group: {
                        _id: null,
                        totalAmountRedeemed: { $sum: "$totalAmountRedeemed" },
                    }
                }
            ]),
            // overallGeneratedCount,
            Report.aggregate([
                { $match: match_query },
                { $unwind: "$overallGeneratedCount" },
                {
                    $group: {
                        _id: { amount: "$overallGeneratedCount.amount" },
                        count: { $sum: "$overallGeneratedCount.count" }
                    }
                },
            ]),
            // topTen,
            Report.aggregate([
                { $match: match_query },
                { $unwind: "$topTen" },
                {
                    $group: {
                        _id: "$topTen.name",
                        count: { $sum: "$topTen.count" },
                        totalCredit: { $sum: "$topTen.totalCredit" }
                    }
                },
                { $sort: { totalCredit: -1 } },
                { $limit: 10 },
                {
                    $group: {
                        _id: null,
                        topTen: {
                            $push: {
                                name: "$_id",
                                count: "$count",
                                totalCredit: "$totalCredit"
                            }
                        }
                    }
                },
            ]),
        ])

        const reportData = {
            overallRedeemedCount: overallRedeemedCount[0]?.overallRedeemedCount || 0,
            redeemedCount: redeemedCount
                .map(({ _id, count }) => ({ amount: _id.amount, count }))
                .sort((a, b) => a.amount - b.amount) || [],
            overallGeneratedCount: overallGeneratedCount
                .map(({ _id, count }) => ({ amount: _id.amount, count }))
                .sort((a, b) => a.amount - b.amount) || [],
            mostRedeemed: redeemedCount
                .map(({ _id, count }) => ({
                    amount: _id.amount,
                    percentage:
                        overallRedeemedCount[0]?.overallRedeemedCount !== 0
                            ? (count / overallRedeemedCount[0]?.overallRedeemedCount) * 100
                            : 0,
                }))
                .sort((a, b) => a.amount - b.amount) || [],
            topTen: topTen[0]?.topTen.map(({ name, count, totalCredit }) => ({
                name,
                count,
                totalCredit,
            })).sort((a, b) => b.totalCredit - a.totalCredit) || [],
            totalAmountRedeemed: totalAmountRedeemed[0]?.totalAmountRedeemed || 0,
        };
        return res.status(200).json(reportData);
    } catch (error) {
        return res.status(404).json({ error: error.message })
    }
}

module.exports = {
    getChartData,
    getSummaryData
};