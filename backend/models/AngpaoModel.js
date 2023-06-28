const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AngpaoSchema = new Schema({
    angpao_owner: {
        type: String
    },
    angpao_type: {
        type: String,
        enum: ['Random', 'Equal']
    },
    angpao_credit: {
        type: Number,
    },
    num_receiver: {
        type: Number,
    },
    timeout: {
        type: Date
    },
    remarks: {
        type: String
    },
    angpao_claim: [{
        playerID: { type: String, unique: true },
        amount: Number,
    }],
}, { timestamps: true })

const Angpao = mongoose.model('Angpao', AngpaoSchema)
module.exports = Angpao