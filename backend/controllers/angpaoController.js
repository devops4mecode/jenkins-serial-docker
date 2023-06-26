const Angpao = require("../models/AngpaoModel");
const { AngpaoFormula, Angpaonize } = require("../utils/angpao");



const createAngpao = async (req, res) => {
    try {
        let { angpao_owner, angpao_type, angpao_value, angpao_divider, owner_balance } = req.body

        return res.json({
            angpao_owner,
            angpao_type,
            angpao_value,
            angpao_divider,
            owner_balance
        })

        // Passing in 3 values for the calculation
        const validation = AngpaoFormula(angpao_value, angpao_divider, owner_balance)

        if (!validation) return res.status(400).json({ message: 'Insufficient balance' })



        // owner_balance just needs to do calculations


    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}


module.exports = {
    createAngpao,
};