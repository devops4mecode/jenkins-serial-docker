import { Typography, Box, useTheme, Button } from "@mui/material";
import { tokens } from "../theme";

const CreditButton = ({ onClick, title }) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={onClick}
        >
            <Typography
                // variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{
                    fontSize: {
                        xs: "12px",
                        lg: "18px"
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