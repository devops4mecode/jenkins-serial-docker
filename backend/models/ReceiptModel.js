const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReceiptSchema = new Schema(
    {
        serialID: [{
            type: mongoose.Types.ObjectId,
            ref: "Serial"
        }]
    },
    { timestamps: true }
)

const Receipt = mongoose.model('Receipt', ReceiptSchema)
module.exports = Receipt