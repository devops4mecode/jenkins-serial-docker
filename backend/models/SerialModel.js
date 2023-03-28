const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SerialSchema = new Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        serialNo: {
            type: Number,
            required: true,
        },
        remarkName: {
            type: String,
            required: true,
        },
        givenCredit: {
            type: Number,
            required: true,
        },
        redemptionAcc: {
            type: String,
        },
        serialStatus: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

const Serial = mongoose.model('Serial', SerialSchema)
module.exports = Serial