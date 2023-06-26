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
    angpao_value: {
        type: Number,
    },
    angpao_divider: {
        type: Number,
    },
    angpao_claim: [{
        playerID: String,
        amount: Number,
    }]
}, { timestamps: true })

const Angpao = mongoose.model('Angpao', AngpaoSchema)
module.exports = Angpao