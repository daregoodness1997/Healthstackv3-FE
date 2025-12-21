import { useContext, useState } from 'react'
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
// import DeleteIcon from '@mui/icons-material/Delete'
import { useEffect } from 'react'
import ModalBox from '../../components/modal'
import ClaimCreateStudy from '../Corporate/components/claims/Study'
import AddBoxIcon from '@mui/icons-material/AddBox'
import Textarea from '../../components/inputs/basic/Textarea'

const WeeklySleepLog = () => {
    const ClientServ = client.service('clinicaldocument')
    const { state, setState, showActionLoader, hideActionLoader } =
        useContext(ObjectContext)
    const [study, setStudy] = useState([])
    const [newStudy, setNewStudy] = useState([])
    const [studyModal, setStudyModal] = useState(false)
    const { register, handleSubmit, reset, setValue, control } = useForm()
    const [confirmationDialog, setConfirmationDialog] = useState(false)

    const { user } = useContext(UserContext)
    const [docStatus, setDocStatus] = useState('Draft')

    let draftDoc = state.DocumentClassModule.selectedDocumentClass.document
    const document_name = state.DocumentClassModule.selectedDocumentClass.name

    useEffect(() => {
        if (!!draftDoc && draftDoc.status === 'Draft') {
            Object.entries(draftDoc.documentdetail).map(([keys, value], i) => {
                if (keys === 'study') {
                    let stuff = Array.isArray(value)
                    setNewStudy(stuff)
                    setStudy(value)
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

    const handleChangeStatus = async e => {
        setDocStatus(e.target.value)
    }

    // const handleDeleteStudy = date => {
    //     setStudy(study.filter(entry => entry.studyDate !== date))
    // }

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
        // {
        //     name: 'Action',
        //     key: 'action',
        //     selector: row => row.action,
        //     sortable: false,
        //     cell: row => (
        //         <span
        //             onClick={() => {
        //                 handleDeleteStudy(row.studyDate)
        //             }}
        //         >
        //             <DeleteIcon
        //                 sx={{
        //                     color: '#e57373',
        //                     fontSize: '18px',
        //                     ':hover': {
        //                         color: 'red',
        //                     },
        //                 }}
        //             />
        //         </span>
        //     ),
        //     width: '50px',
        // },
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

    const onSubmit = (data, e) => {
        showActionLoader()
        e.preventDefault()

        let document = {}
        if (user.currentEmployee) {
            document.facility = user.currentEmployee.facilityDetail._id
            document.facilityname =
                user.currentEmployee.facilityDetail.facilityName // or from facility dropdown
        }

        data.study = study
        document.documentdetail = data

        document.documentname =
            state.DocumentClassModule.selectedDocumentClass.name
        document.documentClassId =
            state.DocumentClassModule.selectedDocumentClass._id
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

        if (!!draftDoc && draftDoc.status === 'Draft') {
            // console.log('Clinincal note created draft')
            ClientServ.patch(draftDoc._id, document)
                .then(() => {
                    Object.keys(data).forEach(key => {
                        data[key] = ''
                    })

                    setDocStatus('Draft')
                    toast.success('Documentation updated succesfully')
                    reset(data)
                    setConfirmationDialog(false)
                    closeEncounterRight()
                    hideActionLoader()
                })
                .catch(err => {
                    toast.error('Error updating Documentation ' + err)
                    hideActionLoader()
                })
        } else {
            // console.log('Clinincal note created')
            ClientServ.create(document)
                .then(() => {
                    // console.log('Clinincal note data', res)
                    setStudy([])

                    Object.keys(data).forEach(key => {
                        data[key] = ''
                    })

                    // console.log('goood')
                    toast.success('Documentation created succesfully')
                    reset(data)
                    setConfirmationDialog(false)
                    closeEncounterRight()
                    hideActionLoader()
                })
                .catch(err => {
                    toast.error('Error creating Documentation ' + err)
                    hideActionLoader()
                })
        }
    }

    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <CustomConfirmationDialog
                    open={confirmationDialog}
                    cancelAction={() => setConfirmationDialog(false)}
                    confirmationAction={handleSubmit(onSubmit)}
                    type="create"
                    message={`You are about to save this document ${document_name}`}
                />
                <ModalBox
                    open={studyModal}
                    onClose={() => setStudyModal(false)}
                    header="Add Study to Claim"
                >
                    <ClaimCreateStudy
                        closeModal={() => setStudyModal(false)}
                        setStudy={setStudy}
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
                    <FormsHeaderText text="Weekly Sleep Log FORM" />

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
                            SLEEP ASSOCIATES OF CT WEEKLY SLEEP & WAKE LOG
                        </Typography>
                    </Grid>

                    <Grid container spacing={1} alignItems={'center'}>
                        <Grid item xs={6}>
                            <Input
                                name="Name"
                                register={register('Name')}
                                type="text"
                                label="Name"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Input
                                name="Date"
                                register={register('Date')}
                                type="date"
                                label="Date"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    mb: 1,
                                }}
                            >
                                1. Take the time to fill out this form for last
                                night’s sleep when you get up to start your day.
                                (No need to watch the clock, just estimate sleep
                                time or time awake).
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    mb: 1,
                                }}
                            >
                                2. You will indicate what time you actually
                                began trying to fall asleep
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    mb: 1,
                                }}
                            >
                                3. You will indicate what time you got up to
                                start your day with an up arrow
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    mb: 1,
                                }}
                            >
                                4. Shade the boxes showing when you think you
                                were sleeping.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    mb: 1,
                                }}
                            >
                                5. If you are awake for more than half an hour,
                                leave that area un-shaded.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    mb: 1,
                                }}
                            >
                                6. In the morning, under the “rested” column,
                                mark how rested you felt upon arising, on a
                                scale of 1-7, 1 being most rested.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    mb: 1,
                                }}
                            >
                                7. In the evening, under the “sleepy” column,
                                mark how sleepy you felt for most of day, on a
                                scale of 1-7, 7 being most sleepy.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                sx={{
                                    fontSize: '0.9rem',
                                    mb: 1,
                                }}
                            >
                                8. Before you go to bed indicate by letter what
                                times you took (M)edication, (C)affeine (# of
                                beverages or chocolate pieces), or (A)lcohol (#
                                drinks, beers, or ounces), and shade in time for
                                any naps that day (Note: use M1, M2 etc for
                                different medications)
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} mt={2}>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <CustomSelect
                                label="Time you began trying to fall asleep"
                                name="StartFallSleepTime"
                                control={control}
                                // register={register('startSleepTimeFall')}
                                options={[
                                    {
                                        label: '12am',
                                        value: '12am',
                                    },
                                    {
                                        label: '1am',
                                        value: '1am',
                                    },
                                    {
                                        label: '2am',
                                        value: '2am',
                                    },
                                    {
                                        label: '3am',
                                        value: '3am',
                                    },
                                    {
                                        label: '4am',
                                        value: '4am',
                                    },
                                    {
                                        label: '5am',
                                        value: '5am',
                                    },
                                    {
                                        label: '6am',
                                        value: '6am',
                                    },
                                    {
                                        label: '7am',
                                        value: '7am',
                                    },
                                    {
                                        label: '8am',
                                        value: '8am',
                                    },
                                    {
                                        label: '9am',
                                        value: '9am',
                                    },
                                    {
                                        label: '10am',
                                        value: '10am',
                                    },
                                    {
                                        label: '11am',
                                        value: '11am',
                                    },
                                    {
                                        label: '12pm',
                                        value: '12pm',
                                    },
                                    {
                                        label: '1pm',
                                        value: '1pm',
                                    },
                                    {
                                        label: '2pm',
                                        value: '2pm',
                                    },
                                    {
                                        label: '3pm',
                                        value: '3pm',
                                    },
                                    {
                                        label: '4pm',
                                        value: '4pm',
                                    },
                                    {
                                        label: '5pm',
                                        value: '5pm',
                                    },
                                    {
                                        label: '6pm',
                                        value: '6pm',
                                    },
                                    {
                                        label: '7pm',
                                        value: '7pm',
                                    },
                                    {
                                        label: '8pm',
                                        value: '8pm',
                                    },
                                    {
                                        label: '9pm',
                                        value: '9pm',
                                    },
                                    {
                                        label: '10pm',
                                        value: '10pm',
                                    },
                                    {
                                        label: '11pm',
                                        value: '11pm',
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <CustomSelect
                                label="Time you got up to start your day"
                                control={control}
                                name="StartSleepTime"
                                options={[
                                    {
                                        label: '12am',
                                        value: '12am',
                                    },
                                    {
                                        label: '1am',
                                        value: '1am',
                                    },
                                    {
                                        label: '2am',
                                        value: '2am',
                                    },
                                    {
                                        label: '3am',
                                        value: '3am',
                                    },
                                    {
                                        label: '4am',
                                        value: '4am',
                                    },
                                    {
                                        label: '5am',
                                        value: '5am',
                                    },
                                    {
                                        label: '6am',
                                        value: '6am',
                                    },
                                    {
                                        label: '7am',
                                        value: '7am',
                                    },
                                    {
                                        label: '8am',
                                        value: '8am',
                                    },
                                    {
                                        label: '9am',
                                        value: '9am',
                                    },
                                    {
                                        label: '10am',
                                        value: '10am',
                                    },
                                    {
                                        label: '11am',
                                        value: '11am',
                                    },
                                    {
                                        label: '12pm',
                                        value: '12pm',
                                    },
                                    {
                                        label: '1pm',
                                        value: '1pm',
                                    },
                                    {
                                        label: '2pm',
                                        value: '2pm',
                                    },
                                    {
                                        label: '3pm',
                                        value: '3pm',
                                    },
                                    {
                                        label: '4pm',
                                        value: '4pm',
                                    },
                                    {
                                        label: '5pm',
                                        value: '5pm',
                                    },
                                    {
                                        label: '6pm',
                                        value: '6pm',
                                    },
                                    {
                                        label: '7pm',
                                        value: '7pm',
                                    },
                                    {
                                        label: '8pm',
                                        value: '8pm',
                                    },
                                    {
                                        label: '9pm',
                                        value: '9pm',
                                    },
                                    {
                                        label: '10pm',
                                        value: '10pm',
                                    },
                                    {
                                        label: '11pm',
                                        value: '11pm',
                                    },
                                ]}
                            />
                        </Grid>
                    </Grid>

                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                my: 2,
                            }}
                        >
                            <FormsHeaderText text="Study Data" />

                            {newStudy && (
                                <GlobalCustomButton
                                    onClick={() => setStudyModal(true)}
                                    sx={{ marginLeft: 'auto' }}
                                >
                                    <AddBoxIcon
                                        sx={{ marginRight: '3px' }}
                                        fontSize="small"
                                    />
                                    Add Study
                                </GlobalCustomButton>
                            )}
                        </Box>

                        <Box>
                            {newStudy ? (
                                <CustomTable
                                    title={''}
                                    columns={StudySchema}
                                    data={study}
                                    pointerOnHover
                                    highlightOnHover
                                    striped
                                    //onRowClicked={handleRow}
                                    //conditionalRowStyles={conditionalRowStyles}
                                    progressPending={false}
                                    CustomEmptyData={
                                        <Typography sx={{ fontSize: '0.8rem' }}>
                                            You&apos;ve not added a Study yet...
                                        </Typography>
                                    }
                                />
                            ) : (
                                <Textarea
                                    register={register('study')}
                                    type="text"
                                    label="Study"
                                    placeholder="Study......"
                                />
                            )}
                        </Box>

                        <Box ml={2} mt={4}>
                            <RadioGroup
                                row
                                aria-label="document-status"
                                name="Status"
                                value={docStatus}
                                onChange={handleChangeStatus}
                            >
                                <FormControlLabel
                                    value="Draft"
                                    control={<Radio {...register('Status')} />}
                                    label="Draft"
                                />
                                <FormControlLabel
                                    value="Final"
                                    control={<Radio {...register('Status')} />}
                                    label="Final"
                                />
                            </RadioGroup>
                        </Box>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end">
                                <GlobalCustomButton
                                    onClick={() => setConfirmationDialog(true)}
                                    type="submit"
                                >
                                    Submit
                                </GlobalCustomButton>
                            </Box>
                        </Grid>
                        {/* </Grid> */}
                    </Box>
                </>
            </Box>
        </div>
    )
}

export default WeeklySleepLog
