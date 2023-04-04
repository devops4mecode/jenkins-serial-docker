import { Typography, Box, useTheme, Button, TextField } from "@mui/material";
import { tokens } from "../theme";

const CreditText = (props) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const {
        handleBlur,
        handleChange,
        values,
        touched,
        errors,
        label,
        type,
        name,
        sx,
      } = props;

    return (
        <TextField
            fullWidth
            variant="filled"
            type={type}
            label={label}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values[name]}
            name={name}
            error={!!touched[name] && !!errors[name]}
            helperText={touched[name] && errors[name]}
            sx={sx}
        />

    )
}

export default CreditText