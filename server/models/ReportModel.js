const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReportSchema = new Schema(
    {
        // overallGeneratedCount
        amountGeneratedPerDay: [{
            amount: Number,
            count: Number,
        }],
        // redeemedCount
        amountRedeemedPerDay: [{
            amount: Number,
            count: Number,
        }],
        // topTen
        topTenRedeemPerDay: [{
            name: String,
            count: Number,
            totalCredit: Number,
        }],
        // overallRedeemedCount
        redeemedCountPerDay: Number,
        // totalAmountRedeemed
        totalAmountRedeemed: Number,
    },
    { timestamps: true }
)

const Report = mongoose.model('Report', ReportSchema)
module.exports = Report