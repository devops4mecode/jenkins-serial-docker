const INITIAL_STATE = {
    totalRedeemedAmount: 0,
    totalRedeemedCount: 0,
    redeemedCount: { '10': 0, '30': 0, '50': 0, '100': 0 },
    generatedCount: { '10': 0, '30': 0, '50': 0, '100': 0 },
    mostRedeemedCount: { '10': 0, '30': 0, '50': 0, '100': 0 }
}

const ACTIONS = {
    SET_TOTAL_REDEEMED_AMOUNT: "SET_TOTAL_REDEEMED_AMOUNT",
    SET_TOTAL_REDEEMED_COUNT: "SET_TOTAL_REDEEMED_COUNT",
    SET_REDEEMED_COUNT: "SET_REDEEMED_COUNT",
    SET_GENERATED_COUNT: "SET_GENERATED_COUNT",
    SET_MOST_REDEEMED_COUNT: "SET_MOST_REDEEMED_COUNT"
}

const dashboardReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_TOTAL_REDEEMED_AMOUNT:
            return {
                ...state,
                totalRedeemedAmount: action.payload
            }
        case ACTIONS.SET_TOTAL_REDEEMED_COUNT:
            return {
                ...state,
                totalRedeemedCount: action.payload
            }
        case ACTIONS.SET_REDEEMED_COUNT:
            return {
                ...state,
                redeemedCount: action.payload
            }
        case ACTIONS.SET_GENERATED_COUNT:
            return {
                ...state,
                generatedCount: action.payload
            }
        case ACTIONS.SET_MOST_REDEEMED_COUNT:
            return {
                ...state,
                mostRedeemedCount: action.payload
            }
        default:
            return state
    }
}

export { INITIAL_STATE, ACTIONS, dashboardReducer }