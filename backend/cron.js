const CronJob = require('cron').CronJob
const moment = require('moment');

// Get From
const Serial = require('./models/SerialModel')
const Chart = require('./models/ChartModel');
// Save To
const Report = require('./models/ReportModel')

exports.generateChartData = () => {
    const dashChart = new CronJob('* * * * * *', async function () {
        const yearStart = moment().startOf('year').toDate()
        const yearEnd = moment().endOf('year').toDate()

        const [
            monthlyRedeemedThroughYear,
            monthlyGeneratedThroughYear,
        ] = await Promise.all([
            Serial.aggregate([
                { $match: { serialStatus: false, updatedAt: { $gte: yearStart, $lte: yearEnd } } },
                {
                    $group: {
                        _id: {
                            year: { $year: "$updatedAt" },
                            month: { $month: "$updatedAt" }
                        },
                        givenCredit: { $sum: "$givenCredit" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        givenCredit: 1,
                        month: "$_id.month",
                        year: "$_id.year",
                    }
                },
                { $sort: { year: 1, month: 1 } }
            ]),
            Serial.aggregate([
                { $match: { createdAt: { $gte: yearStart, $lte: yearEnd } } },
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
                        givenCredit: 1,
                        month: "$_id.month",
                        year: "$_id.year",
                    }
                },
                { $sort: { year: 1, month: 1 } }
            ]),
        ])

        const totalGenerated = monthlyGeneratedThroughYear.reduce((acc, curr) => acc + curr.givenCredit, 0);
        const totalRedeemed = monthlyRedeemedThroughYear.reduce((acc, curr) => acc + curr.givenCredit, 0);

        let chartData = {
            monthlyRedeemed: monthlyRedeemedThroughYear,
            monthlyGenerated: monthlyGeneratedThroughYear,
            totalGenerated,
            totalRedeemed,
        }

        const existingChart = await Chart.findOne({ createdAt: { $gte: yearStart, $lte: yearEnd } })

        if (existingChart) {
            await Chart.updateOne({ _id: existingChart._id }, chartData)
        } else {
            await Chart.create(chartData)
        }
    },
        null,
        true,
        "Asia/Singapore"
    );
}

exports.generateSummary = () => {
    // Daily
    const reportSummary = new CronJob('* * * * * *', async function () {
        const todayStart = moment().startOf('day').toDate()
        const todayEnd = moment().endOf('day').toDate()
        // TEST YESTERDAY
        // const todayStart = moment().startOf('day').subtract(1, 'day').toDate()
        // const todayEnd = moment().endOf('day').subtract(1, 'day').toDate()

        const [
            overallRedeemedCount,
            redeemedCount,
            overallGeneratedCount,
            topTen,
            totalAmountRedeemed
        ] = await Promise.all([
            // overallRedeemedCount
            Serial.aggregate([
                {
                    $match: {
                        serialStatus: false,
                        updatedAt: { $gte: todayStart, $lte: todayEnd }
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 }
                    }
                }
            ]),
            // redeemedCount,
            Serial.aggregate([
                {
                    $match: {
                        serialStatus: false,
                        updatedAt: { $gte: todayStart, $lte: todayEnd }
                    }
                },
                { $group: { _id: "$givenCredit", count: { $sum: 1 } } }
            ]),
            // overallGeneratedCount,
            Serial.aggregate([
                {
                    $match: {
                        createdAt: { $gte: todayStart, $lte: todayEnd }
                    }
                },
                { $group: { _id: "$givenCredit", count: { $sum: 1 } } }
            ]),
            // topTen,
            Serial.aggregate([
                {
                    $match: {
                        serialStatus: false,
                        updatedAt: { $gte: todayStart, $lte: todayEnd }
                    }
                },
                {
                    $group: {
                        _id: "$redemptionAcc",
                        count: { $sum: 1 },
                        totalGivenCredit: { $sum: "$givenCredit" },
                    }
                },
                { $sort: { totalGivenCredit: -1 } },
                { $limit: 10 }
            ]),
            // totalAmountRedeemed
            Serial.aggregate([
                {
                    $match: {
                        serialStatus: false,
                        updatedAt: { $gte: todayStart, $lte: todayEnd }
                    }
                },
                { $group: { _id: "givenCredit", sum: { $sum: "$givenCredit" } } },
            ]),
        ])

        let summaryData = {
            overallRedeemedCount: overallRedeemedCount[0]?.count || 0,
            redeemedCount: redeemedCount.map(({ _id, count }) => ({ amount: _id, count })) || [],
            overallGeneratedCount: overallGeneratedCount
                .map(({ _id, count }) => ({ amount: _id, count }))
                .sort((a, b) => a.amount - b.amount) // Sort by amount in ascending order
                || [],
            mostRedeemed: redeemedCount
                .map(({ _id, count }) => ({ amount: _id, percentage: count / overallRedeemedCount[0]?.count * 100 }))
                .sort((a, b) => a.amount - b.amount) // Sort by amount in ascending order
                || [],
            topTen: topTen.map(({ _id, count, totalGivenCredit }) => ({ name: _id, count: count, totalCredit: totalGivenCredit })),
            totalAmountRedeemed: totalAmountRedeemed[0]?.sum || 0
        }
        const existingSummary = await Report.findOne({ createdAt: { $gte: todayStart, $lte: todayEnd } })

        if (existingSummary) {
            await Report.updateOne({ _id: existingSummary._id }, summaryData)
        } else {
            await Report.create(summaryData)
        }
    },
        null,
        true,
        "Asia/Singapore"
    );
}