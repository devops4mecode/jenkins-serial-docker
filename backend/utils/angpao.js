// Function to calculate angpao distribution
const AngpaoFormula = (totalAmount, numReceivers, angpaoType) => {
    if (angpaoType === 'Random') {
        const amountCanGet = Math.floor(totalAmount / numReceivers);
        let remainingAmount = totalAmount - (amountCanGet * numReceivers);

        const angpaoClaim = Array.from({ length: numReceivers }, () => {
            const randomAmount = Math.floor(Math.random() * remainingAmount);
            remainingAmount -= randomAmount;

            return {
                playerID: '', // Set player ID here
                amount: amountCanGet + randomAmount
            };
        });

        return angpaoClaim;
    } else if (angpaoType === 'Equal') {
        // Calculate equal amount for each receiver
        const amountCanGet = Math.floor(totalAmount / numReceivers);

        // Generate equal amounts for receivers
        const angpaoClaim = Array.from({ length: numReceivers }, () => {
            return {
                playerID: '', // Set player ID here
                amount: amountCanGet
            };
        });

        return angpaoClaim;
    }

    return null; // Invalid angpao type
};

const RandomizeAngpao = (angpao_credit, num_receiver) => {
    const angpao_claim = [];

    const minAmount = 0.1;
    const maxAmount = angpao_credit / 2;

    let remainingCredit = angpao_credit;

    for (let i = 0; i < num_receiver - 1; i++) {
        // Generate a random amount within the range, considering the remaining credit
        const maxRandomAmount = Math.min(maxAmount, remainingCredit - (num_receiver - i - 1) * minAmount);
        const randomAmount = (Math.random() * (maxRandomAmount - minAmount) + minAmount).toFixed(2);

        remainingCredit -= randomAmount;

        angpao_claim.push({
            playerID: '', // You need to specify how the playerID will be assigned
            amount: randomAmount,
        });
    }

    angpao_claim.push({
        playerID: '', // You need to specify how the playerID will be assigned
        amount: remainingCredit.toFixed(2),
    });

    // Shuffle the angpao_claim array using Fisher-Yates shuffle algorithm
    for (let i = angpao_claim.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [angpao_claim[i], angpao_claim[j]] = [angpao_claim[j], angpao_claim[i]];
    }

    return angpao_claim;

};


const EqualizeAngpao = (angpao_credit, num_receiver) => {
    const equalAmount = angpao_credit / num_receiver;
    const angpao_claim = [];

    for (let i = 0; i < num_receiver; i++) {
        angpao_claim.push({
            playerID: '', // You need to specify how the playerID will be assigned
            amount: equalAmount,
        });
    }

    return angpao_claim;
}

const Angpaonize = () => {

}

module.exports = {
    RandomizeAngpao,
    EqualizeAngpao,
    AngpaoFormula,
    Angpaonize,
}