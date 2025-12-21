import { useState, useContext } from 'react'
import {
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import client from '../../../feathers'
import { ObjectContext, UserContext } from '../../../context'
import ClientPaymentTypeSelect from '../../../components/client-payment/ClientPaymentType'
import EmployeeSearch from '../../helpers/EmployeeSearch'
import LocationSearch from '../../helpers/LocationSearch'
import MuiDateTimePicker from '../../../components/inputs/DateTime/MuiDateTimePicker'
import CustomSelect from '../../../components/inputs/basic/Select'
import Textarea from '../../../components/inputs/basic/Textarea'
import GlobalCustomButton from '../../../components/buttons/CustomButton'

const TheatreCreate = ({ closeModal }) => {
    const appointmentsServer = client.service('appointments')
    const DocumentServ = client.service('clinicaldocument')
    const sendSmsServer = client.service('sendsms')
    const smsServer = client.service('sms')
    const [documentData, setDocumentData] = useState({})
    const emailServer = client.service('email')
    const notificationsServer = client.service('notification')
    const { state, setState, showActionLoader, hideActionLoader } =
        useContext(ObjectContext)
    const { user } = useContext(UserContext)
    const { register, reset, control, handleSubmit } = useForm({
        defaultValues: {
            start_time: dayjs(),
        },
    })
    const [practioner, setPractitioner] = useState(null)
    const [location, setLocation] = useState(null)
    const [paymentMode, setPaymentMode] = useState(null)
    const [sendMail, setSendMail] = useState(false)
    const patient = state.ClientModule.selectedClient

    const handleGetPractitioner = practioner => {
        setPractitioner(practioner)
        setDocumentData({
            ...documentData,
            practioner,
        })
    }

    const handleGetLocation = location => {
        setLocation(location)
    }

    const handleGetPaymentMode = paymentMode => {
        setPaymentMode(paymentMode)
        setDocumentData({
            ...documentData,
            paymentMode,
        })
    }

    const generateOTP = () => {
        var minm = 100000
        var maxm = 999999
        const otp = Math.floor(Math.random() * (maxm - minm + 1)) + minm
        return otp.toString()
    }

    const handleCloseModal = () => {
        setState(prev => ({
            ...prev,
            AppointmentModule: {
                ...prev.AppointmentModule,
                selectedPatient: {},
            },
        }))
    }
    const checkHMO = obj => obj.paymentmode === 'HMO'

    const handleCreateTheatreDocument = async data => {
        let document = {}
        if (user.currentEmployee) {
            document.facility = user.currentEmployee.facilityDetail._id
            document.facilityname =
                user.currentEmployee.facilityDetail.facilityName
        }
        document.documentdetail = data

        document.documentname = 'Theatre Orders'
        document.location =
            state.employeeLocation.locationName +
            ' ' +
            state.employeeLocation.locationType
        document.client = state.ClientModule.selectedClient._id
        document.clientname =
            state.ClientModule.selectedClient.firstname +
            ' ' +
            state.ClientModule.selectedClient.middlename +
            ' ' +
            state.ClientModule.selectedClient.lastname
        document.clientobj = state.ClientModule.selectedClient
        document.createdBy = user._id
        document.createdByname = user.firstname + ' ' + user.lastname
        document.status = 'completed'

        const client = state.ClientModule.selectedClient

        const notificationObj = {
            type: 'Pharmacy',
            title: 'Pending Bill Theatre',
            description: `You have Pending bill theatre(s) for ${client.firstname} ${client.lastname} in Pharmacy`,
            facilityId: user.currentEmployee.facilityDetail._id,
            sender: `${user.firstname} ${user.lastname}`,
            senderId: user._id,
            pageUrl: '/app/pharmacy/billprescription',
            priority: 'urgent',
        }

        DocumentServ.create(document)
            .then(async res => {
                await notificationsServer.create(notificationObj)
                toast.success('Theatre order created succesfully')
            })
            .catch(err => {
                toast.error(`Error creating Theatre Order  ${err}`)
            })
    }

    const handleCreateAppointment = async data => {
        const employee = user.currentEmployee
        const facility = employee.facilityDetail
        const generatedOTP = generateOTP()
        const isHMO = patient.paymentinfo.some(checkHMO)

        setDocumentData({
            ...documentData,
            start_time: data.start_time,
            appointment_type: data.appointment_type,
            appointment_status: data.appointment_status,
            surgical_procedure: data.surgical_procedure,
            order_details: data.order_details,
        })

        if (!patient) return toast.warning('Please select a Client/Patient')
        if (!practioner)
            return toast.warning('Please select a Practitioner/Employee')
        if (!location) return toast.warning('Please select a Location')
        if (!paymentMode)
            return toast.warning(
                'Please select a Payment Mode for Client/Patient',
            )
        if (
            !state.CommunicationModule.defaultEmail.emailConfig?.username &&
            sendMail
        )
            return setState(prev => ({
                ...prev,
                CommunicationModule: {
                    ...prev.CommunicationModule,
                    configEmailModal: true,
                },
            }))

        showActionLoader()

        if (user.currentEmployee) {
            data.facility = employee.facilityDetail._id // or from facility dropdown
        }

        if (paymentMode.paymentmode.toLowerCase() === 'hmo') {
            data.sponsor = paymentMode?.policy?.sponsor
            data.hmo = paymentMode?.policy?.organization
            data.policy = paymentMode?.policy
        }

        data.locationId = location._id
        data.practitionerId = practioner._id
        data.clientId = patient._id
        data.client = patient
        data.firstname = patient.firstname
        data.middlename = patient.middlename
        data.lastname = patient.lastname
        data.dob = patient.dob
        data.gender = patient.gender
        data.phone = patient.phone
        data.email = patient.email
        data.practitioner_name = `${practioner.firstname} ${practioner.lastname}`
        data.practitioner_profession = practioner.profession
        data.practitioner_department = practioner.department
        data.location_name = location.name
        data.location_type = location.locationType
        data.otp = generatedOTP
        data.organization_type = facility.facilityType
        data.actions = [
            {
                status: data.appointment_status,
                actor: user.currentEmployee._id,
            },
        ]

        const notificationObj = {
            type: 'Clinic',
            title: `Scheduled ${data.appointmentClass} ${data.appointment_type} Appointment`,
            description: `You have a schedule appointment with ${patient.firstname} ${
                patient.lastname
            } set to take place exactly at ${dayjs(data.start_time).format(
                'DD/MM/YYYY hh:mm',
            )} in ${location.name} Clinic for ${data.appointment_reason}`,
            facilityId: employee.facilityDetail._id,
            sender: `${employee.firstname} ${employee.lastname}`,
            senderId: employee._id,
            pageUrl: '/app/clinic/appointments',
            priority: 'normal',
            dest_userId: [practioner._id],
        }

        const emailObj = {
            organizationId: facility._id,
            organizationName: facility.facilityName,
            html: `<p>You have been scheduled for an appointment with ${
                practioner.profession
            } ${practioner.firstname} ${practioner.lastname} at ${dayjs(
                data.start_time,
            ).format('DD/MM/YYYY hh:mm')} ${
                isHMO ? `and your OTP code is ${generatedOTP}` : ''
            } </p>`,

            text: ``,
            status: 'pending',
            subject: `SCHEDULED APPOINTMENT WITH ${facility.facilityName} AT ${dayjs(
                data.date,
            ).format('DD/MM/YYYY hh:mm')}`,
            to: patient.email,
            name: facility.facilityName,
            from: state?.CommunicationModule?.defaultEmail?.emailConfig
                ?.username,
        }

        const smsObj = {
            message: `You have been scheduled for an appointment with ${
                practioner.profession
            } ${practioner.firstname} ${practioner.lastname} at ${dayjs(
                data.start_time,
            ).format('DD/MM/YYYY hh:mm')} ${
                isHMO ? `and your OTP code is ${generatedOTP}` : ''
            } `,
            receiver: patient.phone,
            facilityName: facility.facilityName,
            facilityId: facility._id,
        }

        handleCreateTheatreDocument(documentData)

        appointmentsServer
            .create(data)
            .then(async () => {
                hideActionLoader()
                handleCloseModal()
                toast.success(
                    'Appointment created succesfully, Kindly bill patient if required',
                )

                await notificationsServer.create(notificationObj)
                await sendSmsServer.create(smsObj)
                if (sendMail) {
                    await emailServer.create(emailObj)
                }
                closeModal()
                hideActionLoader()
            })
            .catch(err => {
                hideActionLoader()
                toast.error('Error creating Appointment ' + err)
            })
    }

    return (
        <Box
            sx={{
                width: '70vw',
            }}
        >
            <Grid container spacing={2} mb={1}>
                <Grid item xs={12} md={6}>
                    <ClientPaymentTypeSelect
                        payments={patient?.paymentinfo}
                        handleChange={handleGetPaymentMode}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={6}>
                    <EmployeeSearch getSearchfacility={handleGetPractitioner} />
                </Grid>

                <Grid item xs={12} sm={12} md={6}>
                    <LocationSearch getSearchfacility={handleGetLocation} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <MuiDateTimePicker
                        control={control}
                        name="start_time"
                        label="Date and Time"
                        required
                        important
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CustomSelect
                        control={control}
                        name="appointment_type"
                        label="Appointment Type"
                        required
                        important
                        options={['New Procedure', 'Repeat Procedure']}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CustomSelect
                        required
                        important
                        control={control}
                        name="appointment_status"
                        label="Appointment Status "
                        options={[
                            'Scheduled',
                            'Confirmed',
                            'Billed',
                            'Paid',
                            'Checked In',
                            'Checked Out',
                            'Procedure in Progress',
                            'Completed Procedure',
                            'No Show',
                            'Cancelled',
                        ]}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Textarea
                        label="Surgical Procedure"
                        name="surgical_procedure"
                        //important
                        register={register('surgical_procedure')}
                        type="text"
                        placeholder="write here.."
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Textarea
                        label="Order Details"
                        name="order_details"
                        //important
                        register={register('order_details')}
                        type="text"
                        placeholder="write here.."
                    />
                </Grid>

                {/* <Grid item xs={12} sm={12} md={12} lg={12}>
          <Textarea
            label="Other Information"
            //important
            register={register("other_information")}
            type="text"
            placeholder="write here.."
          />
        </Grid> */}
            </Grid>

            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                }}
            >
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={sendMail}
                                onChange={e => setSendMail(e.target.checked)}
                            />
                        }
                        label={
                            <Typography
                                sx={{
                                    fontSize: '0.8rem',
                                }}
                            >
                                Send Email To Client
                            </Typography>
                        }
                    />
                </FormGroup>

                <GlobalCustomButton
                    onClick={handleSubmit(handleCreateAppointment)}
                >
                    Create Appointment
                </GlobalCustomButton>

                <GlobalCustomButton onClick={handleCloseModal} color="error">
                    Cancel
                </GlobalCustomButton>
            </Box>
        </Box>
    )
}

export default TheatreCreate
