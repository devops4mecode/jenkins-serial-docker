import { createSlice } from "@reduxjs/toolkit";




// change mode from light to dark


const initialState = {
    mode: "light"
}

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === 'dark' ? "light" : "light"
        }
    }
})

export const { setMode } = globalSlice.actions

export default globalSlice.reducer