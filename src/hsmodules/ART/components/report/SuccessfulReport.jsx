import { Box, Typography } from '@mui/material'
import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

const SuccessfulReport = ({ open, setOpen, setClose }) => {
    return (
        <Box
            sx={{
                width: '50vw',
            }}
        >
            <Box
                display="flex"
                flexDirection="column"
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    maxWidth: '400px',
                    mx: 'auto',
                    textAlign: 'center',
                    gap: '6px',
                }}
            >
                <CheckCircleOutlineIcon
                    sx={{ color: 'green', height: '50px', width: '50px' }}
                />
                <Typography component={'p'} sx={{ fontSize: '1.2rem', mt: 2 }}>
                    Report Generated Successfully!
                </Typography>
                <Typography>
                    You have successfully generated your claim report, kindly
                    click view report to view details
                </Typography>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <GlobalCustomButton type="submit" onClick={setClose}>
                        View Report
                    </GlobalCustomButton>
                </Box>
            </Box>
        </Box>
    )
}

export default SuccessfulReport
