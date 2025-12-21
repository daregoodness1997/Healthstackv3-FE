import { Box } from '@mui/system'

import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import { useForm } from 'react-hook-form'
import { Checkbox, FormControlLabel, Grid, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import RadioButton from '../../../../components/inputs/basic/Radio'
import Input from '../../../../components/inputs/basic/Input'

const ClaimCreateStudy = ({ setStudy, closeModal }) => {
    const { control, register, reset, handleSubmit, watch, setValue } =
        useForm()

    const handleAddStudy = data => {
        const study = {
            ...data,
            // _id: uuidv4(),
        }
        setStudy(prev => [study, ...prev])
        toast.success('Study successfully listed.')
        reset({
            type: null,
            study: null,
            code: '',
        })
    }

    return (
        <Box
            sx={{
                width: '600px',
            }}
        >
            <Grid item xs={12}>
                <Input
                    register={register('studyDate')}
                    type="date"
                    label="Study Date"
                />
            </Grid>
            <Grid container spacing={1} alignItems={'center'}>
                <Grid item xs={12}>
                    <Typography
                        sx={{
                            fontSize: '0.9rem',
                            my: 1,
                        }}
                    >
                        Select the boxes when you think you were sleeping
                    </Typography>
                </Grid>

                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('am12')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                12am
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('am1')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                1am
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('am2')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                2am
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('am3')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                3am
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('am4')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                4am
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('am5')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                5am
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('am6')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                6am
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('am7')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                7am
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('am8')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                8am
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('am9')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                9am
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('am10')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                10am
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('am11')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                11am
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('pm12')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                12pm
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('pm1')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                1pm
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('pm2')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                2pm
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('pm3')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                3pm
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('pm4')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                4pm
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('pm5')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                5pm
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('pm6')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                6pm
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('pm7')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                7pm
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('pm8')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                8pm
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('pm9')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                9pm
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('pm10')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                10pm
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <FormControlLabel
                        control={<Checkbox {...register('pm11')} />}
                        label={
                            <Typography sx={{ fontSize: '0.8rem' }}>
                                11pm
                            </Typography>
                        }
                    />
                </Grid>

                <Grid item xs={12}>
                    <Box>
                        <RadioButton
                            register={register('morningFeeling')}
                            title="How rested did you feel in the morning on a scale of 1-7, 1 being the most rested"
                            options={['1', '2', '3', '4', '5', '6', '7']}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box>
                        <RadioButton
                            register={register('eveningFeeling')}
                            title="How sleepy did you feel in the evening on a scale of 1-7, 7 being the most evening"
                            options={['1', '2', '3', '4', '5', '6', '7']}
                        />
                    </Box>
                </Grid>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                    }}
                >
                    <GlobalCustomButton onClick={handleSubmit(handleAddStudy)}>
                        Save Study
                    </GlobalCustomButton>

                    <GlobalCustomButton color="error" onClick={closeModal}>
                        Cancel
                    </GlobalCustomButton>
                </Box>
            </Grid>
        </Box>
    )
}

export default ClaimCreateStudy
