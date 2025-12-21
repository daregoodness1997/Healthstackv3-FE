/* eslint-disable react/prop-types */
import { Box, Grid, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import Input from '../../../../components/inputs/basic/Input'
import CustomSelect from '../../../../components/inputs/basic/Select'
import { useContext, useState } from 'react'
import ControlPointIcon from '@mui/icons-material/ControlPoint'
import CustomTable from '../../../../components/customtable'
import EmployeeSearch from '../../../helpers/EmployeeSearch'
import DeleteIcon from '@mui/icons-material/Delete'
import { useForm } from 'react-hook-form'
import { ObjectContext } from '../../../../context'
import client from '../../../../feathers'
import { toast } from 'react-toastify'
import { ClientSearch } from '../../../helpers/ClientSearch'

const EditCareTeam = ({ data, onClose }) => {
    const [editMode, setEditMode] = useState(false)
    const [practitioner, setPractitioner] = useState(data.practitioner)
    const [patient, setPatient] = useState(data.practitioner)
    const [members, setMembers] = useState(data.members)
    const { register, control, handleSubmit } = useForm()
    const { showActionLoader, hideActionLoader, state } =
        useContext(ObjectContext)
    const careTeamServ = client.service('careteam')
    const prevCareTeamData = state.ARTModule.selectedCareTeam || []
    const leadPractitionerData =
        state.ARTModule.selectedCareTeam.leadPractitioner || ''
    const status = data.status

    const handleGetPatient = obj => {
        setPatient(obj)
    }

    const handleEdit = () => {
        setEditMode(!editMode)
    }
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
                        if (editMode === true) {
                            handleDeleteSpecialist(row.name)
                        }
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

    const { control: controlSpecialist, handleSubmit: submitSpecialist } =
        useForm()

    const handleDeleteSpecialist = name => {
        setMembers(members.filter(entry => entry.name !== name))
    }

    const onSubmitSpecialistData = formData => {
        // console.log('clicked')
        // console.log({ practitioner })
        const newEntry = {
            employeeid: practitioner,
            name: `${practitioner?.firstname} ${practitioner?.lastname}`,
            ...formData,
        }
        setMembers([...members, newEntry])
    }

    const onSubmit = async editData => {
        showActionLoader()
        const careTeamData = {
            ...prevCareTeamData,
            name: editData.name,
            description: editData.description,
            leadPractitioner: practitioner
                ? `${practitioner?.firstname} ${practitioner?.lastname}`
                : leadPractitionerData,
            startDate: editData.startDate,
            status: editData.status || status,
            members,
        }

        try {
            await careTeamServ.patch(data._id, careTeamData)
            onClose()
            toast.success('Task edited successfully')
        } catch (err) {
            toast.error('Error editing task: ' + err)
        } finally {
            hideActionLoader()
        }
    }

    const handleGetSearchPractitioner = practitioner => {
        setPractitioner(practitioner)
    }
    return (
        <Box
            sx={{
                width: '50vw',
            }}
        >
            <Box display="flex" justifyContent="flex-end" mb={2}>
                {!editMode ? (
                    <GlobalCustomButton type="submit" onClick={handleEdit}>
                        <EditIcon
                            fontSize="small"
                            sx={{ marginRight: '5px' }}
                        />
                        Edit Care Team
                    </GlobalCustomButton>
                ) : (
                    <GlobalCustomButton
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Save
                    </GlobalCustomButton>
                )}
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <Input
                        register={register('name')}
                        label="Care Team Name"
                        name="name"
                        type="text"
                        disabled={!editMode}
                        defaultValue={data.name}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Input
                        register={register('description')}
                        label="Description"
                        name="description"
                        type="text"
                        disabled={!editMode}
                        defaultValue={data.description}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    {!editMode ? (
                        <Input
                            label="Lead Practitioner"
                            type="text"
                            disabled={!editMode}
                            defaultValue={data.leadPractitioner}
                        />
                    ) : (
                        <EmployeeSearch
                            getSearchfacility={handleGetSearchPractitioner}
                            label="Lead Practitioner"
                            name="leadPractitioner"
                            disabled={!editMode}
                            defaultValue={data.leadPractitioner}
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        register={register('startDate')}
                        label="Start Date"
                        name="date"
                        type="date"
                        disabled={!editMode}
                        defaultValue={data.startDate}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    {!editMode ? (
                        <Input
                            label="Client Name"
                            type="text"
                            disabled={!editMode}
                            defaultValue={data.clientname}
                        />
                    ) : (
                        <ClientSearch
                            getSearchfacility={handleGetPatient}
                            disabled={!editMode}
                            id={patient?._id}
                            label="Client Name"
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {!editMode ? (
                        <Input
                            label="Status"
                            type="text"
                            disabled={!editMode}
                            defaultValue={data.status}
                        />
                    ) : (
                        <CustomSelect
                            name="status"
                            label="Status"
                            disabled={!editMode}
                            options={['Pending', 'Ongoing', 'Completed']}
                            control={control}
                            defaultValue={data.status}
                        />
                    )}
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
                <Grid item xs={12} sm={7.5}>
                    <EmployeeSearch
                        getSearchfacility={handleGetSearchPractitioner}
                        label="Find specialist/Nurse/Physician"
                        disabled={!editMode}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <CustomSelect
                        name="role"
                        label="Role"
                        options={['Lead', 'Assistant']}
                        disabled={!editMode}
                        control={controlSpecialist}
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

export default EditCareTeam
