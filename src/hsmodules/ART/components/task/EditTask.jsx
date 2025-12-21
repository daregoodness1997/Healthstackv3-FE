/* eslint-disable react/prop-types */
import { Box, Grid } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import Input from '../../../../components/inputs/basic/Input'
import CustomSelect from '../../../../components/inputs/basic/Select'
import { useContext, useState } from 'react'
import EmployeeSearch from '../../../helpers/EmployeeSearch'
import { useForm } from 'react-hook-form'
import { ObjectContext, UserContext } from '../../../../context'
import { toast } from 'react-toastify'
import client from '../../../../feathers'
import { useEffect } from 'react'
import { ClientSearch } from '../../../helpers/ClientSearch'

const EditTask = ({ data, onClose }) => {
    const [editMode, setEditMode] = useState(false)
    const [staff, setStaff] = useState(null)
    const [patient, setPatient] = useState(null)
    const { register, control, handleSubmit, setValue } = useForm()
    const { state, showActionLoader, hideActionLoader } =
        useContext(ObjectContext)
    const { user } = useContext(UserContext)
    const taskServ = client.service('task')
    const prevTaskData = state.ARTModule.selectedTask || []
    const staffData = state.ARTModule.selectedTask.staffName || ''

    const handleGetSearchStaff = staff => {
        setStaff(staff)
    }

    const handleGetPatient = obj => {
        setPatient(obj)
    }

    const handleEdit = () => {
        setEditMode(!editMode)
    }

    const onSubmit = async editData => {
        showActionLoader()
        const taskData = {
            ...prevTaskData,
            staff: staff ? `${staff.firstname} ${staff.lastname}` : staffData,
            taskTitle: editData.taskTitle,
            priority: editData.priority,
            description: editData.description,
            assignedBy: editData.assignedBy,
            status: editData.status,
            facilityId: user.currentEmployee.facilityDetail._id,
            employeeid: user.currentEmployee.userId,
            patientId: state.ARTModule.selectedFamilyProfile._id,
        }

        try {
            await taskServ.patch(data._id, taskData)
            onClose()
            toast.success('Task edited successfully')
        } catch (err) {
            toast.error('Error editing task: ' + err)
        } finally {
            hideActionLoader()
        }
    }

    useEffect(() => {
        setValue('staffName', data.staffName)
        setValue('taskTitle', data.taskTitle)
        setValue('priority', data.priority)
        setValue('status', data.status)
        setValue('description', data.description)
    }, [data, setValue])

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
                        Edit Task
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
                <Grid item xs={12} sm={6}>
                    {!editMode ? (
                        <Input
                            label="Staff Name"
                            type="text"
                            disabled={!editMode}
                            register={register('staffName')}
                        />
                    ) : (
                        <EmployeeSearch
                            getSearchfacility={handleGetSearchStaff}
                            label="Staff Name"
                            disabled={!editMode}
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        label="Task Title"
                        name="taskTitle"
                        type="text"
                        disabled={!editMode}
                        register={register('taskTitle')}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        label="Priority"
                        name="priority"
                        type="number"
                        disabled={!editMode}
                        register={register('priority')}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    {!editMode ? (
                        <Input
                            label="Status"
                            type="text"
                            disabled={!editMode}
                        />
                    ) : (
                        <CustomSelect
                            name="status"
                            label="Status"
                            disabled={!editMode}
                            options={['Pending', 'Ongoing', 'Completed']}
                            control={control}
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {!editMode ? (
                        <Input
                            label="Patient Profile"
                            type="text"
                            disabled={!editMode}
                            register={register('clientname')}
                        />
                    ) : (
                        <ClientSearch
                            getSearchfacility={handleGetPatient}
                            id={patient?._id}
                            disabled={!editMode}
                            label="Client Name"
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        label="Description"
                        name="description"
                        type="text"
                        disabled={!editMode}
                        register={register('description')}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default EditTask
