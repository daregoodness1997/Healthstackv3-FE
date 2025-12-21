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
import CheckboxGroup from '../../components/inputs/basic/Checkbox/CheckBoxGroup'

const PatientConsultationForm = () => {
    const { state, setState, showActionLoader, hideActionLoader } =
        useContext(ObjectContext)
    const [confirmDialog, setConfirmDialog] = useState(false)

    const { register, handleSubmit, setValue, reset, control } = useForm() //, watch, errors, reset
    const { user } = useContext(UserContext) //,setUser
    const [docStatus, setDocStatus] = useState('Draft')

    const rosOptions = [
        {
            label: 'Chest discomfort',
            name: 'chestDiscomfort',
        },
        {
            label: 'SOB',
            name: 'SOB',
        },
        {
            label: 'Orthopnea',
            name: 'Orthopnea',
        },
        {
            label: 'PND',
            name: 'PND',
        },
        {
            label: 'Edema',
            name: 'Edema',
        },
        {
            label: 'Palpitations',
            name: 'Palpitations',
        },
        {
            label: 'Lighthead/Dizzy',
            name: 'Lighthead',
        },
        {
            label: 'Syncope',
            name: 'Syncope',
        },
        {
            label: 'Cough/Wheezing',
            name: 'Cough',
        },
        {
            label: 'Snoring',
            name: 'Snoring',
        },
        {
            label: 'Use of CPAP',
            name: 'cpap',
        },
        {
            label: 'Hemoptysis',
            name: 'Hemoptysis',
        },
        {
            label: 'Fever',
            name: 'Fever',
        },
        {
            label: 'Weight Loss/Gain',
            name: 'weightLoss',
        },
        {
            label: 'Neurological Sympt',
            name: 'neurologicalSympt',
        },
        {
            label: 'Stomach/Digestive sx',
            name: 'digestiveSx',
        },
        {
            label: 'Melena/Hematochezia',
            name: 'melena',
        },
        {
            label: 'Dry Skin/Bruising',
            name: 'drySkin',
        },
        {
            label: 'Muscle Aches',
            name: 'muscleAches',
        },
        {
            label: 'Hematuria',
            name: 'Hematuria',
        },
        {
            label: 'Trouble Hearing',
            name: 'troubleHearing',
        },
        {
            label: 'Decreased Visual Aculty',
            name: 'decreasedVisualAculty',
        },
        {
            label: 'Anxiety/Depression',
            name: 'anxiety',
        },
        {
            label: 'All Other Systems Neg',
            name: 'allOtherSystems',
        },
    ]
    const riskFactorsOptions = [
        {
            label: 'High Cholesterol',
            name: 'HighCholesterol',
        },
        {
            label: 'Low LDL',
            name: 'LowLDL',
        },
        {
            label: 'Hypertension',
            name: 'Hypertension',
        },
        {
            label: 'LVH',
            name: 'LVH',
        },
        {
            label: 'Diabetes',
            name: 'Diabetes',
        },
        {
            label: 'Family History',
            name: 'FamilyHistory',
        },
        {
            label: 'Smoker',
            name: 'Smoker',
        },
        {
            label: 'PVD',
            name: 'PVD',
        },
        {
            label: 'CRI/CRF',
            name: 'CRICRF',
        },
        {
            label: 'Diet Pill Use',
            name: 'DietPillUse',
        },
    ]
    const medicalHistoryOptions = [
        'Strokes',
        'Pneumonia',
        'Diverticulities',
        'Kidney Disease',
        'Arthritis',
        'Previous Hemmorrhage',
        'Rheumatological Disease/Lupus',
        'Kawasaki Disease',
        'Seizures',
        'Asthma',
        'Intestinal Disease',
        'Kidney Stone',
        'Head injury',
        'COPD',
        'Anemia',
        'Gastric Ulcer',
        'Gout',
        'Rheumatic Fever',
        'Cancer/Chemotherapy/Radiation',
        'Emphysema',
        'GI Bleeding',
        'Gastric Reflux',
        'Frequent Falls',
        'Hyperthyroid',
        'DVT/PE',
        'Coumadin Tx',
    ]

    const handleChangeStatus = async e => {
        setDocStatus(e.target.value)
    }

    let draftDoc = state.DocumentClassModule.selectedDocumentClass.document
    const ClientServ = client.service('clinicaldocument')

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
        document.documentname = 'Patient Consultation Form'
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
                        'Patient Consultation Form updated succesfully',
                    )
                    closeEncounterRight()
                })
                .catch(err => {
                    hideActionLoader()
                    setConfirmDialog(false)
                    toast.error(
                        'Error updating Patient Consultation Form ' + err,
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
                        'Patient Consultation Form created succesfully',
                    )
                    closeEncounterRight()
                })
                .catch(err => {
                    setConfirmDialog(false)
                    hideActionLoader()
                    toast.error(
                        'Error creating Patient Consultation Form ' + err,
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
                    message="You're about to create an Patient Consultation Form Document"
                />

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                    mb={1}
                >
                    <FormsHeaderText text=" Patient Consultation Form" />

                    <IconButton onClick={closeEncounterRight}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <>
                    <Grid item xs={12} alignItems={'center'}>
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
                        <Grid item xs={6}>
                            <Input
                                register={register('referringPhysician')}
                                type="text"
                                label="Referring Physician"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('reasonForReferral')}
                                type="text"
                                label="Reason For Referral"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                register={register('hpi')}
                                type="text"
                                label="HPI"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'surgicalClearance'}
                                    label="Surgical Procedure/Clearance"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'medicationListAttached'}
                                    label="Medication List Attached"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'ptNotTakingMeds'}
                                    label="Patient Not Taking Meds"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('allergies')}
                                type="text"
                                label="Allergies"
                            />
                        </Grid>
                    </Grid>

                    <Grid item xs={12} alignItems={'center'}>
                        <Typography
                            sx={{
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                color: '#0364FF',
                                textTransform: 'uppercase',
                                mb: 1,
                            }}
                        >
                            ROS
                        </Typography>
                    </Grid>
                    <Grid container spacing={1}>
                        {rosOptions.map((item, index) => (
                            <Grid key={index} item xs={3}>
                                <Box>
                                    <GroupedRadio
                                        control={control}
                                        name={item.name}
                                        label={item.label}
                                        options={['Yes', 'No']}
                                    />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Grid item xs={12} alignItems={'center'}>
                        <Typography
                            sx={{
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                color: '#0364FF',
                                textTransform: 'uppercase',
                                mb: 1,
                            }}
                        >
                            Risk Factors
                        </Typography>
                    </Grid>
                    <Grid container spacing={1}>
                        {riskFactorsOptions.map((item, index) => (
                            <Grid key={index} item xs={3}>
                                <Box>
                                    <GroupedRadio
                                        control={control}
                                        name={item.name}
                                        label={item.label}
                                        options={['Yes', 'No']}
                                    />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Grid item xs={12} alignItems={'center'}>
                        <Typography
                            sx={{
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                color: '#0364FF',
                                textTransform: 'uppercase',
                                mb: 1,
                            }}
                        >
                            Social History
                        </Typography>
                    </Grid>
                    <Grid container spacing={1} alignItems={'center'}>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'ETOH'}
                                    label="ETOH"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'Caffeine'}
                                    label="Caffeine"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('Hobbies')}
                                type="text"
                                label="Hobbies"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('Duration of Smoking (yrs)')}
                                type="text"
                                label="Duration of smoking (yrs) if smoker"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('exercise')}
                                type="text"
                                label="Do you exercise?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('Others')}
                                type="text"
                                label="Others"
                            />
                        </Grid>
                    </Grid>

                    <Grid item xs={12} alignItems={'center'}>
                        <Typography
                            sx={{
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                color: '#0364FF',
                                textTransform: 'uppercase',
                                my: 2,
                            }}
                        >
                            Physical Exam
                        </Typography>
                    </Grid>
                    <Grid container spacing={1} alignItems={'center'}>
                        <Grid item xs={3}>
                            <Input
                                register={register('bPSitting')}
                                type="text"
                                label="BP Sitting"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Input
                                register={register('bPStanding')}
                                type="text"
                                label="BP Standing"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Input
                                register={register('bPSupine')}
                                type="text"
                                label="BP Supine"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Input
                                register={register('HR')}
                                type="text"
                                label="HR"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Input
                                register={register('RR')}
                                type="text"
                                label="RR"
                            />
                        </Grid>
                    </Grid>

                    <Grid item xs={12} alignItems={'center'}>
                        <Typography
                            sx={{
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                color: '#0364FF',
                                textTransform: 'uppercase',
                                mt: 2,
                            }}
                        >
                            Past Medical History
                        </Typography>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                }}
                            >
                                Select all that apply
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <CheckboxGroup
                                name="pastMedicalHistory"
                                options={medicalHistoryOptions}
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                register={register('OtherMedicalHistory')}
                                type="text"
                                label="Other"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('pastCardiacHx')}
                                type="text"
                                label="Past Cardiac Hx"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('pastCardiacSurgery')}
                                type="text"
                                label="Past Cardiac Surgery"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('pastCardiacProcedure')}
                                type="text"
                                label="Past Cardiac Procedure"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('pastCardiacTesting')}
                                type="text"
                                label="Past Cardiac Testing"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('pastSurgicalHx')}
                                type="text"
                                label="Past Surgical Hx"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                register={register('OtherCardiacHistory')}
                                type="text"
                                label="Other"
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} alignItems={'center'}>
                        <Typography
                            sx={{
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                color: '#0364FF',
                                textTransform: 'uppercase',
                                mt: 2,
                            }}
                        >
                            EKG
                        </Typography>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'overallekg'}
                                    label="Overall"
                                    options={[
                                        'Well developed',
                                        'Ill Appearing',
                                        'Cachectic',
                                        'Obese',
                                    ]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'eyesekg'}
                                    label="Eyes: Conjuctiva & Lids"
                                    options={['Normal', 'Abnormal']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'enmtekg'}
                                    label="ENMT: Teeth, Gums, Palate"
                                    options={['Normal', 'Abnormal']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'oralekg'}
                                    label="Oral Mucosa"
                                    options={['Normal', 'Abnormal']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'neckekg'}
                                    label="Neck: Jugular Veins"
                                    options={['Normal', 'Abnormal']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'neckekg'}
                                    label="Neck: Jugular Veins"
                                    options={['Normal', 'Abnormal']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'neckekgBrults'}
                                    label="Neck: Brults"
                                    options={['Normal', 'Abnormal']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'respekgEffort'}
                                    label="Resp: Effort"
                                    options={['Normal', 'Abnormal']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'respekgAuscultationSound'}
                                    label="Resp: Auscultation Breath Sounds Clear"
                                    options={['Normal', 'Abnormal']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'giekgTenderness'}
                                    label="GI: Tenderness/masses"
                                    options={['Normal', 'Abnormal']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'giekgHepatosplenomegaly'}
                                    label="GI: Hepatosplenomegaly"
                                    options={['Normal', 'Abnormal']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'giekgBruits'}
                                    label="GI: Abdominal Aorta (Size, Bruits)"
                                    options={['Normal', 'Abnormal']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'msekgGalt'}
                                    label="MS: Galt"
                                    options={['Normal', 'Abnormal']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'msekgKyphosis'}
                                    label="MS: Kyphosis/Scoliosis"
                                    options={['Normal', 'Abnormal']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'skinekgXanthoma'}
                                    label="Skin: Xanthoma"
                                    options={['Normal', 'Abnormal']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'skinekgTugor'}
                                    label="MS: Tugor"
                                    options={['Good', 'Poor']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'neuroekg'}
                                    label="Neuro: A&O x 3"
                                    options={['Normal', 'Abnormal']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                register={register('cardiac')}
                                type="text"
                                label="Cardiac"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                register={register('Otherekg')}
                                type="text"
                                label="Other"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                register={register('ekgInterpretation')}
                                type="text"
                                label="EKG Interpretation"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                register={register('labDate')}
                                type="date"
                                label="Labs Date"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={1} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Input
                                register={register('Assessment')}
                                type="text"
                                label="Assessment"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid item xs={12}>
                                <Input
                                    register={register('Plan')}
                                    type="text"
                                    label="Plan"
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('testsOrdered')}
                                type="text"
                                label="Test Ordered: 2D Echocardiogram"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('carotidUltraSound')}
                                type="text"
                                label="Carotid UltraSound"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('arterialDoppler')}
                                type="text"
                                label="Arterial Doppler BLE/LLE/RLE"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('exerciseAndStress')}
                                type="text"
                                label="Exercise/Chemical Stress Cardiolyte/Myoview"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('abi')}
                                type="text"
                                label="ABI"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('Renal Doppler')}
                                type="text"
                                label="Renal Doppler"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'labs'}
                                    label="Labs"
                                    options={[
                                        'BMP',
                                        'MAG',
                                        'CBC',
                                        'PT/INR',
                                        'Fasting Lipids',
                                        'LFTs',
                                        'TSH',
                                        'T3Uptake',
                                        'T4',
                                    ]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'followUp'}
                                    label="Follow Up In"
                                    options={[
                                        '1-2 weeks',
                                        '3-4 weeks',
                                        '1-2 months',
                                        '3-4 months',
                                        '5-6 months',
                                        '7-8 months',
                                        '9-10 months',
                                        '1 year',
                                    ]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                register={register('PhysicianSignature')}
                                type="text"
                                label="Physician Signature"
                            />
                        </Grid>
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
                </>
            </Box>
        </div>
    )
}

export default PatientConsultationForm
