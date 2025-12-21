import { Box } from '@mui/system'

import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import { useForm } from 'react-hook-form'
import { Grid } from '@mui/material'
import { toast } from 'react-toastify'
import Input from '../../../../components/inputs/basic/Input'

const ClaimCreateHospt = ({ setHospt, closeModal }) => {
    const { register, reset, handleSubmit } = useForm()

    const handleAddHospt = data => {
        const hospt = {
            ...data,
        }
        setHospt(prev => [hospt, ...prev])
        toast.success('Hospitalization successfully listed.')
        reset({
            type: null,
            hospt: null,
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
                        register={register('hospt')}
                        type="text"
                        label="Hospitalization"
                    />
                </Grid>
                <Grid item xs={3}>
                    <Input
                        register={register('HosptYear')}
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
                    <GlobalCustomButton onClick={handleSubmit(handleAddHospt)}>
                        Save Hospitalization
                    </GlobalCustomButton>

                    <GlobalCustomButton color="error" onClick={closeModal}>
                        Cancel
                    </GlobalCustomButton>
                </Box>
            </Grid>
        </Box>
    )
}

export default ClaimCreateHospt
