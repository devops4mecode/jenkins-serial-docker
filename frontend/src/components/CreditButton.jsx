import { Typography, Box, useTheme, Button } from "@mui/material";
import { tokens } from "../theme";

const CreditButton = ({ title }) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    return (
        <Button 
        variant="contained" 
        color="secondary"
        >
            <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{
                    fontSize: {
                        xs: "12px",
                        lg: "32px"
                    },
                    paddingBottom: {
                        xs: "2px"
                    }
                }}
            >{title}</Typography>
        </Button>

    )
}

export default CreditButton