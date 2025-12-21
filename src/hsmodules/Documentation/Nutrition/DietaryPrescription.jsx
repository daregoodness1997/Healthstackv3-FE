/* eslint-disable */
import { Box, Grid } from '@mui/material'
import GlobalCustomButton from '../../../components/buttons/CustomButton'
import { FormsHeaderText } from '../../../components/texts'
import Input from '../../../components/inputs/basic/Input'
import CheckboxGroup from '../../../components/inputs/basic/Checkbox/CheckBoxGroup'

const DietaryPrescription = ({ handleNext, register, control }) => {
    const options = [
        'Low Cholesterol',
        'Low Phosphates',
        ' Low Sodium',
        'Low Purine',
        ' Low Fibre',
        'High Fibre',
        ' Clear Fluid',
        'Full Fluid',
        'Semi Solid',
        'Soft Diet',
        'Bland Diet',
        "Children's High Nutrition Feed",
    ]
    return (
        <div className="card-content vscrollable">
            <Box>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Input
                            register={register('typeOfDiet')}
                            type="text"
                            label={'Type Of Diet'}
                        />
                    </Grid>
                    <Grid item md={6} sm={6} xs={6}>
                        <Input
                            register={register('dailyRecommendedCalorieIntake')}
                            type="text"
                            label={'Recommended (k) calorie/day'}
                        />
                    </Grid>
                    <Grid item md={6} sm={6} xs={6}>
                        <Input
                            register={register('Protein')}
                            type="text"
                            label={'Protein (g)'}
                        />
                    </Grid>
                    <Grid item md={6} sm={6} xs={6}>
                        <Input
                            register={register('OilAndFat')}
                            type="text"
                            label={'Oil/Fat (g)'}
                        />
                    </Grid>
                    <Grid item md={6} sm={6} xs={6}>
                        <Input
                            register={register('Carbohydrate')}
                            type="text"
                            label={'Carbohydrate (g)'}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ height: '40px', my: 2 }}>
                    <FormsHeaderText text="Other Dietary Modification(s) Needed" />
                </Box>

                <Grid container spacing={1}>
                    <Box>
                        <CheckboxGroup
                            label=""
                            name="otherDietaryNeeds"
                            control={control}
                            options={options}
                        />
                    </Box>
                </Grid>

                <Box
                    spacing={1}
                    sx={{
                        display: 'flex',
                        gap: '1rem',
                        position: 'right',
                        alignContent: 'center',
                        justifySelf: 'right',
                    }}
                >
                    <GlobalCustomButton
                        sx={{ marginTop: '10px', textAlign: 'right' }}
                        type="button"
                        onClick={handleNext}
                    >
                        Next
                    </GlobalCustomButton>
                </Box>
            </Box>
        </div>
    )
}

export default DietaryPrescription
