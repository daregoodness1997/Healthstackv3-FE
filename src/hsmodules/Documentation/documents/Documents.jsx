/* eslint-disable react/display-name */
import { Box, Grid, Typography } from '@mui/material'
import { forwardRef } from 'react'
import dayjs from 'dayjs'
import CustomTable from '../../../components/customtable'
import { FormsHeaderText } from '../../../components/texts'
import {
    AdmissionOrderPrintOut,
    AdultQuestionnairePrintOut,
    AgonistProtocolPrintOut,
    AntagonistProtocolPrintOut,
    LaboratoryTreatmentPrintOut,
    BilledOrdersPrintOut,
    DischargeOrderPrintOut,
    IntrauterineInseminationPrintOut,
    LaboratoryOrdersPrintOut,
    MedicationListPrintOut,
    PediatricPulmonologyList,
    PrescriptionPrintOut,
    RadiologyOrdersPrintOut,
    RecipientTreatmentPrintOut,
    TreatmentSummaryPrintOut,
    FemaleHistoryListPrintOut,
    LaboratoryResultsPrintOut,
    PregnancyAssessmentPrintOut,
    ObstetricsAssessmentPrintOut,
    HeamodialysisNursingPrintOut,
    SleepMedicineReferralFormPrintOut,
    PediatricSleepStudyReferralFormPrintOut,
    EpworthSleepinessScalePrintOut,
    SleepStudyAuthorizationPrintOut,
    PatientInstructionForSleepStudyPrintOut,
    InsuranceDetailsPrintOut,
    PrivacyAndPolicyPrintOut,
    FatigueSeverityScalePrintOut,
    SleepQuestionnairePrintOut,
    SleepQuestionnaireForSpousePrintOut,
    WeeklySleepLogPrintOut,
    SleepHistoryAndIntakePrintOut,
    NursesContinuationSheetPrintOut,
    TheatreOrderPrintOut,
    NutritionAndDieteticsRequestFormPrintOut,
} from '../print-outs/Print-Outs'
import client from '../../../feathers'

export const AdmissionOrderDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail
    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <AdmissionOrderPrintOut data={data} Clinic={Clinic} ref={ref} />
            </Box>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex' }}>
                            <Typography
                                sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#023047',
                                    marginRight: '5px',
                                }}
                            >
                                Admit To:
                            </Typography>

                            <Typography
                                sx={{ fontSize: '0.75rem', color: '#000000' }}
                            >
                                {data.ward?.name || data.ward}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex' }}>
                            <Typography
                                sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#023047',
                                    marginRight: '5px',
                                }}
                            >
                                Instructions:
                            </Typography>

                            <Typography
                                sx={{ fontSize: '0.75rem', color: '#000000' }}
                            >
                                {data.instruction}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
})

export const DischargeOrderComponent = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail
    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <DischargeOrderPrintOut data={data} ref={ref} Clinic={Clinic} />
            </Box>

            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex' }}>
                            <Typography
                                sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#03045e',
                                    marginRight: '5px',
                                }}
                            >
                                Discharge From:
                            </Typography>

                            <Typography
                                sx={{ fontSize: '0.75rem', color: '#000000' }}
                            >
                                {data.ward?.name || data.ward}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex' }}>
                            <Typography
                                sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#03045e',
                                    marginRight: '5px',
                                }}
                            >
                                Instructions:
                            </Typography>

                            <Typography
                                sx={{ fontSize: '0.75rem', color: '#000000' }}
                            >
                                {data.instruction
                                    ? data.instruction
                                    : '________________________'}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
})

export const SleepMedicineReferralFormListDocument = forwardRef(
    ({ Clinic }, ref) => {
        const data = Clinic?.documentdetail

        return (
            <div
                className={
                    Clinic.show
                        ? 'card-content p-1'
                        : 'card-content p-1 is-hidden'
                }
            >
                <Box sx={{ display: 'none' }}>
                    <SleepMedicineReferralFormPrintOut
                        ref={ref}
                        data={data}
                        Clinic={Clinic}
                    />
                </Box>

                <Box
                    sx={{
                        backgroundColor: '#f5f5f5',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                    }}
                >
                    <Grid container spacing={3}>
                        {[
                            { label: 'Primary', value: data.primary },
                            {
                                label: 'Id Number',
                                value: data.primaryId || '',
                            },
                            {
                                label: 'Authorization Number',
                                value: data.primaryAuthNo || '',
                            },
                            { label: 'Secondary', value: data.secondary },
                            {
                                label: 'Id Number',
                                value: data.secondaryId || '',
                            },
                            {
                                label: 'Authorization Number',
                                value: data.secondaryAuthNo || '',
                            },
                        ].map(({ label, value }, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#03045e',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        {label}:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#000000',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                        <Grid item xs={12} sm={6} md={4}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    Reason For Referral:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {data.reasonForReferral || ''}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <Grid container spacing={2}>
                    {[
                        { key: 'sleepService', label: 'Sleep Services' },
                        { key: 'complaints', label: 'Sleep Complaints' },
                        {
                            key: 'otherSleepComplaints',
                            label: 'Other Sleep Complaints',
                        },
                        {
                            key: 'currentDiagnosis',
                            label: 'Current Diagnosis',
                        },
                        {
                            key: 'otherCurrentDiagnosis',
                            label: 'Other Current Diagnosis',
                        },
                        { key: 'specialNeeds', label: 'Special Needs' },
                        {
                            key: 'otherSpecialNeeds',
                            label: 'Other Special Needs',
                        },
                    ].map(
                        ({ key, label }) =>
                            data[key]?.length > 0 && (
                                <Grid item xs={12} sm={6} key={key}>
                                    <Box
                                        sx={{
                                            backgroundColor: '#f5f5f5',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            height: '100%',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                color: '#03045e',
                                                marginBottom: '5px',
                                            }}
                                        >
                                            {label}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: '0.75rem',
                                                color: '#000000',
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {([
                                                'sleepService',
                                                'complaints',
                                                'currentDiagnosis',
                                                'specialNeeds',
                                            ].includes(key) &&
                                                data[key]
                                                    ?.map(item => item)
                                                    .join(', ')) ||
                                                data[key]}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ),
                    )}
                </Grid>

                <Grid container spacing={3}>
                    {[
                        { label: 'On CPAP', value: data.cpap || 'No' },
                        {
                            label: 'CPAP Pressure',
                            value: data.cpapPressure || '',
                        },
                        {
                            label: 'On Oxygen',
                            value: data.oxygen || 'No',
                        },
                        { label: 'Oxygen Rate', value: data.oxygenRate },
                        {
                            label: 'Prior Sleep Studies',
                            value: data.priorSleepStudies || 'No',
                        },
                        {
                            label: 'Prior Studies Time',
                            value: data.priorStudiesTime || '',
                        },
                        {
                            label: 'ENT Evaluation',
                            value: data.entEvaluation || '',
                        },
                        {
                            label: 'Current Medication',
                            value: data.currentMedications || '',
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Referring Physician',
                            value: data.referringPhysicianName || 'No',
                        },
                        {
                            label: 'Referring Physician Phone',
                            value: data.referringPhysicianPhone || '',
                        },
                        {
                            label: 'Referring Physician Fax',
                            value: data.referringPhysicianFax || '',
                        },
                        {
                            label: 'Referring Physician Address',
                            value: data.referringPhysicianAddress || '',
                        },
                        {
                            label: 'Referring Physician City',
                            value: data.referringPhysicianCity || '',
                        },
                        {
                            label: 'Referring Physician State',
                            value: data.referringPhysicianState || '',
                        },
                        {
                            label: 'Referring Physician Zip',
                            value: data.referringPhysicianZip || '',
                        },
                        {
                            label: 'Referring Physician Signature',
                            value: data.referringPhysicianSignature || '',
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </div>
        )
    },
)

export const PediatricSleepStudyReferralFormListDocument = forwardRef(
    ({ Clinic }, ref) => {
        const data = Clinic?.documentdetail

        return (
            <div
                className={
                    Clinic.show
                        ? 'card-content p-1'
                        : 'card-content p-1 is-hidden'
                }
            >
                <Box sx={{ display: 'none' }}>
                    <PediatricSleepStudyReferralFormPrintOut
                        ref={ref}
                        data={data}
                        Clinic={Clinic}
                    />
                </Box>

                <Box
                    sx={{
                        backgroundColor: '#f5f5f5',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                    }}
                >
                    <Grid container spacing={3}>
                        {[
                            { label: 'Diagnosis', value: data.Diagnosis },
                            {
                                label: 'PCP Name',
                                value: data.pcpName || '',
                            },
                            {
                                label: 'PCP Phone',
                                value: data.pcpPhone || '',
                            },
                            {
                                label: 'Emergency Contact',
                                value: data.EmergencyContact,
                            },
                            {
                                label: 'Parent/Guardian Name',
                                value: data.ParentName || '',
                            },
                            {
                                label: 'Parent/Guardian DOB',
                                value: data.ParentDOB || '',
                            },
                            {
                                label: 'Parent/Guardian Phone',
                                value: data.ParentPhone || '',
                            },
                            {
                                label: 'Additional Contact',
                                value: data.AdditionalContact || '',
                            },
                            {
                                label: 'Additional Contact Phone',
                                value: data.AdditionalContactPhone || '',
                            },
                        ].map(({ label, value }, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#03045e',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        {label}:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#000000',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid container spacing={3}>
                        {[
                            {
                                label: 'Insurance Company',
                                value: data.insuranceCompany,
                            },
                            {
                                label: 'Insurance ID',
                                value: data.insuranceID || '',
                            },
                            {
                                label: 'Insurance Group',
                                value: data.insuranceGroup || '',
                            },
                            {
                                label: 'Insurance Phone',
                                value: data.insurancePhone || '',
                            },
                            {
                                label: 'Insurance Name',
                                value: data.insuranceName || '',
                            },
                            {
                                label: 'Progress Notes',
                                value: data.ProgressNotes || '',
                            },
                        ].map(({ label, value }, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#03045e',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        {label}:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#000000',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Referring Physician',
                            value: data.referringPhysicianName || 'No',
                        },
                        {
                            label: 'Referring Physician Phone',
                            value: data.referringPhysicianPhone || '',
                        },
                        {
                            label: 'Referring Physician Fax',
                            value: data.referringPhysicianFax || '',
                        },
                        {
                            label: 'Referring Physician Address',
                            value: data.referringPhysicianAddress || '',
                        },
                        {
                            label: 'Referring Physician City',
                            value: data.referringPhysicianCity || '',
                        },
                        {
                            label: 'Referring Physician State',
                            value: data.referringPhysicianState || '',
                        },
                        {
                            label: 'Referring Physician Zip',
                            value: data.referringPhysicianZip || '',
                        },
                        {
                            label: 'Referring Physician Signature',
                            value: data.referringPhysicianSignature || '',
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={2}>
                    {[
                        {
                            key: 'instructionsForStudy',
                            label: 'Instructions For Study',
                        },
                        {
                            key: 'specialistAppointment',
                            label: 'Prioir Pediatric Sleep Specialist Appointment',
                        },
                        { key: 'Snoring', label: 'Snoring' },
                        { key: 'BreathingPauses', label: 'Breathing Pauses' },
                        {
                            key: 'GaspAndChoke',
                            label: 'Gasp And Choke At Nght',
                        },
                        { key: 'MouthBreather', label: 'Mouth Breather' },
                        { key: 'BedWet', label: 'Bed Wet' },
                        { key: 'DayTiredness', label: 'Day Tiredness' },
                        {
                            key: 'PoorSchoolPerformance',
                            label: 'Poor School Performance',
                        },
                        { key: 'HyperActive', label: 'Hyper Active' },
                        { key: 'MorningHeadaches', label: 'Morning Headaches' },
                        { key: 'RestlessLimbs', label: 'Restless Limbs' },
                        {
                            key: 'DifficultySleeping',
                            label: 'Difficulty Sleeping',
                        },
                        {
                            key: 'DifficultyStayingAwake',
                            label: 'Difficulty Staying Awake IN Daytime',
                        },
                        {
                            key: 'LossOfStrengthOnWaking',
                            label: 'Loss Of Strength On Waking',
                        },
                        { key: 'PreviousStudy', label: 'Previous Study' },
                        {
                            key: 'previousStudyDetails',
                            label: 'Previous Study Details',
                        },
                        { key: 'durationToSleep', label: 'Duration To Sleep' },
                    ].map(
                        ({ key, label }) =>
                            data[key]?.length > 0 && (
                                <Grid item xs={12} sm={6} key={key}>
                                    <Box
                                        sx={{
                                            backgroundColor: '#f5f5f5',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            height: '100%',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                color: '#03045e',
                                                marginBottom: '5px',
                                            }}
                                        >
                                            {label}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: '0.75rem',
                                                color: '#000000',
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {(['instructionsForStudy'].includes(
                                                key,
                                            ) &&
                                                data[key]
                                                    ?.map(item => item)
                                                    .join(', ')) ||
                                                data[key]}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ),
                    )}
                </Grid>

                <Grid container spacing={2}>
                    {[
                        { key: 'medicalHistory', label: 'Medical History' },
                        { key: 'medications', label: 'Medications' },
                        {
                            key: 'Physician Print',
                            label: 'PhysicianPrint',
                        },
                        {
                            key: 'Physician Sign',
                            label: 'PhysicianSign',
                        },
                        {
                            key: 'Date',
                            label: 'date',
                        },
                    ].map(
                        ({ key, label }) =>
                            data[key]?.length > 0 && (
                                <Grid item xs={12} sm={6} key={key}>
                                    <Box
                                        sx={{
                                            backgroundColor: '#f5f5f5',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            height: '100%',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                color: '#03045e',
                                                marginBottom: '5px',
                                            }}
                                        >
                                            {label}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: '0.75rem',
                                                color: '#000000',
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {(['medicalHistory'].includes(
                                                key,
                                            ) &&
                                                data[key]
                                                    ?.map(item => item)
                                                    .join(', ')) ||
                                                data[key]}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ),
                    )}
                </Grid>
            </div>
        )
    },
)

export const NutritionAndDieteticsRequestFormListDocument = forwardRef(
    ({ Clinic }, ref) => {
        const data = Clinic?.documentdetail

        return (
            <div
                className={
                    Clinic.show
                        ? 'card-content p-1'
                        : 'card-content p-1 is-hidden'
                }
            >
                <Box sx={{ display: 'none' }}>
                    <NutritionAndDieteticsRequestFormPrintOut
                        ref={ref}
                        data={data}
                        Clinic={Clinic}
                    />
                </Box>

                <Box
                    sx={{
                        backgroundColor: '#f5f5f5',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                    }}
                >
                    <Grid container spacing={3}>
                        {[
                            { label: 'Patient', value: data.Patient },
                            {
                                label: 'Date of Birth',
                                value: data.DateOfBirth || '',
                            },
                            {
                                label: 'Gender',
                                value: data.Gender || '',
                            },
                            {
                                label: 'Marital Status',
                                value: data.MaritalStatus,
                            },
                            {
                                label: 'Tribe',
                                value: data.Tribe || '',
                            },
                            {
                                label: 'Weight',
                                value: data.Weight || '',
                            },
                            {
                                label: 'Height',
                                value: data.Height || '',
                            },
                            {
                                label: 'BMI',
                                value: data.BMI || '',
                            },
                            {
                                label: 'IBW',
                                value: data.IBW || '',
                            },
                            {
                                label: 'PFHX',
                                value: data.PFHX || '',
                            },
                            {
                                label: 'Activity Level',
                                value: data.activityLevel || '',
                            },
                            {
                                label: 'Insulin Type',
                                value: data.insulinType || '',
                            },
                            {
                                label: 'Oral Hypoglycemics',
                                value: data.oralHypoglycemics || '',
                            },
                        ].map(({ label, value }, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#03045e',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        {label}:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#000000',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid container spacing={3}>
                        {[
                            {
                                label: 'Breakfast',
                                value: data.Breakfast,
                            },
                            {
                                label: 'Lunch',
                                value: data.Lunch || '',
                            },
                            {
                                label: 'Snacks',
                                value: data.Snacks || '',
                            },
                            {
                                label: 'Dinner',
                                value: data.Dinner || '',
                            },
                            {
                                label: 'Soups',
                                value: data.Soups || '',
                            },
                            {
                                label: 'Vegetables',
                                value: data.Vegetables || '',
                            },
                            {
                                label: 'Meat',
                                value: data.Meat || '',
                            },
                            {
                                label: 'Fruits',
                                value: data.Fruits || '',
                            },
                            {
                                label: 'Oils',
                                value: data.Oils || '',
                            },
                            {
                                label: 'Plan',
                                value: data.Plan || '',
                            },
                        ].map(({ label, value }, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#03045e',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        {label}:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#000000',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Grid container spacing={2}>
                    {[
                        {
                            key: 'typeOfDiet',
                            label: 'Type Of Diet',
                        },
                        {
                            key: 'dailyRecommendedCalorieIntake',
                            label: 'Daily Recommended Calorie Intake',
                        },
                        { key: 'Protein', label: 'Protein' },
                        { key: 'OilAndFat', label: 'Oil And Fat' },
                        {
                            key: 'Carbohydrate',
                            label: 'Carbohydrate',
                        },
                        {
                            key: 'otherDietaryNeeds',
                            label: 'Other Dietary Needs',
                        },
                        {
                            key: 'NutritionAndDieteticsAssessment',
                            label: 'Nutrition And Dietetics Assessment',
                        },
                        {
                            key: 'NutritionAndDieteticsDiagnosis',
                            label: 'Nutrition And Dietetics Diagnosis',
                        },
                        {
                            key: 'NutritionAndDieteticsIntervention',
                            label: 'Nutrition And Dietetics Intervention',
                        },
                        {
                            key: 'MonitoringAndEvaluation',
                            label: 'Monitoring And Evaluation',
                        },
                    ].map(
                        ({ key, label }) =>
                            data[key]?.length > 0 && (
                                <Grid item xs={12} sm={6} key={key}>
                                    <Box
                                        sx={{
                                            backgroundColor: '#f5f5f5',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            height: '100%',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                color: '#03045e',
                                                marginBottom: '5px',
                                            }}
                                        >
                                            {label}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: '0.75rem',
                                                color: '#000000',
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {(['otherDietaryNeeds'].includes(
                                                key,
                                            ) &&
                                                data[key]
                                                    ?.map(item => item)
                                                    .join(', ')) ||
                                                data[key]}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ),
                    )}
                </Grid>
            </div>
        )
    },
)

export const EpworthSleepinessScaleDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <EpworthSleepinessScalePrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Sitting And Reading',
                            value: data.sittingAndReading,
                        },
                        {
                            label: 'Watching TV',
                            value: data.watchingTv || '',
                        },
                        {
                            label: 'Public Inactive Sitting',
                            value: data.publicInactiveSitting || '',
                        },
                        {
                            label: 'Sitting As Passenger',
                            value: data.sittingAsPassenger,
                        },
                        {
                            label: 'Rest in Free Time',
                            value: data.restInFreeTime || '',
                        },
                        {
                            label: 'Sitting And Talking',
                            value: data.sittingAndTalking || '',
                        },
                        {
                            label: 'Sitting After Lunch Without Alcohol',
                            value: data.sittingAfterLunchWithoutAlcohol || '',
                        },
                        {
                            label: 'Sitting In Traffic',
                            value: data.sittingInTraffic || '',
                        },
                        {
                            label: 'Total',
                            value: data.total || '0',
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    )
})

export const TheatreOrderDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail
    // console.log('This is the Clinic document', Clinic)
    // const clinicServ = client.service('clinicaldocument')
    // const deleteItem = async id => {
    //     try {
    //         await clinicServ.remove(id)
    //         console.log('Deleted', id)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // deleteItem(Clinic._id)

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <TheatreOrderPrintOut ref={ref} data={data} Clinic={Clinic} />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Appointment Type',
                            value: data.appointment_type || '',
                        },
                        {
                            label: 'Order Details',
                            value: data.order_details || '',
                        },
                        {
                            label: 'Payment Mode',
                            value: data.paymentMode.paymentmode || '',
                        },
                        {
                            label: 'Practitioner',
                            value:
                                data.practioner.firstname +
                                    ' ' +
                                    data.practioner.lastname || '',
                        },
                        {
                            label: 'Appointment Time',
                            value: data.start_time || '',
                        },
                        {
                            label: 'Surgical Procedure',
                            value: data.surgical_procedure || '',
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    )
})

export const SleepStudyAuthorizationDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <SleepStudyAuthorizationPrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Parent/Guardian',
                            value: data.parent,
                        },
                        {
                            label: 'Authorizations',
                            value: data.authorizations,
                        },
                        {
                            label: 'Signature (Patient or Guardian)',
                            value: data.patientSignature,
                        },
                        {
                            label: 'Relationship to Patient if Guardian',
                            value: data.relationship,
                        },
                        {
                            label: 'Witness',
                            value: data.witness,
                        },
                        {
                            label: 'Date',
                            value: data.date,
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    )
})

export const PatientInstructionForSleepDocument = forwardRef(
    ({ Clinic }, ref) => {
        const data = Clinic?.documentdetail

        return (
            <div
                className={
                    Clinic.show
                        ? 'card-content p-1'
                        : 'card-content p-1 is-hidden'
                }
            >
                <Box sx={{ display: 'none' }}>
                    <PatientInstructionForSleepStudyPrintOut
                        ref={ref}
                        data={data}
                        Clinic={Clinic}
                    />
                </Box>

                <Box
                    sx={{
                        backgroundColor: '#f5f5f5',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                    }}
                >
                    <Grid container spacing={3}>
                        {[
                            {
                                label: 'Study Date',
                                value: data.date,
                            },
                        ].map(({ label, value }, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#03045e',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        {label}:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#000000',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </div>
        )
    },
)

export const InsuranceDetailsDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <InsuranceDetailsPrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Primary Policy Holder',
                            value: data.primaryPolicyHolder,
                        },
                        {
                            label: 'Relationship',
                            value: data.relationship,
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    )
})

export const PrivacyAndPolicyDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <PrivacyAndPolicyPrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Acknowledgement',
                            value: data.acknowledgement,
                        },
                        {
                            label: 'Other',
                            value: data.other,
                        },
                        {
                            label: 'Specified Person Name',
                            value: data.specifiedPersonOneName,
                        },
                        {
                            label: 'Specified Person Relationship',
                            value: data.specifiedPersonOneRelationship,
                        },
                        {
                            label: 'Specified Person Name',
                            value: data.specifiedPersonTwoName,
                        },
                        {
                            label: 'Specified Person Relationship',
                            value: data.specifiedPersonTwoRelationship,
                        },
                        {
                            label: 'Signature',
                            value: data.signature,
                        },
                        {
                            label: 'Date',
                            value: data.date,
                        },
                        {
                            label: 'Voicemail Permission',
                            value: data.voicemailPermission,
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    )
})

export const FatigueSeverityScaleDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <FatigueSeverityScalePrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Motivation',
                            value: data.motivation,
                        },
                        {
                            label: 'Exercise',
                            value: data.exercise || '',
                        },
                        {
                            label: 'Easily Fatigued',
                            value: data.easilyFatigued || '',
                        },
                        {
                            label: 'Fatigue Interefering With Physical Functioning',
                            value: data.physicalFunctioning,
                        },
                        {
                            label: 'Fatigue Causing Frequent Problems',
                            value: data.frequentProblems || '',
                        },
                        {
                            label: 'Fatigue Prevents Sustained Physical Function',
                            value: data.sustainedPhysicalFunction || '',
                        },
                        {
                            label: 'Fatigue Interferes With Responsibilities',
                            value: data.responsibilities || '',
                        },
                        {
                            label: 'Fatigue Is A Disabling Symptom',
                            value: data.disablingSymptoms || '',
                        },
                        {
                            label: 'Fatigue Interferes With Work And Family',
                            value: data.workAndFamily || '',
                        },
                        {
                            label: 'Total',
                            value: data.total || '0',
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    )
})

export const SleepQuestionnaireDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <SleepQuestionnairePrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Bedtime',
                            value: data.bedtime,
                        },
                        {
                            label: 'Awakening Time',
                            value: data.waketime,
                        },
                        {
                            label: 'Use Alarm Clock',
                            value: data.alarmClock,
                        },
                        {
                            label: 'Wake At Night',
                            value: data.wakeAtNight,
                        },
                        {
                            label: 'No Of Times Waking Up At Night',
                            value: data.noOfWakingUpTimes,
                        },
                        {
                            label: 'Duration Of Waking Up Times',
                            value: data.durationOfWakingUpTimes,
                        },
                        {
                            label: 'Snore',
                            value: data.snore,
                        },
                        {
                            label: 'Lost Bed Partner',
                            value: data.lostBedPartner,
                        },
                        {
                            label: 'Breath Pauses',
                            value: data.breathPauses,
                        },
                        {
                            label: 'Limb Kicks',
                            value: data.limbKicks,
                        },
                        {
                            label: 'Sleep Talk',
                            value: data.sleepTalk,
                        },
                        {
                            label: 'Sleep Walk',
                            value: data.sleepWalk,
                        },
                        {
                            label: 'Sleep Act',
                            value: data.sleepAct,
                        },
                        {
                            label: 'Trouble Sleeping',
                            value: data.troubleSleeping,
                        },
                        {
                            label: 'How Long It Takes To Sleep',
                            value: data.durationToSleep,
                        },
                        {
                            label: 'Insomnia Weekly Count',
                            value: data.insomniaWeeklyCount,
                        },
                        {
                            label: 'Trouble Falling Back Asleep',
                            value: data.troubleFallingBackAsleep,
                        },
                        {
                            label: 'How Long Before Falling Back Asleep',
                            value: data.durationToFallBackAsleep,
                        },
                        {
                            label: 'Trouble Falling Back Asleep Weekly Count',
                            value: data.troubleFallingBackAsleepWeeklyCount,
                        },
                        {
                            label: 'Unfamiliar Environment',
                            value: data.unfamiliarEnv,
                        },
                        {
                            label: 'Aching Sensation Before Sleep',
                            value: data.achingSensationBeforeSleep,
                        },
                        {
                            label: 'Light Sleeper',
                            value: data.lightSleeper,
                        },
                        {
                            label: 'Daytime Tiredness',
                            value: data.daytimeTiredness,
                        },
                        {
                            label: 'Sleep Watching TV',
                            value: data.sleepWatchingTV,
                        },
                        {
                            label: 'Sleep At Inappropriate Times',
                            value: data.sleepAtInappropriateTimes,
                        },
                        {
                            label: 'Accident From Sleepiness',
                            value: data.accidentFromSleepiness,
                        },
                        {
                            label: 'Sudden Alertness',
                            value: data.suddenAlertness,
                        },
                        {
                            label: 'Sudden Weakness',
                            value: data.suddenWeakness,
                        },
                        {
                            label: 'Hallucinations',
                            value: data.hallucinations,
                        },
                        {
                            label: 'Daytime Naps',
                            value: data.dayNaps,
                        },
                        {
                            label: 'Weekly No Of Nap Times',
                            value: data.weeklyNoOfNapTimes,
                        },
                        {
                            label: 'Duration Of Nap Times',
                            value: data.durationOfNapTimes,
                        },
                        {
                            label: 'RefreshingNaps',
                            value: data.refreshingNaps,
                        },
                        {
                            label: 'Dream During Naps',
                            value: data.dreamDuringNaps,
                        },
                        {
                            label: 'Often Sleep As An Adolescent',
                            value: data.oftenSleepAsAdolescent,
                        },
                        {
                            label: 'Childhood Sleep Problems',
                            value: data.childhoodSleepProblems,
                        },
                        {
                            label: 'HyperActive As A Kid',
                            value: data.hyperActiveAsKid,
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    )
})

export const SleepQuestionnaireForSpouseDocument = forwardRef(
    ({ Clinic }, ref) => {
        const data = Clinic?.documentdetail

        return (
            <div
                className={
                    Clinic.show
                        ? 'card-content p-1'
                        : 'card-content p-1 is-hidden'
                }
            >
                <Box sx={{ display: 'none' }}>
                    <SleepQuestionnaireForSpousePrintOut
                        ref={ref}
                        data={data}
                        Clinic={Clinic}
                    />
                </Box>

                <Box
                    sx={{
                        backgroundColor: '#f5f5f5',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                    }}
                >
                    <Grid container spacing={3}>
                        {[
                            {
                                label: 'Snore',
                                value: data.snore,
                            },
                            {
                                label: 'Stop Breathing',
                                value: data.stopBreathing,
                            },
                            {
                                label: 'Limb Twitch',
                                value: data.limbTwitch,
                            },
                            {
                                label: 'Grind Teeth',
                                value: data.grindTeeth,
                            },
                            {
                                label: 'Sleep Walk',
                                value: data.sleepWalk,
                            },
                            {
                                label: 'Seep Sit',
                                value: data.sleepSit,
                            },
                            {
                                label: 'Rigid While Asleep',
                                value: data.rigidWhileAsleep,
                            },
                            {
                                label: 'Aching Sensation Before Sleep',
                                value: data.achingSensationBeforeSleep,
                            },
                            {
                                label: 'Bang Head While Asleep',
                                value: data.bangHeadWhileAsleep,
                            },
                            {
                                label: 'Others',
                                value: data.others,
                            },
                        ].map(({ label, value }, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#03045e',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        {label}:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#000000',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </div>
        )
    },
)

export const WeeklySleepLogDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    const StudySchema = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
            width: '50px',
        },
        {
            name: 'Date',
            key: 'studyDate',
            selector: row => row.studyDate,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Sleepy',
            key: 'eveningFeeling',
            selector: row => row.eveningFeeling,
            sortable: false,
            width: '50px',
        },
        {
            name: '12am',
            key: 'am12',
            selector: row => (row.am12 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '1am',
            key: 'am1',
            selector: row => (row.am1 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '2am',
            key: 'am2',
            selector: row => (row.am2 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '3am',
            key: 'am3',
            selector: row => (row.am3 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '4am',
            key: 'am4',
            selector: row => (row.am4 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '5am',
            key: 'am5',
            selector: row => (row.am5 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '6am',
            key: 'am6',
            selector: row => (row.am6 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '7am',
            key: 'am7',
            selector: row => (row.am7 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '8am',
            key: 'am8',
            selector: row => (row.am8 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '9am',
            key: 'am9',
            selector: row => (row.am9 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '10am',
            key: 'am10',
            selector: row => (row.am10 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '11am',
            key: 'am11',
            selector: row => (row.am11 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '12pm',
            key: 'pm12',
            selector: row => (row.pm12 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '1pm',
            key: 'pm1',
            selector: row => (row.pm1 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '2pm',
            key: 'pm2',
            selector: row => (row.pm2 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '3pm',
            key: 'pm3',
            selector: row => (row.pm3 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '4pm',
            key: 'pm4',
            selector: row => (row.pm4 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '5pm',
            key: 'pm5',
            selector: row => (row.pm5 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '6pm',
            key: 'pm6',
            selector: row => (row.pm6 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '7pm',
            key: 'pm7',
            selector: row => (row.pm7 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '8pm',
            key: 'pm8',
            selector: row => (row.pm8 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '9pm',
            key: 'pm9',
            selector: row => (row.pm9 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '10pm',
            key: 'pm10',
            selector: row => (row.pm10 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: '11pm',
            key: 'pm11',
            selector: row => (row.pm11 === true ? 'True' : 'False'),
            sortable: false,
            width: '50px',
        },
        {
            name: 'Rested',
            key: 'morningFeeling',
            selector: row => row.morningFeeling,
            sortable: false,
            width: '70px',
        },
    ]

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <WeeklySleepLogPrintOut ref={ref} data={data} Clinic={Clinic} />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Time You Began Trying To Fall Asleep',
                            value: data.StartFallSleepTime,
                        },
                        {
                            label: 'Time You Got Up To Start Your Day',
                            value: data.StartSleepTime,
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {data.study?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Study
                    </Typography>
                    <CustomTable
                        title="Study Data"
                        columns={StudySchema}
                        data={data.study}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}
        </div>
    )
})

export const SleepHistoryAndIntakeDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    const MedicationSchema = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
            width: '100px',
        },
        {
            name: 'Medication Name',
            key: 'medicationName',
            selector: row => row.medicationName,
            sortable: false,
            width: '200px',
        },
        {
            name: 'Dosage',
            key: 'medicationDosage',
            selector: row => row.medicationDosage,
            sortable: false,
            width: '200px',
        },
        {
            name: 'Instructions',
            key: 'medicationInstructions',
            selector: row => row.medicationInstructions,
            sortable: false,
            width: '200px',
        },
    ]
    const AllergySchema = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
            width: '100px',
        },
        {
            name: 'Allergen/Medication',
            key: 'allergen',
            selector: row => row.allergen,
            sortable: false,
            width: '200px',
        },
        {
            name: 'Reaction',
            key: 'allergenReaction',
            selector: row => row.allergenReaction,
            sortable: false,
            width: '200px',
        },
    ]
    const MedHistorySchema = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
            width: '100px',
        },
        {
            name: 'Medical Condition',
            key: 'medicalCondition',
            selector: row => row.medicalCondition,
            sortable: false,
            width: '400px',
        },
    ]
    const SurgHistorySchema = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
            width: '100px',
        },
        {
            name: 'Surgery/Procedure',
            key: 'procedure',
            selector: row => row.procedure,
            sortable: false,
            width: '200px',
        },
        {
            name: 'Year',
            key: 'SurgYear',
            selector: row => row.SurgYear,
            sortable: false,
            width: '200px',
        },
    ]
    const HosptSchema = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
            width: '100px',
        },
        {
            name: 'Hospitalization',
            key: 'hospt',
            selector: row => row.hospt,
            sortable: false,
            width: '200px',
        },
        {
            name: 'Year',
            key: 'HosptYear',
            selector: row => row.HosptYear,
            sortable: false,
            width: '200px',
        },
    ]

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <SleepHistoryAndIntakePrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Referring Physician Name',
                            value: data.referringPhysician,
                        },
                        {
                            label: 'Physician Phone',
                            value: data.physicianPhone,
                        },
                        {
                            label: 'Primary Care Physician',
                            value: data.primaryCarePhysician,
                        },
                        {
                            label: 'Primary Care Physician Phone',
                            value: data.primaryCarePhysicianPhone,
                        },
                        {
                            label: 'Reason For Visit',
                            value: data.reasonForVisit,
                        },
                        {
                            label: 'Presently On Medications',
                            value: data.presentlyOnMedications,
                        },
                        {
                            label: 'Has Allergies',
                            value: data.hasAllergies,
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {data.medications?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Medications
                    </Typography>
                    <CustomTable
                        title="Medications Data"
                        columns={MedicationSchema}
                        data={data.medications}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}

            {data.allergies?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Allergies
                    </Typography>
                    <CustomTable
                        title="Allergy Data"
                        columns={AllergySchema}
                        data={data.allergies}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}

            {data.medHistory?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Medical History
                    </Typography>
                    <CustomTable
                        title="Medical History Data"
                        columns={MedHistorySchema}
                        data={data.medHistory}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}

            {data.surgHistory?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Surgical History
                    </Typography>
                    <CustomTable
                        title="Surgical History Data"
                        columns={SurgHistorySchema}
                        data={data.surgHistory}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}

            {data.hospt?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Hospitalization
                    </Typography>
                    <CustomTable
                        title="Hospitalization Data"
                        columns={HosptSchema}
                        data={data.hospt}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}

            <Grid container spacing={3}>
                {[
                    {
                        label: 'Sleep Apnea',
                        value: data.sleepApnea,
                    },
                    {
                        label: 'Family Sleep Apnea Patient',
                        value: data.sleepApneaPatient,
                    },
                    {
                        label: 'Narcolepsy',
                        value: data.Narcolepsy,
                    },
                    {
                        label: 'Family Narcolepsy Patient',
                        value: data.NarcolepsyPatient,
                    },
                    {
                        label: 'Restless Leg Syndrome',
                        value: data.restlessLeg,
                    },
                    {
                        label: 'Family Restless Leg Patient',
                        value: data.restlessLegPatient,
                    },
                    {
                        label: 'Is Mother Alive',
                        value: data.isMotherAlive,
                    },
                    {
                        label: 'Current Age Of Mother',
                        value: data.currentAgeMother,
                    },
                    {
                        label: 'Is Father Alive',
                        value: data.isFatherAlive,
                    },
                    {
                        label: 'Current Age Of Father',
                        value: data.currentAgeFather,
                    },
                    {
                        label: 'Significant Mother Family Illnesses',
                        value: data.significantMotherFamilyIllnesses,
                    },
                    {
                        label: 'Significant Mother Family Illnesses List',
                        value: data.significantMotherFamilyIllnessesList,
                    },
                    {
                        label: 'Significant Father Family Illnesses',
                        value: data.significantFatherFamilyIllnesses,
                    },
                    {
                        label: 'Significant Father Family Illnesses List',
                        value: data.significantFatherFamilyIllnessesList,
                    },
                ].map(({ label, value }, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    color: '#03045e',
                                    marginBottom: '5px',
                                }}
                            >
                                {label}:
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '0.75rem',
                                    color: '#000000',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {value}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {[
                    {
                        label: 'Relationship Status',
                        value: data.relationshipStatus,
                    },
                    {
                        label: 'Partnership Duration',
                        value: data.partnershipDuration,
                    },
                    {
                        label: 'Smoked Cigarettes Before',
                        value: data.smokeCigarettesBefore,
                    },
                    {
                        label: 'Smoke Cigarettes Currently',
                        value: data.smokeCigarettesCurrently,
                    },
                    {
                        label: 'No Of Cigarettes Daily',
                        value: data.noOfCigarettesDaily,
                    },
                    {
                        label: 'No Of Years Smoking',
                        value: data.noOfYearsSmoking,
                    },
                    {
                        label: 'When You Quit Smoking',
                        value: data.whenQuitSmoking,
                    },
                    {
                        label: 'Drink Alcohol Currently',
                        value: data.drinkAlcoholCurrently,
                    },
                    {
                        label: 'No Of drinks Weekly',
                        value: data.noOfdrinksWeekly,
                    },
                    {
                        label: 'Drink Caffeine Currently',
                        value: data.drinkCaffeineCurrently,
                    },
                    {
                        label: 'No Of Caffeine Weekly',
                        value: data.noOfCaffeineWeekly,
                    },
                ].map(({ label, value }, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    color: '#03045e',
                                    marginBottom: '5px',
                                }}
                            >
                                {label}:
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '0.75rem',
                                    color: '#000000',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {value}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {[
                    {
                        label: 'Five Yrs Weight Progress',
                        value: data.fiveYrsWeightProgress,
                    },
                    {
                        label: 'Extent Of Weight Progress',
                        value: data.extentOfWeightProgress,
                    },
                    {
                        label: 'Dry Mouth On Awakening',
                        value: data.dryMouthOnAwakening,
                    },
                    {
                        label: 'Headaches',
                        value: data.headaches,
                    },
                    {
                        label: 'Morning Headaches',
                        value: data.morningHeadaches,
                    },
                    {
                        label: 'Heartburn',
                        value: data.heartburn,
                    },
                    {
                        label: 'Sinus Congestion',
                        value: data.sinus,
                    },
                    {
                        label: 'Urination Count At Night',
                        value: data.uptimesAtNight,
                    },
                    {
                        label: 'Night Choking Or Gasping',
                        value: data.chokingOrGasping,
                    },
                    {
                        label: 'Overnight Sleep Study',
                        value: data.overnightSleepStudy,
                    },
                    {
                        label: 'Overnight Sleep Study Time',
                        value: data.overnightSleepStudyTime,
                    },
                    {
                        label: 'Overnight Sleep Study Place',
                        value: data.overnightSleepStudyPlace,
                    },
                    {
                        label: 'Overnight Sleep Study Results',
                        value: data.overnightSleepStudyResults,
                    },
                    {
                        label: 'Had Surgery For Snoring',
                        value: data.surgeryForSnoring,
                    },
                    {
                        label: 'Surgery For Snoring Time',
                        value: data.surgeryForSnoringTime,
                    },
                ].map(({ label, value }, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    color: '#03045e',
                                    marginBottom: '5px',
                                }}
                            >
                                {label}:
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '0.75rem',
                                    color: '#000000',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {value}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {[
                    {
                        label: 'Hypertension',
                        value: data.Hypertension,
                    },
                    {
                        label: 'Coronary Artery Disease',
                        value: data.CoronaryArteryDisease,
                    },
                    {
                        label: 'Diabetes',
                        value: data.Diabetes,
                    },
                    {
                        label: 'Chronic Fatigue Syndrome',
                        value: data.ChronicFatigueSyndrome,
                    },
                    {
                        label: 'Acromegaly',
                        value: data.Acromegaly,
                    },
                    {
                        label: 'Chronic Pain Syndrome',
                        value: data.ChronicPainSyndrome,
                    },
                    {
                        label: 'Atrial Fibrillation',
                        value: data.AtrialFibrillation,
                    },
                    {
                        label: 'Stroke',
                        value: data.stroke,
                    },
                    {
                        label: 'Depression',
                        value: data.Depression,
                    },
                    {
                        label: 'CongestiveHeartFailure',
                        value: data.CongestiveHeartFailure,
                    },
                    {
                        label: 'Pulmonary Hypertension',
                        value: data.PulmonaryHypertension,
                    },
                    {
                        label: 'Fibromyalgia',
                        value: data.Fibromyalgia,
                    },
                ].map(({ label, value }, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    color: '#03045e',
                                    marginBottom: '5px',
                                }}
                            >
                                {label}:
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '0.75rem',
                                    color: '#000000',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {value}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
})

export const NursesContinuationSheetDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <NursesContinuationSheetPrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Elimination',
                            value: data.elimination,
                        },
                        {
                            label: 'Activity/Exercise',
                            value: data.activity,
                        },
                        {
                            label: 'Sleep/Rest',
                            value: data.sleep,
                        },
                        {
                            label: 'Communication/Special Senses',
                            value: data.communication,
                        },
                        {
                            label: 'Feeling About Self/Image',
                            value: data.selfImage,
                        },
                        {
                            label: 'Family/Social Relationship',
                            value: data.relationships,
                        },
                        {
                            label: 'Sexuality/Reproduction',
                            value: data.sexuality,
                        },
                        {
                            label: 'Coping With Stress',
                            value: data.stressCoping,
                        },
                        {
                            label: 'Values and Belief',
                            value: data.values,
                        },
                        {
                            label: 'Other Information i.e (Habits)',
                            value: data.habits,
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    )
})

export const AgonistProtocolListDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    const StimulationColumns = [
        {
            name: 'Start Date',
            key: 'startDate',
            selector: row => row.startDate,
            sortable: true,
        },
        {
            name: 'Time',
            key: 'time',
            selector: row => row.time,
            sortable: true,
        },
        {
            name: 'Buserelin',
            key: 'buserelin',
            selector: row => row.buserelin,
            sortable: true,
        },
        {
            name: 'Suprefact Nasal',
            key: 'suprefactNasal',
            selector: row => row.suprefactNasal,
            sortable: true,
        },
        {
            name: 'Menogon',
            key: 'menogon',
            selector: row => row.menogon,
            sortable: true,
        },
        {
            name: 'HCG',
            key: 'hcg',
            selector: row => row.hcg,
            sortable: true,
        },
        {
            name: 'Follicles Right',
            key: 'folliclesRight',
            selector: row => row.folliclesRight,
            sortable: true,
        },
        {
            name: 'Follicles Left',
            key: 'folliclesLeft',
            selector: row => row.folliclesLeft,
            sortable: true,
        },
    ]

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <AgonistProtocolPrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        { label: 'Last Menses', value: data.last_menses },
                        {
                            label: 'Treatment Form',
                            value: data.treatment_form ? 'Yes' : 'No',
                        },
                        {
                            label: 'Indication Male',
                            value: data.indication_male ? 'Yes' : 'No',
                        },
                        {
                            label: 'Registration',
                            value: data.registration ? 'Yes' : 'No',
                        },
                        { label: 'Score', value: data.score },
                        { label: 'Donated', value: data.donated },
                        { label: 'Frozen', value: data.frozen },
                        {
                            label: 'Plan for Treatment',
                            value: data.plan_for_treatment,
                        },
                        {
                            label: 'Additional Information',
                            value: data.additional_information,
                        },
                        {
                            label: 'Outcome of Treatment',
                            value: data.outcome_of_treatment ? 'Yes' : 'No',
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Grid container spacing={2}>
                {[
                    { key: 'medications', label: 'Medications' },
                    { key: 'allergies', label: 'Allergies' },
                    { key: 'follicles', label: 'Follicles' },
                    { key: 'oocytes', label: 'Oocytes' },
                    { key: 'embryos', label: 'Embryos' },
                    { key: 'transferred', label: 'Transferred' },
                ].map(
                    ({ key, label }) =>
                        data[key]?.length > 0 && (
                            <Grid item xs={12} sm={6} md={4} key={key}>
                                <Box
                                    sx={{
                                        backgroundColor: '#f5f5f5',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        height: '100%',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#03045e',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#000000',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {data[key]
                                            .map(item => item.value)
                                            .join(', ')}
                                    </Typography>
                                </Box>
                            </Grid>
                        ),
                )}
            </Grid>

            {data.stimulationData?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Stimulation
                    </Typography>
                    <CustomTable
                        title="Stimulation Data"
                        columns={StimulationColumns}
                        data={data.stimulationData}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}
        </div>
    )
})

export const FemaleHistoryListDocument = forwardRef(({ Clinic }, ref) => {
    const data = {
        femaleHistory: Clinic?.documentdetail?.femaleHistory?.[0] || {},
        femaleInvestigations:
            Clinic?.documentdetail?.femaleInvestigations?.[0] || {},
        fertilityTreatments: Clinic?.documentdetail?.fertilityTreatments || [],
    }

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <FemaleHistoryListPrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>
            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Menarche',
                            value: data.femaleHistory.menarche,
                        },
                        {
                            label: 'Last Menstrual Period',
                            value: data.femaleHistory.lmp,
                        },
                        {
                            label: 'Ketamenia',
                            value: data.femaleHistory.ketamenia,
                        },
                        {
                            label: 'Pelvic Infection History',
                            value: data.femaleHistory.pelvicInfectionHistory,
                        },
                        {
                            label: 'Pelvic Surgery History',
                            value: data.femaleHistory.pelvicSurgeryHistory,
                        },
                        {
                            label: 'Pregnancy History',
                            value: data.femaleHistory.pregnancyHistory,
                        },
                        {
                            label: 'Pregnancy History (Miscarriage)',
                            value: data.femaleHistory
                                .pregnancyHistoryMiscarriage,
                        },
                        {
                            label: 'Pregnancy History (Deliveries)',
                            value: data.femaleHistory
                                .pregnancyHistoryDeliveries,
                        },
                        {
                            label: 'Number of Live Children',
                            value: data.femaleHistory.noOfLiveChildren,
                        },
                        {
                            label: 'Medical Illness History',
                            value: data.femaleHistory.medicalIllnessHistory,
                        },
                        {
                            label: 'Surgical Intervention History',
                            value: data.femaleHistory
                                .surgicalInterventionHistory,
                        },
                        {
                            label: 'Current Medication',
                            value: data.femaleHistory.currentMedication,
                        },
                        {
                            label: 'Smoking History',
                            value: data.femaleHistory.smokingHistory,
                        },
                        {
                            label: 'Breast Milk Discharge History',
                            value: data.femaleHistory
                                .breastMilkDischargeHistory,
                        },
                        {
                            label: 'Alcohol Use History',
                            value: data.femaleHistory.alcoholUseHistory,
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Grid container spacing={2}>
                {[
                    { key: 'hsg', label: 'HSG' },
                    { key: 'laparoscopy', label: 'Laparoscopy' },
                    { key: 'sonohysterogram', label: 'Sonohysterogram' },
                    { key: 'hsysteroscopy', label: 'Hysteroscopy' },
                    { key: 'hormonalProfile', label: 'Hormonal Profile' },
                ]?.map(({ key, label }) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                        <Box
                            sx={{
                                backgroundColor: '#f5f5f5',
                                padding: '10px',
                                borderRadius: '5px',
                                height: '100%',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    color: '#03045e',
                                    marginBottom: '5px',
                                }}
                            >
                                {label}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '0.75rem',
                                    color: '#000000',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {data.femaleInvestigations[key]}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {data.fertilityTreatments.length > 0 && (
                <Box sx={{ marginTop: '20px' }}>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBottom: '15px',
                        }}
                    >
                        Fertility Treatments
                    </Typography>
                    <Grid item xs={12} sm={6} md={4}>
                        <Box
                            sx={{
                                backgroundColor: '#f5f5f5',
                                padding: '10px',
                                borderRadius: '5px',
                                height: '100%',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    color: '#03045e',
                                    marginBottom: '5px',
                                }}
                            >
                                Date
                            </Typography>
                            {data.fertilityTreatments.map(
                                (treatment, index) => (
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#000000',
                                            wordBreak: 'break-word',
                                        }}
                                        key={index}
                                    >
                                        {treatment.date}
                                    </Typography>
                                ),
                            )}
                        </Box>
                    </Grid>
                </Box>
            )}
        </div>
    )
})

export const LaboratoryResultDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    const ResultsColumns = [
        {
            name: 'Test Name',
            key: 'test',
            selector: row => row.test,
            sortable: true,
        },
        {
            name: 'Value',
            key: 'value',
            selector: row => row.value,
            sortable: true,
        },
        {
            name: 'Unit',
            key: 'unit',
            selector: row => row.unit,
            sortable: true,
        },
        {
            name: 'Status',
            key: 'status',
            selector: row => row.status,
            sortable: true,
        },
    ]

    return (
        <div
            className={
                Clinic?.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <LaboratoryResultsPrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Typography
                    sx={{
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: '#03045e',
                        marginBottom: '5px',
                    }}
                >
                    Test : {data?.test}
                </Typography>
                <Typography
                    sx={{
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: '#03045e',
                        marginBottom: '5px',
                    }}
                >
                    Recommendation : {data?.Recommendation}
                </Typography>
            </Box>

            <Box>
                <Typography
                    sx={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#03045e',
                        marginBlock: '15px',
                    }}
                >
                    Results
                </Typography>
                <CustomTable
                    title="Lab Results Data"
                    columns={ResultsColumns}
                    data={data?.results}
                    pointerOnHover
                    highlightOnHover
                    striped
                    progressPending={false}
                />
            </Box>
        </div>
    )
})

export const AntagonistProtocolListDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    const StimulationColumns = [
        {
            name: 'Start Date',
            key: 'startDate',
            selector: row => row.startDate,
            sortable: true,
        },
        {
            name: 'Time',
            key: 'time',
            selector: row => row.time,
            sortable: true,
        },
        {
            name: 'Gon-F/Puregon/Hmg',
            key: 'gonFPuregonHmg',
            selector: row => row.gonFPuregonHmg,
            sortable: true,
        },
        {
            name: 'Cetrotide',
            key: 'cetrotide',
            selector: row => row.cetrotide,
            sortable: true,
        },
        {
            name: 'HCG',
            key: 'hcg',
            selector: row => row.hcg,
            sortable: true,
        },
        {
            name: 'Follicles Right',
            key: 'folliclesRight',
            selector: row => row.folliclesRight,
            sortable: true,
        },
        {
            name: 'Follicles Left',
            key: 'folliclesLeft',
            selector: row => row.folliclesLeft,
            sortable: true,
        },
    ]

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <AntagonistProtocolPrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        { label: 'Last Menses', value: data.last_menses },
                        {
                            label: 'Treatment Form',
                            value: data.treatment_form ? 'Yes' : 'No',
                        },
                        {
                            label: 'Indication Male',
                            value: data.indication_male ? 'Yes' : 'No',
                        },
                        {
                            label: 'Registration',
                            value: data.registration ? 'Yes' : 'No',
                        },
                        {
                            label: 'Indication Female',
                            value: data.indication_female ? 'Yes' : 'No',
                        },
                        {
                            label: 'Transfer Cycle',
                            value: data.transfer_cycle ? 'Yes' : 'No',
                        },
                        { label: 'Score', value: data.score },
                        { label: 'Donated', value: data.donated },
                        { label: 'Frozen', value: data.frozen },
                        {
                            label: 'Plan for Treatment',
                            value: data.plan_for_treatment,
                        },
                        {
                            label: 'Additional Information',
                            value: data.additional_information,
                        },
                        {
                            label: 'Document Status',
                            value: data.documentStatus,
                        },
                        {
                            label: 'Outcome of Treatment',
                            value: data.outcome_of_treatment ? 'Yes' : 'No',
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Grid container spacing={2}>
                {[
                    { key: 'medications', label: 'Medications' },
                    { key: 'allergies', label: 'Allergies' },
                    { key: 'follicles', label: 'Follicles' },
                    { key: 'oocytes', label: 'Oocytes' },
                    { key: 'embryos', label: 'Embryos' },
                    { key: 'transferred', label: 'Transferred' },
                ].map(
                    ({ key, label }) =>
                        data[key]?.length > 0 && (
                            <Grid item xs={12} sm={6} md={4} key={key}>
                                <Box
                                    sx={{
                                        backgroundColor: '#f5f5f5',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        height: '100%',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#03045e',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#000000',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {data[key]
                                            .map(item => item.value)
                                            .join(', ')}
                                    </Typography>
                                </Box>
                            </Grid>
                        ),
                )}
            </Grid>

            {data.stimulationData?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Stimulation
                    </Typography>
                    <CustomTable
                        title="Stimulation Data"
                        columns={StimulationColumns}
                        data={data.stimulationData}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}
        </div>
    )
})

export const PregnancyAssessmentDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    const ExaminationTwoColumns = [
        {
            name: 'Weight',
            key: 'weight',
            selector: row => row.weight,
            sortable: true,
        },
        {
            name: 'PCV',
            key: 'pcv',
            selector: row => row.pcv,
            sortable: true,
        },
        {
            name: 'Oedema',
            key: 'oedema',
            selector: row => row.oedema,
            sortable: true,
        },
        {
            name: 'Remark',
            key: 'remark',
            selector: row => row.remark,
            sortable: true,
        },
        {
            name: 'Return',
            key: 'return',
            selector: row => row.return,
            sortable: true,
        },
        {
            name: 'Examiner Initial',
            key: 'examinerInitial',
            selector: row => row.examinerInitial,
            sortable: true,
        },
    ]

    const ExaminationColumns = [
        {
            name: 'Date',
            key: 'date',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Presentation',
            key: 'presentation',
            selector: row => row.presentation,
            sortable: true,
        },
        {
            name: 'Relation to Brim',
            key: 'relationToBrim',
            selector: row => row.relationToBrim,
            sortable: true,
        },
        {
            name: 'Fetal Heart',
            key: 'fetalHeart',
            selector: row => row.fetalHeart,
            sortable: true,
        },
        {
            name: 'Urine',
            key: 'urine',
            selector: row => row.urine,
            sortable: true,
        },
        {
            name: 'BP',
            key: 'bp',
            selector: row => row.bp,
            sortable: true,
        },
    ]

    const GestationalColumns = [
        {
            name: 'LMP',
            key: 'lmp',
            selector: row => row.lmp,
            sortable: true,
        },
        {
            name: 'Fundal Height',
            key: 'fundal_height',
            selector: row => row.fundal_height,
            sortable: true,
        },
        {
            name: 'Scan',
            key: 'scan',
            selector: row => row.scan,
            sortable: true,
        },
    ]

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <PregnancyAssessmentPrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>
            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        { label: 'Chest X-Ray', value: data.chestXRay },
                        { label: 'Blood Group', value: data.bloodGroup },
                        { label: 'VDR', value: data.vdr },
                        { label: 'HIV', value: data.hiv },
                        { label: 'Hepatitis', value: data.hepatitis },
                        { label: 'Made By', value: data.madeBy },
                        {
                            label: 'Assessment Date',
                            value: data.assessmentDate,
                        },
                        {
                            label: 'X-Ray Pelvimetry Inlet',
                            value: data.xRayPelvimetryInlet,
                        },
                        {
                            label: 'X-Ray Pelvimetry Outlet',
                            value: data.xRayPelvimetryOutlet,
                        },
                        {
                            label: 'Additional Information',
                            value: data.additionalInformation,
                        },
                        { label: 'Status', value: data.status },
                        { label: 'Cavity', value: data.cavity },
                        { label: 'Outlet Cavity', value: data.outletCavity },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            {data.followUpTableData?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Gestational Age By
                    </Typography>
                    <CustomTable
                        title="Follow-up Data"
                        columns={GestationalColumns}
                        data={data.followUpTableData}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}

            {data.followUpTableData?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Follow-up Examination Details
                    </Typography>
                    <CustomTable
                        title="Follow-up Data"
                        columns={ExaminationColumns}
                        data={data.followUpTableData}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                    <Box pt={1}>
                        <CustomTable
                            title="Follow-up Data"
                            columns={ExaminationTwoColumns}
                            data={data.followUpTableData}
                            pointerOnHover
                            highlightOnHover
                            striped
                            progressPending={false}
                        />
                    </Box>
                </Box>
            )}
        </div>
    )
})

export const ObstetricsAssessmentDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail
    const PregnancyHistoryColumns = [
        {
            name: 'Date of Birth',
            key: 'dateOfBirth',
            selector: row => row.dateOfBirth,
        },
        {
            name: 'Duration of Pregnancy',
            key: 'durationOfPregnancy',
            selector: row => row.durationOfPregnancy,

            width: '200px',
        },
        {
            name: 'Pregnancy Details',
            key: 'pregnancyDetails',
            selector: row => row.pregnancyDetails,
        },
        {
            name: 'Birth Weight',
            key: 'birthWeight',
            selector: row => row.birthWeight,
        },
        {
            name: 'Baby Status',
            key: 'babyStatus',
            selector: row => row.babyStatus,
        },
    ]

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <ObstetricsAssessmentPrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>
            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Typography
                    sx={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#03045e',
                        marginBottom: '15px',
                    }}
                >
                    Personal Information
                </Typography>
                <Grid container spacing={3}>
                    {[
                        { label: 'Surname', value: data.surname },
                        { label: 'First Name', value: data.firstName },
                        { label: 'Age', value: data.age },
                        { label: 'Ethnic Group', value: data.ethnicGroup },
                        { label: 'Occupation', value: data.occupation },
                        { label: 'Employers', value: data.employers },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Medical Details Section */}
            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Typography
                    sx={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#03045e',
                        marginBottom: '15px',
                    }}
                >
                    Medical Details
                </Typography>
                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Hospital Number',
                            value: data.hospitalNumber,
                        },
                        { label: 'X-Ray Number', value: data.exRayNumber },
                        { label: 'Special Points', value: data.specialPoints },
                        { label: 'Consultant', value: data.consultant },
                        {
                            label: 'Indication for Booking',
                            value: data.indicationForBooking,
                        },
                        { label: 'LMP', value: data.lmp },
                        { label: 'EDD', value: data.edd },
                        {
                            label: 'Previous Pregnancies Total',
                            value: data.previousPregnanciesTotal,
                        },
                        {
                            label: 'Number of Living Children',
                            value: data.noOfLivingChildren,
                        },
                        {
                            label: 'Additional Information',
                            value: data.additionalInfo,
                        },
                        { label: 'Status', value: data.status },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Medical History Section */}
            {data.medicalHistory?.length > 0 && (
                <Box
                    sx={{
                        backgroundColor: '#f5f5f5',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBottom: '15px',
                        }}
                    >
                        Medical History
                    </Typography>
                    <Grid container spacing={2}>
                        {data.medicalHistory.map((item, index) => (
                            <Grid item xs={12} key={index}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                        }}
                                    >
                                        Condition: {item.medicalCondition}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.75rem' }}>
                                        Family Relation: {item.familyRelation}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Pregnancy History Table */}
            {data.pregnancyTableData?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Previous Pregnancy History
                    </Typography>
                    <CustomTable
                        title="Pregnancy History"
                        columns={PregnancyHistoryColumns}
                        data={data.pregnancyTableData}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}
        </div>
    )
})

export const HeamodialysisNursingDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail
    const bloodFlowColumns = [
        {
            name: 'Blood Flow',
            key: 'bloodFlow',
            selector: row => row.bloodFlow,
            sortable: true,
        },
        { name: 'VP', key: 'vp', selector: row => row.vp, sortable: true },
        { name: 'AP', key: 'ap', selector: row => row.ap, sortable: true },
        { name: 'UFR', key: 'ufr', selector: row => row.ufr, sortable: true },
        {
            name: 'Heparin',
            key: 'heparin',
            selector: row => row.heparin,
            sortable: true,
        },
    ]

    const bloodFlowTwoColumns = [
        { name: 'BP', key: 'bp', selector: row => row.bp, sortable: true },
        {
            name: 'Fluid Loss',
            key: 'fluidLoss',
            selector: row => row.fluidLoss,
            sortable: true,
        },
        {
            name: 'Remarks',
            key: 'remarks',
            selector: row => row.remarks,
            sortable: true,
        },
        {
            name: 'Nurse Signature',
            key: 'nurseSignature',
            selector: row => row.nurseSignature,
            sortable: true,
        },
    ]

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <HeamodialysisNursingPrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>
            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        { label: 'Date', value: data.date },
                        { label: 'Dialyser', value: data.dialyser },
                        { label: 'Hours', value: data.hours },
                        { label: 'Start Time', value: data.startTime },
                        { label: 'Stop Time', value: data.stopTime },
                        { label: 'Dry Weight', value: data.dryWeight },
                        {
                            label: 'Required Weight Loss',
                            value: data.requiredWeightLoss,
                        },
                        { label: 'Heparin Close', value: data.heparinClose },
                        {
                            label: 'Pre-Dialysis Weight',
                            value: data.preDialysisWeight,
                        },
                        {
                            label: 'Pre-Dialysis Temp',
                            value: data.preDialysisTemp,
                        },
                        { label: 'Pre-Dialysis BP', value: data.preDialysisBP },
                        { label: 'Post Weight', value: data.postWeight },
                        { label: 'Post Temp', value: data.postTemp },
                        { label: 'Post BP', value: data.postBP },
                        { label: 'Dialysis Flow', value: data.dialysisFlow },
                        { label: 'Conductivity', value: data.conductivity },
                        { label: 'Status', value: data.status },
                        { label: 'Long-Term Care', value: data.longTermCare },
                        {
                            label: 'Stages in Healthcare',
                            value: data.stagesInHealthcare,
                        },
                        {
                            label: 'Physical Condition',
                            value: data.physicalCondition,
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {data.bloodFlowTableData?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Blood Flow Details
                    </Typography>
                    <CustomTable
                        title="Blood Flow Table Data"
                        columns={bloodFlowColumns}
                        data={data.bloodFlowTableData}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                    <Box mt={1}>
                        <CustomTable
                            title="Blood Flow Table Data"
                            columns={bloodFlowTwoColumns}
                            data={data.bloodFlowTableData}
                            pointerOnHover
                            highlightOnHover
                            striped
                            progressPending={false}
                        />
                    </Box>
                </Box>
            )}
        </div>
    )
})

export const RecipientTreatmentDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    const StimulationColumns = [
        {
            name: 'Start Date',
            key: 'startDate',
            selector: row => row.startDate,
        },
        {
            name: 'Time',
            key: 'time',
            selector: row => row.time,
        },
        {
            name: 'Buselin/Suprefact',
            key: 'buselinSuprefact',
            selector: row => row.buselinSuprefact,
        },
        {
            name: 'Naferelin/Synarela',
            key: 'naferelinSynarela',
            selector: row => row.naferelinSynarela,
        },
        {
            name: 'Progynova',
            key: 'progynova',
            selector: row => row.progynova,
        },
        {
            name: 'Cyclogest',
            key: 'cyclogest',
            selector: row => row.cyclogest,
        },
        {
            name: 'HCG',
            key: 'hcg',
            selector: row => row.hcg,
        },
        {
            name: 'Follicles Right',
            key: 'folliclesRight',
            selector: row => row.folliclesRight,
        },
        {
            name: 'Follicles Left',
            key: 'folliclesLeft',
            selector: row => row.folliclesLeft,
        },
    ]

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <RecipientTreatmentPrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Treatment Cycle',
                            value: data.treatment_cycle,
                        },
                        {
                            label: 'Treatment Form',
                            value: data.treatment_form ? 'Yes' : 'No',
                        },
                        {
                            label: 'Indication Male',
                            value: data.indication_male ? 'Yes' : 'No',
                        },
                        {
                            label: 'Registration',
                            value: data.registration ? 'Yes' : 'No',
                        },
                        {
                            label: 'Indication Female',
                            value: data.indication_female ? 'Yes' : 'No',
                        },
                        {
                            label: 'Transfer Cycle',
                            value: data.transfer_cycle ? 'Yes' : 'No',
                        },
                        { label: 'Score', value: data.score },
                        { label: 'Donated', value: data.donated },
                        { label: 'Frozen', value: data.frozen },
                        {
                            label: 'Plan for Treatment',
                            value: data.plan_for_treatment,
                        },
                        {
                            label: 'Additional Information',
                            value: data.additional_information,
                        },
                        {
                            label: 'Document Status',
                            value: data.documentStatus,
                        },
                        {
                            label: 'Outcome of Treatment',
                            value: data.outcome_of_treatment ? 'Yes' : 'No',
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Grid container spacing={2}>
                {[
                    { key: 'allergies', label: 'Allergies' },
                    { key: 'embryos', label: 'Embryos' },
                    { key: 'transferred', label: 'Transferred' },
                ].map(
                    ({ key, label }) =>
                        data[key]?.length > 0 && (
                            <Grid item xs={12} sm={6} md={4} key={key}>
                                <Box
                                    sx={{
                                        backgroundColor: '#f5f5f5',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        height: '100%',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#03045e',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#000000',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {data[key]
                                            .map(item => item.value)
                                            .join(', ')}
                                    </Typography>
                                </Box>
                            </Grid>
                        ),
                )}
            </Grid>

            {data.stimulationData?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Stimulation
                    </Typography>
                    <CustomTable
                        title="Stimulation Data"
                        columns={StimulationColumns}
                        data={data.stimulationData}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}
        </div>
    )
})

export const IntrauterineInseminationDocument = forwardRef(
    ({ Clinic }, ref) => {
        const data = Clinic?.documentdetail

        const StimulationColumns = [
            {
                name: 'Start Date',
                key: 'startDate',
                selector: row => row.startDate,
                sortable: true,
            },
            {
                name: 'Time',
                key: 'time',
                selector: row => row.time,
                sortable: true,
            },
            {
                name: 'Clomid',
                key: 'clomid',
                selector: row => row.clomid,
                sortable: true,
            },
            {
                name: 'FSH',
                key: 'fsh',
                selector: row => row.fsh,
                sortable: true,
            },
            {
                name: 'HCG',
                key: 'hcg',
                selector: row => row.hcg,
                sortable: true,
            },
            {
                name: 'Follicles Right',
                key: 'folliclesRight',
                selector: row => row.folliclesRight,
                sortable: true,
            },
            {
                name: 'Follicles Left',
                key: 'folliclesLeft',
                selector: row => row.folliclesLeft,
                sortable: true,
            },
            {
                name: 'Added By',
                key: 'addedBy',
                selector: row => row.addedBy,
                sortable: true,
            },
        ]

        return (
            <div
                className={
                    Clinic.show
                        ? 'card-content p-1'
                        : 'card-content p-1 is-hidden'
                }
            >
                <Box sx={{ display: 'none' }}>
                    <IntrauterineInseminationPrintOut
                        ref={ref}
                        data={data}
                        Clinic={Clinic}
                    />
                </Box>

                <Box
                    sx={{
                        backgroundColor: '#f5f5f5',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                    }}
                >
                    <Grid container spacing={3}>
                        {[
                            { label: 'Score', value: data.score },
                            { label: 'Donated', value: data.donated },
                            {
                                label: 'Plan for Treatment',
                                value: data.plan_for_treatment,
                            },
                            {
                                label: 'Additional Information',
                                value: data.additional_information,
                            },
                            {
                                label: 'Document Status',
                                value: data.documentStatus,
                            },
                            { label: 'Sperm Source', value: data.sperm_source },
                            {
                                label: 'Outcome of Treatment',
                                value: data.outcome_of_treatment ? 'Yes' : 'No',
                            },
                        ].map(({ label, value }, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#03045e',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        {label}:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#000000',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {data.stimulationData?.length > 0 && (
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: '#03045e',
                                marginBlock: '15px',
                            }}
                        >
                            Stimulation
                        </Typography>
                        <CustomTable
                            title="Stimulation Data"
                            columns={StimulationColumns}
                            data={data.stimulationData}
                            pointerOnHover
                            highlightOnHover
                            striped
                            progressPending={false}
                        />
                    </Box>
                )}
            </div>
        )
    },
)

export const LaboratoryTreatmentDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    const AspirationColumns = [
        {
            name: 'Aspiration Date',
            key: 'aspirationDate',
            selector: row => row.aspirationDate,
            sortable: true,
        },
        {
            name: 'Aspiration Time',
            key: 'aspirationTime',
            selector: row => row.aspirationTime,
            sortable: true,
        },
        {
            name: 'Transfer Time',
            key: 'transferTime',
            selector: row => row.transferTime,
            sortable: true,
        },
        {
            name: 'Embryo Time Out',
            key: 'embryoTimeOut',
            selector: row => row.embryoTimeOut,
            sortable: true,
        },
        {
            name: 'Fertilization Rate',
            key: 'fertilizationRate',
            selector: row => row.fertilizationRate,
            sortable: true,
        },
        {
            name: 'Cleavage Percentage',
            key: 'cleavagePercentage',
            selector: row => row.cleavagePercentage,
            sortable: true,
        },
        {
            name: 'Blastocytes Percentage',
            key: 'blastocytesPercentage',
            selector: row => row.blastocytesPercentage,
            sortable: true,
        },
        {
            name: 'PT Date',
            key: 'ptDate',
            selector: row => row.ptDate,
            sortable: true,
        },
        {
            name: 'PT Result',
            key: 'ptResult',
            selector: row => row.ptResult,
            sortable: true,
        },
        {
            name: 'Transfer Comment',
            key: 'transferComment',
            selector: row => row.transferComment,
            sortable: true,
        },
    ]

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <LaboratoryTreatmentPrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        { label: 'Name', value: data.name },
                        { label: 'Date', value: data.date },
                        {
                            label: 'Additional Information',
                            value: data.additional_information,
                        },
                        {
                            label: 'Document Status',
                            value: data.documentStatus,
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {data.aspirationData?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Aspiration
                    </Typography>
                    <CustomTable
                        title="Aspiration Data"
                        columns={AspirationColumns}
                        data={data.aspirationData}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}
        </div>
    )
})

export const TreatmentSummaryDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    const InvestigationColumns = [
        {
            name: 'Investigation',
            key: 'investigation',
            selector: row => row.investigation,
            sortable: true,
        },
        {
            name: 'Date',
            key: 'date',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Result',
            key: 'result',
            selector: row => row.result,
            sortable: true,
        },
        {
            name: 'Unit',
            key: 'unit',
            selector: row => row.unit,
            sortable: true,
        },
        {
            name: 'Transfer Comment',
            key: 'transferComment',
            selector: row => row.transferComment,
            sortable: true,
        },
    ]

    const DrugColumns = [
        {
            name: 'Type',
            key: 'type',
            selector: row => row.type,
            sortable: true,
        },
        {
            name: 'Drug Name',
            key: 'drugName',
            selector: row => row.drugName,
            sortable: true,
        },
        {
            name: 'Start Date',
            key: 'startDate',
            selector: row => row.startDate,
            sortable: true,
        },
        {
            name: 'No. of Days',
            key: 'noOfDays',
            selector: row => row.noOfDays,
            sortable: true,
        },
        {
            name: 'Dose',
            key: 'dose',
            selector: row => row.dose,
            sortable: true,
        },
        {
            name: 'Total Dose',
            key: 'totalDose',
            selector: row => row.totalDose,
            sortable: true,
        },
    ]

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <TreatmentSummaryPrintOut
                    ref={ref}
                    data={data}
                    Clinic={Clinic}
                />
            </Box>

            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            >
                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Referring Doctor',
                            value: data.referring_doctor,
                        },
                        { label: 'Consultant', value: data.consultant },
                        {
                            label: 'Additional Treatment',
                            value: data.additional_treatment,
                        },
                        {
                            label: 'Dr. in Charge of Treatment',
                            value: data.dr_in_charge_of_treatment,
                        },
                        { label: 'Drug Protocol', value: data.drug_protocol },
                        { label: 'LMP', value: data.lmp },
                        {
                            label: 'Egg Collection Date',
                            value: data.egg_collection_date,
                        },
                        {
                            label: 'No. of Eggs Collected',
                            value: data.no_of_eggs_collected,
                        },
                        {
                            label: 'Eggs Fertilized',
                            value: data.eggs_fertilized,
                        },
                        {
                            label: 'Embryos Transferred',
                            value: data.embryos_transferred,
                        },
                        { label: 'Eggs Discarded', value: data.eggs_discarded },
                        { label: 'Embryos Stored', value: data.embryos_stored },
                        {
                            label: 'Assisted Hatching',
                            value: data.assisted_hatching,
                        },
                        {
                            label: 'Eggs Microinjected',
                            value: data.eggs_microinjected,
                        },
                        {
                            label: 'Metaphase 2 Egg Collected',
                            value: data.metaphase_2_egg_collected,
                        },
                        {
                            label: "Inseminated with Partner's Sperm",
                            value: data.inseminated_with_partners_sperm,
                        },
                        { label: 'Complication', value: data.complication },
                        { label: 'Outcome', value: data.outcome },
                        {
                            label: 'Additional Information',
                            value: data.additional_information,
                        },
                        {
                            label: 'Document Status',
                            value: data.documentStatus,
                        },
                        {
                            label: 'Treatment Protocol Type',
                            value: data.treatment_protocol_type,
                        },
                    ].map(({ label, value }, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#03045e',
                                        marginBottom: '5px',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        color: '#000000',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {data.investigationData?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Investigation
                    </Typography>
                    <CustomTable
                        title="Investigation Data"
                        columns={InvestigationColumns}
                        data={data.investigationData}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}

            {data.drugData?.length > 0 && (
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#03045e',
                            marginBlock: '15px',
                        }}
                    >
                        Drug
                    </Typography>
                    <CustomTable
                        title="Drug Data"
                        columns={DrugColumns}
                        data={data.drugData}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}
        </div>
    )
})

export const MedicationListDocument = forwardRef(({ Clinic }, ref) => {
    const AllergiesColumns = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            width: '50px',
            center: true,
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
        },
        {
            name: 'Allergine',
            key: 'allergine',
            description: 'Allergine',
            selector: row => row.allergine,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },

        {
            name: 'Reaction',
            key: 'reaction',
            description: 'Midlle Name',
            selector: row => row.reaction,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },
    ]

    const MedicationColumns = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            width: '50px',
            center: true,
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
        },
        {
            name: 'Drug Name',
            key: 'drugname',
            description: 'Allergine',
            selector: row => row.drugname,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },

        {
            name: 'Strength/Frequency',
            key: 'strengthfreq',
            description: 'Midlle Name',
            selector: row => row.strengthfreq,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },

        {
            name: 'Notes',
            key: 'notes',
            description: 'Midlle Name',
            selector: row => row.notes,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },
    ]
    const data = Clinic?.documentdetail
    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <MedicationListPrintOut ref={ref} data={data} Clinic={Clinic} />
            </Box>

            {Object.entries(data).map(
                ([keys, value], i) =>
                    value?.length > 0 && (
                        <Box key={i}>
                            {keys !== 'Allergies' && keys !== 'Medications' && (
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex' }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        color: '#03045e',
                                                        marginRight: '5px',
                                                    }}
                                                >
                                                    {keys}:
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        fontSize: '0.75rem',
                                                        color: '#000000',
                                                    }}
                                                >
                                                 {dayjs(value).isValid()
                                                    ? dayjs(value).format("DD/MM/YYYY")
                                                    : value}
                                                    {/* {value} */}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {keys === 'Allergies' && (
                                <Box>
                                    <Box>
                                        <FormsHeaderText text="Allergies" />
                                    </Box>

                                    {data?.Allergies?.length > 0 && (
                                        <Box
                                            sx={{
                                                height: 'auto',
                                                width: '100%',
                                            }}
                                        >
                                            <CustomTable
                                                title="Allergies"
                                                columns={AllergiesColumns}
                                                data={data?.Allergies}
                                                pointerOnHover
                                                highlightOnHover
                                                striped
                                                progressPending={false}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {keys === 'Medications' && (
                                <Box>
                                    <Box>
                                        <FormsHeaderText text="Medications" />
                                    </Box>

                                    {data?.Medications?.length > 0 && (
                                        <Box
                                            sx={{
                                                height: 'auto',
                                                width: '100%',
                                            }}
                                        >
                                            <CustomTable
                                                title="Medications"
                                                columns={MedicationColumns}
                                                data={data.Medications}
                                                pointerOnHover
                                                highlightOnHover
                                                striped
                                                progressPending={false}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>
                    ),
            )}
        </div>
    )
})

export const PediatricForm = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    const columnsOne = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            width: '50px',
            center: true,
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
        },
        {
            name: 'Allergine',
            key: 'allergine',
            description: 'Allergine',
            selector: row => row.allergine,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },

        {
            name: 'Reaction',
            key: 'reaction',
            description: 'Reaction',
            selector: row => row.reaction,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },
    ]

    const columnsTwo = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            width: '50px',
            center: true,
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
        },
        {
            name: 'Symptoms',
            key: 'symptom',
            description: 'Symptom',
            selector: row => row.symptom,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },

        {
            name: 'Duration',
            key: 'duration',
            description: 'Duration',
            selector: row => row.duration,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },
    ]

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
            ref={ref}
        >
            <Box sx={{ display: 'none' }}>
                <PediatricPulmonologyList
                    ref={ref}
                    Clinic={Clinic}
                    data={Clinic.documentdetail}
                />
            </Box>

            {Object.entries(data).map(([keys, value], i) => (
                <Box key={i}>
                    {value?.length > 0 && (
                        <>
                            {keys !== 'Allergy_Skin_Test' &&
                                keys !== 'Presenting_Complaints' && (
                                    <Box>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Box sx={{ display: 'flex' }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600',
                                                            color: '#03045e',
                                                            marginRight: '5px',
                                                        }}
                                                    >
                                                        {keys}:
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize: '0.75rem',
                                                            color: '#000000',
                                                        }}
                                                    >
                                                        {/* {dayjs(value).isValid()
                              ? dayjs(value).format("DD/MM/YYYY")
                              : value} */}
                                                        {value}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                            {keys === 'Allergy_Skin_Test' && (
                                <Box>
                                    <Box>
                                        <FormsHeaderText text="Allergy Skin Test" />
                                    </Box>

                                    {data?.Allergy_Skin_Test?.length > 0 && (
                                        <Box
                                            sx={{
                                                height: 'auto',
                                                width: '100%',
                                            }}
                                        >
                                            <CustomTable
                                                title="Tests"
                                                columns={columnsOne}
                                                data={data.Allergy_Skin_Test}
                                                pointerOnHover
                                                highlightOnHover
                                                striped
                                                progressPending={false}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {keys === 'Presenting_Complaints' && (
                                <Box>
                                    <Box>
                                        <FormsHeaderText text="Presenting Complaints" />
                                    </Box>

                                    {data?.Presenting_Complaints?.length >
                                        0 && (
                                        <Box
                                            sx={{
                                                height: 'auto',
                                                width: '100%',
                                            }}
                                        >
                                            <CustomTable
                                                title="Tests"
                                                columns={columnsTwo}
                                                data={
                                                    data.Presenting_Complaints
                                                }
                                                pointerOnHover
                                                highlightOnHover
                                                striped
                                                progressPending={false}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            ))}
        </div>
    )
})

export const AdultAthsmaQuestionaire = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    const columns = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            width: '50px',
            center: true,
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
        },
        {
            name: 'Allergine',
            key: 'allergine',
            description: 'Allergine',
            selector: row => row.allergine,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },

        {
            name: 'Reaction',
            key: 'reaction',
            description: 'Reaction',
            selector: row => row.reaction,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },
    ]

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <AdultQuestionnairePrintOut
                    Clinic={Clinic}
                    data={Clinic?.documentdetail}
                    ref={ref}
                />
            </Box>

            {Object.entries(data).map(([keys, value], i) => (
                <Box key={i}>
                    {value?.length > 0 &&
                        (keys !== 'Allergy_Skin_Test' ? (
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex' }}>
                                            <Typography
                                                sx={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    color: '#03045e',
                                                    marginRight: '5px',
                                                }}
                                            >
                                                {keys}:
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontSize: '0.75rem',
                                                    color: '#000000',
                                                }}
                                            >
                                                {/* {dayjs(value).isValid()
                          ? dayjs(value).format("DD/MM/YYYY")
                          : value} */}
                                                {value}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        ) : (
                            <Box>
                                <FormsHeaderText text="Tests" />
                                {data?.Allergy_Skin_Test?.length > 0 && (
                                    <Box sx={{ height: 'auto', width: '100%' }}>
                                        <CustomTable
                                            title="Tests"
                                            columns={columns}
                                            data={data.Allergy_Skin_Test}
                                            pointerOnHover
                                            highlightOnHover
                                            striped
                                            progressPending={false}
                                        />
                                    </Box>
                                )}
                            </Box>
                        ))}
                </Box>
            ))}
        </div>
    )
})

export const PrescriptionDocument = forwardRef(({ Clinic }, ref) => {
    const columns = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            width: '50px',
            center: true,
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
        },
        {
            name: 'Medication',
            key: 'medication',
            description: 'Test',
            selector: row => row.name || row.medication,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },
        {
            name: 'Amount',
            key: 'amount',
            description: 'Enter Amount',
            selector: row => row.calcAmount,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },
        {
            name: 'Quantity',
            key: 'quantity',
            description: 'Enter Quantity',
            selector: row => row.quantity,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },
        {
            name: 'Instruction',
            key: 'instruction',
            description: 'Test',
            selector: row => (row.instruction ? row.instruction : '------'),
            sortable: true,
            required: true,
            inputType: 'TEXT',
            center: true,
        },

        {
            name: 'Destination',
            key: 'destination',
            description: 'destination',
            selector: row => row.destination,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },
    ]

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <PrescriptionPrintOut
                    data={Clinic.documentdetail}
                    ref={ref}
                    Clinic={Clinic}
                />
            </Box>

            {Clinic.documentdetail.length > 0 && (
                <div>
                    <FormsHeaderText text="Product" />
                    <Box sx={{ height: 'auto' }}>
                        <CustomTable
                            columns={columns}
                            data={Clinic.documentdetail}
                            pointerOnHover
                            highlightOnHover
                            striped
                            progressPending={false}
                        />
                    </Box>
                </div>
            )}
        </div>
    )
})

export const TheatreDocument = forwardRef(({ Clinic }, ref) => {
    const columns = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            width: '50px',
            selector: row => (row.instruction ? row.instruction : '------'),
            center: true,
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
        },
        {
            name: 'Theatre Service',
            key: 'medication',
            description: 'Test',
            selector: row => row.medication,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },
        {
            name: 'Procedure Instructions',
            key: 'instruction',
            description: 'Test',
            sortable: true,
            required: true,
            inputType: 'TEXT',
            center: true,
        },

        {
            name: 'Destination',
            key: 'destination',
            description: 'destination',
            selector: row => row.destination,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },
    ]

    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <PrescriptionPrintOut
                    data={Clinic.documentdetail}
                    ref={ref}
                    Clinic={Clinic}
                />
            </Box>

            {Clinic.documentdetail.length > 0 && (
                <div>
                    <FormsHeaderText text="Theatre" />
                    <Box sx={{ height: 'auto' }}>
                        <CustomTable
                            columns={columns}
                            data={Clinic.documentdetail}
                            pointerOnHover
                            highlightOnHover
                            striped
                            progressPending={false}
                        />
                    </Box>
                </div>
            )}
        </div>
    )
})

export const RadiologyOrdersDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    const columns = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            width: '50px',
            center: true,
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
        },
        {
            name: 'Test',
            key: 'test',
            description: 'Test',
            selector: row => row.test,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },

        {
            name: 'Destination',
            key: 'destination',
            description: 'destination',
            selector: row => row.destination,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },
    ]
    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <RadiologyOrdersPrintOut
                    data={data}
                    ref={ref}
                    Clinic={Clinic}
                />
            </Box>

            <Box>
                <FormsHeaderText text="Tests" />
            </Box>

            {data?.length > 0 && (
                <Box sx={{ height: 'auto', width: '100%' }}>
                    <CustomTable
                        title="Tests"
                        columns={columns}
                        data={data}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}
        </div>
    )
})

export const LabOrdersDocument = forwardRef(({ Clinic }, ref) => {
    const data = Clinic?.documentdetail

    /*  const removeNullOrUndefinedEmpty=(obj) =>  {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => {
        // Remove keys with null, undefined, or empty string values
        return value !== null && value !== undefined && value !== '';
      })
    );
  }
data = removeNullOrUndefinedEmpty(data) */

    const columns = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            width: '50px',
            center: true,
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
        },
        {
            name: 'Test',
            key: 'test',
            description: 'Test',
            selector: row => row.test,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },

        {
            name: 'Destination',
            key: 'destination',
            description: 'destination',
            selector: row => row.destination,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        },
    ]
    return (
        <div
            className={
                Clinic.show ? 'card-content p-1' : 'card-content p-1 is-hidden'
            }
        >
            <Box sx={{ display: 'none' }}>
                <LaboratoryOrdersPrintOut
                    data={data}
                    ref={ref}
                    Clinic={Clinic}
                />
            </Box>
            <Box>
                <FormsHeaderText text="Tests" />
            </Box>

            {data?.length > 0 && (
                <Box sx={{ height: 'auto', width: '100%' }}>
                    <CustomTable
                        title="Tests"
                        columns={columns}
                        data={data}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={false}
                    />
                </Box>
            )}
        </div>
    )
})

export const BilledOrdersDocument = forwardRef(({ Clinic }, ref) => {
    const columns = [
        {
            name: 'S/NO',
            width: '50px',
            key: 'sn',
            center: true,
            selector: (row, i) => i + 1,
            sortable: true,
            required: true,
            inputType: 'HIDDEN',
        },
        {
            name: 'Category',
            key: 'category',
            description: 'Enter Category',
            selector: row => row.category,
            sortable: true,
            required: true,
            inputType: 'TEXT',
            center: true,
        },

        {
            name: 'Name',
            key: 'name',
            description: 'Enter Name',
            selector: row => row.name,
            sortable: true,
            required: true,
            inputType: 'DATE',
            center: true,
        },

        {
            name: 'Quantity',
            key: 'quantity',
            width: '100px',
            center: 'true',
            description: 'Enter Quantity',
            selector: row => row.quantity,
            sortable: true,
            required: true,
            inputType: 'DATE',
        },

        {
            name: 'Unit',
            key: 'unit',
            description: 'Enter Category',
            selector: row => row.baseunit,
            sortable: true,
            required: true,
            center: true,
            inputType: 'DATE',
        },
        {
            name: 'Selling Price',
            key: 'sellingprice',
            description: 'Enter Category',
            selector: row => row.sellingprice,
            sortable: true,
            required: true,
            inputType: 'DATE',
            center: true,
        },
        {
            name: 'Amount',
            key: 'amount',
            description: 'Enter Category',
            selector: row => row.amount,
            sortable: true,
            required: true,
            center: true,
            inputType: 'DATE',
        },

        {
            name: 'Mode',
            key: 'billMode',
            description: 'Enter Category',
            selector: row => row.billMode?.type,
            sortable: true,
            required: true,
            center: true,
            inputType: 'DATE',
        },
    ]
    return (
        <>
            <Box sx={{ display: 'none' }}>
                <BilledOrdersPrintOut
                    data={Clinic.documentdetail}
                    ref={ref}
                    Clinic={Clinic}
                />
            </Box>
            <Box sx={{ height: 'auto' }}>
                <FormsHeaderText text="Bill Orders" />
                <CustomTable
                    title={'Bill Orders:'}
                    columns={columns}
                    data={Clinic.documentdetail}
                    pointerOnHover
                    highlightOnHover
                    striped
                    progressPending={false}
                />
            </Box>
        </>
    )
})
