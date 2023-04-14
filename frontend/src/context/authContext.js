// NEW
import { createContext, useReducer, useEffect } from 'react'
import jwt_decode from 'jwt-decode'

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
}


export const AuthContext = createContext(INITIAL_STATE)


export const authReducer = (state, action) => {
    switch (action.type) {
        case "Login":
            return { user: action.payload }
        case "Logout":
            return { user: null }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, INITIAL_STATE)

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(state.user))

        // Set up a timeout function to automatically log out the user when the token expires
        if (state.user) {
            const decodedToken = jwt_decode(state.user.accessToken)
            const expiresIn = (new Date(decodedToken.exp * 1000)) - (new Date())
            setTimeout(() => {
                alert('Session has expired. Please log in again.')
                dispatch({ type: 'Logout' })
            }, expiresIn)
        }
    }, [state.user])

    console.log('AuthContext state: ', state)

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}