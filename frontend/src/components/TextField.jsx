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
        InputProps,
        className
    } = props;

    return (
        <Box
            className="credit_field"
        >
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
                InputProps={InputProps}
                className={className}
                InputLabelProps={{
                    sx: {
                        fontSize: {
                            xs: 12,
                            xl: 18
                        },
                        '& .MuiInputBase-input': {
                            height: '12px'
                        },
                    }
                }}
            />
        </Box>
    )
}

export default CreditTextField