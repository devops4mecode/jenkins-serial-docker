const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChartSchema = new Schema(
    {
        month: Number,
        year: Number,
        amountRedeemed: Number,
        amountGenerated: Number
    },
    { timestamps: true }
)

const Chart = mongoose.model('Chart', ChartSchema)
module.exports = Chart