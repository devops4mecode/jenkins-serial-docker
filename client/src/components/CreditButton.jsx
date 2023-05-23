import { Typography, Button } from "@mui/material";
import '../css/generateNumber.css'

const CreditButton = ({ onClick, title }) => {

    return (
        <Button
            variant="contained"
            className="credit-button-button"
            onClick={onClick}
        >
            <Typography className="credit-button-text" >
                {title}
            </Typography>
        </Button>

    )
}

export default CreditButton