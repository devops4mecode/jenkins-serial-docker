import { Box, Typography } from "@mui/material";
import "../css/dashboard.css"

const StatBox = ({ title, subtitle, icon}) => {

    return (
        <Box width="100%" className="statbox-content">

            <Box>
                <Typography className="subtitle-font">
                    {subtitle}
                </Typography>
            </Box>


            <Box display="inline-flex" >

                {/* icon colour is in index.jsx (dashboard) */}
                {icon}

                <Typography className="title-font">
                    {/* data fetched */}
                    {title}
                </Typography>

            </Box>

        </Box>
    )
}

export default StatBox