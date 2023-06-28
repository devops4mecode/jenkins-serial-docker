const Angpao = require("../models/AngpaoModel");
const { AngpaoFormula, Angpaonize, RandomizeAngpao, EqualizeAngpao } = require("../utils/angpao");
const { convertExpiryTime } = require('../utils/timezone')

const createAngpao = async (req, res) => {
    try {
        const { angpao_owner, angpao_type, angpao_credit, num_receiver, remarks, timeout } = req.body;

        let angpao_claim

        if (angpao_type === 'Random') {
            angpao_claim = RandomizeAngpao(angpao_credit, num_receiver)
        } else if (angpao_type === 'Equal') {
            angpao_claim = EqualizeAngpao(angpao_credit, num_receiver)
        }

        const angpaoObj = {
            angpao_owner,
            angpao_type,
            angpao_credit,
            num_receiver,
            remarks,
            timeout: convertExpiryTime(timeout),
            angpao_claim
        }

        return res.json(angpaoObj)

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createAngpao,
};