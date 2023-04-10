import { Typography, Box, useTheme, Button } from "@mui/material";
import { tokens } from "../theme";
import '../css/generateNumber.css'

const CreditButton = ({ onClick, title }) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    return (
        <Button
            variant="contained"
            className="credit-button-button"
            onClick={onClick}
        >
            <Typography
                className="credit-button-text"
            >
                {title}
            </Typography>
        </Button>

    )
}

export default CreditButton