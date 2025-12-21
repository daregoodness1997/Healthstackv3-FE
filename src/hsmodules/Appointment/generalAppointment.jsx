/* eslint-disable */
import { useState, useContext, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../../feathers'

import { useForm } from 'react-hook-form'
import { UserContext, ObjectContext } from '../../context'
import { toast } from 'react-toastify'
import { formatDistanceToNowStrict, format, subDays,startOfDay, addDays } from 'date-fns'
import LocationSearch from '../helpers/LocationSearch'
import EmployeeSearch from '../helpers/EmployeeSearch'
import 'react-datepicker/dist/react-datepicker.css'
import { PageWrapper } from '../../ui/styled/styles'
import { TableMenu } from '../../ui/styled/global'
import FilterMenu from '../../components/utilities/FilterMenu'
import CustomTable from '../../components/customtable'
import { globalAppointmentColumns } from './schema'
import Switch from '../../components/switch'
import { BsFillGridFill, BsList } from 'react-icons/bs'
import CalendarGrid from '../../components/calender'
import ModalBox from '../../components/modal'
import { Autocomplete, Box, Grid } from '@mui/material'
import Input from '../../components/inputs/basic/Input'
import GlobalCustomButton from '../../components/buttons/CustomButton'
import BasicDateTimePicker from '../../components/inputs/DateTime'
import RadioButton from '../../components/inputs/basic/Radio'
import TextField from '@mui/material/TextField'
import { FormsHeaderText } from '../../components/texts'
import MuiClearDatePicker from '../../components/inputs/Date/MuiClearDatePicker'
import GroupedRadio from '../../components/inputs/basic/Radio/GroupedRadio'
import CustomSelect from '../../components/inputs/basic/Select'
import Textarea from '../../components/inputs/basic/Textarea'

export default function GeneralAppointments() {
    const { state } = useContext(ObjectContext) //,setState
    const [showModal, setShowModal] = useState(false)

    return (
        <section className="section remPadTop">
            <ClientList showModal={showModal} setShowModal={setShowModal} />

            {showModal && (
                <ModalBox
                    open={state.AppointmentModule.show === 'create'}
                    onClose={() => setShowModal(false)}
                    header="Create Appointment"
                >
                    <AppointmentCreate
                        showModal={showModal}
                        setShowModal={setShowModal}
                    />
                </ModalBox>
            )}
            {showModal && (
                <ModalBox
                    open={state.AppointmentModule.show === 'detail'}
                    onClose={() => setShowModal(false)}
                    header="Appointment Details"
                    width="70vw"
                >
                    <ClientDetail
                        showModal={showModal}
                        setShowModal={setShowModal}
                    />
                </ModalBox>
            )}
            {showModal && (
                <ModalBox
                    open={state.AppointmentModule.show === 'modify'}
                    header="Edit Appointment"
                    onClose={() => setShowModal(false)}
                    width="70vw"
                >
                    <ClientModify
                        showModal={showModal}
                        setShowModal={setShowModal}
                    />
                </ModalBox>
            )}
        </section>
    )
}

export function AppointmentCreate({ showModal, setShowModal }) {
    const { state, setState } = useContext(ObjectContext)
    const { user } = useContext(UserContext)
    const { register, handleSubmit } = useForm()
    const ClientServ = client.service('appointments')

    const [formData, setFormData] = useState({
        clientId: '',
        locationId: '',
        practitionerId: '',
        appointmentType: '',
        appointmentStatus: '',
        appointmentClass: '',
        appointmentReason: '',
        startTime: new Date(),
    })

    const [chosen, setChosen] = useState({
        client: null,
        location: null,
        practitioner: null,
    })

    const appClass = ['On-site', 'Teleconsultation', 'Home Visit']

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSearchResult = (type, obj) => {
        if (obj) {
            setChosen(prev => ({ ...prev, [type]: obj }))
            handleInputChange(`${type}Id`, obj._id)
        } else {
            setChosen(prev => ({ ...prev, [type]: null }))
            handleInputChange(`${type}Id`, '')
        }
    }

    useEffect(() => {
        if (state.ClientModule.selectedClient) {
            handleSearchResult('client', state.ClientModule.selectedClient)
        }
    }, [state.ClientModule.selectedClient])

    const onSubmit = async data => {
        try {
            const appointmentData = {
                ...data,
                ...formData,
                facility: user.currentEmployee?.facilityDetail._id,
                actions: [
                    {
                        action: formData.appointmentStatus,
                        actor: user.currentEmployee._id,
                    },
                ],
            }

            if (chosen.client) {
                appointmentData.firstname = chosen.client.firstname
                appointmentData.middlename = chosen.client.middlename
                appointmentData.lastname = chosen.client.lastname
                appointmentData.dob = chosen.client.dob
                appointmentData.gender = chosen.client.gender
                appointmentData.phone = chosen.client.phone
                appointmentData.email = chosen.client.email
            }

            if (chosen.practitioner) {
                appointmentData.practitioner_name = `${chosen.practitioner.firstname} ${chosen.practitioner.lastname}`
                appointmentData.practitioner_profession =
                    chosen.practitioner.profession
                appointmentData.practitioner_department =
                    chosen.practitioner.department
            }

            if (chosen.location) {
                appointmentData.location_name = chosen.location.name
                appointmentData.location_type = chosen.location.locationType
            }

            await ClientServ.create(appointmentData)
            toast.success('Appointment created successfully')
            setShowModal(false)
            setState(prev => ({
                ...prev,
                AppointmentModule: {
                    ...prev.AppointmentModule,
                    selectedAppointment: {},
                    show: 'list',
                },
            }))
        } catch (error) {
            toast.error(`Error creating appointment: ${error.message}`)
        }
    }

    return (
        <Box sx={{ width: '70vw' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={4}>
                        <ClientSearch
                            getSearchfacility={obj =>
                                handleSearchResult('client', obj)
                            }
                            clear={chosen.client === null}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <EmployeeSearch
                            getSearchfacility={obj =>
                                handleSearchResult('practitioner', obj)
                            }
                            clear={chosen.practitioner === null}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <LocationSearch
                            getSearchfacility={obj =>
                                handleSearchResult('location', obj)
                            }
                            clear={chosen.location === null}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <RadioButton
                            name="appointmentClass"
                            options={appClass}
                            onChange={value =>
                                handleInputChange('appointmentClass', value)
                            }
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <BasicDateTimePicker
                            label="Date"
                            value={formData.startTime}
                            onChange={date =>
                                handleInputChange('startTime', date)
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <CustomSelect
                            options={[
                                { value: 'New', label: 'New' },
                                { value: 'Followup', label: 'Followup' },
                                {
                                    value: 'Readmission with 24hrs',
                                    label: 'Readmission with 24hrs',
                                },
                                {
                                    value: 'Annual Checkup',
                                    label: 'Annual Checkup',
                                },
                                { value: 'Walk in', label: 'Walk-in' },
                            ]}
                            name="appointmentType"
                            label="Appointment Type"
                            onChange={value =>
                                handleInputChange('appointmentType', value)
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <CustomSelect
                            options={[
                                { value: 'Scheduled', label: 'Scheduled' },
                                { value: 'Confirmed', label: 'Confirmed' },
                                { value: 'Checked In', label: 'Checked In' },
                                {
                                    value: 'Vitals Taken',
                                    label: 'Vitals Taken',
                                },
                                { value: 'With Nurse', label: 'With Nurse' },
                                { value: 'With Doctor', label: 'With Doctor' },
                                { value: 'No Show', label: 'No Show' },
                                { value: 'Cancelled', label: 'Cancelled' },
                                { value: 'Billed', label: 'Billed' },
                            ]}
                            name="appointmentStatus"
                            label="Appointment Status"
                            onChange={value =>
                                handleInputChange('appointmentStatus', value)
                            }
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Textarea
                            label="Reason for Appointmentssssss"
                            register={register('appointmentReason')}
                            name="appointmentReason"
                            onChange={e =>
                                handleInputChange(
                                    'appointmentReason',
                                    e.target.value,
                                )
                            }
                        />
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <GlobalCustomButton
                        text="Submit"
                        onClick={handleSubmit(onSubmit)}
                        customStyles={{ marginRight: '15px' }}
                    />
                    <GlobalCustomButton
                        variant="contained"
                        color="error"
                        text="Cancel"
                        onClick={() => setShowModal(false)}
                    />
                </Box>
            </form>
        </Box>
    )
}

export function ClientList({ setShowModal }) {
    const ClientServ = client.service('appointments')
    const [facilities, setFacilities] = useState([])
    const { state, setState } = useContext(ObjectContext)

    const { user} = useContext(UserContext)
    const [startDate, setStartDate] = useState(new Date())
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState('list')

    const { control, watch } = useForm({
        defaultValues: {
            location_type: 'All',
        },
    })

    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const onTableChangeRowsPerPage = size => {
        setLimit(size)
        setPage(1)
    }

    const onTablePageChange = newPage => {
        setPage(newPage)
    }

    const handleRow = async Client => {
        setShowModal(true)
        const newClientModule = {
            selectedAppointment: Client,
            show: 'detail',
        }
        await setState(prevstate => ({
            ...prevstate,
            AppointmentModule: newClientModule,
        }))
    }
    
    const handleSearch = val => {
        let query = {
            $or: [
                {
                    firstname: {
                        $regex: val,
                        $options: 'i',
                    },
                },
                {
                    lastname: {
                        $regex: val,
                        $options: 'i',
                    },
                },
                {
                    middlename: {
                        $regex: val,
                        $options: 'i',
                    },
                },
                {
                    phone: {
                        $regex: val,
                        $options: 'i',
                    },
                },
                {
                    appointment_type: {
                        $regex: val,
                        $options: 'i',
                    },
                },
                {
                    appointment_status: {
                        $regex: val,
                        $options: 'i',
                    },
                },
                {
                    appointment_reason: {
                        $regex: val,
                        $options: 'i',
                    },
                },
                {
                    location_type: {
                        $regex: val,
                        $options: 'i',
                    },
                },
                {
                    location_name: {
                        $regex: val,
                        $options: 'i',
                    },
                },
                {
                    practitioner_department: {
                        $regex: val,
                        $options: 'i',
                    },
                },
                {
                    practitioner_profession: {
                        $regex: val,
                        $options: 'i',
                    },
                },
                {
                    practitioner_name: {
                        $regex: val,
                        $options: 'i',
                    },
                },
            ],
            facility: user.currentEmployee.facilityDetail._id, // || "",
            $limit: limit,
            $skip: (page - 1) * limit,
           
            
            $select: [
                'start_time',
                'firstname',
                'lastname',
                'appointmentClass',
                'location_name',
                'appointment_type',
                'appointment_status',
                'appointment_status',
                'appointment_reason',
                'practitioner_name',
                'location_type',
            ],
        }
        if (state.employeeLocation.locationType !== 'Front Desk') {
            query.locationId = state.employeeLocation.locationId
        }
       
        ClientServ.find({ query: query })
            .then(res => {    
                setFacilities(res.data)
                setTotal(res.total)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const watch_location_type = watch('location_type')

    // const handleCalendarClose = useCallback(async () => {
    //     setLoading(true)
    //     let query = {
    //         facility: user.currentEmployee?.facilityDetail._id,
    //         $limit: limit,
    //         $skip: (page - 1) * limit,    
    //         $select: [
    //             'start_time',
    //             'firstname',
    //             'lastname',
    //             'appointmentClass',
    //             'location_name',
    //             'appointment_type',
    //             'appointment_status',
    //             'appointment_status',
    //             'appointment_reason',
    //             'practitioner_name',
    //             'location_type',
    //         ],
    //     }

    //     if (watch_location_type !== 'All') {
    //         query.location_type = watch_location_type
    //     }

    //     const findClient = await ClientServ.find({ query: query })

    //      setFacilities(findClient.data)
    //      setTotal(findClient.total)
    //     setLoading(false)
    // }, [watch_location_type, limit, page])

  

const getFacilities =  async () => {
    setLoading(true)
    if (user.currentEmployee) {
        let query = {
            facility: user.currentEmployee.facilityDetail._id,
            $limit: limit,
            $skip: (page - 1) * limit,
            $sort: {
                start_time: 1 
            },
            
        }

        if (startDate) {
            //console.log(startDate)
            const start=startOfDay(new Date(startDate));
            query.start_time = {
                $gte: new Date(start).getTime(), //toISOString(),
               $lt: addDays(new Date(start), 1).getTime() //toISOString()
            }
        }

        if (watch_location_type !== 'All') {
            query.location_type = watch_location_type
        }

        const findClient = await ClientServ.find({ query: query })

         setFacilities(findClient.data)
         setTotal(findClient.total)
        setLoading(false)
    }
}

    useEffect(() => {
        getFacilities()
        ClientServ.on('created', getFacilities)
        ClientServ.on('updated', getFacilities)
        ClientServ.on('patched', getFacilities)
        ClientServ.on('removed', getFacilities)

        const newClient = {
            selectedClient: {},
            show: 'create',
        }
        setState(prevstate => ({ ...prevstate, ClientModule: newClient }))
        return () => {
        }
    }, [watch_location_type,limit,page,startDate])


    const mapFacilities = () => {
        let mapped = []
        facilities.map((facility, i) => {
            mapped.push({
                title: `Name: ${facility?.firstname} ${
                    facility?.lastname
                }. Age: ${formatDistanceToNowStrict(
                    new Date(facility?.dob),
                )}. Gender: ${facility?.gender}. Phone: ${facility?.phone}. Email: ${
                    facility?.email
                }`,
                startDate: format(
                    new Date(facility?.start_time.slice(0, 19)),
                    'yyyy-MM-dd HH:mm',
                ),
                id: i,
                location: facility?.location_name,
                content: 'Test',
            })
        })
        return mapped
    }
    const activeStyle = {
        backgroundColor: '#0064CC29',
        border: 'none',
        padding: '0 .8rem',
    }

   
    return (
        <>
            {user ? (
                <>
                    <div className="level">
                        <PageWrapper
                            style={{
                                flexDirection: 'column',
                                padding: '0.6rem 1rem',
                            }}
                        >
                            <TableMenu>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    {handleSearch && (
                                        <div className="inner-table">
                                            <FilterMenu
                                                onSearch={handleSearch}
                                            />
                                        </div>
                                    )}
                                    <h2
                                        style={{
                                            margin: '0 10px',
                                            fontSize: '0.95rem',
                                        }}
                                    >
                                        {watch_location_type} Appointments
                                    </h2>
                                    <MuiClearDatePicker
                                        value={startDate}
                                        setValue={setStartDate}
                                        label="Filter By Date"
                                        format="dd/MM/yyyy"
                                    />
                                    {/* <SwitchButton /> */}
                                    {/* <Switch>
                                        <button
                                            value={value}
                                            onClick={() => {
                                                setValue('list')
                                            }}
                                            style={
                                                value === 'list'
                                                    ? activeStyle
                                                    : {}
                                            }
                                        >
                                            <BsList
                                                style={{ fontSize: '1rem' }}
                                            />
                                        </button>
                                        <button
                                            value={value}
                                            onClick={() => {
                                                setValue('grid')
                                            }}
                                            style={
                                                value === 'grid'
                                                    ? activeStyle
                                                    : {}
                                            }
                                        >
                                            <BsFillGridFill
                                                style={{ fontSize: '1rem' }}
                                            />
                                        </button>
                                    </Switch> */}
                                </div>

                                <Box
                                    sx={{
                                        width: '150px',
                                    }}
                                >
                                    <CustomSelect
                                        label="Location Type"
                                        control={control}
                                        options={[
                                            'All',
                                            'Blood Bank',
                                            'Client',
                                            'Clinic',
                                            'Pharmacy',
                                            'Radiology',
                                            'Referral',
                                            'Theatre',
                                        ]}
                                        name="location_type"
                                    />
                                </Box>
                            </TableMenu>
                            <div
                                style={{
                                    width: '100%',
                                    overflowY: 'auto',
                                }}
                            >
                                {value === 'list' ? (
                                    <CustomTable
                                        title={''}
                                        columns={globalAppointmentColumns}
                                        data={facilities}
                                        pointerOnHover
                                        highlightOnHover
                                        striped
                                        onRowClicked={handleRow}
                                        progressPending={loading}
                                        onChangeRowsPerPage={
                                            onTableChangeRowsPerPage
                                        }
                                        onChangePage={onTablePageChange}
                                        pagination
                                        paginationServer
                                        paginationTotalRows={total}
                                    />
                                ) : (
                                    <CalendarGrid
                                        appointments={mapFacilities()}
                                    />
                                )}
                            </div>
                        </PageWrapper>
                    </div>
                </>
            ) : (
                <div>loading</div>
            )}
        </>
    )
}

export function ClientDetail({ showModal, setShowModal }) {
    const navigate = useNavigate()

    const { state, setState } = useContext(ObjectContext)
    const [selectedClient, setSelectedClient] = useState()
    const AppointmentServ = client.service('appointments')

    const Client = state.AppointmentModule.selectedAppointment
    //const client=Client
    const handleEdit = async () => {
        const newClientModule = {
            selectedAppointment: Client,
            show: 'modify',
        }
        await setState(prevstate => ({
            ...prevstate,
            AppointmentModule: newClientModule,
        }))
    }

    const handleAttend = async () => {
        const patient = await client.service('client').get(Client.clientId)
        await setSelectedClient(patient)
        const newClientModule = {
            selectedClient: patient,
            show: 'detail',
        }
        await setState(prevstate => ({
            ...prevstate,
            ClientModule: newClientModule,
        }))
        await AppointmentServ.patch(Client._id, { encounter_started_at: new Date() })
        navigate('/app/clinic/documentation')
    }

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'right',
                }}
                mb={2}
            >
                <GlobalCustomButton
                    onClick={handleEdit}
                    text="Edit Appointment Details"
                    customStyles={{
                        marginRight: '5px',
                    }}
                />
                <GlobalCustomButton
                    onClick={handleAttend}
                    text="Attend to Client"
                />
            </Box>
            <Grid container spacing={1} mt={1}>
                <Grid item xs={12} md={4}>
                    <Input
                        label="First Name"
                        value={Client?.firstname}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Input
                        label="Middle Name"
                        value={Client?.middlename}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Input
                        label="Last Name"
                        value={Client?.lastname}
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1} mt={1}>
                <Grid item xs={12} md={4}>
                    <Input
                        label="Age"
                        value={Client.dob ? formatDistanceToNowStrict(new Date(Client.dob)) : 'N/A'}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Input label="Gender" value={Client.gender} disabled />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Input
                        label="Phone Number"
                        value={Client?.phone}
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1} my={1}>
                <Grid item xs={12} md={4}>
                    <Input label="Email" value={Client?.email} disabled />
                </Grid>
            </Grid>
            <hr />
            <Grid container spacing={1} mt={1}>
                <Grid item xs={12} md={4}>
                    <Input
                        label="Start Date"
                        value={format(
                            new Date(Client.start_time),
                            'dd/MM/yyyy HH:mm',
                        )}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Input
                        label="Location"
                        value={Client?.location_name}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Input
                        label="Professional"
                        value={`  ${Client.practitioner_name} (${Client.practitioner_profession})`}
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1} mt={1}>
                <Grid item xs={12} md={4}>
                    <Input
                        label="Appointment Status"
                        value={Client?.appointment_status}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Input
                        label="Appointment Class"
                        value={Client?.appointmentClass}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Input
                        label="Appointment Type"
                        value={Client?.appointment_type}
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1} mt={1}>
                <Grid item xs={12} md={12}>
                    <label className="label" htmlFor="appointment_reason">
                        Reason for Appointment
                    </label>
                    <textarea
                        className="input is-small"
                        name="appointment_reason"
                        value={Client?.appointment_reason}
                        disabled
                        type="text"
                        placeholder="Appointment Reason"
                        rows="3"
                        cols="50"
                        style={{
                            border: '1px solid #b6b6b6',
                            borderRadius: '4px',

                            width: '100%',
                        }}
                    >
                        {' '}
                    </textarea>
                </Grid>
            </Grid>
        </>
    )
}

export function ClientModify({ showModal, setShowModal }) {
    const { register, handleSubmit, setValue, reset, control } = useForm()

    const ClientServ = client.service('appointments')

    const { user } = useContext(UserContext)
    const { state, setState } = useContext(ObjectContext)

    const appClass = ['On-site', 'Teleconsultation', 'Home Visit']
    const [locationId, setLocationId] = useState()
    const [practionerId, setPractionerId] = useState()
    const [success1, setSuccess1] = useState(false)
    const [success2, setSuccess2] = useState(false)
    const [chosen1, setChosen1] = useState()
    const [chosen2, setChosen2] = useState()

    const Client = state.AppointmentModule.selectedAppointment

    const getSearchfacility1 = obj => {
        setLocationId(obj._id)
        setChosen1(obj)

        if (!obj) {
            //"clear stuff"
            setLocationId()
            setChosen1()
        }
    }

    const getSearchfacility2 = obj => {
        setPractionerId(obj._id)
        setChosen2(obj)

        if (!obj) {
            //"clear stuff"
            setPractionerId()
            setChosen2()
        }
    }

    useEffect(() => {
        setValue('firstname', Client.firstname, {
            shouldValidate: true,
            shouldDirty: true,
        })
        setValue('middlename', Client.middlename, {
            shouldValidate: true,
            shouldDirty: true,
        })
        setValue('lastname', Client.lastname, {
            shouldValidate: true,
            shouldDirty: true,
        })
        setValue('phone', Client.phone, {
            shouldValidate: true,
            shouldDirty: true,
        })
        setValue('email', Client.email, {
            shouldValidate: true,
            shouldDirty: true,
        })
        setValue('dob', Client.dob, {
            shouldValidate: true,
            shouldDirty: true,
        })
        setValue('gender', Client.gender, {
            shouldValidate: true,
            shouldDirty: true,
        })
        setValue('ClientId', Client.clientId, {
            shouldValidate: true,
            shouldDirty: true,
        })
        setValue('appointment_reason', Client.appointment_reason, {
            shouldValidate: true,
            shouldDirty: true,
        })
        setValue('appointment_status', Client.appointment_status, {
            shouldValidate: true,
            shouldDirty: true,
        })
        setValue('appointment_type', Client.appointment_type, {
            shouldValidate: true,
            shouldDirty: true,
        })
        setValue(
            'start_time',
            format(new Date(Client.start_time), "yyyy-MM-dd'T'HH:mm:ss"),
            {
                shouldValidate: true,
                shouldDirty: true,
            },
        )
        setValue('appointmentClass', Client.appointmentClass, {
            shouldValidate: true,
            shouldDirty: true,
        })

        return () => {}
    }, [])
    const handleChangeType = async e => {
        setValue('appointment_type', e.target.value, {
            shouldValidate: true,
            shouldDirty: true,
        })
    }

    const handleChangeStatus = async e => {
        // await setAppointment_status(e.target.value)
        setValue('appointment_status', e.target.value, {
            shouldValidate: true,
            shouldDirty: true,
        })
    }

    const changeState = () => {
        const newClientModule = {
            selectedAppointment: {},
            show: 'list',
        }
        setState(prevstate => ({
            ...prevstate,
            AppointmentModule: newClientModule,
        }))
    }
    const handleDelete = async () => {
        let conf = window.confirm('Are you sure you want to delete this data?')

        const dleteId = Client._id
        if (conf) {
            ClientServ.remove(dleteId)
                .then(() => {
                    reset()

                    toast.success('Client deleted succesfully')
                    changeState()
                })
                .catch(err => {
                    toast.error(
                        'Error deleting Client, probable network issues or ' +
                            err,
                    )
                })
        }
    }

    const onSubmit = (data, e) => {
        e.preventDefault()
        setShowModal(false),
            (data.practitioner_name =
                chosen2.firstname + ' ' + chosen2.lastname)
        data.practitioner_profession = chosen2.profession
        data.practitioner_department = chosen2.department
        data.practitionerId = chosen2._id
        data.locationId = chosen1._id
        data.location_name = chosen1.name
        data.location_type = chosen1.locationType

        //data.actions
        if (Client.appointment_status !== data.appointment_status) {
            Client.actions.push({
                status: data.appointment_status,
                actor: user.currentEmployee._id,
            })
        }
        data.actions = Client.actions
        ClientServ.patch(Client._id, data)
            .then(() => {
                toast.success('Client updated succesfully')

                changeState()
            })
            .catch(err => {
                toast.error(
                    'Error updating Client, probable network issues or ' + err,
                )
            })
    }

    return (
        <>
            <div className="card ">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormsHeaderText
                        text={`${Client.firstname} ${Client.lastname}`}
                    />

                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <LocationSearch
                                id={Client.locationId}
                                getSearchfacility={getSearchfacility1}
                                clear={success1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <EmployeeSearch
                                id={Client.practitionerId}
                                getSearchfacility={getSearchfacility2}
                                clear={success2}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <GroupedRadio
                                name="appointmentClass"
                                options={appClass}
                                control={control}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid item xs={12} sm={12} md={4}>
                            <BasicDateTimePicker
                                label="Date"
                                register={register('start_time', {
                                    required: true,
                                })}
                                value={format(
                                    new Date(Client.start_time),
                                    "yyyy-MM-dd'T'HH:mm:ss",
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <select
                                name="type"
                                onChange={handleChangeType}
                                defaultValue={Client?.appointment_type}
                                style={{
                                    border: '1px solid #b6b6b6',
                                    height: '38px',
                                    borderRadius: '4px',
                                    width: '100%',
                                }}
                            >
                                <option defaultChecked>
                                    Choose Appointment Type{' '}
                                </option>
                                <option value="New">New</option>
                                <option value="Followup">Followup</option>
                                <option value="Readmission with 24hrs">
                                    Readmission with 24hrs
                                </option>
                                <option value="Annual Checkup">
                                    Annual Checkup
                                </option>
                                <option value="Walk in">Walk-in</option>
                            </select>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <select
                                name="appointment_status"
                                onChange={handleChangeStatus}
                                defaultValue={Client?.appointment_status}
                                style={{
                                    border: '1px solid #b6b6b6',
                                    height: '38px',
                                    borderRadius: '4px',
                                    width: '100%',
                                }}
                            >
                                <option defaultChecked>
                                    Appointment Status{' '}
                                </option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Checked In">Checked In</option>
                                <option value="Checked Out">Checked Out</option>
                                <option value="Vitals Taken">
                                    Vitals Taken
                                </option>
                                <option value="With Nurse">With Nurse</option>
                                <option value="With Doctor">With Doctor</option>
                                <option value="No Show">No Show</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Billed">Billed</option>
                            </select>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <label
                                className="label"
                                htmlFor="appointment_reason"
                            >
                                Reason for Appointment
                            </label>
                            <textarea
                                className="input is-small"
                                name="appointment_reason"
                                {...register('appointment_reason', {
                                    required: true,
                                })}
                                type="text"
                                placeholder="Appointment Reason"
                                rows="3"
                                cols="50"
                                style={{
                                    border: '1px solid #b6b6b6',
                                    borderRadius: '4px',

                                    width: '100%',
                                }}
                            >
                                {' '}
                            </textarea>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <GlobalCustomButton
                            variant="contained"
                            color="success"
                            text="Save"
                            customStyles={{
                                marginRight: '15px',
                            }}
                            onClick={handleSubmit(onSubmit)}
                        />

                        <GlobalCustomButton
                            text="Delete"
                            onClick={() => handleDelete()}
                            color="error"
                            variant="outlined"
                        />
                    </Box>
                </form>
            </div>
        </>
    )
}

export function ClientSearch({ id, getSearchfacility, clear, label }) {
    const ClientServ = client.service('client')
    const [facilities, setFacilities] = useState([])

    const [showPanel, setShowPanel] = useState(false)

    const [searchMessage, setSearchMessage] = useState('')

    const [simpa, setSimpa] = useState('')

    const [chosen, setChosen] = useState(false)

    const [count, setCount] = useState(0)
    const inputEl = useRef(null)
    const [val, setVal] = useState('')
    const { user } = useContext(UserContext)

    const handleRow = async obj => {
        await setChosen(true)
        //alert("something is chaning")
        getSearchfacility(obj)

        await setSimpa(
            obj.firstname +
                ' ' +
                obj.middlename +
                ' ' +
                obj.lastname +
                ' ' +
                obj.gender +
                ' ' +
                obj.phone,
        )

        setShowPanel(false)
        await setCount(2)
    }

    const handleSearch = async val => {
        setVal(val)
        if (val === '') {
            setShowPanel(false)
            getSearchfacility(false)
            return
        }

        if (val.length >= 3) {
            ClientServ.find({
                query: {
                    $or: [
                        {
                            firstname: {
                                $regex: val,
                                $options: 'i',
                            },
                        },
                        {
                            lastname: {
                                $regex: val,
                                $options: 'i',
                            },
                        },
                        {
                            middlename: {
                                $regex: val,
                                $options: 'i',
                            },
                        },
                        {
                            phone: {
                                $regex: val,
                                $options: 'i',
                            },
                        },
                        {
                            clientTags: {
                                $regex: val,
                                $options: 'i',
                            },
                        },
                        {
                            mrn: {
                                $regex: val,
                                $options: 'i',
                            },
                        },
                        {
                            specificDetails: {
                                $regex: val,
                                $options: 'i',
                            },
                        },
                    ],

                    facility: user.currentEmployee.facilityDetail._id,
                    $limit: 10,
                    $sort: {
                        createdAt: -1,
                    },
                    $select: [
                        'start_time',
                        'firstname',
                        'lastname',
                        'appointmentClass',
                        'location_name',
                        'appointment_type',
                        'appointment_status',
                        'appointment_status',
                        'appointment_reason',
                        'practitioner_name',
                        'location_type',
                    ],
                },
            })
                .then(res => {
                    console.log('product  fetched successfully')
                    setFacilities(res.data)
                    setSearchMessage(' product  fetched successfully')
                    setShowPanel(true)
                })
                .catch(err => {
                    toast({
                        message: 'Error creating ProductEntry ' + err,
                        type: 'is-danger',
                        dismissible: true,
                        pauseOnHover: true,
                    })
                })
        } else {
            console.log('less than 3 ')
            setShowPanel(false)
            await setFacilities([])
            console.log(facilities)
        }
    }
    console.log(simpa)

    useEffect(() => {
        if (clear) {
            console.log('success has changed', clear)
            setSimpa('')
        }
        return () => {}
    }, [clear])

    return (
        <div>
            <Autocomplete
                size="small"
                value={simpa}
                onChange={(event, newValue) => {
                    handleRow(newValue)
                    setSimpa('')
                }}
                id="free-solo-dialog-demo"
                options={facilities}
                getOptionLabel={option => {
                    if (typeof option === 'string') {
                        return option
                    }
                    if (option.inputValue) {
                        return option.inputValue
                    }
                    return option.firstname
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                noOptionsText="No Client found"
                renderOption={(props, option) => (
                    <li {...props} style={{ fontSize: '0.75rem' }}>
                        {option.firstname}, {option.middlename},{' '}
                        {option.lastname},{' '}
                    </li>
                )}
                sx={{
                    width: '100%',
                }}
                freeSolo={false}
                renderInput={params => (
                    <TextField
                        {...params}
                        label={label || 'Search for Client'}
                        onChange={e => handleSearch(e.target.value)}
                        ref={inputEl}
                        sx={{
                            fontSize: '0.75rem',
                            backgroundColor: '#ffffff',
                            '& .MuiInputBase-input': {
                                height: '0.9rem',
                            },
                        }}
                        InputLabelProps={{
                            shrink: true,
                            style: { color: '#2d2d2d' },
                        }}
                    />
                )}
            />
        </div>
    )
}
