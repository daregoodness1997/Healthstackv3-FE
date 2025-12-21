import { Box, Typography } from '@mui/material'
import { RotatingLines } from 'react-loader-spinner'

interface componentProps {
    bgColor?: string
    Icon: any
    label: string
    figure: number | string
    loading?: boolean
}

const DashboardCard = ({
    bgColor,
    Icon,
    label,
    figure,
    loading,
}: componentProps) => {
    return (
        <Box
            sx={{
                boxShadow: 2,
                borderRadius: '8px',
                bgcolor: bgColor || 'primary.main',
                display: 'flex',
                alignItems: 'center',
                py: 3,
                px: 2,
            }}
        >
            <Box
                sx={{
                    height: '50px',
                    width: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    border: '2px solid white',
                    bgcolor: bgColor || 'primary.main',
                }}
            >
                <Icon sx={{ width: '25px', height: '25px', fill: '#ffffff' }} />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    justifyContent: 'center',
                    ml: 2,
                }}
            >
                <Typography
                    variant="h6"
                    component="p"
                    sx={{
                        color: 'white',
                        fontWeight: 'medium',
                        fontSize: '1rem',
                    }}
                >
                    {label}
                </Typography>
                {loading ? (
                    <RotatingLines
                        strokeColor="white"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="36"
                        visible={true}
                    />
                ) : (
                    <Typography
                        variant="h4"
                        component="p"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            maxWidth: '20px',
                        }}
                    >
                        {figure}
                    </Typography>
                )}
            </Box>
        </Box>
    )
}

export default DashboardCard
