import { useState, useContext, useEffect } from 'react'
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
import { ClientSearch } from '../../../hsmodules/helpers/ClientSearch'
import EmployeeSearch from '../../../hsmodules/helpers/EmployeeSearch'
import LocationSearch from '../../../hsmodules/helpers/LocationSearch'
import ClientPaymentTypeSelect from '../../client-payment/ClientPaymentType'
import RadioButton from '../../inputs/basic/Radio'
import MuiDateTimePicker from '../../inputs/DateTime/MuiDateTimePicker'
import CustomSelect from '../../inputs/basic/Select'
import Textarea from '../../inputs/basic/Textarea'
import GlobalCustomButton from '../../buttons/CustomButton'
import Input from '../../inputs/basic/Input'

const AppointmentCreate = ({ closeModal, showBillModal }) => {
    const appointmentsServer = client.service('appointments')
    // const apptServer = client.service('availability')
    const sendSmsServer = client.service('sendsms')
    // const smsServer = client.service('sms')
    const emailServer = client.service('email')
    const notificationsServer = client.service('notification')
    const { state, setState, showActionLoader, hideActionLoader } =
        useContext(ObjectContext)
    const { user } = useContext(UserContext)
    const { register, reset, control, handleSubmit, watch } = useForm({
        defaultValues: {
            start_time: dayjs(),
        },
    })
    const [patient, setPatient] = useState(null)
    const [practioner, setPractitioner] = useState(null)
    const [location, setLocation] = useState(null)
    const [paymentMode, setPaymentMode] = useState(null)
    const [sendMail, setSendMail] = useState(false)
    const [sendEmployeeMail, setSendEmployeeMail] = useState(false)
  const clientId = state.ClientModule.selectedClient._id;
  const link = `https://meet.jit.si/${clientId}`;
  console.log(state, user.email);


     //console.log(watch('appointmentClass'))
    useEffect(() => {
        setPatient(state.AppointmentModule.selectedPatient)
        // console.log(
        //     'appointment patient',
        //     state.AppointmentModule.selectedPatient,
        // )
    }, [state.AppointmentModule.selectedPatient]) //

    const handleGetPatient = patient => {
        //  console.log('patient', patient)
        setPatient(patient)
    }

    const handleGetPractitioner = practioner => {
        setPractitioner(practioner)
        // console.log(practioner)
    }

    const handleGetLocation = location => {
        setLocation(location)
        // console.log(location)
    }

    const handleGetPaymentMode = paymentMode => {
        console.log(paymentMode)
        setPaymentMode(paymentMode)
    }

    const generateOTP = () => {
        var minm = 100000
        var maxm = 999999
        const otp = Math.floor(Math.random() * (maxm - minm + 1)) + minm
        return otp.toString()
    }

    const handleCloseModal = () => {
        closeModal()
        setState(prev => ({
            ...prev,
            AppointmentModule: {
                ...prev.AppointmentModule,
                selectedPatient: {},
            },
        }))
    }
    const checkHMO = obj => obj.paymentmode === 'HMO'

    const handleCreateAppointment = async (
        data
      ) => {
        // Validate required fields
        if (!patient) {
          toast.warning('Please select a Client/Patient');
          return;
        }
        if (!practioner) {
          toast.warning('Please select a Practitioner/Employee');
          return;
        }
        if (!location) {
          toast.warning('Please select a Location');
          return;
        }
        if (!paymentMode) {
          toast.warning('Please select a Payment Mode for Client/Patient');
          return;
        }
      
        // Check email configuration if sending emails
        if (!state.CommunicationModule.defaultEmail.emailConfig?.username && sendMail) {
          setState(prev => ({
            ...prev,
            CommunicationModule: {
              ...prev.CommunicationModule,
              configEmailModal: true,
            },
          }));
          return;
        }
      
        // Start loading state
        showActionLoader();
      
        try {
          // Initialize necessary data
          const employee = user.currentEmployee;
          const facility = employee.facilityDetail;
          const generatedOTP = generateOTP();
          const isHMO = patient.paymentinfo.some(checkHMO);
          const appointmentClass = watch('appointmentClass');
          const isTeleconsultation = appointmentClass === "Teleconsultation";
          const formattedStartTime = dayjs(data.start_time).format('DD/MM/YYYY hh:mm');
          const defaultEmailUsername = state?.CommunicationModule?.defaultEmail?.emailConfig?.username;
          
          // Prepare appointment data
          const appointmentData = {
            ...data,
            facility: employee.facilityDetail._id,
            locationId: location._id,
            practitionerId: practioner._id,
            clientId: patient._id,
            client: patient,
            firstname: patient.firstname,
            middlename: patient.middlename,
            lastname: patient.lastname,
            dob: patient.dob,
            gender: patient.gender,
            end_time: new Date(data.start_time.getTime() + 30 * 60 * 1000),
            phone: patient.phone,
            email: patient.email,
            practitioner_name: `${practioner.firstname} ${practioner.lastname}`,
            practitioner_profession: practioner.profession,
            practitioner_department: practioner.department,
            location_name: location.name,
            location_type: location.locationType,
            otp: generatedOTP,
            organization_type: facility.facilityType,
            actions: [
              {
                status: data.appointment_status,
                actor: employee._id,
              },
            ],
          };
          
          // Add HMO-specific data if applicable
          if (paymentMode.paymentmode?.toLowerCase() === 'hmo') {
            appointmentData.sponsor = paymentMode?.policy?.sponsor;
            appointmentData.hmo = paymentMode?.policy?.organization;
            appointmentData.policy = paymentMode?.policy;
          }
      
          // Prepare notification content
          const otpInfo = isHMO ? `and your OTP code is ${generatedOTP}` : '';
          const teleconsultationInfo = isTeleconsultation ? `You can join them live here ${link}` : '';
          
          // Create notification objects
          const emailObj = {
            organizationId: facility._id,
            organizationName: facility.facilityName,
            html: `<p>You have been scheduled for an appointment with ${practioner.profession} ${practioner.firstname} ${practioner.lastname} at ${formattedStartTime}. ${otpInfo} ${teleconsultationInfo}</p>`,
            text: '',
            status: 'pending',
            subject: `SCHEDULED APPOINTMENT WITH ${facility.facilityName} AT ${formattedStartTime}`,
            to: patient.email,
            name: facility.facilityName,
            from: defaultEmailUsername,
          };
          
          const employeeEmailObj = {
            organizationId: facility._id,
            organizationName: facility.facilityName,
            html: `<p>A consultation has been booked between you and ${patient.lastname} ${patient.firstname} at ${formattedStartTime}. ${otpInfo} ${teleconsultationInfo}</p>`,
            text: '',
            status: 'pending',
            subject: `CONSULTATION APPOINTMENT WITH YOU AND ${patient.lastname} ${patient.firstname} AT ${formattedStartTime}`,
            to: practioner.email,
            name: facility.facilityName,
            from: defaultEmailUsername,
          };
          
          const smsObj = {
            message: `You have been scheduled for an appointment with ${practioner.profession} ${practioner.firstname} ${practioner.lastname} at ${formattedStartTime}. ${otpInfo}`,
            receiver: patient.phone,
            facilityName: facility.facilityName,
            facilityId: facility._id,
          };
          
          const notificationObj = {
            message: {
              type: 'Appointment',
              title: `New ${data.appointmentClass} ${data.appointment_type} Appointment`,
              description: `You have a scheduled appointment with ${patient.firstname} ${patient.lastname} on ${formattedStartTime} at ${location.name} for ${data.appointment_reason}`,
            },
            type: 'Appointment',
            title: `New ${data.appointmentClass} ${data.appointment_type} Appointment`,
            description: `You have a scheduled appointment with ${patient.firstname} ${patient.lastname} on ${formattedStartTime} at ${location.name} for ${data.appointment_reason}`,
            priority: 'normal',
            dest_userId: [practioner._id],
            facilityId: facility._id,
            sender: `${employee.firstname} ${employee.lastname}`,
            senderId: employee._id,
            pageUrl: '/app/clinic/appointments',
          };
      
          const appointmentResponse = await appointmentsServer.create(appointmentData);
    hideActionLoader();
    handleCloseModal();
    toast.success('Appointment created successfully, Kindly bill patient if required');
    
    // Send notifications after appointment is successfully created
    try {
      // Send in-app notification - Make sure this actually creates
      console.log("Sending notification:", notificationObj);
      const notificationResponse = await notificationsServer.create(notificationObj);
      console.log("Notification response:", notificationResponse);
      
      // Send SMS if phone number exists
      if (patient.phone) {
        await sendSmsServer.create(smsObj);
      } else {
        console.warn("Patient phone number missing - SMS notification skipped");
      }
      
      // Send emails if enabled
      if (sendMail) {
        await emailServer.create(emailObj);
      }
      
      if (sendEmployeeMail) {
        await emailServer.create(employeeEmailObj);
      }

          } catch (notificationError) {
            console.error("Error sending notifications:", notificationError);
            toast.warning("Appointment created but there was an error sending notifications");
          }
          
          // Success handling
          hideActionLoader();
          handleCloseModal();
          toast.success('Appointment created successfully, Kindly bill patient if required');
          
          // Show billing modal if required
          if (showBillModal) {
            showBillModal(true);
          }
        } catch (error) {
          console.error("Error creating appointment:", error);
          hideActionLoader();
          toast.error(`Error creating Appointment: ${error.message || error}`);
        }
      };

    

    return (
        <Box
            sx={{
                width: '70vw',
            }}
        >
            <Grid container spacing={2} mb={1}>
                <Grid item xs={12} sm={12} md={8} lg={8}>
                    <ClientSearch
                        getSearchfacility={handleGetPatient}
                        id={patient?._id}
                    />
                
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={4}>
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

                <Grid item xs={12} sm={12} md={12}>
                    <RadioButton
                        name="appointmentClass"
                        register={register('appointmentClass', {
                            required: true,
                        })}
                        options={['On-site', 'Teleconsultation', 'Home Visit']}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <MuiDateTimePicker
                        control={control}
                        name="start_time"
                        label="Date and Time"
                        required
                        important
                    />
                    {/* <Input name="start_time"
                        label="Date and Time" type="datetime-local"/> */}
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <CustomSelect
                        control={control}
                        name="appointment_type"
                        label="Appointment Type"
                        required
                        important
                        options={[
                            'New',
                            'Followup',
                            'Readmission with 24hrs',
                            'Annual Checkup',
                            'Walk-in',
                        ]}
                    />
                </Grid>

                {/* this is good */}

                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <CustomSelect
                        required
                        important
                        control={control}
                        name="appointment_status"
                        label="Appointment Status "
                        options={[
                            'Scheduled',
                            'Confirmed',
                            'Checked In',
                            'Checked Out',
                            'Vitals Taken',
                            'With Nurse',
                            'With Doctor',
                            'No Show',
                            'Cancelled',
                            'Billed',
                        ]}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Textarea
                        label="Reason for Appointment"
                        //important
                        register={register('appointment_reason')}
                        type="text"
                        placeholder="write here.."
                    />
                </Grid>
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

                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={sendEmployeeMail}
                                onChange={e => setSendEmployeeMail(e.target.checked)}
                            />
                        }
                        label={
                            <Typography
                                sx={{
                                    fontSize: '0.8rem',
                                }}
                            >
                                Send Email To Employee
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

export default AppointmentCreate
