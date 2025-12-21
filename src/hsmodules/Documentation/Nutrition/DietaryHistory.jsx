/* eslint-disable */
import { Box, Grid } from '@mui/material'
import GlobalCustomButton from '../../../components/buttons/CustomButton'
import Textarea from '../../../components/inputs/basic/Textarea'

const DietaryHistory = ({ handleNext, register }) => {
    return (
        <div className="card-content vscrollable">
            <Box>
                <Grid item lg={12} md={12} sm={12}>
                    <Grid container spacing={1}>
                        <Grid item md={12} sm={12} xs={12}>
                            <Textarea
                                register={register('Breakfast')}
                                type="text"
                                label={'Breakfast'}
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Textarea
                                register={register('Lunch')}
                                type="text"
                                label={'Lunch'}
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Textarea
                                register={register('Snacks')}
                                type="text"
                                label={'Snacks'}
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Textarea
                                register={register('Dinner')}
                                type="text"
                                label={'Dinner'}
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Textarea
                                register={register('Soups')}
                                type="text"
                                label={'Soups'}
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Textarea
                                register={register('Vegetables')}
                                type="text"
                                label={'Vegetables'}
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Textarea
                                register={register('Meat')}
                                type="text"
                                label={'Meat'}
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Textarea
                                register={register('Fruits')}
                                type="text"
                                label={'Fruits'}
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Textarea
                                register={register('Oils')}
                                type="text"
                                label={'Oils'}
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Textarea
                                register={register('Plan')}
                                type="text"
                                label={'Plan'}
                            />
                        </Grid>
                    </Grid>
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

export default DietaryHistory
