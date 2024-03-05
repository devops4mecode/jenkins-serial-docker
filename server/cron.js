// Required Stuffs
const CronJob = require('cron').CronJob
const { getMonthStart, getMonthEnd, subtractDays, getTargetMonthStart, getTargetMonthEnd, subtractMonths, convertDayStart, convertDayEnd, convertYearStart, convertYearEnd, convertMonthCount, convertYearCount } = require('./utils/timezone');

// Get From
const Serial = require('./models/SerialModel')
const Chart = require('./models/ChartModel');
// Save To
const Report = require('./models/ReportModel');

exports.generateCurrentMonthChart = () => {
    const currentMonthChart = new CronJob('* * * * *', async function () {

        const match_query = { $gte: getMonthStart(), $lte: getMonthEnd() }

        const [currentMonthGenerated, currentMonthRedeemed] = await Promise.all([
            // currentMonthGenerated
            Serial.aggregate([
                { $match: { "createdAt": match_query } },
                { $group: { _id: null, givenCredit: { $sum: "$givenCredit" } } }
            ]),
            // currentMonthRedeemed
            Serial.aggregate([
                { $match: { "serialStatus": false, "updatedAt": match_query } },
                { $group: { _id: null, givenCredit: { $sum: "$givenCredit" } } }
            ])
        ])

        // Initialize the chartData
        const chartData = {
            month: convertMonthCount(),
            year: convertYearCount(),
            amountRedeemed: currentMonthRedeemed[0]?.givenCredit,
            amountGenerated: currentMonthGenerated[0]?.givenCredit,
        }

        const existingChart = await Chart.findOne({ month: chartData.month }).exec()

        if (!existingChart) {
            const newChart = await Chart.create(chartData)
        } else {
            const updatedChart = await Chart.updateOne({ _id: existingChart._id }, chartData)
        }
    },
        null,
        true,
        "Asia/Singapore"
    )
}
// !NEW
exports.spareSummary = () => {
    const manualSummary = new CronJob('43 12 * * *', async function () {

        // Start from here, wrap with for loop, and from subtractDays(77) to subtractDays(0)
        for (let i = 77; i >= 0; i--) {
            const match_query = { $gte: convertDayStart(subtractDays(i)), $lte: convertDayEnd(subtractDays(i)) }

            const [
                generatedCountPerDay,
                amountGeneratedPerDay,
                redeemedCountPerDay,
                amountRedeemedPerDay,
                totalAmountRedeemed,
                topTenRedeemPerDay,
            ] = await Promise.all([
                // generatedCountPerDay - no need serialStatus, createdAt
                Serial.aggregate([
                    { $match: { createdAt: match_query } },
                    { $group: { _id: null, count: { $sum: 1 } } }
                ]),
                // amountGeneratedPerDay - no need serialStatus, createdAt
                Serial.aggregate([
                    { $match: { createdAt: match_query } },
                    { $group: { _id: "$givenCredit", count: { $sum: 1 } } }
                ]),
                // redeemedCountPerDay  - serialStatus false, updatedAt
                Serial.aggregate([
                    { $match: { serialStatus: false, updatedAt: match_query } },
                    { $group: { _id: null, count: { $sum: 1 } } }
                ]),
                // amountRedeemedPerDay - serialStatus false, updatedAt
                Serial.aggregate([
                    { $match: { serialStatus: false, updatedAt: match_query } },
                    { $group: { _id: "$givenCredit", count: { $sum: 1 } } }
                ]),
                // totalAmountRedeemed - serialStatus false, updatedAt
                Serial.aggregate([
                    { $match: { serialStatus: false, updatedAt: match_query } },
                    { $group: { _id: "givenCredit", sum: { $sum: "$givenCredit" } } },
                ]),
                // topTenRedeemPerDay - serialStatus false, updatedAt
                Serial.aggregate([
                    { $match: { serialStatus: false, updatedAt: match_query } },
                    {
                        $group: {
                            _id: "$redemptionAcc",
                            count: { $sum: 1 },
                            totalGivenCredit: { $sum: "$givenCredit" },
                        }
                    },
                    { $sort: { totalGivenCredit: -1 } },
                    { $limit: 10 }
                ])
            ])

            // Predefined
            //! ADDED WITH 3000 and 5000
            const amounts = [5, 10, 15, 20, 30, 50, 100, 200, 300, 500, 800, 1000, 3000, 5000]

            const summaryDataPerDay = {
                generatedCountPerDay: generatedCountPerDay[0]?.count || 0,
                amountGeneratedPerDay: amounts.map((amount) => ({
                    amount,
                    count: amountGeneratedPerDay.find(({ _id }) => _id === amount)?.count || 0
                })),
                redeemedCountPerDay: redeemedCountPerDay[0]?.count || 0,
                amountRedeemedPerDay: amounts.map((amount) => ({
                    amount,
                    count: amountRedeemedPerDay.find(({ _id }) => _id === amount)?.count || 0
                })),

                totalAmountRedeemed: totalAmountRedeemed[0]?.sum || 0,

                topTenRedeemPerDay: topTenRedeemPerDay.map(({ _id, count, totalGivenCredit }) => ({
                    name: _id,
                    count: count,
                    totalCredit: totalGivenCredit
                })),
                // mostRedeemed: amounts.map((amount) => {
                //     const redeemed = amountRedeemedPerDay.find(({ _id }) => _id === amount)?.count || 0;
                //     const overallRedeemed = redeemedCountPerDay[0]?.count || 1;
                //     const percentage = (redeemed / overallRedeemed) * 100;
                //     return { amount, percentage };
                // }),
                createdAt: convertDayStart(subtractDays(i)),
                updatedAt: convertDayEnd(subtractDays(i)),
            }

            const existingSummary = await Report.findOne({ createdAt: match_query }).exec()

            if (!existingSummary) {
                console.dir(`Creating for ${match_query}`, { depth: null })
                const newReport = await Report.create(summaryDataPerDay)
            }
        }

        // Loop end here
    },
        null,
        true,
        "Asia/Singapore"
    )
}

exports.generateSummary = () => {
    // Daily
    const reportSummary = new CronJob('* * * * *', async function () {

        const match_query = { $gte: convertDayStart(), $lte: convertDayEnd() }

        const [
            generatedCountPerDay,
            amountGeneratedPerDay,
            redeemedCountPerDay,
            amountRedeemedPerDay,
            totalAmountRedeemed,
            topTenRedeemPerDay,
        ] = await Promise.all([
            // generatedCountPerDay - no need serialStatus, createdAt
            Serial.aggregate([
                { $match: { createdAt: match_query } },
                { $group: { _id: null, count: { $sum: 1 } } }
            ]),
            // amountGeneratedPerDay - no need serialStatus, createdAt
            Serial.aggregate([
                { $match: { createdAt: match_query } },
                { $group: { _id: "$givenCredit", count: { $sum: 1 } } }
            ]),
            // redeemedCountPerDay  - serialStatus false, updatedAt
            Serial.aggregate([
                { $match: { serialStatus: false, updatedAt: match_query } },
                { $group: { _id: null, count: { $sum: 1 } } }
            ]),
            // amountRedeemedPerDay - serialStatus false, updatedAt
            Serial.aggregate([
                { $match: { serialStatus: false, updatedAt: match_query } },
                { $group: { _id: "$givenCredit", count: { $sum: 1 } } }
            ]),
            // totalAmountRedeemed - serialStatus false, updatedAt
            Serial.aggregate([
                { $match: { serialStatus: false, updatedAt: match_query } },
                { $group: { _id: "givenCredit", sum: { $sum: "$givenCredit" } } },
            ]),
            // topTenRedeemPerDay - serialStatus false, updatedAt
            Serial.aggregate([
                { $match: { serialStatus: false, updatedAt: match_query } },
                {
                    $group: {
                        _id: "$redemptionAcc",
                        count: { $sum: 1 },
                        totalGivenCredit: { $sum: "$givenCredit" },
                    }
                },
                { $sort: { totalGivenCredit: -1 } },
                { $limit: 10 }
            ])
        ])

        // Predefined
        //! ADDED WITH 3000 and 5000
        const amounts = [5, 10, 15, 20, 30, 50, 100, 200, 300, 500, 800, 1000, 3000, 5000]

        const summaryDataPerDay = {
            generatedCountPerDay: generatedCountPerDay[0]?.count || 0,
            amountGeneratedPerDay: amounts.map((amount) => ({
                amount,
                count: amountGeneratedPerDay.find(({ _id }) => _id === amount)?.count || 0
            })),
            redeemedCountPerDay: redeemedCountPerDay[0]?.count || 0,
            amountRedeemedPerDay: amounts.map((amount) => ({
                amount,
                count: amountRedeemedPerDay.find(({ _id }) => _id === amount)?.count || 0
            })),

            totalAmountRedeemed: totalAmountRedeemed[0]?.sum || 0,

            topTenRedeemPerDay: topTenRedeemPerDay.map(({ _id, count, totalGivenCredit }) => ({
                name: _id,
                count: count,
                totalCredit: totalGivenCredit
            })),
        }

        const existingSummary = await Report.findOne({ createdAt: match_query })

        if (existingSummary) {
            await Report.updateOne({ _id: existingSummary._id }, summaryDataPerDay)
        } else {
            await Report.create(summaryDataPerDay)
        }
    },
        null,
        true,
        "Asia/Singapore"
    );
}
