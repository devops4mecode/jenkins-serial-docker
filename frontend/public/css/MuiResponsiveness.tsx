import { Box } from '@mui/material'
import React from 'react'

export const MuiResponsiveness = () => {
    return (
        <Box
            sx={{
                width: {
                    xs: 100,    //viewport 0 and above
                    sm: 200,    //viewport 600 and above
                    md: 300,    //viewport width 900 and above
                    lg: 400,    //viewport width 1200 and above
                    xl: 500,    //viewport width 1536 and above
                }
            }}
        >

        </Box>
    )
}