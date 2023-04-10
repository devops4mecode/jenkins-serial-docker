import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    return (
        <Box
            sx={{
                paddingBottom: {
                    xs: "10px",
                    lg: "20px"
                }
            }}
        >
            <Typography
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{
                    fontSize: {
                        xs: "19px",
                        lg: "25px"
                    },
                    paddingBottom: {
                        xs: "2px"
                    }
                }}
            >
                {title}
            </Typography>

            <Typography
                color={colors.purple[100]}
                sx={{
                    fontSize: {
                        xs: "15px",
                        lg: "19px"
                    },
                    paddingBottom: {
                        xs: "3px"
                    }
                }}
            >
                {subtitle}
            </Typography>
        </Box>
    )
}

export default Header