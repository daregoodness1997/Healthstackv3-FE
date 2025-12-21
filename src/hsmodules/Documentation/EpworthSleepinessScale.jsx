import { useContext, useEffect, useState } from 'react'
import {
    Box,
    FormControlLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material'
import CustomConfirmationDialog from '../../components/confirm-dialog/confirm-dialog'
import { FormsHeaderText } from '../../components/texts'
import CloseIcon from '@mui/icons-material/Close'
import { ObjectContext, UserContext } from '../../context'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import client from '../../feathers'
import Input from '../../components/inputs/basic/Input'
import GlobalCustomButton from '../../components/buttons/CustomButton'
import GroupedRadio from '../../components/inputs/basic/Radio/GroupedRadio'

const EpworthSleepinessScale = () => {
    const { state, setState, hideActionLoader, showActionLoader } =
        useContext(ObjectContext)
    const [confirmDialog, setConfirmDialog] = useState(false)

    const { register, control, handleSubmit, reset, watch, setValue } =
        useForm() //, watch, errors, reset
    const [total, setTotal] = useState(0)

    const option1 = watch('sittingAndReading')
    const option2 = watch('watchingTv')
    const option3 = watch('publicInactiveSitting')
    const option4 = watch('sittingAsPassenger')
    const option5 = watch('restInFreeTime')
    const option6 = watch('sittingAndTalking')
    const option7 = watch('sittingAfterLunchWithoutAlcohol')
    const option8 = watch('sittingInTraffic')

    // Sum the total
    useEffect(() => {
        const sum = [
            option1,
            option2,
            option3,
            option4,
            option5,
            option6,
            option7,
            option8,
        ]
            .map(val => parseInt(val || '0', 10))
            .reduce((acc, val) => acc + val, 0)

        setTotal(sum)
    }, [option1, option2, option3, option4, option5, option6, option7, option8])

    const { user } = useContext(UserContext) //,setUser
    const [docStatus, setDocStatus] = useState('Draft')

    const handleChangeStatus = async e => {
        setDocStatus(e.target.value)
    }

    let draftDoc = state.DocumentClassModule.selectedDocumentClass.document
    const ClientServ = client.service('clinicaldocument')

    const closeEncounterRight = async () => {
        let documentobj = {}
        documentobj.name = ''
        documentobj.facility = ''
        documentobj.document = ''
        //  alert("I am in draft mode : " + Clinic.documentname)
        const newDocumentClassModule = {
            selectedDocumentClass: documentobj,
            encounter_right: false,
            show: 'detail',
        }
        await setState(prevstate => ({
            ...prevstate,
            DocumentClassModule: newDocumentClassModule,
        }))
    }

    useEffect(() => {
        if (!!draftDoc && draftDoc.status === 'Draft') {
            Object.entries(draftDoc.documentdetail).map(([keys, value], i) =>
                setValue(keys, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                }),
            )
        }

        return () => {
            draftDoc = {}
        }
    }, [draftDoc])

    const onSubmit = (data, e) => {
        showActionLoader()
        //e.preventDefault();
        data.total = total

        let document = {}

        if (user.currentEmployee) {
            document.facility = user.currentEmployee.facilityDetail._id
            document.facilityname =
                user.currentEmployee.facilityDetail.facilityName // or from facility dropdown
        }
        document.documentdetail = data
        document.documentname = 'Epworth Sleepiness Scale'
        document.location =
            state.employeeLocation.locationName +
            ' ' +
            state.employeeLocation.locationType
        document.locationId = state.employeeLocation.locationId
        document.client = state.ClientModule.selectedClient._id
        document.createdBy = user._id
        document.createdByname = user.firstname + ' ' + user.lastname
        document.status = docStatus === 'Draft' ? 'Draft' : 'completed'

        document.geolocation = {
            type: 'Point',
            coordinates: [
                state.coordinates.latitude,
                state.coordinates.longitude,
            ],
        }

        // console.log(document)

        if (
            document.location === undefined ||
            !document.createdByname ||
            !document.facilityname
        ) {
            toast.error(
                'Documentation data missing, requires location and facility details',
            )
            return
        }

        //return console.log(document)

        if (!!draftDoc && draftDoc.status === 'Draft') {
            ClientServ.patch(draftDoc._id, document)
                .then(() => {
                    // e.target.reset();
                    Object.keys(data).forEach(key => {
                        data[key] = null
                    })
                    setConfirmDialog(false)
                    hideActionLoader()
                    reset(data)
                    toast.success(
                        'Epworth Sleepiness Scale updated succesfully',
                    )
                    closeEncounterRight()
                })
                .catch(err => {
                    hideActionLoader()
                    setConfirmDialog(false)
                    toast.error(
                        'Error updating Epworth Sleepiness Scale ' + err,
                    )
                })
        } else {
            ClientServ.create(document)
                .then(() => {
                    Object.keys(data).forEach(key => {
                        data[key] = null
                    })
                    hideActionLoader()
                    //e.target.reset();
                    reset(data)
                    setConfirmDialog(false)
                    toast.success(
                        'Epworth Sleepiness Scale created succesfully',
                    )
                    closeEncounterRight()
                })
                .catch(err => {
                    setConfirmDialog(false)
                    hideActionLoader()
                    toast.error(
                        'Error creating Epworth Sleepiness Scale ' + err,
                    )
                })
        }
    }

    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <CustomConfirmationDialog
                    open={confirmDialog}
                    cancelAction={() => setConfirmDialog(false)}
                    confirmationAction={handleSubmit(onSubmit)}
                    type="create"
                    message="You're about to create an Epworth Sleepiness Scale Document"
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                    mb={1}
                >
                    <FormsHeaderText text=" Epworth Sleepiness Scale" />

                    <IconButton onClick={closeEncounterRight}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <>
                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                my: 1,
                            }}
                        >
                            Rate each description according to your normal way
                            of life in recent times. Even if you have not been
                            in some of these situations recently, try to
                            determine how sleepy you would have been. Use the
                            following scale to choose the best number for each
                            situation:
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                my: 1,
                            }}
                        >
                            0 = Would never doze
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                my: 1,
                            }}
                        >
                            1 = Slight chance of dozing
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                my: 1,
                            }}
                        >
                            2 = Moderate chance of dozing
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                my: 1,
                            }}
                        >
                            3 = High chance of dozing
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                color: '#0364FF',
                                textTransform: 'uppercase',
                                my: 1,
                            }}
                        >
                            Situations and Chances of Dozing
                        </Typography>
                    </Grid>

                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'sittingAndReading'}
                                    label="Sitting and reading"
                                    options={['0', '1', '2', '3']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'watchingTv'}
                                    label="Watching TV"
                                    options={['0', '1', '2', '3']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'publicInactiveSitting'}
                                    label="Sitting inactive in a public place (e.g a theater or meeting)"
                                    options={['0', '1', '2', '3']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'sittingAsPassenger'}
                                    label="Sitting as a passenger in a car, for an hour without a break"
                                    options={['0', '1', '2', '3']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'restInFreeTime'}
                                    label="Lying down to rest in the afternoon when your schedule permits it"
                                    options={['0', '1', '2', '3']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'sittingAndTalking'}
                                    label="Sitting and talking to someone"
                                    options={['0', '1', '2', '3']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'sittingAfterLunchWithoutAlcohol'}
                                    label="Sitting quietly alter a lunch without alcohol"
                                    options={['0', '1', '2', '3']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'sittingInTraffic'}
                                    register={register('sittingInTraffic')}
                                    label="Sitting in a car, while stopped for a few minutes in the traffic"
                                    options={['0', '1', '2', '3']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <Input
                                    name="total"
                                    register={register('total')}
                                    type="number"
                                    label="Total"
                                    value={total}
                                    disabled
                                />
                            </Box>
                        </Grid>
                        <Box ml={2} mt={4}>
                            <RadioGroup
                                row
                                aria-label="document-status"
                                name="status"
                                value={docStatus}
                                onChange={handleChangeStatus}
                            >
                                <FormControlLabel
                                    value="Draft"
                                    control={<Radio {...register('status')} />}
                                    label="Draft"
                                />
                                <FormControlLabel
                                    value="Final"
                                    control={<Radio {...register('status')} />}
                                    label="Final"
                                />
                            </RadioGroup>
                        </Box>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end">
                                <GlobalCustomButton
                                    onClick={handleSubmit(onSubmit)}
                                    type="submit"
                                >
                                    Submit
                                </GlobalCustomButton>
                            </Box>
                        </Grid>
                    </Grid>
                </>
            </Box>
        </div>
    )
}

export default EpworthSleepinessScale
