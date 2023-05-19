import { Typography, Box } from "@mui/material";


const Header = ({ title, subtitle }) => {
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
                color='#141414'
                fontWeight="bold"
                sx={{
                    fontSize: {
                        xs: "19px",
                        lg: "21px"
                    },
                    paddingBottom: {
                        xs: "2px"
                    }
                }}
            >
                {title}
            </Typography>

            <Typography
                color='#6200EE'
                sx={{
                    fontSize: {
                        xs: "15px",
                        lg: "16px"
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