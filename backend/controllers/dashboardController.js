const Serial = require("../models/SerialModel");
const moment = require("moment");

const Report = require("../models/ReportModel")
const Chart = require("../models/ChartModel")

// !TEST NEW
// !GET CHART AND REPORT TOGETHER
const getDashboardData = async (req, res) => {
    try {
        const { year, startDate, endDate } = req.query

        const yearStart = moment(year).startOf('year').toDate()
        const yearEnd = moment(year).endOf('year').toDate()
        const dateStart = moment(startDate).startOf('day').toDate()
        const dateEnd = moment(endDate).endOf('day').toDate()

        // Chart Sure No Problem
        const foundChart = await Chart.findOne(
            {
                createdAt: { $gte: yearStart, $lte: yearEnd }
            },
            { _id: 0 } // Exclude _id field
        )
        // ! Report Need More Checking
        const foundReport = await Report.findOne(
            {
                createdAt: { $gte: dateStart, $lte: dateEnd }
            },
            { _id: 0 } // Exclude _id field
        )
        const returnData = {
            ...foundChart._doc,
            ...foundReport._doc
        }
        return res.json(returnData)
    } catch (error) {
        return res.status(404).json({ error: error.message })
    }
}

// const getChartData = async (req, res) => {
//     try {

//         // Go Chart Model Take Data

//         const { year } = req.query
//         const startDate = moment(year).startOf('year').toDate();
//         const endDate = moment(year).endOf('year').toDate();

//         const [
//             monthlyRedeemedThroughYear,
//             monthlyGeneratedThroughYear,
//         ] = await Promise.all([
//             // monthlyRedeemedThroughYear
//             Serial.aggregate([
//                 {
//                     $match: {
//                         serialStatus: false,
//                         updatedAt: { $gte: startDate, $lte: endDate }
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: {
//                             year: { $year: "$updatedAt" },
//                             month: { $month: "$updatedAt" },
//                         },
//                         givenCredit: { $sum: "$givenCredit" }
//                     }
//                 },
//                 {
//                     $project: {
//                         _id: 0,
//                         month: "$_id.month",
//                         year: "$_id.year",
//                         givenCredit: 1
//                     }
//                 },
//                 {
//                     $sort: { year: 1, month: 1 }
//                 }
//             ]),
//             // monthlyGeneratedThroughYear
//             Serial.aggregate([
//                 {
//                     $match: {
//                         // ! MAYBE NO NEED THIS
//                         // serialStatus: true,
//                         // ! CUZ GENERATED MEANS ALL
//                         createdAt: { $gte: startDate, $lte: endDate }
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: {
//                             year: { $year: "$createdAt" },
//                             month: { $month: "$createdAt" },
//                         },
//                         givenCredit: { $sum: "$givenCredit" }
//                     }
//                 },
//                 {
//                     $project: {
//                         _id: 0,
//                         month: "$_id.month",
//                         year: "$_id.year",
//                         givenCredit: 1
//                     }
//                 },
//                 {
//                     $sort: { year: 1, month: 1 }
//                 }
//             ]),
//         ]);

//         const totalGenerated = monthlyGeneratedThroughYear.reduce((acc, curr) => acc + curr.givenCredit, 0);
//         const totalRedeemed = monthlyRedeemedThroughYear.reduce((acc, curr) => acc + curr.givenCredit, 0);

//         const result = {
//             monthlyRedeemedThroughYear,
//             monthlyGeneratedThroughYear,
//             totalGenerated,
//             totalRedeemed,
//         };
//         res.json(result);
//     } catch (error) {
//         return res.status(400).json({ message: "Something wrong" });
//     }
// };

// const getSummary = async (req, res) => {
//     try {

//         // Go Report Model Take Data
//         const { startDate, endDate } = req.query

//         let isoStart
//         let isoEnd = moment(endDate).endOf('day')

//         if (startDate == "null") {
//             isoStart = moment('1900-01-01')
//         } else {
//             isoStart = moment(startDate).startOf('day')
//         }

//         const [
//             overallRedeemedCount,
//             redeemedCounts,
//             overallGeneratedCount,
//             totalAmountRedeemed,
//             topRedeemUser,
//         ] = await Promise.all([
//             // overallRedeemedCount
//             Serial.aggregate([
//                 {
//                     $match: {
//                         serialStatus: false,
//                         updatedAt: { $gte: new Date(isoStart), $lte: new Date(isoEnd) }
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: null,
//                         count: { $sum: 1 }
//                     }
//                 }
//             ]),
//             // redeemedCounts
//             Serial.aggregate([
//                 {
//                     $match: {
//                         serialStatus: false,
//                         updatedAt: { $gte: new Date(isoStart), $lte: new Date(isoEnd) }
//                     }
//                 },
//                 { $group: { _id: "$givenCredit", count: { $sum: 1 } } },
//             ]),
//             // overallGeneratedCount
//             Serial.aggregate([
//                 {
//                     $match: {
//                         createdAt: { $gte: new Date(isoStart), $lte: new Date(isoEnd) }
//                     }
//                 },
//                 { $group: { _id: "$givenCredit", count: { $sum: 1 } } },
//             ]),
//             // totalAmountRedeemed
//             Serial.aggregate([
//                 {
//                     $match: {
//                         serialStatus: false,
//                         updatedAt: { $gte: new Date(isoStart), $lte: new Date(isoEnd) }
//                     }
//                 },
//                 { $group: { _id: "givenCredit", sum: { $sum: "$givenCredit" } } },
//             ]),
//             // topRedeemUser
//             Serial.aggregate([
//                 {
//                     $match: {
//                         serialStatus: false,
//                         updatedAt: { $gte: new Date(isoStart), $lte: new Date(isoEnd) }
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: "$redemptionAcc",
//                         count: { $sum: 1 },
//                         totalGivenCredit: { $sum: "$givenCredit" },
//                     }
//                 },
//                 {
//                     $sort: { totalGivenCredit: -1 }
//                 },
//                 { $limit: 10 }
//             ]),
//         ]);

//         const mostRedeemed = [10, 30, 50, 100];

//         const percentages = await Serial.aggregate([
//             {
//                 $match: {
//                     serialStatus: false,
//                     updatedAt: { $gte: new Date(isoStart), $lte: new Date(isoEnd) },
//                     givenCredit: { $in: mostRedeemed }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$givenCredit",
//                     count: { $sum: 1 }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     percentage: { $multiply: [{ $divide: ["$count", overallRedeemedCount[0]?.count || 0] }, 100] }
//                 }
//             }
//         ]);

//         const percentagesMap = new Map(percentages.map(({ _id, percentage }) => [_id, percentage]));

//         const result = {
//             overallRedeemedCount: overallRedeemedCount[0]?.count || 0,
//             redeemedCount: redeemedCounts || 0,
//             overallGeneratedCount: overallGeneratedCount || 0,
//             totalAmountRedeemed: totalAmountRedeemed[0]?.sum || 0,
//             mostRedeemed: mostRedeemed.map(_id => ({ _id, percentage: percentagesMap.get(_id) || 0 })),
//             topRedeemUser: topRedeemUser,
//         };
//         res.json(result);
//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }
// };

module.exports = {
    // getChartData,
    // getSummary,
    getDashboardData
};