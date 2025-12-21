import { Box } from '@mui/system'

import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import { useForm } from 'react-hook-form'
import { Grid } from '@mui/material'
import { toast } from 'react-toastify'
import Input from '../../../../components/inputs/basic/Input'

const ClaimCreateAllergy = ({ setAllergy, closeModal }) => {
    const { register, reset, handleSubmit } = useForm()

    const handleAddAllergy = data => {
        const allergies = {
            ...data,
        }
        setAllergy(prev => [allergies, ...prev])
        toast.success('Allergy successfully listed.')
        reset({
            type: null,
            allergies: null,
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
                <Grid item xs={5.5}>
                    <Input
                        register={register('allergen')}
                        type="text"
                        label="Medication/Allergen"
                    />
                </Grid>
                <Grid item xs={5.5}>
                    <Input
                        register={register('allergenReaction')}
                        type="text"
                        label="Reaction"
                    />
                </Grid>
                <Box
                    sx={{
                        display: 'flex',
                        mt: 2,
                        gap: 2,
                    }}
                >
                    <GlobalCustomButton
                        onClick={handleSubmit(handleAddAllergy)}
                    >
                        Save Allergy
                    </GlobalCustomButton>

                    <GlobalCustomButton color="error" onClick={closeModal}>
                        Cancel
                    </GlobalCustomButton>
                </Box>
            </Grid>
        </Box>
    )
}

export default ClaimCreateAllergy
