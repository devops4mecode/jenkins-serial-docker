import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import "../css/dashboard.css"

const StatBox = ({ title, subtitle, icon, total_redeem_count, className }) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    return (
        <Box width="100%" className={className}>
            <Box display="flex" justifyContent="space-between" className="statBox-center">
                <Box className="statBox pb-statbox">
                    {icon}
                    <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                        {subtitle}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: colors.grey[100] }}>
                        {title}
                    </Typography>
                </Box>
            </Box>

        </Box>
    )
}

export default StatBox