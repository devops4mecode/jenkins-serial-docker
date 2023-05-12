const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChartSchema = new Schema(
    {
        monthlyRedeemed: [{
            givenCredit: Number,
            month: Number,
            year: Number
        }],
        monthlyGenerated: [{
            givenCredit: Number,
            month: Number,
            year: Number
        }],
        totalGenerated: Number,
        totalRedeemed: Number
    },
    { timestamps: true }
)

const Chart = mongoose.model('Chart', ChartSchema)
module.exports = Chart