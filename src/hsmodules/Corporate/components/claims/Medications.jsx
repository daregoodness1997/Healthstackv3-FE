import { Box } from '@mui/system'

import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import { useForm } from 'react-hook-form'
import { Checkbox, FormControlLabel, Grid, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import RadioButton from '../../../../components/inputs/basic/Radio'
import Input from '../../../../components/inputs/basic/Input'

const ClaimCreateMedications = ({ setMedications, closeModal }) => {
    const { control, register, reset, handleSubmit, watch, setValue } =
        useForm()

    const handleAddMedication = data => {
        const medications = {
            ...data,
            // _id: uuidv4(),
        }
        setMedications(prev => [medications, ...prev])
        toast.success('Medications successfully listed.')
        reset({
            type: null,
            medications: null,
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
                <Grid item xs={12}>
                    <Input
                        register={register('Medication Date')}
                        type="date"
                        label="Medication Date"
                        sx={{
                            mb: 2,
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Input
                        register={register('medicationName')}
                        type="text"
                        label="Medication Name"
                    />
                </Grid>
                <Grid item xs={3}>
                    <Input
                        register={register('medicationDosage')}
                        type="text"
                        label="Dosage"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Input
                        register={register('medicationInstructions')}
                        type="text"
                        label="Instructions (No of times a day)"
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
                        onClick={handleSubmit(handleAddMedication)}
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

export default ClaimCreateMedications
