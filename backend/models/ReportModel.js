const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReportSchema = new Schema(
    {
        overallRedeemedCount: Number,
        redeemedCount: [{
            amount: Number,
            count: Number
        }],
        overallGeneratedCount: [{
            amount: Number,
            count: Number,
        }],
        mostRedeemed: [{
            amount: Number,
            percentage: Number,
        }],
        topTen: [{
            name: String,
            count: Number,
            totalCredit: Number,
        }],
        totalAmountRedeemed: Number,
    },
    { timestamps: true }
)

const Report = mongoose.model('Report', ReportSchema)
module.exports = Report