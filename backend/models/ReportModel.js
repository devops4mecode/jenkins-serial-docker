const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReportSchema = new Schema(
    {
        mostRedeemed: [{
            amount: Number,
            percentage: Number,
        }],
        overallGeneratedCount: [{
            amount: Number,
            count: Number,
        }],
        redeemedCount: [{
            amount: Number,
            count: Number
        }],
        topTen: [{
            name: String,
            count: Number,
            totalCredit: Number,
        }],
        overallRedeemedCount: Number,
        totalAmountRedeemed: Number,
    },
    { timestamps: true }
)

const Report = mongoose.model('Report', ReportSchema)
module.exports = Report