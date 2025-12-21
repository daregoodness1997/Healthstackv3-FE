/* eslint-disable */
import { Box, Grid } from '@mui/material'
import Textarea from '../../../components/inputs/basic/Textarea'

const NAndDRequestForm = ({ register }) => {
    return (
        <div className="card-content vscrollable">
            <Box>
                <Grid item lg={12} md={12} sm={12}>
                    <Grid container spacing={1}>
                        <Grid item md={12} sm={12} xs={12}>
                            <Textarea
                                register={register(
                                    'NutritionAndDieteticsAssessment',
                                )}
                                type="text"
                                label="Nutrition And Dietetics Assessment"
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Textarea
                                register={register(
                                    'NutritionAndDieteticsDiagnosis',
                                )}
                                type="text"
                                label="Nutrition And Dietetics Diagnosis"
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Textarea
                                register={register(
                                    'NutritionAndDieteticsIntervention',
                                )}
                                type="text"
                                label="Nutrition And Dietetics Intervention"
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Textarea
                                register={register('MonitoringAndEvaluation')}
                                type="text"
                                label="Monitoring And Evaluation"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default NAndDRequestForm
