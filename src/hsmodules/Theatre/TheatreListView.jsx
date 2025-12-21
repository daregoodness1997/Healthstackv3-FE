import { Box, Grid, Typography } from '@mui/material'
import Input from '../../components/inputs/basic/Input'
import client from '../../feathers'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ObjectContext } from '../../context'
import GlobalCustomButton from '../../components/buttons/CustomButton'

export default function ViewTheatreList({ data }) {
    const { state, setState } = useContext(ObjectContext)
    const [selectedClient, setSelectedClient] = useState()
    const navigate = useNavigate()
    const [edit, setEdit] = useState(false)

    const Client = state.AppointmentModule.selectedAppointment

    const handleAttendToClient = async () => {
        console.log(Client)
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
        navigate('/app/clinic/documentation')
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
                <GlobalCustomButton
                    text="Attend to Client"
                    onClick={handleAttendToClient}
                    customStyles={{
                        float: 'right',
                        marginLeft: 'auto',
                    }}
                />
            </Box>

            <Box>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Input
                            type="text"
                            label="Client"
                            defaultValue={
                                data.documentdetail.orderDetails.clientname ||
                                ''
                            }
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            type="text"
                            label="Created By"
                            defaultValue={data.createdByname || ''}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            type="date"
                            label="Date"
                            defaultValue={data.documentdetail.date || ''}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            type="text"
                            label="Order Status"
                            defaultValue={
                                data.documentdetail.orderDetails.order_status ||
                                ''
                            }
                            disabled
                        />
                    </Grid>
                    <Grid container ml={1} spacing={1} mt={1}>
                        <Grid item xs={12}>
                            <Typography sx={{ fontSize: '0.8rem', mb: 1 }}>
                                Details
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Input
                                type="text"
                                label="Anaesthesia Type"
                                defaultValue={
                                    data.documentdetail.anaesthesiaType || ''
                                }
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Input
                                label="Indication"
                                type="text"
                                defaultValue={
                                    data.documentdetail.indication || ''
                                }
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Input
                                type="text"
                                label="Medical Officer Initials"
                                defaultValue={
                                    data.documentdetail
                                        .medicalOfficerInitials || ''
                                }
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Input
                                type="text"
                                label="Remark"
                                defaultValue={data.documentdetail.remark || ''}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Input
                                type="text"
                                label="Ward"
                                defaultValue={data.documentdetail.ward || ''}
                                disabled
                            />
                        </Grid>
                        {data.documentdetail.anaesthetist.length > 0 && (
                            <Grid container ml={1} mt={1}>
                                <Typography sx={{ fontSize: '0.8rem' }}>
                                    Anaesthetist
                                </Typography>
                                {data.documentdetail.anaesthetist.map(
                                    (item, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Input
                                                type="text"
                                                defaultValue={
                                                    `${item.firstname} ${item.lastname}` ||
                                                    ''
                                                }
                                                disabled
                                            />
                                        </Grid>
                                    ),
                                )}
                            </Grid>
                        )}
                        {data.documentdetail.surgeon.length > 0 && (
                            <Grid container ml={1} mt={1}>
                                <Typography sx={{ fontSize: '0.8rem' }}>
                                    Surgeon
                                </Typography>
                                {data.documentdetail.surgeon.map(
                                    (item, index) => (
                                        <Grid item xs={12} key={index}>
                                            <Input
                                                type="text"
                                                defaultValue={
                                                    `${item.firstname} ${item.lastname}` ||
                                                    ''
                                                }
                                                disabled
                                            />
                                        </Grid>
                                    ),
                                )}
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
