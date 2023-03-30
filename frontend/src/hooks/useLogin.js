import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const login = async (values) => {
        setIsLoading(true)
        setError(null)

        const response = await axios.post('http://localhost:3500/auth', values, {
            headers: { "Content-Type": 'application/json' },
        })

        if (response.status !== 200) {
            setIsLoading(false)
            setError(response.data.error)
        } else {
            localStorage.setItem('user', JSON.stringify(response.data))

            // Update the auth context
            dispatch({ type: 'Login', payload: response.data })

            // Update loading state
            setIsLoading(false)
        }
    }
    return { login, isLoading, error }
}