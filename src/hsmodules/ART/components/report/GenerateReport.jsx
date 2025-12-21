import { Box, Grid } from '@mui/material'
import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import { ClientSearch } from '../../../helpers/ClientSearch'
import Input from '../../../../components/inputs/basic/Input'
import CustomSelect from '../../../../components/inputs/basic/Select'

const GenerateReport = ({ open, setOpen, setClose }) => {
    return (
        <Box
            sx={{
                width: '50vw',
            }}
        >
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <GlobalCustomButton type="submit" onClick={setClose}>
                    Generate
                </GlobalCustomButton>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <CustomSelect
                        name="procedure"
                        label="Procedure"
                        options={[
                            'IVF',
                            'Appendectomy',
                            'Endoscopy',
                            'CABG',
                            'Cataract Surgery',
                        ]}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <CustomSelect
                        name="medication"
                        label="Medication"
                        options={['Paracetamol', 'Aspirin']}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <CustomSelect
                        name="lab-test"
                        label="Lab Test"
                        options={[
                            'CBC',
                            'Lipid Panel',
                            'BMP',
                            'LFT',
                            'Urinalysis',
                        ]}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input label="Start Date" name="startDate" type="date" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input label="End Date" name="endDate" type="date" />
                </Grid>
            </Grid>
        </Box>
    )
}

export default GenerateReport
