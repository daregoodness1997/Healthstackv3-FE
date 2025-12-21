/* eslint-disable react/prop-types */
import { Box, Grid } from '@mui/material'
import ControlPointIcon from '@mui/icons-material/ControlPoint'
import GlobalCustomButton from '../../../../components/buttons/CustomButton'
import Input from '../../../../components/inputs/basic/Input'
import CustomSelect from '../../../../components/inputs/basic/Select'
import { useForm } from 'react-hook-form'
import { useContext, useState } from 'react'
import { ObjectContext, UserContext } from '../../../../context'
import client from '../../../../feathers'
import { toast } from 'react-toastify'
import EmployeeSearch from '../../../helpers/EmployeeSearch'
import { ClientSearch } from '../../../helpers/ClientSearch'

const CreateTask = ({ close }) => {
    const { register, control, handleSubmit } = useForm()
    const { state, showActionLoader, hideActionLoader } =
        useContext(ObjectContext)
    const [staff, setStaff] = useState(null)
    const { user } = useContext(UserContext)
    const [patient, setPatient] = useState(null)

    const handleGetSearchStaff = obj => {
        setStaff(obj)
    }
    const handleGetPatient = obj => {
        setPatient(obj)
    }

    const taskServ = client.service('task')

    const onSubmit = async data => {
        showActionLoader()
        const taskData = {
            staffName: `${staff?.firstname} ${staff?.lastname}`,
            taskTitle: data.taskTitle,
            priority: data.priority,
            description: data.description,
            assignedBy: `${user.firstname} ${user.lastname}`,
            status: data.status,
            facilityId: user.currentEmployee.facilityDetail._id,
            employeeid: user.currentEmployee.userId,
            patientId: state.ARTModule.selectedFamilyProfile._id,
        }

        try {
            await taskServ.create(taskData)
            close(false)
            toast.success('Task created successfully')
        } catch (err) {
            toast.error('Error creating task' + err)
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
                    Assign Task
                </GlobalCustomButton>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <EmployeeSearch
                        getSearchfacility={handleGetSearchStaff}
                        label="Staff Name"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        register={register('taskTitle')}
                        label="Task Title"
                        name="taskTitle"
                        type="text"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input
                        register={register('priority')}
                        label="Priority"
                        name="priority"
                        type="number"
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
                <Grid item xs={12} sm={6}>
                    <Input
                        register={register('description')}
                        label="Description"
                        name="description"
                        type="text"
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default CreateTask
