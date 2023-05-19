import { Typography, Box, useTheme, Button, TextField } from "@mui/material";
import { tokens } from "../theme";
import '../css/generateNumber.css'

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
        InputProps,
        className
    } = props;

    return (
        <Box className="credit_field" >
            <TextField
                className="credit-input-field"
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
                InputProps={InputProps}
                InputLabelProps={{
                    sx: {
                        fontSize: {
                            xs: 12,
                            md: 14,
                            xl: 15
                        },
                    }
                }}

            />
        </Box>
    )
}

export default CreditTextField