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
import RadioButton from '../../components/inputs/basic/Radio'
import GlobalCustomButton from '../../components/buttons/CustomButton'
import GroupedRadio from '../../components/inputs/basic/Radio/GroupedRadio'

const FatigueSeverityScale = () => {
    const { state, setState, showActionLoader, hideActionLoader } =
        useContext(ObjectContext)
    const [confirmDialog, setConfirmDialog] = useState(false)

    const { register, handleSubmit, reset, watch, setValue, control } =
        useForm()
    const [total, setTotal] = useState(0)

    const { user } = useContext(UserContext) //,setUser
    const [docStatus, setDocStatus] = useState('Draft')

    const handleChangeStatus = async e => {
        setDocStatus(e.target.value)
    }

    const option1 = watch('motivation')
    const option2 = watch('exercise')
    const option3 = watch('easilyFatigued')
    const option4 = watch('physicalFunctioning')
    const option5 = watch('frequentProblems')
    const option6 = watch('sustainedPhysicalFunction')
    const option7 = watch('responsibilities')
    const option8 = watch('disablingSymptoms')
    const option9 = watch('workAndFamily')

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
            option9,
        ]
            .map(val => parseInt(val || '0', 10))
            .reduce((acc, val) => acc + val, 0)
        setTotal(sum)
    }, [
        option1,
        option2,
        option3,
        option4,
        option5,
        option6,
        option7,
        option8,
        option9,
    ])

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
        data.total = total
        showActionLoader()
        //e.preventDefault();

        let document = {}

        if (user.currentEmployee) {
            document.facility = user.currentEmployee.facilityDetail._id
            document.facilityname =
                user.currentEmployee.facilityDetail.facilityName // or from facility dropdown
        }
        document.documentdetail = data
        document.documentname = 'Fatigue Severity Scale'
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
                    toast.success('Fatigue Severity Scale updated succesfully')
                    closeEncounterRight()
                })
                .catch(err => {
                    hideActionLoader()
                    setConfirmDialog(false)
                    toast.error('Error updating Fatigue Severity Scale ' + err)
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
                    toast.success('Fatigue Severity Scale created succesfully')
                    closeEncounterRight()
                })
                .catch(err => {
                    setConfirmDialog(false)
                    hideActionLoader()
                    toast.error('Error creating Fatigue Severity Scale ' + err)
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
                    message="You're about to create an Fatigue Severity Scale Document"
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                    mb={1}
                >
                    <FormsHeaderText text=" Fatigue Severity Scale" />

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
                            Rate the following on a scale of 1 to 7. A “1”
                            meaning “completely disagree” and a “7” meaning
                            “completely agree.”
                        </Typography>
                    </Grid>

                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'motivation'}
                                    label="My motivation is lower when I am fatigued"
                                    options={[
                                        '0',
                                        '1',
                                        '2',
                                        '3',
                                        '4',
                                        '5',
                                        '6',
                                        '7',
                                    ]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'exercise'}
                                    label="Exercise brings on my fatigue  "
                                    options={[
                                        '0',
                                        '1',
                                        '2',
                                        '3',
                                        '4',
                                        '5',
                                        '6',
                                        '7',
                                    ]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'easilyFatigued'}
                                    label="I am easily fatigued"
                                    options={[
                                        '0',
                                        '1',
                                        '2',
                                        '3',
                                        '4',
                                        '5',
                                        '6',
                                        '7',
                                    ]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'physicalFunctioning'}
                                    label="Fatigue interferes with my physical functioning "
                                    options={[
                                        '0',
                                        '1',
                                        '2',
                                        '3',
                                        '4',
                                        '5',
                                        '6',
                                        '7',
                                    ]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'frequentProblems'}
                                    label="Fatigue causes frequent problems for me "
                                    options={[
                                        '0',
                                        '1',
                                        '2',
                                        '3',
                                        '4',
                                        '5',
                                        '6',
                                        '7',
                                    ]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'sustainedPhysicalFunction'}
                                    label="My fatigue prevents sustained physical function"
                                    options={[
                                        '0',
                                        '1',
                                        '2',
                                        '3',
                                        '4',
                                        '5',
                                        '6',
                                        '7',
                                    ]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'responsibilities'}
                                    label="Fatigue interferes with carrying out my responsibilities"
                                    options={[
                                        '0',
                                        '1',
                                        '2',
                                        '3',
                                        '4',
                                        '5',
                                        '6',
                                        '7',
                                    ]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'disablingSymptoms'}
                                    label="Fatigue is among my three most disabling symptoms"
                                    options={[
                                        '0',
                                        '1',
                                        '2',
                                        '3',
                                        '4',
                                        '5',
                                        '6',
                                        '7',
                                    ]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'workAndFamily'}
                                    label="Fatigue interferes with my work, family and social life"
                                    options={[
                                        '0',
                                        '1',
                                        '2',
                                        '3',
                                        '4',
                                        '5',
                                        '6',
                                        '7',
                                    ]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <Input
                                    name="total"
                                    type="text"
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

export default FatigueSeverityScale
