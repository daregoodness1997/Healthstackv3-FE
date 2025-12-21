import { PageWrapper } from '../../ui/styled/styles'
import { TableMenu } from '../../ui/styled/global'
import GlobalCustomButton from '../../components/buttons/CustomButton'
import { Box, Typography } from '@mui/material'
import DashboardCard from '../../components/dashboardcard'
import ArticleIcon from '@mui/icons-material/Article'
import InfoIcon from '@mui/icons-material/Info'
import { useState } from 'react'
import ModalBox from '../../components/modal'
import GenerateReport from './components/report/GenerateReport'
import SuccessfulReport from './components/report/SuccessfulReport'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import MedicationIcon from '@mui/icons-material/Medication'
import ScienceIcon from '@mui/icons-material/Science'

export default function Report() {
    const [generateModal, setGenerateModal] = useState(false)
    const [successModal, setSuccessModal] = useState(false)

    const handleGenerateModal = () => {
        setGenerateModal(true)
    }

    const handleHideGenerateModal = () => {
        setGenerateModal(false)
    }

    const handleSuccessModal = () => {
        setSuccessModal(true)
    }

    const handleHideSuccessModal = () => {
        setSuccessModal(false)
    }

    return (
        <Box 
          sx={{
            overflowY: 'auto',
            maxHeight: '90vh',
          }}
        >
            <PageWrapper
                style={{
                    flexDirection: 'column',
                    padding: '0.6rem 1rem',
                }}
            >
                <TableMenu>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h2 style={{ margin: '0 10px', fontSize: '0.95rem' }}>
                            Report Dashboard
                        </h2>
                    </div>

                    <GlobalCustomButton onClick={handleGenerateModal}>
                        Generate Report
                    </GlobalCustomButton>
                </TableMenu>

                <ModalBox
                    open={generateModal}
                    onClose={handleHideGenerateModal}
                    header="Report Filters"
                >
                    <GenerateReport
                        open={generateModal}
                        setOpen={handleGenerateModal}
                        setClose={() => {
                            handleHideGenerateModal()
                            handleSuccessModal()
                        }}
                    />
                </ModalBox>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)',
                        },
                        gap: { xs: 2, sm: 3 },
                        width: '100%',
                        
                    }}
                >
                    <DashboardCard
                        bgColor="#023e8a"
                        Icon={ArticleIcon}
                        label="Total"
                        figure={10}
                        loading={false}
                    />

                    <DashboardCard
                        bgColor="#31572c"
                        Icon={LocalHospitalIcon}
                        label="Procedure"
                        figure={5}
                        loading={false}
                    />

                    <DashboardCard
                        bgColor="#2a9d8f"
                        Icon={MedicationIcon}
                        label="Prescription"
                        figure={200}
                        loading={false}
                    />

                    <DashboardCard
                        bgColor="#e76f51"
                        Icon={ScienceIcon}
                        label="Lab Test"
                        figure="102"
                        loading={false}
                    />
                </Box>

                <ModalBox open={successModal} onClose={handleHideSuccessModal}>
                    <SuccessfulReport
                        open={successModal}
                        setOpen={handleSuccessModal}
                        setClose={handleHideSuccessModal}
                    />
                </ModalBox>

                <Box sx={{ px: 1, py: 4 }}>
                <Box display={'flex'} gap={2} justifyContent="flex-end" marginY={2}>
                        <GlobalCustomButton type="submit">
                            View Report
                        </GlobalCustomButton>
                        <GlobalCustomButton type="submit">
                            Print Report
                        </GlobalCustomButton>
                        <GlobalCustomButton type="submit">
                            Export Report (xlxs)
                        </GlobalCustomButton>
                    </Box>
                    <Box
                        sx={{
                            py: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '70vh',
                            background: '#ebebeb',
                            borderRadius: '6px',
                        }}
                    >
                        <InfoIcon
                            sx={{ height: '40px', width: '40px', mb: 2 }}
                        />
                        <Typography sx={{ fontSize: '1rem' }}>
                            No Report Generated Yet
                        </Typography>
                    </Box>
                   
                </Box>
            </PageWrapper>
        </Box>
    )
}
