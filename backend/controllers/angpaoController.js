const Angpao = require("../models/AngpaoModel");
const { RandomizeAngpao, EqualizeAngpao } = require("../utils/angpao");
const { convertExpiryTime, setAngpaoID, timeNow } = require('../utils/timezone')
require('dotenv').config()

// Function to get the base URL based on the current environment
function getBaseUrl() {
    if (process.env.NODE_ENV === 'production') {
        return process.env.PRODUCTION_URL;
    } else {
        return process.env.DEVELOPMENT_URL;
    }
}

// Create Angpao
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

        // Construct the get API link with angpaoID
        const getLink = `${getBaseUrl()}/api/angpao/open?angpaoID=${angpaoID}`;

        return res.json({ angpao: newAngpao, getLink });

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

// Get Angpao Details
const getAngpao = async (req, res) => {
    try {
        const { angpaoID } = req.query

        const targetAngpao = await Angpao.findOne({ angpaoID }).exec()

        if (!targetAngpao) return res.status(400).json({ message: `Angpao not found` })

        if (timeNow > targetAngpao.valid_until) return res.status(400).json({ message: `Angpao Expired` })

        const emptyClaims = targetAngpao.angpao_claim.filter(claim => claim.playerID === '');

        if (emptyClaims.length === 0) return res.status(400).json({ message: `Angpao fully claimed` });

        const returnData = {
            createdBy: targetAngpao.angpao_owner,
            remarks: targetAngpao.remarks,
        }

        return res.status(200).json(returnData)

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

// Redeem Angpao
const redeemAngpao = async (req, res) => {
    try {
        const { playerID, angpaoID } = req.query;

        const targetAngpao = await Angpao.findOne({
            angpaoID,
            valid_until: { $gt: timeNow },
        });

        if (!targetAngpao) {
            return res.status(400).json({ message: `Angpao not found or already expired` });
        }

        const emptyClaims = targetAngpao.angpao_claim.filter(claim => claim.playerID === '');

        if (emptyClaims.length === 0) {
            return res.status(400).json({ message: `Angpao fully claimed` });
        }

        const playerExists = targetAngpao.angpao_claim.some(claim => claim.playerID === playerID);

        if (playerExists) {
            return res.status(400).json({ message: `You already claimed this angpao` });
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
    getAngpao,
    redeemAngpao,
};