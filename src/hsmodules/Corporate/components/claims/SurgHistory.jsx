import { Box } from '@mui/system'

import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import { useForm } from 'react-hook-form'
import { Grid } from '@mui/material'
import { toast } from 'react-toastify'
import Input from '../../../../components/inputs/basic/Input'

const ClaimCreateSurgHistory = ({ setSurgHistory, closeModal }) => {
    const { register, reset, handleSubmit } = useForm()

    const handleAddSurgHistory = data => {
        const surgHistory = {
            ...data,
        }
        setSurgHistory(prev => [surgHistory, ...prev])
        toast.success('Surgical History successfully listed.')
        reset({
            type: null,
            surgHistory: null,
            code: '',
        })
    }

    return (
        <Box
            sx={{
                width: '600px',
            }}
        >
            <Grid container spacing={1} alignItems={'center'}>
                <Grid item xs={8}>
                    <Input
                        register={register('procedure')}
                        type="text"
                        label="Surgery/Procedure"
                    />
                </Grid>
                <Grid item xs={3}>
                    <Input
                        register={register('SurgYear')}
                        type="text"
                        label="Year"
                    />
                </Grid>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        mt: 2,
                    }}
                >
                    <GlobalCustomButton
                        onClick={handleSubmit(handleAddSurgHistory)}
                    >
                        Save Medication
                    </GlobalCustomButton>

                    <GlobalCustomButton color="error" onClick={closeModal}>
                        Cancel
                    </GlobalCustomButton>
                </Box>
            </Grid>
        </Box>
    )
}

export default ClaimCreateSurgHistory
