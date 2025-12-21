import { useContext, useState, useEffect } from 'react'
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
import GroupedRadio from '../../components/inputs/basic/Radio/GroupedRadio'

const PrivacyAndPolicy = () => {
    const { state, setState, hideActionLoader, showActionLoader } =
        useContext(ObjectContext)
    const [confirmDialog, setConfirmDialog] = useState(false)

    const { register, handleSubmit, reset, control, setValue } = useForm() //, watch, errors, reset
    const { user } = useContext(UserContext) //,setUser
    const [docStatus, setDocStatus] = useState('Draft')

    const handleChangeStatus = async e => {
        setDocStatus(e.target.value)
    }
    let draftDoc = state.DocumentClassModule.selectedDocumentClass.document
    const ClientServ = client.service('clinicaldocument')

    const acknowledgement = [
        'Individual refused to sign',
        'Communication barriers prohibiting obtaining the acknowledgment',
        'In emergency situation prevented us from obtaining acknowledgement',
    ]

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
        document.documentname = 'Privacy and Policies'
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
                    toast.success('Privacy and Policies updated succesfully')
                    closeEncounterRight()
                })
                .catch(err => {
                    hideActionLoader()
                    setConfirmDialog(false)
                    toast.error('Error updating Privacy and Policies ' + err)
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
                    toast.success('Privacy and Policies created succesfully')
                    closeEncounterRight()
                })
                .catch(err => {
                    setConfirmDialog(false)
                    hideActionLoader()
                    toast.error('Error creating Privacy and Policies ' + err)
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
                    message="You're about to create an Privacy and Policies Document"
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                    mb={1}
                >
                    <FormsHeaderText text="ACKNOWLEDGEMENTS (HIPAA PRIVACY PRACTICES & OFFICE POLICIES)" />

                    <IconButton onClick={closeEncounterRight}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                NOTICE OF PRIVACY PRACTICES
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    my: 1,
                                }}
                            >
                                I acknowledge that I have received the Notice of
                                Privacy Practices and have been provided an
                                opportunity to review it. facilities or
                                unauthorized physicians.
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    my: 1,
                                }}
                            >
                                We attempted to obtain written acknowledgment of
                                receipt of Notice of Privacy Practices, but
                                acknowledgment could not be obtained because:
                            </Typography>
                        </Grid>
                        <Box>
                            <CheckboxGroup
                                label=""
                                name="acknowledgement"
                                control={control}
                                options={acknowledgement}
                            />
                        </Box>

                        <Grid item xs={12}>
                            <Input
                                register={register('other')}
                                type="text"
                                label="Other"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    my: 1,
                                }}
                            >
                                NOTICE TO CONSUMERS: Medical doctors are
                                licensed and regulated by the Medical Board of
                                CA, 800-633-3233, www.mbc.ca.gov
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                MISSED APPOINTMENTS
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    my: 1,
                                }}
                            >
                                I understand that missed appointments or
                                appointments cancelled less than 24 hours in
                                advance WILL result in a $50 charge for office
                                visits and a $500 charge for sleep studies. I
                                agree to pay for these charges accordingly.
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                E-Prescribing PBM Consent
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    my: 1,
                                }}
                            >
                                In the interest of improving quality of care,
                                this office utilizes an electronic prescribing
                                (e-prescribing) system to best send accurate
                                prescriptions directly to pharmacies. The
                                Medicare Modernization Act of 2003 lists
                                standards that must be included as part of the
                                e-prescribing program. These include Formulary
                                and Benefit Transactions – giving prescribers
                                information about which medications are covered
                                under a particular benefits plan & Medication
                                History Transactions- giving the provider access
                                to information about medications the patient has
                                been prescribed currently or previously by any
                                provider in order to minimize the number of
                                adverse drug events. This information is
                                maintained by third party administrators know as
                                Pharmacy Benefits Managers (PBM). PBM’s primary
                                responsibilities are processing and paying
                                prescription drug claims as well as developing
                                and maintaining prescription formularies for
                                pharmacy benefits plans. By signing below, you
                                understand the office of Dr. Jeffrey R. Polito
                                utilizes an e-prescribing system and agree that
                                our office can request and use your prescription
                                medication history from other healthcare
                                providers and/or third party PBM payers for
                                treatment purposes.
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                PERMISSION
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    my: 1,
                                }}
                            >
                                I give permission for Jeffrey R. Polito, M.D.
                                and his staff to speak with the following people
                                regarding my medical problems and/or diagnostic
                                results related to my case. I have the right to
                                revoke this consent in writing at any time.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    mb: 1,
                                }}
                            >
                                Specified Individuals
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('specifiedPersonOneName')}
                                type="text"
                                label="1. Name"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register(
                                    'specifiedPersonOneRelationship',
                                )}
                                type="text"
                                label="Relationship"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('specifiedPersonTwoName')}
                                type="text"
                                label="2. Name"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('signature')}
                                type="text"
                                label="Signature"
                            />
                            <label>
                                (Signature of patient or parent/guardian if
                                minor)
                            </label>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('date')}
                                type="date"
                                label="Date"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register(
                                    'specifiedPersonTwoRelationship',
                                )}
                                type="text"
                                label="Relationship"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    name={'voicemailPermission'}
                                    control={control}
                                    label=" I give permission for the office to leave a
                                message regarding my medical case on my personal
                                voicemail:"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={6}>
                            <Input
                                register={register('name')}
                                type="text"
                                label="Print Name"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Input
                                register={register('signature')}
                                type="text"
                                label="Signature"
                            />
                        </Grid>
                        <Grid item xs={3}>
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

export default PrivacyAndPolicy
