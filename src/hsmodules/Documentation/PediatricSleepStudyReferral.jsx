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
import GroupedRadio from '../../components/inputs/basic/Radio/GroupedRadio'

const PediatricSleepStudyReferral = () => {
    const { state, setState, showActionLoader, hideActionLoader } =
        useContext(ObjectContext)
    const [confirmDialog, setConfirmDialog] = useState(false)
    const { register, handleSubmit, setValue, reset, control } = useForm() //, watch, errors, reset
    const { user } = useContext(UserContext) //,setUser
    const [docStatus, setDocStatus] = useState('Draft')

    const handleChangeStatus = async e => {
        setDocStatus(e.target.value)
    }

    let draftDoc = state.DocumentClassModule.selectedDocumentClass.document
    const ClientServ = client.service('clinicaldocument')

    const instructionsForStudy = [
        'Obstructive sleep apnea',
        'Central sleep apnea',
        'Hypoventilation',
        'Obesity',
        'Insomnia',
        'Narcolepsy',
        'Hypoxemia',
    ]

    const medicalHistory = [
        'Asthma',
        'Enlarged Tonsils',
        'Deviated septum',
        'Gastroesophogeal Reflux',
        'Allergies',
        'Enlarged Aadenoids',
        'Nasal Obstruction',
        'Craniofacial Malformation',
        'Obesity',
        'Previous T&A?',
        'Enlarged Tongue',
        'Seizures',
        'Cardiac Problems',
        'Nasal polyps',
        'Diabetes',
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

    const onSubmit = data => {
        showActionLoader()
        //e.preventDefault();

        let document = {}

        if (user.currentEmployee) {
            document.facility = user.currentEmployee.facilityDetail._id
            document.facilityname =
                user.currentEmployee.facilityDetail.facilityName // or from facility dropdown
        }
        document.documentdetail = data
        document.documentname = 'Pediatric Sleep Study Referral Form'
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
                        'Pediatric Sleep Study Referral Form updated succesfully',
                    )
                    closeEncounterRight()
                })
                .catch(err => {
                    hideActionLoader()
                    setConfirmDialog(false)
                    toast.error(
                        'Error updating Pediatric Sleep Study Referral Form ' +
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
                        'Pediatric Sleep Study Referral Form created succesfully',
                    )
                    closeEncounterRight()
                })
                .catch(err => {
                    setConfirmDialog(false)
                    hideActionLoader()
                    toast.error(
                        'Error creating Pediatric Sleep Study Referral Form ' +
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
                    message="You're about to create an Pediatric Sleep Study Referral Form Document"
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                    mb={1}
                >
                    <FormsHeaderText text="PEDIATRIC SLEEP STUDY REFERRAL FORM" />

                    <IconButton onClick={closeEncounterRight}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <>
                    {/* Patient Info  */}
                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                color: '#0364FF',
                                textTransform: 'uppercase',
                                mb: 1,
                            }}
                        >
                            Client Details
                        </Typography>
                    </Grid>

                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Input
                                register={register('Diagnosis')}
                                type="text"
                                label="Diagnosis"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('pcpName')}
                                type="text"
                                label="PCP Name"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('pcpPhone')}
                                type="text"
                                label="PCP Phone"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('EmergencyContact')}
                                type="text"
                                label="Emergency Contact"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('ParentName')}
                                type="text"
                                label="Parent/Guardian Name"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('ParentDOB')}
                                type="date"
                                label="Parent/Guardian  DOB"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('ParentPhone')}
                                type="text"
                                label="Parent Phone"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('AdditionalContact')}
                                type="text"
                                label="Additional Contact"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('AdditionalContactPhone')}
                                type="text"
                                label="Additional Contact Phone"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    color: '#0364FF',
                                    textTransform: 'uppercase',
                                    mb: 1,
                                }}
                            >
                                Health Insurance Information
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Input
                                register={register('insuranceCompany')}
                                type="text"
                                label="Insurance Company"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('insuranceID')}
                                type="text"
                                label="Insurance ID"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('insuranceGroup')}
                                type="text"
                                label="Insurance Group"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('insurancePhone')}
                                type="text"
                                label="Insurance Phone"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('insuranceName')}
                                type="text"
                                label="Insured Name"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('insuranceCardFront')}
                                type="file"
                                label="Copy of Patient's insurance card (front)"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('insuranceCardBack')}
                                type="file"
                                label="Copy of Patient's insurance card (back)"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                register={register('ProgressNotes')}
                                type="text"
                                label="Progress Notes"
                            />
                        </Grid>

                        {/* Physician Info  */}
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
                                REFERRING PHYSICIAN INFORMATION
                            </Typography>
                        </Grid>

                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Input
                                    register={register(
                                        'referringPhysicianName',
                                    )}
                                    type="text"
                                    label="Name"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Input
                                    register={register(
                                        'referringPhysicianPhone',
                                    )}
                                    type="number"
                                    label="Phone"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Input
                                    register={register('referringPhysicianFax')}
                                    type="number"
                                    label="Fax"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Input
                                    register={register(
                                        'referringPhysicianAddress',
                                    )}
                                    type="text"
                                    label="Address"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Input
                                    register={register(
                                        'referringPhysicianCity',
                                    )}
                                    type="text"
                                    label="City"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Input
                                    register={register(
                                        'referringPhysicianState',
                                    )}
                                    type="text"
                                    label="State"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Input
                                    register={register('referringPhysicianZip')}
                                    type="number"
                                    label="Zip"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Input
                                    register={register(
                                        'referringPhysicianSignature',
                                    )}
                                    type="text"
                                    label="Signature"
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    color: '#0364FF',
                                    textTransform: 'uppercase',
                                    mb: 1,
                                }}
                            >
                                INSTRUCTION for study
                            </Typography>
                        </Grid>

                        <Box>
                            <CheckboxGroup
                                label=""
                                name="instructionsForStudy"
                                control={control}
                                options={instructionsForStudy}
                            />
                        </Box>

                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    color: '#0364FF',
                                    textTransform: 'uppercase',
                                    mb: 1,
                                }}
                            >
                                INSTRUCTIONS
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    name="specialistAppointment"
                                    label="Would you like the patient to be seen by a Pediatric Sleep Specialist at The Pediatric Sleep Disorders Center prior to the sleep study?   "
                                    options={['Yes', 'No']}
                                    control={control}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Sleep Services  */}
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
                            Sleep History
                        </Typography>
                    </Grid>

                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <label>Does, or has, the patient: </label>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    name={'Snoring'}
                                    control={control}
                                    label="Snore excessively more than 3 nights a week?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    name={'BreathingPauses'}
                                    label="Been observed to stop breathing or have pauses in breathing during sleep?"
                                    control={control}
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    name={'GaspAndChoke'}
                                    label="Awaken with gasping, choking, dry mouth or throat?"
                                    control={control}
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    name={'MouthBreather'}
                                    label="Tend to be a “mouth breather?"
                                    control={control}
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    name={'BedWet'}
                                    label="Occasionally wets the bed (for children 3 and older)?"
                                    control={control}
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    name={'DayTiredness'}
                                    label="Feel sleepy or fatigued during the day?"
                                    options={['Yes', 'No']}
                                    control={control}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    name={'PoorSchoolPerformance'}
                                    label="Have poor school performance?"
                                    control={control}
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    name={'HyperActive'}
                                    label="Have hyperactivity or is inattentive?"
                                    control={control}
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    name={'MorningHeadaches'}
                                    label="Suffers from morning headaches?"
                                    control={control}
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    name={'RestlessLimbs'}
                                    label="Experience a restless sensation in arms or legs during sleep or in the evening?"
                                    control={control}
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'KickInSleep'}
                                    label="Been told that they make kicking movements during sleep?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'DifficultySleeping'}
                                    label="Have difficulty falling asleep at the beginning of the night?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'DifficultyStayingAwake'}
                                    label="Have difficulty staying awake during the day?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    name="LossOfStrengthOnWaking"
                                    control={control}
                                    label="Have sudden loss of strength in arms or legs while awake? (Induced by strong emotion)"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    name={'PreviousStudy'}
                                    control={control}
                                    label="Had a previous sleep study?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('previousStudyDetails')}
                                type="text"
                                label="If so, when and where?"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                register={register('durationToSleep')}
                                type="text"
                                label="How long does it typically take the patient to fall asleep?"
                            />
                        </Grid>
                    </Grid>

                    {/* Medical History */}
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
                            Medical History
                        </Typography>
                    </Grid>

                    <Grid container spacing={1}>
                        <Box>
                            <CheckboxGroup
                                label=""
                                name="medicalHistory"
                                control={control}
                                options={medicalHistory}
                            />
                        </Box>
                        <Grid item xs={12}>
                            <Input
                                register={register('medications')}
                                type="text"
                                label="Medications"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <label>
                                I AUTHORIZE LAB TO PERFORM SLEEP STUDIES ON
                                ABOVE PATIENT ACCORDING TO THEIR PROTOCOLS,
                                INCLUDING URGENT INITIATION OF O2 & CPAP.
                            </label>
                        </Grid>
                        <Grid item xs={4}>
                            <Input
                                register={register('PhysicianPrint')}
                                type="text"
                                label="Physician (Print)"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Input
                                register={register('PhysicianSign')}
                                type="text"
                                label="Signature"
                            />
                        </Grid>
                        <Grid item xs={4}>
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

export default PediatricSleepStudyReferral
