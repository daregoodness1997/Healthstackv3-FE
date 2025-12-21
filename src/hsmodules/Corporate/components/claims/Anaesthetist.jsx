import { Box } from '@mui/system'

import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import { Grid } from '@mui/material'
import { toast } from 'react-toastify'
import EmployeeSearch from '../../../helpers/EmployeeSearch'
import { useState } from 'react'

const AddAnaesthetist = ({ setAnaesthetist, closeModal }) => {
    const [practioner, setPractitioner] = useState(null)

    const handleAddAnaesthetist = data => {
        const anaesthetist = {
            ...data,
        }
        setAnaesthetist(prev => [anaesthetist, ...prev])
        toast.success('Anaesthetist successfully listed.')
    }

    const handleGetPractitioner = practioner => {
        setPractitioner(practioner)
    }

    return (
        <Box
            sx={{
                width: '600px',
                pt: 2,
            }}
        >
            <Grid container spacing={1} alignItems={'center'}>
                <Grid sm={12}>
                    <EmployeeSearch getSearchfacility={handleGetPractitioner} />
                </Grid>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        mt: 2,
                    }}
                >
                    <GlobalCustomButton
                        onClick={() => handleAddAnaesthetist(practioner)}
                    >
                        Save Anaesthetist
                    </GlobalCustomButton>

                    <GlobalCustomButton color="error" onClick={closeModal}>
                        Cancel
                    </GlobalCustomButton>
                </Box>
            </Grid>
        </Box>
    )
}

export default AddAnaesthetist
