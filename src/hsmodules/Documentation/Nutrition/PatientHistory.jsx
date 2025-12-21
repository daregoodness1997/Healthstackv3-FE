/* eslint-disable */

import { Box, Grid } from '@mui/material'
import { useContext } from 'react'
import GlobalCustomButton from '../../../components/buttons/CustomButton'
import Input from '../../../components/inputs/basic/Input'
import { ObjectContext } from '../../../context'
import { format } from 'date-fns'

const PatientHistory = ({ handleNext, register }) => {
    const { state } = useContext(ObjectContext)

    console.log(state.ClientModule.selectedClient)

    const {
        firstname,
        lastname,
        middlename,
        dob,
        mrn,
        maritalstatus,
        gender,
        religion,
        profession,
    } = state.ClientModule.selectedClient

    console.log(
        firstname,
        lastname,
        middlename,
        //new Date(dob),
        format(new Date(dob), 'dd-MM-yyyy'),
        mrn,
        maritalstatus,
        gender,
    )

    return (
        <div className="card-content vscrollable">
            <Box>
                <Grid item lg={12} md={12} sm={12}>
                    <Grid container spacing={1}>
                        <Grid item sx={12} sm={6}>
                            <Input
                                register={register('Patient', {
                                    value: `${firstname} ${middlename} ${lastname}`,
                                })}
                                value={`${firstname} ${middlename} ${lastname}`}
                                type="text"
                                label=" Patient"
                                onBlur={e => {
                                    console.log(e)
                                }}
                                disabled
                            />
                        </Grid>

                        <Grid item sx={12} sm={6}>
                            <Input
                                register={register('DateOfBirth', {
                                    value: format(new Date(dob), 'dd-MM-yyyy'),
                                })}
                                type="text"
                                label="D.O.B"
                                value={format(new Date(dob), 'dd-MM-yyyy')}
                                disabled
                            />
                        </Grid>
                        <Grid item sx={12} sm={6}>
                            <Input
                                value={gender}
                                register={register('Gender', {
                                    value: gender,
                                })}
                                type="text"
                                label="Gender"
                                disabled
                            />
                        </Grid>
                        <Grid item sx={12} sm={6}>
                            <Input
                                register={register('MaritalStatus', {
                                    value: maritalstatus,
                                })}
                                type="text"
                                label="Marital Status"
                                value={maritalstatus}
                                disabled
                            />
                        </Grid>
                        <Grid item sx={12} sm={6}>
                            <Input
                                register={register('Religion', {
                                    value: religion,
                                })}
                                type="text"
                                label="Religion"
                                value={religion}
                                disabled
                            />
                        </Grid>
                        <Grid item sx={12} sm={6}>
                            <Input
                                register={register('Profession', {
                                    value: profession,
                                })}
                                type="text"
                                label="Profession"
                                value={profession}
                                disabled
                            />
                        </Grid>

                        <Grid item sx={12} sm={6}>
                            <Input
                                register={register('Tribe')}
                                type="text"
                                label="Tribe"
                            />
                        </Grid>
                        <Grid item sx={12} sm={6}>
                            <Input
                                register={register('Weight')}
                                type="text"
                                label="Weight(kg)"
                            />
                        </Grid>
                        <Grid item sx={12} sm={6}>
                            <Input
                                register={register('Height')}
                                type="text"
                                label="Height(cm)"
                            />
                        </Grid>
                        <Grid item sx={12} sm={6}>
                            <Input
                                register={register('BMI')}
                                type="text"
                                label="BMI"
                            />
                        </Grid>
                        <Grid item sx={12} sm={6}>
                            <Input
                                register={register('IBW')}
                                type="text"
                                label="IBW"
                            />
                        </Grid>
                        <Grid item sx={12} sm={6}>
                            <Input
                                register={register('PFHX')}
                                type="text"
                                label="PFHX"
                            />
                        </Grid>
                        <Grid item sx={12} sm={6}>
                            <Input
                                register={register('activityLevel')}
                                type="text"
                                label="Activity Level"
                            />
                        </Grid>
                        <Grid item sx={12} sm={6}>
                            <Input
                                register={register('insulinType')}
                                type="text"
                                label="Insulin Type"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                register={register('oralHypoglycemics')}
                                type="text"
                                label="Oral Hypoglycemics"
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

export default PatientHistory
