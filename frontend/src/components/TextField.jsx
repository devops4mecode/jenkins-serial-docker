import { Typography, Box, useTheme, Button, TextField } from "@mui/material";
import { tokens } from "../theme";

const CreditTextField = (props) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const {
        label,
        name,
        value,
        error,
        helperText,
        sx,
        onChange,
        onBlur,
        type,
    } = props;

    return (
        <TextField
            fullWidth
            variant="filled"
            type={type}
            label={label}
            onBlur={onBlur}
            onChange={onChange}
            value={value}
            name={name}
            error={error}
            helperText={helperText}
            // sx={ }
        />

    )
}

export default CreditTextField