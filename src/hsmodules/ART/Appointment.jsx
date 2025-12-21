import React, { useState } from 'react'
import { PageWrapper } from '../../ui/styled/styles'
import { TableMenu } from '../../ui/styled/global'
import FilterMenu from '../../components/utilities/FilterMenu'
import CustomTable from '../../components/customtable'
import { format } from 'date-fns'
import { UserContext } from '../../context'
import { useContext } from 'react'
import client from '../../feathers'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

export default function Appointment() {
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const AppointmentServ = client.service('appointments')
    const [appointment, setAppointment] = useState([])
    const { user } = useContext(UserContext)

    const getAppointment = async () => {
        try {
            setLoading(true)
            const findAppointments = await AppointmentServ.find({
                query: {
                    facility: user.currentEmployee.facilityDetail._id,
                    $sort: { createdAt: -1 },
                    $limit: limit,
                    $skip: (page - 1) * limit,
                },
            })
            setAppointment(findAppointments.data)
            setTotal(findAppointments.total)
        } catch (error) {
            console.error('Error fetching appointments:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAppointment()

        AppointmentServ.on('created', obj => getAppointment())
        AppointmentServ.on('updated', obj => getAppointment())
        AppointmentServ.on('patched', obj => getAppointment())
        AppointmentServ.on('removed', obj => getAppointment())
        return () => {}
    }, [limit, page])

    const handleRow = async data => {
        // showDetail();
    }

    const handleSearch = val => {
        //console.log(val);
        AppointmentServ.find({
            query: {
                $or: [
                    {
                        firstname: {
                            $regex: val,
                            $options: 'i',
                        },
                    },

                    {
                        practitioner_name: {
                            $regex: val,
                            $options: 'i',
                        },
                    },
                ],

                facility: user.currentEmployee.facilityDetail._id,
                $limit: limit,
                $sort: {
                    createdAt: -1,
                },
            },
        })
            .then(res => {
                // console.log(res);
                setAppointment(res.data)
            })
            .catch(err => {
                toast.error(`Something went wrong!!!! ${err}`)
                // console.log(err);
            })
    }

    const AppointmentSchema = [
        {
            name: 'S/N',
            key: 'sn',
            description: 'SN',
            selector: row => row.sn,
            sortable: true,
            inputType: 'HIDDEN',
            width: '60px',
        },
        {
            name: 'Date/Time',
            key: 'date',
            description: 'Date/Time',
            selector: row =>
                row.start_time
                    ? format(
                          new Date(row.start_time.slice(0, 19)),
                          'dd/MM/yyyy HH:mm',
                      )
                    : '',
            sortable: true,
            required: true,
            inputType: 'TEXT',
            width: '150px',
        },
        {
            name: 'First Name',
            key: 'firstname',
            description: 'First Name',
            selector: row => row.firstname,
            sortable: true,
            required: true,
            inputType: 'TEXT',
            width: '150px',
        },
        {
            name: 'Classification',
            key: 'classification',
            description: 'Classification',
            selector: row => row.appointmentClass,
            sortable: true,
            required: true,
            inputType: 'TEXT',
            width: '150px',
        },
        {
            name: 'Type',
            key: 'type',
            description: 'Type',
            selector: row => row.appointment_type,
            sortable: true,
            required: true,
            inputType: 'TEXT',
            width: '100px',
        },
        {
            name: 'Status',
            key: 'status',
            description: 'Status',
            selector: row => row.appointment_status,
            sortable: true,
            required: true,
            inputType: 'TEXT',
            width: '150px',
        },
        {
            name: 'Reason',
            key: 'reason',
            description: 'Reason',
            selector: row => row.appointment_reason,
            sortable: true,
            required: true,
            inputType: 'TEXT',
            width: '150px',
        },
        {
            name: 'Practitioner',
            key: 'practitioner',
            description: 'Practitioner',
            selector: row => row.practitioner_name,
            sortable: true,
            required: true,
            inputType: 'TEXT',
            width: '100px',
        },
    ]

    const onTableChangeRowsPerPage = size => {
        setLimit(size)
        setPage(1)
    }

    const onTablePageChange = newPage => {
        setPage(newPage)
    }

    return (
        <>
            <div className="level">
                <PageWrapper
                    style={{ flexDirection: 'column', padding: '0.6rem 1rem' }}
                >
                    <TableMenu>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                            }}
                        >
                            {handleSearch && (
                                <div className="inner-table">
                                    <FilterMenu onSearch={handleSearch} />
                                </div>
                            )}
                            <h2
                                style={{
                                    margin: '0 10px',
                                    fontSize: '0.95rem',
                                }}
                            >
                                Appointment
                            </h2>
                        </div>
                    </TableMenu>

                    <div
                        className="level"
                        style={{
                            overflow: 'auto',
                        }}
                    >
                        <CustomTable
                            title={'Appointment List'}
                            columns={AppointmentSchema}
                            data={appointment}
                            pointerOnHover
                            highlightOnHover
                            striped
                            onChangeRowsPerPage={onTableChangeRowsPerPage}
                            onChangePage={onTablePageChange}
                            onRowClicked={handleRow}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={total}
                        />
                    </div>
                </PageWrapper>
            </div>
        </>
    )
}
