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
import CheckboxGroup from '../../components/inputs/basic/Checkbox/CheckBoxGroup'

const SleepStudyAuthorization = () => {
    const { state, setState, hideActionLoader, showActionLoader } =
        useContext(ObjectContext)
    const [confirmDialog, setConfirmDialog] = useState(false)

    const { register, handleSubmit, reset, setValue, control } = useForm() //, watch, errors, reset
    const { user } = useContext(UserContext) //,setUser
    const [docStatus, setDocStatus] = useState('Draft')

    let draftDoc = state.DocumentClassModule.selectedDocumentClass.document
    const ClientServ = client.service('clinicaldocument')

    const authorizations = [
        'No use of the material for educational purposes will identify me by name',
        'Tick here if you do NOT authorize use for educational purposes',
    ]

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
        document.documentname = 'Sleep Study Authorization Form'
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
                        'Sleep Study Authorization Form updated succesfully',
                    )
                    closeEncounterRight()
                })
                .catch(err => {
                    hideActionLoader()
                    setConfirmDialog(false)
                    toast.error(
                        'Error updating Sleep Study Authorization Form ' + err,
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
                        'Sleep Study Authorization Form created succesfully',
                    )
                    closeEncounterRight()
                })
                .catch(err => {
                    setConfirmDialog(false)
                    hideActionLoader()
                    toast.error(
                        'Error creating Sleep Study Authorization Form ' + err,
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
                    message="You're about to create an Sleep Study Authorization Document"
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                    mb={1}
                >
                    <FormsHeaderText text=" Sleep Study Authorization" />

                    <IconButton onClick={closeEncounterRight}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <>
                    <Grid item xs={12}>
                        <Input
                            register={register('parent')}
                            type="text"
                            label="Parent/Guardian"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                my: 1,
                            }}
                        >
                            Here by authorize TSC, or their representative, to
                            take photograph(s) and/or record audio and video. I
                            understand that such photograph(s), audio
                            recording(s) and or video recordings may be used for
                            clinical or educational purposes or in the event of
                            legal action. The sleep center and trustees of TSC
                            and its duly appointed representatives are hereby
                            released without recourse from any liability arising
                            from obtaining and using such photograph(s), audio
                            recording(s)and/or video recordings.
                        </Typography>
                    </Grid>

                    <Grid container spacing={1}>
                        <Box>
                            <CheckboxGroup
                                label=""
                                name="authorizations"
                                control={control}
                                options={authorizations}
                            />
                        </Box>

                        <Grid item xs={6}>
                            <Input
                                register={register('patientSignature')}
                                type="text"
                                label="Signature (Patient or Guardian)"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('relationship')}
                                type="text"
                                label="Relationship to Patient if Guardian"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('witness')}
                                type="text"
                                label="Witness"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('date')}
                                type="date"
                                label="Date"
                            />
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

export default SleepStudyAuthorization
