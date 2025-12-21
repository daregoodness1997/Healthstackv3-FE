import { Box } from '@mui/system'

import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import { Grid } from '@mui/material'
import { toast } from 'react-toastify'
import EmployeeSearch from '../../../helpers/EmployeeSearch'
import { useState } from 'react'

const AddSurgeon = ({ setSurgeon, closeModal }) => {
    const [practioner, setPractitioner] = useState(null)

    const handleAddSurgeon = data => {
        const surgeon = {
            ...data,
        }
        setSurgeon(prev => [surgeon, ...prev])
        toast.success('Surgeon successfully listed.')
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
                        onClick={() => handleAddSurgeon(practioner)}
                    >
                        Save Surgeon
                    </GlobalCustomButton>

                    <GlobalCustomButton color="error" onClick={closeModal}>
                        Cancel
                    </GlobalCustomButton>
                </Box>
            </Grid>
        </Box>
    )
}

export default AddSurgeon
