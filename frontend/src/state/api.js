import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
    reducerPath: "adminApi",
    tagTypes: ["User", "Serials"],
    endpoints: (build) => ({
        getUser: build.query({
            // query: (id) => `users/${id}`,
            query: (id) => `users/642259aea8d95e3124b95578`,
            providesTags: ["User"]
        }),
        getSerials: build.query({
            query: () => `serials/all`,
            providesTags: ["Serials"]
        }),
        getSerialDetails: build.query({
            query: (redemptionAcc, serialNo) => `serials/details?redemptionAcc=${redemptionAcc}&serialNo=${serialNo}`,
            providesTags: ["Serials"]
        })
    })
})


export const {
    useGetUserQuery,
    useGetSerialsQuery,
    useGetSerialDetailsQuery,
} = api