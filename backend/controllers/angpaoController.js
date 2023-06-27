const Angpao = require("../models/AngpaoModel");
const { RandomizeAngpao, EqualizeAngpao } = require("../utils/angpao");
const { convertExpiryTime, setAngpaoID, timeNow } = require('../utils/timezone')

const createAngpao = async (req, res) => {
    try {
        const { angpao_owner, angpao_type, angpao_credit, num_receiver, remarks, valid_until } = req.body;

        let angpao_claim

        if (angpao_type === 'Random') {
            angpao_claim = RandomizeAngpao(angpao_credit, num_receiver)
        } else if (angpao_type === 'Equal') {
            angpao_claim = EqualizeAngpao(angpao_credit, num_receiver)
        }

        const newAngpao = await Angpao.create({
            angpao_owner,
            angpao_type,
            angpao_credit,
            num_receiver,
            remarks,
            valid_until: convertExpiryTime(valid_until),
            angpao_claim
        })

        const angpaoID = setAngpaoID(newAngpao._id.toString());

        newAngpao.angpaoID = angpaoID;
        await newAngpao.save();

        // Construct the redeem API link with angpaoID
        const redeemLink = `/api/angpao/redeem?angpaoID=${angpaoID}`;

        return res.json({ angpao: newAngpao, redeemLink });

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const redeemAngpao = async (req, res) => {
    try {
        const { playerID, angpaoID } = req.query;

        const targetAngpao = await Angpao.findOne({
            angpaoID,
            valid_until: { $gt: timeNow },
        });

        if (!targetAngpao) {
            return res.status(400).json({ message: 'Angpao not found or already expired' });
        }

        const emptyClaims = targetAngpao.angpao_claim.filter(claim => claim.playerID === '');

        if (emptyClaims.length === 0) {
            return res.status(400).json({ message: 'Angpao fully claimed' });
        }

        const playerExists = targetAngpao.angpao_claim.some(claim => claim.playerID === playerID);

        if (playerExists) {
            return res.status(400).json({ message: 'You already claimed this angpao' });
        }

        const randomIndex = Math.floor(Math.random() * emptyClaims.length);
        const randomClaim = emptyClaims[randomIndex];

        randomClaim.playerID = playerID;

        // Save the updated targetAngpao with the playerID
        await targetAngpao.save();

        const returnData = {
            claim_by: randomClaim.playerID,
            amount: randomClaim.amount,
        };

        return res.status(200).json(returnData);

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createAngpao,
    redeemAngpao,
};