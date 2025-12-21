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

const PatientInstructionForSleepStudy = () => {
    const { state, setState, hideActionLoader, showActionLoader } =
        useContext(ObjectContext)
    const [confirmDialog, setConfirmDialog] = useState(false)

    const { register, handleSubmit, reset, setValue } = useForm() //, watch, errors, reset
    const { user } = useContext(UserContext) //,setUser
    const [docStatus, setDocStatus] = useState('Draft')

    let draftDoc = state.DocumentClassModule.selectedDocumentClass.document
    const ClientServ = client.service('clinicaldocument')
    const handleChangeStatus = async e => {
        setDocStatus(e.target.value)
    }

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

        let document = {}

        if (user.currentEmployee) {
            document.facility = user.currentEmployee.facilityDetail._id
            document.facilityname =
                user.currentEmployee.facilityDetail.facilityName // or from facility dropdown
        }
        document.documentdetail = data
        document.documentname = 'Patient Instruction For Sleep Study'
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
                        'Patient Instruction For Sleep Study updated succesfully',
                    )
                    closeEncounterRight()
                })
                .catch(err => {
                    hideActionLoader()
                    setConfirmDialog(false)
                    toast.error(
                        'Error updating Patient Instruction For Sleep Study ' +
                            err,
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
                        'Patient Instruction For Sleep Study created succesfully',
                    )
                    closeEncounterRight()
                })
                .catch(err => {
                    setConfirmDialog(false)
                    hideActionLoader()
                    toast.error(
                        'Error creating Patient Instruction For Sleep Study ' +
                            err,
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
                    message="You're about to create an Patient Instruction For Sleep Study Document"
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                    mb={1}
                >
                    <FormsHeaderText text=" Patient Instruction For Sleep Study" />

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
                            PLEASE FOLLOW THESE INSTRUCTIONS TO INSURE GOOD
                            CONDITIONS FOR THE STUDY
                        </Typography>
                    </Grid>

                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Input
                                register={register('name')}
                                type="text"
                                label="Name"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('date')}
                                type="date"
                                label="Study Date"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    my: 1,
                                }}
                            >
                                1. DO NOT drink any caffeinated beverages such
                                as coffee, tea, or COLAs (Coke, Pepsi, Mountain
                                Dew, Jolt etc.) after 12:00 noon on the day of
                                your study.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    my: 1,
                                }}
                            >
                                2. DO NOT drink any alcoholic beverages such as
                                beer, wine, liquors, brandy, etc. after 12:00
                                noon on the day of your study.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    my: 1,
                                }}
                            >
                                3. DO NOT take any sedatives, or sleep
                                medications on the day of your study unless
                                otherwise advised by a physician. You may take
                                regular medications for heart, blood pressure,
                                lungs or diabetes, etc., but please remember to
                                report all medications recently taken on your
                                bedtime questionnaire.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    my: 1,
                                }}
                            >
                                4. Please refrain from napping on the day of
                                your study. We want you to come inprepared to
                                sleep.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    my: 1,
                                }}
                            >
                                5. Please bathe and shampoo your hair prior to
                                arriving at the lab. DO NOT use any hair
                                conditioners, creams, oils on your hair. DO NOT
                                use any makeup, skin creams etc. on your face
                                after washing. DO NOT use nail polish. Men
                                please come in with face freshly shaven.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    my: 1,
                                }}
                            >
                                6. Bring nightclothes (pajamas, nightgowns,
                                sweat suit, bathrobe, etc., that open in front
                                if possible) and light reading material.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    my: 1,
                                }}
                            >
                                7. Bring any items you may need to wash and
                                dress in the morning.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    my: 1,
                                }}
                            >
                                8. Pillows and blankets will be provided,
                                however we suggest you bring your own for added
                                comfort.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    my: 1,
                                }}
                            >
                                9. The test is terminated at 6:00 AM-7:00 AM.
                                Please advise the technician if you need to be
                                awakened earlier, if that is your usual routine.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    my: 1,
                                }}
                            >
                                10. Try to arrange a ride both to and from the
                                testing facility, particularly if you experience
                                significant daytime sleepiness.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    my: 1,
                                }}
                            >
                                11. Report to the TSC testing facility at 22,
                                wole ariyo street. Place a call on arrival at
                                the designated location.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    my: 1,
                                }}
                            >
                                12. Please provide 48 hours advance cancellation
                                notice or a fee will be implemented. By signing
                                below you acknowledge that you have read and
                                understand the Cancellation Policy TSC sleep
                                respiratory and critical care.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    my: 1,
                                    textTransform: 'uppercase',
                                }}
                            >
                                If you have questions please call TSC at
                                07040402659, Monday through Friday, 8:00AM to
                                5:00PM; after hours and weekends you may leave a
                                message
                            </Typography>
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

export default PatientInstructionForSleepStudy
