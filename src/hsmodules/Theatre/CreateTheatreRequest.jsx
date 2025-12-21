import { useState, useContext, useEffect } from 'react'
import { UserContext, ObjectContext } from '../../context'
import { toast } from 'react-toastify'
import { Box, Typography } from '@mui/material'
import ModalBox from '../../components/modal'
import CustomTable from '../../components/customtable'
import Input from '../../components/inputs/basic/Input'
import { FormsHeaderText } from '../../components/texts'
import GlobalCustomButton from '../../components/buttons/CustomButton'
import AddCircleOutline from '@mui/icons-material/AddCircleOutline'
import { useForm } from 'react-hook-form'
import Textarea from '../../components/inputs/basic/Textarea'
import AddBoxIcon from '@mui/icons-material/AddBox'
import AddAnaesthetist from '../Corporate/components/claims/Anaesthetist'
import AddSurgeon from '../Corporate/components/claims/Surgeon'
import client from '../../feathers'
import CustomSelect from '../../components/inputs/basic/Select'
import LocationSearch from '../helpers/LocationSearch'

export default function TheatreRequestCreate({ orderDetails, setModalOpen }) {
    const notificationsServer = client.service('notification')
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [anaesthetist, setAnaesthetist] = useState([])
    const [newAnaesthetist, setNewAnaesthetist] = useState([])
    const [anaesthetistModal, setAnaesthetistModal] = useState(false)
    const [surgeon, setSurgeon] = useState([])
    const [newSurgeon, setNewSurgeon] = useState([])
    const [surgeonModal, setSurgeonModal] = useState(false)
    const { register, handleSubmit } = useForm()
    const [location, setLocation] = useState()
    const [chosen, setChosen] = useState()
    const { state, setState, hideActionLoader, showActionLoader } =
        useContext(ObjectContext)

    const OrderServ = client.service('order')
    const documentId = orderDetails._id
    // console.log(orderDetails)

    const handleGetLocation = location => {
        setLocation(location)
    }

    const practitionerSchema = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
            width: '200px',
        },
        {
            name: 'Practictioner Name',
            key: 'fullname',
            description: 'fullname',
            selector: row => row.firstname + ' ' + row.lastname,
            inputType: 'HIDDEN',
            width: '300px',
        },
    ]

    const { user } = useContext(UserContext)

    // const [currentUser, setCurrentUser] = useState()
    const [destination, setDestination] = useState('')

    const ClientServ = client.service('clinicaldocument')
    // console.log(anaesthetist)

    // useEffect(() => {
    //     setCurrentUser(user)
    //     return () => {}
    // }, [user])

    const onSubmit = data => {
        showActionLoader()

        setMessage('')
        setError(false)
        setSuccess(false)
        let document = {}
        data.surgeon = surgeon
        data.anaesthetist = anaesthetist
        data.orderDetails = {
            ...orderDetails,
            order_status: 'Fulfilled',
        }
        data.ward = location
        if (user.currentEmployee) {
            document.facility = user.currentEmployee.facilityDetail._id
            document.facilityname =
                user.currentEmployee.facilityDetail.facilityName
        }
        document.documentdetail = data

        document.documentname = 'Theatre Request Form'
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

        const changeStatus = async () => {
            const updateOrderStatus = {
                ...orderDetails,
                order_status: 'Fulfilled',
            }
            try {
                await OrderServ.patch(documentId, updateOrderStatus)
                toast.success('Status updated successfully')
            } catch (err) {
                toast.error('Error submitting Status: ' + err)
            }
        }
        changeStatus()

        ClientServ.create(document)
            .then(async () => {
                await notificationsServer.create(notificationObj)
                setSuccess(true)
                hideActionLoader()
                toast.success('Theatre request created succesfully')
                setModalOpen(false)
                setDestination(user.currentEmployee.facilityDetail.facilityName)
                setSuccess(false)
            })
            .catch(err => {
                toast.error(`Error creating Theatre  ${err}`)
            })
    }

    useEffect(() => {
        setDestination(user.currentEmployee.facilityDetail.facilityName)
        return () => {}
    }, [])

    return (
        <Box>
            <ModalBox
                open={anaesthetistModal}
                onClose={() => setAnaesthetistModal(false)}
                header="Add Anaesthetist"
            >
                <AddAnaesthetist
                    closeModal={() => setAnaesthetistModal(false)}
                    setAnaesthetist={setAnaesthetist}
                />
            </ModalBox>
            <ModalBox
                open={surgeonModal}
                onClose={() => setSurgeonModal(false)}
                header="Add Surgeon"
            >
                <AddSurgeon
                    closeModal={() => setSurgeonModal(false)}
                    setSurgeon={setSurgeon}
                />
            </ModalBox>
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
                <FormsHeaderText text="Create Theatre request" />

                <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
                    <AddCircleOutline
                        fontSize="small"
                        sx={{ marginRight: '5px' }}
                    />
                    Add
                </GlobalCustomButton>
            </Box>

            <Box
                sx={{ display: 'flex', flexDirection: 'column' }}
                gap={1.5}
                mb={1.5}
            >
                <Input
                    name="date"
                    register={register('date')}
                    type="date"
                    label="Date"
                />

                <LocationSearch
                    getSearchfacility={handleGetLocation}
                    label={'Ward'}
                />

                <Input
                    name="indication"
                    register={register('indication')}
                    type="text"
                    label="Indication"
                />
                <Input
                    name="anaesthesiaType"
                    register={register('anaesthesiaType')}
                    type="text"
                    label="Type of Anaesthesia"
                />
                <Textarea
                    label="Remark"
                    register={register('remark')}
                    type="text"
                />
                <Input
                    name="medicalOfficerInitials"
                    register={register('medicalOfficerInitials')}
                    type="text"
                    label="Medical Officer Signature (Initials)"
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        my: 2,
                    }}
                >
                    <FormsHeaderText text="Anaesthetist" />

                    {newAnaesthetist && (
                        <GlobalCustomButton
                            onClick={() => setAnaesthetistModal(true)}
                            sx={{ marginLeft: 'auto' }}
                        >
                            <AddBoxIcon
                                sx={{ marginRight: '3px' }}
                                fontSize="small"
                            />
                            Add Anaesthetist
                        </GlobalCustomButton>
                    )}
                </Box>
                <Box>
                    {newAnaesthetist ? (
                        <CustomTable
                            title={''}
                            columns={practitionerSchema}
                            data={anaesthetist}
                            pointerOnHover
                            highlightOnHover
                            striped
                            progressPending={false}
                            CustomEmptyData={
                                <Typography sx={{ fontSize: '0.8rem' }}>
                                    You&apos;ve not added a anaesthetist yet...
                                </Typography>
                            }
                        />
                    ) : (
                        <Textarea
                            register={register('anaesthetist')}
                            type="text"
                            label="anaesthetist"
                            placeholder="anaesthetist......"
                        />
                    )}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        my: 2,
                    }}
                >
                    <FormsHeaderText text="Surgeon" />

                    {newSurgeon && (
                        <GlobalCustomButton
                            onClick={() => setSurgeonModal(true)}
                            sx={{ marginLeft: 'auto' }}
                        >
                            <AddBoxIcon
                                sx={{ marginRight: '3px' }}
                                fontSize="small"
                            />
                            Add Surgeon
                        </GlobalCustomButton>
                    )}
                </Box>
                <Box>
                    {newSurgeon ? (
                        <CustomTable
                            title={''}
                            columns={practitionerSchema}
                            data={surgeon}
                            pointerOnHover
                            highlightOnHover
                            striped
                            progressPending={false}
                            CustomEmptyData={
                                <Typography sx={{ fontSize: '0.8rem' }}>
                                    You&apos;ve not added a surgeon yet...
                                </Typography>
                            }
                        />
                    ) : (
                        <Textarea
                            register={register('surgeon')}
                            type="text"
                            label="surgeon"
                            placeholder="surgeon......"
                        />
                    )}
                </Box>
            </Box>
        </Box>
    )
}
