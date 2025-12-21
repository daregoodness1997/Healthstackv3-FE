import {
    Grid,
    Box,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useForm } from 'react-hook-form'
import Input from '../../components/inputs/basic/Input'
import GlobalCustomButton from '../../components/buttons/CustomButton'
import { FormsHeaderText } from '../../components/texts'
import { useState } from 'react'
import { useContext } from 'react'
import { ObjectContext, UserContext } from '../../context'
import client from '../../feathers'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import CustomConfirmationDialog from '../../components/confirm-dialog/confirm-dialog'

const NursesContinuationSheet = () => {
    const { register, handleSubmit, reset, setValue } = useForm()
    const ClientServ = client.service('clinicaldocument')
    const { user } = useContext(UserContext)
    const { state, setState, showActionLoader, hideActionLoader } =
        useContext(ObjectContext)
    const [confirmDialog, setConfirmDialog] = useState(false)

    const [docStatus, setDocStatus] = useState('Draft')

    let draftDoc = state.DocumentClassModule.selectedDocumentClass.document

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
        let document = {}

        if (user.currentEmployee) {
            document.facility = user.currentEmployee.facilityDetail._id
            document.facilityname =
                user.currentEmployee.facilityDetail.facilityName // or from facility dropdown
        }
        document.documentdetail = data
        document.documentname = 'Nurses Continuation Sheet'
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
                        'Nurses Continuation Sheet updated succesfully',
                    )
                    closeEncounterRight()
                })
                .catch(err => {
                    hideActionLoader()
                    setConfirmDialog(false)
                    toast.error(
                        'Error updating Nurses Continuation Sheet ' + err,
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
                        'Nurses Continuation Sheet created succesfully',
                    )
                    closeEncounterRight()
                })
                .catch(err => {
                    setConfirmDialog(false)
                    hideActionLoader()
                    toast.error(
                        'Error creating Nurses Continuation Sheet ' + err,
                    )
                })
        }
    }

    const handleChangeStatus = async e => {
        setDocStatus(e.target.value)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <CustomConfirmationDialog
                open={confirmDialog}
                cancelAction={() => setConfirmDialog(false)}
                confirmationAction={handleSubmit(onSubmit)}
                type="create"
                message="You're about to create Nurses Continuation Sheet Document"
            />
            <>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                    mb={1}
                >
                    <FormsHeaderText text="Nurses Continuation Sheet" />

                    <IconButton onClick={closeEncounterRight}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Input
                            label="Elimination"
                            name="elimination"
                            type="text"
                            register={register('elimination')}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Input
                            label="Activity/Exercise"
                            name="activity"
                            type="text"
                            register={register('activity')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Input
                            label="Sleep/Rest"
                            name="sleep"
                            type="text"
                            register={register('sleep')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Input
                            label="Communication/Special Senses"
                            name="communication"
                            type="text"
                            register={register('communication')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Input
                            label="Feeling About Self/Image"
                            name="selfImage"
                            type="text"
                            register={register('selfImage')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Input
                            label="Family/Social Relationship"
                            name="relationships"
                            type="text"
                            register={register('relationships')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Input
                            label="Sexuality/Reproduction"
                            name="sexuality"
                            type="text"
                            register={register('sexuality')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Input
                            label="Coping With Stress"
                            name="stressCoping"
                            type="text"
                            register={register('stressCoping')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Input
                            label="Values and Beliefs"
                            name="values"
                            type="text"
                            register={register('values')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Input
                            label="Other Information i.e (Habits)"
                            name="habits"
                            type="text"
                            register={register('habits')}
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
    )
}

export default NursesContinuationSheet
