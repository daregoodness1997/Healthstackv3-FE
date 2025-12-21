import { useState, useContext } from 'react'
import { UserContext, ObjectContext } from '../../context'
import { toast } from 'react-toastify'
import { Box, Grid } from '@mui/material'

import Input from '../../components/inputs/basic/Input'
import { FormsHeaderText } from '../../components/texts'
import GlobalCustomButton from '../../components/buttons/CustomButton'
import AddCircleOutline from '@mui/icons-material/AddCircleOutline'
import { useForm } from 'react-hook-form'

import client from '../../feathers'
import { ClientSearch } from '../helpers/ClientSearch'
import GroupedRadio from '../../components/inputs/basic/Radio/GroupedRadio'

export default function CreateRadRequest() {
    const notificationsServer = client.service('notification')
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const { register, handleSubmit, control } = useForm()
    const { state, setState } = useContext(ObjectContext)
    const [patient, setPatient] = useState(null)
    const { user } = useContext(UserContext)

    const handleGetPatient = patient => {
        setPatient(patient)
    }

    const ClientServ = client.service('clinicaldocument')

    const onSubmit = data => {
        setMessage('')
        setError(false)
        setSuccess(false)
        let document = {}

        if (user.currentEmployee) {
            document.facility = user.currentEmployee.facilityDetail._id
            document.facilityname =
                user.currentEmployee.facilityDetail.facilityName
        }
        document.documentdetail = data

        document.documentname = 'Radiology Orders'
        document.location =
            state.employeeLocation.locationName +
            ' ' +
            state.employeeLocation.locationType
        document.locationId = state.employeeLocation.locationId
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

        ClientServ.create(document)
            .then(async () => {
                await notificationsServer.create(notificationObj)
                setSuccess(true)
                toast.success('Theatre order created succesfully')
                setSuccess(false)
            })
            .catch(err => {
                toast.error(`Error creating Theatre  ${err}`)
            })
    }

    return (
        <Box>
            <Box
                container
                sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
                mb={1.5}
            >
                <FormsHeaderText text="Create Radiology Request" />

                <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
                    <AddCircleOutline
                        fontSize="small"
                        sx={{ marginRight: '5px' }}
                    />
                    Add
                </GlobalCustomButton>
            </Box>

            <Box>
                <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                    <Grid item xs={12} sm={6}>
                        <Input
                            name="date"
                            register={register('date')}
                            type="date"
                            label="Date"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            name="ward"
                            register={register('ward')}
                            type="text"
                            label="Ward/OPD"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ClientSearch
                            getSearchfacility={handleGetPatient}
                            id={patient?._id}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            name="provisionalDiagnosis"
                            register={register('provisionalDiagnosis')}
                            type="text"
                            label="Provisional Diagnosis (Wailing case, Wheelchair, Trolley, Theatre, Portable"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            name="xrayNo"
                            register={register('xrayNo')}
                            type="text"
                            label="X-Ray Number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            name="unitNo"
                            register={register('unitNo')}
                            type="text"
                            label="Unit Number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            name="casualtyNo"
                            register={register('casualtyNo')}
                            type="text"
                            label="Casualty Number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            name="gpNo"
                            register={register('gpNo')}
                            type="text"
                            label="G.P Number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            name="antenatalNo"
                            register={register('antenatalNo')}
                            type="text"
                            label="Ante-Natal Number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            name="lastMenstrualPeriod"
                            register={register('lastMenstrualPeriod')}
                            type="text"
                            label="Last Menstrual Period"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Input
                            name="relevantClinicalNotes"
                            register={register('relevantClinicalNotes')}
                            type="text"
                            label="Relevant Clinical Details/Notes"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Box>
                            <GroupedRadio
                                control={control}
                                name={'relevantPreviousOperations'}
                                label="Relevant Previous Operations"
                                options={['Yes', 'No']}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box>
                            <GroupedRadio
                                control={control}
                                name={'previousxray'}
                                label="Previous X-ray Examination"
                                options={['Yes', 'No']}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box>
                            <GroupedRadio
                                control={control}
                                name={'wardPatient'}
                                label="Ward Patient"
                                options={['Yes', 'No']}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            name="examinationRequested"
                            register={register('examinationRequested')}
                            type="text"
                            label="Examination Requested"
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
