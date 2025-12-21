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
import CustomSelect from '../../components/inputs/basic/Select'
import GlobalCustomButton from '../../components/buttons/CustomButton'
import CustomTable from '../../components/customtable'
import DeleteIcon from '@mui/icons-material/Delete'
import GroupedRadio from '../../components/inputs/basic/Radio/GroupedRadio'
import AddBoxIcon from '@mui/icons-material/AddBox'
import Textarea from '../../components/inputs/basic/Textarea'
import ModalBox from '../../components/modal'
import ClaimCreateMedications from '../Corporate/components/claims/Medications'
import ClaimCreateSurgHistory from '../Corporate/components/claims/SurgHistory'
import ClaimCreateAllergy from '../Corporate/components/claims/Allergy'
import ClaimCreateMedHistory from '../Corporate/components/claims/MedHistory'
import ClaimCreateHospt from '../Corporate/components/claims/Hospt'

const SleepHistoryAndIntake = () => {
    const { state, setState, hideActionLoader, showActionLoader } =
        useContext(ObjectContext)
    const [confirmDialog, setConfirmDialog] = useState(false)
    const [medications, setMedications] = useState([])
    const [newMedications, setNewMedications] = useState([])
    const [medicationsModal, setMedicationsModal] = useState(false)
    const [allergies, setAllergies] = useState([])
    const [newAllergy, setNewAllergy] = useState([])
    const [allergyModal, setAllergyModal] = useState(false)
    const [medHistory, setMedHistory] = useState([])
    const [newMedHistory, setNewMedHistory] = useState([])
    const [medHistoryModal, setMedHistoryModal] = useState(false)
    const [surgHistory, setSurgHistory] = useState([])
    const [newSurgHistory, setNewSurgHistory] = useState([])
    const [surgHistoryModal, setSurgHistoryModal] = useState(false)
    const [hospt, setHospt] = useState([])
    const [newHospt, setNewHospt] = useState([])
    const [hosptModal, setHosptModal] = useState(false)
    const { register, handleSubmit, control, reset, setValue } = useForm()

    const { user } = useContext(UserContext) //,setUser
    const [docStatus, setDocStatus] = useState('Draft')

    const handleChangeStatus = async e => {
        setDocStatus(e.target.value)
    }

    let draftDoc = state.DocumentClassModule.selectedDocumentClass.document
    const ClientServ = client.service('clinicaldocument')

    const handleDeleteMedication = name => {
        setMedications(
            medications.filter(entry => entry.medicationName !== name),
        )
    }
    const handleDeleteAllergy = name => {
        setAllergies(allergies.filter(entry => entry.allergen !== name))
    }
    const handleDeleteMedHistory = name => {
        setMedHistory(
            medHistory.filter(entry => entry.medicalCondition !== name),
        )
    }
    const handleDeleteSurgHistory = name => {
        setSurgHistory(surgHistory.filter(entry => entry.procedure !== name))
    }
    const handleDeleteHosptHistory = name => {
        setHospt(hospt.filter(entry => entry.hospt !== name))
    }

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
        {
            name: 'Action',
            key: 'action',
            selector: row => row.action,
            sortable: false,
            cell: row => (
                <span
                    onClick={() => {
                        handleDeleteMedication(row.medicationName)
                    }}
                >
                    <DeleteIcon
                        sx={{
                            color: '#e57373',
                            fontSize: '18px',
                            ':hover': {
                                color: 'red',
                            },
                        }}
                    />
                </span>
            ),
            width: '100px',
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
        {
            name: 'Action',
            key: 'action',
            selector: row => row.action,
            sortable: false,
            cell: row => (
                <span
                    onClick={() => {
                        handleDeleteAllergy(row.allergen)
                    }}
                >
                    <DeleteIcon
                        sx={{
                            color: '#e57373',
                            fontSize: '18px',
                            ':hover': {
                                color: 'red',
                            },
                        }}
                    />
                </span>
            ),
            width: '100px',
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

        {
            name: 'Action',
            key: 'action',
            selector: row => row.action,
            sortable: false,
            cell: row => (
                <span
                    onClick={() => {
                        handleDeleteMedHistory(row.medicalCondition)
                    }}
                >
                    <DeleteIcon
                        sx={{
                            color: '#e57373',
                            fontSize: '18px',
                            ':hover': {
                                color: 'red',
                            },
                        }}
                    />
                </span>
            ),
            width: '100px',
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

        {
            name: 'Action',
            key: 'action',
            selector: row => row.action,
            sortable: false,
            cell: row => (
                <span
                    onClick={() => {
                        handleDeleteSurgHistory(row.procedure)
                    }}
                >
                    <DeleteIcon
                        sx={{
                            color: '#e57373',
                            fontSize: '18px',
                            ':hover': {
                                color: 'red',
                            },
                        }}
                    />
                </span>
            ),
            width: '100px',
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

        {
            name: 'Action',
            key: 'action',
            selector: row => row.action,
            sortable: false,
            cell: row => (
                <span
                    onClick={() => {
                        handleDeleteHosptHistory(row.hospt)
                    }}
                >
                    <DeleteIcon
                        sx={{
                            color: '#e57373',
                            fontSize: '18px',
                            ':hover': {
                                color: 'red',
                            },
                        }}
                    />
                </span>
            ),
            width: '100px',
        },
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
            Object.entries(draftDoc.documentdetail).map(([keys, value], i) => {
                if (keys === 'medications') {
                    let stuff = Array.isArray(value)
                    setNewMedications(stuff)
                    setMedications(value)
                }
                if (keys === 'allergies') {
                    let stuff = Array.isArray(value)
                    setNewAllergy(stuff)
                    setAllergies(value)
                }
                if (keys === 'medHistory') {
                    let stuff = Array.isArray(value)
                    setNewMedHistory(stuff)
                    setMedHistory(value)
                }
                if (keys === 'surgHistory') {
                    let stuff = Array.isArray(value)
                    setNewSurgHistory(stuff)
                    setSurgHistory(value)
                }
                if (keys === 'hospt') {
                    let stuff = Array.isArray(value)
                    setNewHospt(stuff)
                    setHospt(value)
                }
                setValue(keys, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                })
            })
        }
        return () => {
            draftDoc = {}
        }
    }, [draftDoc])

    // useEffect(() => {
    //     if (!!draftDoc && draftDoc.status === 'Draft') {
    //         Object.entries(draftDoc.documentdetail).map(([keys, value], i) =>
    //             setValue(keys, value, {
    //                 shouldValidate: true,
    //                 shouldDirty: true,
    //             }),
    //         )
    //     }

    //     if (!medications?.length && draftDoc?.documentdetail?.medications) {
    //         setMedications(draftDoc?.documentdetail?.medications)
    //     }
    //     if (!allergies?.length && draftDoc?.documentdetail?.allergies) {
    //         setAllergies(draftDoc?.documentdetail?.allergies)
    //     }
    //     if (!medHistory?.length && draftDoc?.documentdetail?.medHistory) {
    //         setMedHistory(draftDoc?.documentdetail?.medHistory)
    //     }
    //     if (!surgHistory?.length && draftDoc?.documentdetail?.surgHistory) {
    //         setSurgHistory(draftDoc?.documentdetail?.surgHistory)
    //     }
    //     if (!hospt?.length && draftDoc?.documentdetail?.hospt) {
    //         setHospt(draftDoc?.documentdetail?.hospt)
    //     }

    //     return () => {
    //         draftDoc = {}
    //     }
    // }, [draftDoc])

    const onSubmit = data => {
        showActionLoader()
        const completeData = {
            ...data,
            medications,
            allergies,
            medHistory,
            surgHistory,
            hospt,
        }

        let document = {}

        if (user.currentEmployee) {
            document.facility = user.currentEmployee.facilityDetail._id
            document.facilityname =
                user.currentEmployee.facilityDetail.facilityName // or from facility dropdown
        }
        document.documentdetail = completeData
        document.documentname = 'Sleep History And Intake'
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

        console.log(document)

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
                    Object.keys(completeData).forEach(key => {
                        completeData[key] = null
                    })
                    setConfirmDialog(false)
                    hideActionLoader()
                    reset(completeData)
                    toast.success(
                        'Sleep History And Intake updated succesfully',
                    )
                    closeEncounterRight()
                })
                .catch(err => {
                    hideActionLoader()
                    setConfirmDialog(false)
                    toast.error(
                        'Error updating Sleep History And Intake ' + err,
                    )
                })
        } else {
            ClientServ.create(document)
                .then(() => {
                    Object.keys(completeData).forEach(key => {
                        completeData[key] = null
                    })
                    hideActionLoader()
                    //e.target.reset();
                    reset(completeData)
                    setConfirmDialog(false)
                    toast.success(
                        'Sleep History And Intake created succesfully',
                    )
                    closeEncounterRight()
                })
                .catch(err => {
                    setConfirmDialog(false)
                    hideActionLoader()
                    toast.error(
                        'Error creating Sleep History And Intake ' + err,
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
                    message="You're about to create an Sleep History and Intake Document"
                />

                <ModalBox
                    open={surgHistoryModal}
                    onClose={() => setSurgHistoryModal(false)}
                    header="Add Surgical History to Claim"
                >
                    <ClaimCreateSurgHistory
                        closeModal={() => setSurgHistoryModal(false)}
                        setSurgHistory={setSurgHistory}
                    />
                </ModalBox>
                <ModalBox
                    open={allergyModal}
                    onClose={() => setAllergyModal(false)}
                    header="Add Allergy to Claim"
                >
                    <ClaimCreateAllergy
                        closeModal={() => setAllergyModal(false)}
                        setAllergy={setAllergies}
                    />
                </ModalBox>
                <ModalBox
                    open={medHistoryModal}
                    onClose={() => setMedHistoryModal(false)}
                    header="Add Medical History to Claim"
                >
                    <ClaimCreateMedHistory
                        closeModal={() => setMedHistoryModal(false)}
                        setMedHistory={setMedHistory}
                    />
                </ModalBox>
                <ModalBox
                    open={hosptModal}
                    onClose={() => setHosptModal(false)}
                    header="Add Hosptitalization to Claim"
                >
                    <ClaimCreateHospt
                        closeModal={() => setHosptModal(false)}
                        setHospt={setHospt}
                    />
                </ModalBox>
                <ModalBox
                    open={medicationsModal}
                    onClose={() => setMedicationsModal(false)}
                    header="Add Medications to Claim"
                >
                    <ClaimCreateMedications
                        closeModal={() => setMedicationsModal(false)}
                        setMedications={setMedications}
                    />
                </ModalBox>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                    mb={1}
                >
                    <FormsHeaderText text="Sleep history and Intake FORM" />

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
                        <Grid item xs={6}>
                            <Input
                                register={register('referringPhysician')}
                                type="text"
                                label="Referring Physician"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('physicianPhone')}
                                type="text"
                                label="Physician Phone"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('primaryCarePhysician')}
                                type="text"
                                label="Primary Care Physician"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('primaryCarePhysicianPhone')}
                                type="text"
                                label="Physician Phone"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Input
                                register={register('reasonForVisit')}
                                type="text"
                                label="Briefly Describe Your Chief Complaint (Reason For Visit)"
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
                                Current Medication
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'presentlyOnMedications'}
                                    label="Are you currently taking any prescription and non-prescription medications, vitamins, home remedies, birth control, herbs, “as needed” medications, etc.?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>

                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography
                                    sx={{
                                        fontSize: '0.9rem',
                                        mb: 1,
                                    }}
                                >
                                    List all medications below (Attach
                                    additional columns as needed)
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                my: 2,
                                px: 1,
                            }}
                        >
                            <FormsHeaderText text="Medications Data" />

                            {newMedications && (
                                <GlobalCustomButton
                                    onClick={() => setMedicationsModal(true)}
                                    sx={{ marginLeft: 'auto' }}
                                >
                                    <AddBoxIcon
                                        sx={{ marginRight: '3px' }}
                                        fontSize="small"
                                    />
                                    Add Medications
                                </GlobalCustomButton>
                            )}
                        </Box>
                    </Box>

                    <Box>
                        {newMedications ? (
                            <CustomTable
                                title={''}
                                columns={MedicationSchema}
                                data={medications}
                                pointerOnHover
                                highlightOnHover
                                striped
                                //onRowClicked={handleRow}
                                //conditionalRowStyles={conditionalRowStyles}
                                progressPending={false}
                                CustomEmptyData={
                                    <Typography sx={{ fontSize: '0.8rem' }}>
                                        You&apos;ve not added a Medication
                                        yet...
                                    </Typography>
                                }
                            />
                        ) : (
                            <Textarea
                                register={register('Medications')}
                                type="text"
                                label="Medications"
                                placeholder="Medications......"
                            />
                        )}
                    </Box>

                    <Grid container spacing={1}>
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
                                Allergies
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'hasAllergies'}
                                    label="Any allergies to food, medications, environment, etc.?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                }}
                            >
                                List below (attach additional pages as needed)
                            </Typography>
                        </Grid>
                    </Grid>

                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                my: 2,
                                px: 1,
                            }}
                        >
                            <FormsHeaderText text="Allergy Data" />

                            {newAllergy && (
                                <GlobalCustomButton
                                    onClick={() => setAllergyModal(true)}
                                    sx={{ marginLeft: 'auto' }}
                                >
                                    <AddBoxIcon
                                        sx={{ marginRight: '3px' }}
                                        fontSize="small"
                                    />
                                    Add Allergy
                                </GlobalCustomButton>
                            )}
                        </Box>
                    </Box>
                    <Box>
                        {newAllergy ? (
                            <CustomTable
                                title={''}
                                columns={AllergySchema}
                                data={allergies}
                                pointerOnHover
                                highlightOnHover
                                striped
                                progressPending={false}
                                CustomEmptyData={
                                    <Typography sx={{ fontSize: '0.8rem' }}>
                                        You&apos;ve not added an Allergy yet...
                                    </Typography>
                                }
                            />
                        ) : (
                            <Textarea
                                register={register('Allergy')}
                                type="text"
                                label="Allergy"
                                placeholder="Allergy......"
                            />
                        )}
                    </Box>

                    <Grid container spacing={1}>
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
                                PAST MEDICAL HISTORY
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    my: 1,
                                }}
                            >
                                Please list any medical conditions/issues that
                                you have ever been diagnosed with (Attach
                                additional page(s) as needed):
                            </Typography>
                        </Grid>
                    </Grid>

                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                my: 2,
                                px: 1,
                            }}
                        >
                            <FormsHeaderText text="Medical History Data" />

                            {newMedHistory && (
                                <GlobalCustomButton
                                    onClick={() => setMedHistoryModal(true)}
                                    sx={{ marginLeft: 'auto' }}
                                >
                                    <AddBoxIcon
                                        sx={{ marginRight: '3px' }}
                                        fontSize="small"
                                    />
                                    Add Medical History
                                </GlobalCustomButton>
                            )}
                        </Box>
                    </Box>
                    <Box>
                        {newMedHistory ? (
                            <CustomTable
                                title={''}
                                columns={MedHistorySchema}
                                data={medHistory}
                                pointerOnHover
                                highlightOnHover
                                striped
                                progressPending={false}
                                CustomEmptyData={
                                    <Typography sx={{ fontSize: '0.8rem' }}>
                                        You&apos;ve not added a Medical History
                                        yet...
                                    </Typography>
                                }
                            />
                        ) : (
                            <Textarea
                                register={register('MedHistory')}
                                type="text"
                                label="MedHistory"
                                placeholder="Medical History......"
                            />
                        )}
                    </Box>

                    <Grid container spacing={1}>
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
                                PAST SURGICAL HISTORY
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    my: 1,
                                }}
                            >
                                Please list all surgeries that you have
                                undergone and the year the procedure(s) were
                                performed (Attach additional page(s) as needed):
                            </Typography>
                        </Grid>
                    </Grid>

                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                my: 2,
                                px: 1,
                            }}
                        >
                            <FormsHeaderText text="Surgical History Data" />

                            {newSurgHistory && (
                                <GlobalCustomButton
                                    onClick={() => setSurgHistoryModal(true)}
                                    sx={{ marginLeft: 'auto' }}
                                >
                                    <AddBoxIcon
                                        sx={{ marginRight: '3px' }}
                                        fontSize="small"
                                    />
                                    Add Surgical History
                                </GlobalCustomButton>
                            )}
                        </Box>
                    </Box>
                    <Box>
                        {newSurgHistory ? (
                            <CustomTable
                                title={''}
                                columns={SurgHistorySchema}
                                data={surgHistory}
                                pointerOnHover
                                highlightOnHover
                                striped
                                progressPending={false}
                                CustomEmptyData={
                                    <Typography sx={{ fontSize: '0.8rem' }}>
                                        You&apos;ve not added a Surgical History
                                        yet...
                                    </Typography>
                                }
                            />
                        ) : (
                            <Textarea
                                register={register('SurgHistory')}
                                type="text"
                                label="SurgHistory"
                                placeholder="Surgical History......"
                            />
                        )}
                    </Box>

                    <Grid container spacing={1}>
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
                                PAST HOSPITALIZATIONS
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    my: 1,
                                }}
                            >
                                Please list any reasons for hospitalization(s)
                                that you have ever had and the year (Attach
                                additional page(s) as needed):
                            </Typography>
                        </Grid>
                    </Grid>

                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                my: 2,
                                px: 1,
                            }}
                        >
                            <FormsHeaderText text="Hospitalization Data" />

                            {newHospt && (
                                <GlobalCustomButton
                                    onClick={() => setHosptModal(true)}
                                    sx={{ marginLeft: 'auto' }}
                                >
                                    <AddBoxIcon
                                        sx={{ marginRight: '3px' }}
                                        fontSize="small"
                                    />
                                    Add Hospitalization
                                </GlobalCustomButton>
                            )}
                        </Box>
                    </Box>
                    <Box>
                        {newHospt ? (
                            <CustomTable
                                title={''}
                                columns={HosptSchema}
                                data={hospt}
                                pointerOnHover
                                highlightOnHover
                                striped
                                progressPending={false}
                                CustomEmptyData={
                                    <Typography sx={{ fontSize: '0.8rem' }}>
                                        You&apos;ve not added a Hospitalization
                                        yet...
                                    </Typography>
                                }
                            />
                        ) : (
                            <Textarea
                                register={register('Hospt')}
                                type="text"
                                label="Hospt"
                                placeholder="Hospitalization......"
                            />
                        )}
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
                            FAMILY HEALTH HISTORY
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            sx={{
                                fontSize: '0.9rem',
                            }}
                        >
                            Please answer the following questions about your
                            immediate family (mother, father, siblings, aunts,
                            and uncles)
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '0.9rem',
                                mb: 1,
                            }}
                        >
                            Have any of your family members been diagnosed or
                            treated for the following:
                        </Typography>
                    </Grid>
                    <Grid container spacing={1} alignItems={'center'}>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'sleepApnea'}
                                    label="Sleep Apnea"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('sleepApneaPatient')}
                                type="text"
                                label="If yes, who?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'Narcolepsy'}
                                    label="Narcolepsy"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('NarcolepsyPatient')}
                                type="text"
                                label="If yes, who?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'restlessLeg'}
                                    label="Restless leg syndrome"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('restlessLegPatient')}
                                type="text"
                                label="If yes, who?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'isMotherAlive'}
                                    label="Is your mother still living"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('currentAgeMother')}
                                type="text"
                                label="Current age (if living) or age passed away"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'isFatherAlive'}
                                    label="Is your Father still living"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('currentAgeFather')}
                                type="text"
                                label="Current age (if living) or age passed away"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'significantMotherFamilyIllnesses'}
                                    label="Are there any significant illnesses/problems on your mother’s side of the family"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register(
                                    'significantMotherFamilyIllnessesList',
                                )}
                                type="text"
                                label="If yes, list them"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'significantFatherFamilyIllnesses'}
                                    label="Are there any significant illnesses/problems on your Father’s side of the family"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register(
                                    'significantFatherFamilyIllnessesList',
                                )}
                                type="text"
                                label="If yes, list them"
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
                            SOCIAL HISTORY AND HABITS
                        </Typography>
                    </Grid>

                    <Grid container spacing={1} alignItems={'center'}>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <CustomSelect
                                label="Relationship status"
                                register={register('relationshipStatus')}
                                options={[
                                    {
                                        label: 'Single',
                                        value: 'Single',
                                    },
                                    {
                                        label: 'Married',
                                        value: 'Married',
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('partnershipDuration')}
                                type="text"
                                label="Duration of Partnership/Relationship"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'smokeCigarettesBefore'}
                                    label="Have you ever smoked cigarettes?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'smokeCigarettesCurrently'}
                                    label="Do you currently smoke cigarettes?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Input
                                register={register('noOfCigarettesDaily')}
                                type="text"
                                label="No of cigarettes a day"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Input
                                register={register('noOfYearsSmoking')}
                                type="text"
                                label="No of years smoking"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('whenQuitSmoking')}
                                type="text"
                                label="When did you quit smoking?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'drinkAlcoholCurrently'}
                                    label="Do you currently drink alcohol"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('noOfdrinksWeekly')}
                                type="text"
                                label="If yes, how often?(Weekly)"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'drinkCaffeineCurrently'}
                                    label="Do you drink coffee, tea, soft drinks, or anything containing caffeine?  "
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('noOfCaffeineWeekly')}
                                type="text"
                                label="If yes, how often?(Daily)"
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
                            SYSTEMS REVIEW
                        </Typography>
                    </Grid>

                    <Grid container spacing={1} alignItems={'center'}>
                        <Grid item xs={12}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'fiveYrsWeightProgress'}
                                    label="In the last 5 years, has your weight"
                                    options={[
                                        'Increased',
                                        'Decreased',
                                        'Stayed the same',
                                    ]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('extentOfWeightProgress')}
                                type="text"
                                label="By how much?(lbs)"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'dryMouthOnAwakening'}
                                    label="Do you wake up wit dry mouth more than twice per week?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'headaches'}
                                    label="Do you have one or more headaches each week?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'morningHeadaches'}
                                    label="If yes, are they worse in the morning?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'heartburn'}
                                    label="Do you have heartburn one or more times per week or have a Hiatal Hernia/Reflux Disease?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'sinus'}
                                    label="Do you have sinus congestion one ore more times per week?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'uptimesAtNight'}
                                    label="How many times do you wake up urinate during the night?"
                                    options={[
                                        '0',
                                        '1',
                                        '2',
                                        '3',
                                        'More than 3 times',
                                    ]}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'chokingOrGasping'}
                                    label="Do you ever wake up in the night choking or gasping?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'overnightSleepStudy'}
                                    label="Have you ever had an overnight sleep study?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('overnightSleepStudyTime')}
                                type="text"
                                label="If yes, when?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('overnightSleepStudyPlace')}
                                type="text"
                                label="Where?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register(
                                    'overnightSleepStudyResults',
                                )}
                                type="text"
                                label="Results?"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'surgeryForSnoring'}
                                    label="Have you ever undergone surgery for snoring or Sleep Apnea?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                register={register('surgeryForSnoringTime')}
                                type="text"
                                label="If yes, when?"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    mb: 1,
                                }}
                            >
                                Have you ever been diagnosed (or treated for)
                                any of the following:
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'Hypertension'}
                                    label="Hypertension (high blood pressure)?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'CoronaryArteryDisease'}
                                    label="Coronary Artery Disease (blocked arteries) "
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'Diabetes'}
                                    label="Diabetes or Borderline Diabetes?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'ChronicFatigueSyndrome'}
                                    label="Chronic Fatigue Syndrome?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'Acromegaly'}
                                    label="Acromegaly?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'ChronicPainSyndrome'}
                                    label="Chronic Pain Syndrome?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'AtrialFibrillation'}
                                    label="Atrial Fibrillation (A.Fib)?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'stroke'}
                                    label="A stroke (TIA)?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'Depression'}
                                    label="Depression?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'CongestiveHeartFailure'}
                                    label="Congestive Heart Failure?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'PulmonaryHypertension'}
                                    label="Pulmonary Hypertension?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box>
                                <GroupedRadio
                                    control={control}
                                    name={'Fibromyalgia'}
                                    label="Fibromyalgia?"
                                    options={['Yes', 'No']}
                                />
                            </Box>
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

export default SleepHistoryAndIntake
