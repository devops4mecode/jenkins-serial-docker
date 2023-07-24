// Required Stuffs
const CronJob = require('cron').CronJob
const { getMonthStart, getMonthEnd, subtractDays, convertDayStart, convertDayEnd, convertYearStart, convertYearEnd } = require('./utils/timezone');
// Get From
const Serial = require('./models/SerialModel')
const Chart = require('./models/ChartModel');
// Save To
const Report = require('./models/ReportModel');

// exports.generateCurrentMonthChart = () => {
//     const currentMonthChart = new CronJob('* * * * *', async function () {

//     },
//         null,
//         true,
//         "Asia/Singapore"
//     )
// }

exports.spareSummary = () => {
    const manualSummary = new CronJob('* * * * * *', async function () {

        console.log('running')


        const match_query = { $gte: convertDayStart(subtractDays(1)), $lte: convertDayEnd(subtractDays(1)) }

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
                        updatedAt: match_query
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
                        updatedAt: match_query
                    }
                },
                { $group: { _id: "$givenCredit", count: { $sum: 1 } } }
            ]),
            // overallGeneratedCount,
            Serial.aggregate([
                {
                    $match: {
                        createdAt: match_query
                    }
                },
                { $group: { _id: "$givenCredit", count: { $sum: 1 } } }
            ]),
            // topTen,
            Serial.aggregate([
                {
                    $match: {
                        serialStatus: false,
                        updatedAt: match_query
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
                        updatedAt: match_query
                    }
                },
                { $group: { _id: "givenCredit", sum: { $sum: "$givenCredit" } } },
            ]),
        ])


        // Predefined
        const amounts = [5, 10, 15, 20, 30, 50, 100, 200, 300, 500, 800, 1000];

        let summaryData = {
            overallRedeemedCount: overallRedeemedCount[0]?.count || 0,
            redeemedCount: amounts.map((amount) => ({
                amount,
                count: redeemedCount.find(({ _id }) => _id === amount)?.count || 0
            })),
            overallGeneratedCount: amounts.map((amount) => ({
                amount,
                count: overallGeneratedCount.find(({ _id }) => _id === amount)?.count || 0
            })),
            mostRedeemed: amounts.map((amount) => {
                const redeemed = redeemedCount.find(({ _id }) => _id === amount)?.count || 0;
                const overallRedeemed = overallRedeemedCount[0]?.count || 1;
                const percentage = (redeemed / overallRedeemed) * 100;
                return {
                    amount,
                    percentage
                };
            }),
            topTen: topTen.map(({ _id, count, totalGivenCredit }) => ({
                name: _id,
                count: count,
                totalCredit: totalGivenCredit
            })),
            totalAmountRedeemed: totalAmountRedeemed[0]?.sum || 0,
            createdAt: convertDayStart(subtractDays(1)),
            updatedAt: convertDayEnd(subtractDays(1))
        };

        const existingSummary = await Report.findOne({ createdAt: match_query })

        if (!existingSummary) {
            console.log('no report')
            const newReport = await Report.create(summaryData)
            console.log(newReport)
        } else {
            console.log('yes report')
            return
            await Report.updateOne({ _id: existingSummary._id }, summaryData)
        }
    },
        null,
        true,
        "Asia/Singapore"
    )
}


exports.generateChartData = () => {
    const dashChart = new CronJob('* * * * *', async function () {

        const match_query = { $gte: convertYearStart(), $lte: convertYearEnd() }

        const [
            monthlyRedeemedThroughYear,
            monthlyGeneratedThroughYear,
        ] = await Promise.all([
            Serial.aggregate([
                { $match: { serialStatus: false, updatedAt: match_query } },
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
                { $match: { createdAt: match_query } },
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

        const existingChart = await Chart.findOne({ createdAt: match_query })

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
    const reportSummary = new CronJob('* * * * *', async function () {

        const match_query = { $gte: convertDayStart(), $lte: convertDayEnd() }

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
                        updatedAt: match_query
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
                        updatedAt: match_query
                    }
                },
                { $group: { _id: "$givenCredit", count: { $sum: 1 } } }
            ]),
            // overallGeneratedCount,
            Serial.aggregate([
                {
                    $match: {
                        createdAt: match_query
                    }
                },
                { $group: { _id: "$givenCredit", count: { $sum: 1 } } }
            ]),
            // topTen,
            Serial.aggregate([
                {
                    $match: {
                        serialStatus: false,
                        updatedAt: match_query
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
                        updatedAt: match_query
                    }
                },
                { $group: { _id: "givenCredit", sum: { $sum: "$givenCredit" } } },
            ]),
        ])

        // Predefined
        const amounts = [5, 10, 15, 20, 30, 50, 100, 200, 300, 500, 800, 1000];

        let summaryData = {
            overallRedeemedCount: overallRedeemedCount[0]?.count || 0,
            redeemedCount: amounts.map((amount) => ({
                amount,
                count: redeemedCount.find(({ _id }) => _id === amount)?.count || 0
            })),
            overallGeneratedCount: amounts.map((amount) => ({
                amount,
                count: overallGeneratedCount.find(({ _id }) => _id === amount)?.count || 0
            })),
            mostRedeemed: amounts.map((amount) => {
                const redeemed = redeemedCount.find(({ _id }) => _id === amount)?.count || 0;
                const overallRedeemed = overallRedeemedCount[0]?.count || 1;
                const percentage = (redeemed / overallRedeemed) * 100;
                return {
                    amount,
                    percentage
                };
            }),
            topTen: topTen.map(({ _id, count, totalGivenCredit }) => ({
                name: _id,
                count: count,
                totalCredit: totalGivenCredit
            })),
            totalAmountRedeemed: totalAmountRedeemed[0]?.sum || 0,
        };

        const existingSummary = await Report.findOne({ createdAt: match_query })

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
