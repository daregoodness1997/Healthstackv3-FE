import { Box } from '@mui/system'

import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Input from '../../../../components/inputs/basic/Input'
import { Grid } from '@mui/material'

const ClaimCreateMedHistory = ({ setMedHistory, closeModal }) => {
    const { register, reset, handleSubmit } = useForm()

    const handleAddMedHistory = data => {
        const medHistory = {
            ...data,
            // _id: uuidv4(),
        }
        setMedHistory(prev => [medHistory, ...prev])
        toast.success('Medical History successfully listed.')
        reset({
            type: null,
            medHistory: null,
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
                <Grid item xs={11}>
                    <Input
                        register={register('medicalCondition')}
                        type="text"
                        label="Medical Condition"
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
                        onClick={handleSubmit(handleAddMedHistory)}
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

export default ClaimCreateMedHistory
