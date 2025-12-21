/* eslint-disable react/prop-types */
import { Box, Grid, Typography } from '@mui/material'
import ControlPointIcon from '@mui/icons-material/ControlPoint'
import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import Input from '../../../../components/inputs/basic/Input'
import CustomSelect from '../../../../components/inputs/basic/Select'
import CustomTable from '../../../../components/customtable'
import DeleteIcon from '@mui/icons-material/Delete'
import { useForm } from 'react-hook-form'
import { useContext, useState } from 'react'
import { ObjectContext } from '../../../../context'
import client from '../../../../feathers'
import { toast } from 'react-toastify'
import EmployeeSearch from '../../../helpers/EmployeeSearch'
import { ClientSearch } from '../../../helpers/ClientSearch'

const CreateCareTeam = ({ onClose }) => {
    const { register, control, handleSubmit } = useForm()
    const [practitioner, setPractitioner] = useState(null)
    const [patient, setPatient] = useState(null)
    const { control: controlSpecialist, handleSubmit: submitSpecialist } =
        useForm()
    const { showActionLoader, hideActionLoader } = useContext(ObjectContext)
    const [members, setMembers] = useState([])
    const careTeamServ = client.service('careteam')

    const SpecialistSchema = [
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
            name: 'Name',
            key: 'name',
            selector: row => row.name,
            sortable: false,
            width: '200px',
        },
        {
            name: 'Role',
            key: 'role',
            selector: row => row.role,
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
                        handleDeleteSpecialist(row.name)
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

    const handleGetPatient = obj => {
        setPatient(obj)
    }

    const handleGetSearchPractitioner = obj => {
        setPractitioner(obj)
    }

    const onSubmitSpecialistData = formData => {
        // console.log('clicked')
        // console.log({ practitioner })
        const newEntry = {
            employeeid: practitioner,
            name: `${practitioner.firstname} ${practitioner.lastname}`,
            ...formData,
        }
        setMembers([...members, newEntry])
    }
    const handleDeleteSpecialist = name => {
        setMembers(members.filter(entry => entry.name !== name))
    }
    const onSubmit = async data => {
        // console.log('submitted')
        showActionLoader()
        const careTeamData = {
            name: data.name,
            description: data.description,
            leadPractitioner: `${practitioner.firstname} ${practitioner.lastname}`,
            startDate: data.startDate,
            status: data.status,
            members,
        }

        // console.log({ careTeamData })

        try {
            await careTeamServ.create(careTeamData)
            toast.success('Care team created successfully')
            onClose()
        } catch (err) {
            toast.error('Error creating care team: ' + err)
            // console.log(err);
        } finally {
            hideActionLoader()
        }
    }

    return (
        <Box
            sx={{
                width: '50vw',
            }}
        >
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <GlobalCustomButton
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                >
                    <ControlPointIcon
                        fontSize="small"
                        sx={{ marginRight: '5px' }}
                    />
                    Complete
                </GlobalCustomButton>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <Input
                        register={register('name')}
                        label="Care Team Name"
                        name="name"
                        type="text"
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Input
                        register={register('description')}
                        label="Description"
                        name="description"
                        type="text"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <EmployeeSearch
                        getSearchfacility={handleGetSearchPractitioner}
                        label="Lead Practitioner"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        register={register('startDate')}
                        label="Start Date"
                        name="date"
                        type="date"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CustomSelect
                        control={control}
                        name="status"
                        label="Status"
                        options={['Pending', 'Ongoing', 'Completed']}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ClientSearch
                        getSearchfacility={handleGetPatient}
                        id={patient?._id}
                        label="Client Name"
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography
                        component={'h6'}
                        fontSize={14}
                        fontWeight={'bold'}
                        sx={{ mb: 1 }}
                    >
                        Add Specialists/Nursing/Physician
                    </Typography>
                </Grid>

                {/* Add Specialist  */}
                <Grid item xs={12} sm={7.5}>
                    <EmployeeSearch
                        getSearchfacility={handleGetSearchPractitioner}
                        label="Find specialist/Nurse/Physician"
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <CustomSelect
                        control={controlSpecialist}
                        name="role"
                        label="Role"
                        options={['Lead', 'Assistant']}
                    />
                </Grid>
                <Grid item xs={12} sm={1.5}>
                    <GlobalCustomButton
                        type="submit"
                        onClick={submitSpecialist(onSubmitSpecialistData)}
                    >
                        <ControlPointIcon
                            fontSize="small"
                            sx={{ marginRight: '5px' }}
                        />
                        Add
                    </GlobalCustomButton>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <div
                        className="level"
                        style={{
                            overflow: 'auto',
                        }}
                    >
                        <CustomTable
                            title={'Specialists/Nurses/Physicians'}
                            columns={SpecialistSchema}
                            data={members}
                            pointerOnHover
                            highlightOnHover
                            striped
                        />
                    </div>
                </Grid>
            </Grid>
        </Box>
    )
}

export default CreateCareTeam
