import { useContext, useEffect, useState } from 'react'
import { TableMenu } from '../../ui/styled/global'
import FilterMenu from '../../components/utilities/FilterMenu'
import GlobalCustomButton from '../../components/buttons/CustomButton'
import AddCircleOutline from '@mui/icons-material/AddCircleOutline'
import { PageWrapper } from '../../ui/styled/styles'
import CreateTask from './components/task/CreateTask'
import ModalBox from '../../components/modal'
import CustomTable from '../../components/customtable'
import EditTask from './components/task/EditTask'
import DeleteIcon from '@mui/icons-material/Delete'
import { ObjectContext, UserContext } from '../../context'
import client from '../../feathers'
import { toast } from 'react-toastify'
import CustomConfirmationDialog from '../../components/confirm-dialog/confirm-dialog'

const Task = () => {
    const [createModal, setCreateModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [total, setTotal] = useState(0)
    const [taskData, setTaskData] = useState(10)
    const [data, setData] = useState(null)
    const [taskToDelete, setTaskToDelete] = useState(null)
    const [confirmationDialog, setConfirmationDialog] = useState(false)

    const { user } = useContext(UserContext)
    const taskServ = client.service('task')
    const { showActionLoader, setState, hideActionLoader } =
        useContext(ObjectContext)

    const handleCreateModal = () => {
        setCreateModal(true)
    }

    const handleHideCreateModal = () => {
        setCreateModal(false)
    }

    const handleConfirmDelete = task => {
        setState(prev => ({
            ...prev,
            ARTModule: { ...prev.ARTModule, selectedTask: data },
        }))
        setTaskToDelete(task)
        setConfirmationDialog(true)
    }

    const handleEditModal = data => {
        // console.log(data)

        setData(data)
        setEditModal(true)
    }

    const handleHideEditModal = () => {
        setEditModal(false)
    }

    const handleDelete = () => {
        showActionLoader()
        taskServ
            .remove(taskToDelete._id)
            .then(() => {
                hideActionLoader()
                toast.success(`Task Deleted succesfully`)
                setConfirmationDialog(false)
            })
            .catch(err => {
                hideActionLoader()
                toast.error('Error deleting task ' + err)
            })
    }

    const closeConfirmationDialog = () => {
        setTaskToDelete(null)
        setConfirmationDialog(false)
    }

    const handleSearch = val => {
        //console.log(val);
        taskServ
            .find({
                query: {
                    $or: [
                        {
                            staffName: {
                                $regex: val,
                                $options: 'i',
                            },
                        },

                        {
                            taskTitle: {
                                $regex: val,
                                $options: 'i',
                            },
                        },
                        {
                            assignedBy: {
                                $regex: val,
                                $options: 'i',
                            },
                        },
                    ],

                    facilityId: user.currentEmployee.facilityDetail._id,
                    $limit: limit,
                    $sort: {
                        createdAt: -1,
                    },
                },
            })
            .then(res => {
                // console.log(res);
                setTaskData(res.data)
            })
            .catch(err => {
                toast.error(`Something went wrong!!!! ${err}`)
                // console.log(err);
            })
    }

    const TaskSchema = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            selector: (row, i) => i + 1,
            sortable: true,
            inputType: 'HIDDEN',
            width: '50px',
        },
        {
            name: 'Staff Name',
            key: 'staffName',
            selector: row => row.staffName,
            sortable: false,
            width: '150px',
        },
        {
            name: 'Task Title',
            key: 'taskTitle',
            selector: row => row.taskTitle,
            sortable: false,
            width: '150px',
        },
        {
            name: 'Priority',
            key: 'priority',
            selector: row => row.priority,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Description',
            key: 'description',
            selector: row => row.description,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Assigned By',
            key: 'assignedBy',
            selector: row => row.assignedBy,
            sortable: false,
            width: '150px',
        },
        {
            name: 'Status',
            key: 'status',
            selector: row => row.status,
            sortable: false,
            width: '150px',
        },
        {
            name: 'Action',
            key: 'action',
            selector: row => row.action,
            cell: row => (
                <span onClick={() => handleConfirmDelete(row)}>
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
            sortable: false,
            width: '50px',
        },
    ]

    const getTask = async () => {
        const facId = user.currentEmployee.facilityDetail._id

        let query = {
            facilityId: facId,
            $sort: {
                createdAt: -1,
            },
            $limit: limit,
            $skip: (page - 1) * limit,
        }

        const res = await taskServ.find({ query })

        setTaskData(res.data)
        setTotal(res.total || 0)
    }

    useEffect(() => {
        getTask()

        taskServ.on('created', obj => getTask())
        taskServ.on('updated', obj => getTask())
        taskServ.on('patched', obj => getTask())
        taskServ.on('removed', obj => getTask())
    }, [limit, page])

    const onTableChangeRowsPerPage = size => {
        setLimit(size)
        setPage(1)
    }

    const onTablePageChange = newPage => {
        setPage(newPage)
    }

    return (
        <div>
            <PageWrapper
                style={{ flexDirection: 'column', padding: '0.6rem 1rem' }}
            >
                <TableMenu>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {handleSearch && (
                            <div className="inner-table">
                                <FilterMenu onSearch={handleSearch} />
                            </div>
                        )}
                        <h2 style={{ margin: '0 10px', fontSize: '0.95rem' }}>
                            Task
                        </h2>
                    </div>

                    <GlobalCustomButton onClick={handleCreateModal}>
                        <AddCircleOutline
                            fontSize="small"
                            sx={{ marginRight: '5px' }}
                        />
                        Assign Task
                    </GlobalCustomButton>
                </TableMenu>
                <ModalBox
                    open={createModal}
                    onClose={handleHideCreateModal}
                    header="Assign New Task"
                >
                    <CreateTask close={handleHideCreateModal} />
                </ModalBox>

                <div
                    className="level"
                    style={{
                        overflow: 'auto',
                    }}
                >
                    <CustomTable
                        title={'Tasks'}
                        columns={TaskSchema}
                        data={
                            taskData && Array.isArray(taskData) ? taskData : []
                        }
                        pointerOnHover
                        highlightOnHover
                        striped
                        onChangeRowsPerPage={onTableChangeRowsPerPage}
                        onChangePage={onTablePageChange}
                        onRowClicked={data => {
                            handleEditModal(data)
                        }}
                        pagination
                        paginationServer
                        paginationTotalRows={total}
                    />
                </div>
                <CustomConfirmationDialog
                    open={confirmationDialog}
                    confirmationAction={() => handleDelete(taskToDelete)}
                    cancelAction={closeConfirmationDialog}
                    type="danger"
                    message={`You are about to delete a task: ${
                        taskToDelete?.taskTitle
                    } assigned by ${taskToDelete?.assignedBy}?`}
                />
                <ModalBox
                    open={editModal}
                    onClose={handleHideEditModal}
                    header="Task Details"
                >
                    <EditTask onClose={handleHideEditModal} data={data} />
                </ModalBox>
            </PageWrapper>
        </div>
    )
}

export default Task
