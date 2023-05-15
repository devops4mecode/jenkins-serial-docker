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