const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AngpaoSchema = new Schema({
    angpaoID: {
        type: String,
    },
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
    valid_until: {
        type: Date
    },
    remarks: {
        type: String
    },
    angpao_claim: [{
        playerID: String,
        amount: Number,
    }],
}, { timestamps: true })

const Angpao = mongoose.model('Angpao', AngpaoSchema)
module.exports = Angpao