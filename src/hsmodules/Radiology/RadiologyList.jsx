import { useContext, useEffect, useState } from 'react'
import ModalBox from '../../components/modal'
import { TableMenu } from '../../ui/styled/global'
import { PageWrapper } from '../../ui/styled/styles'
import CustomTable from '../../components/customtable'
import client from '../../feathers'
import { format } from 'date-fns'
import { UserContext } from '../../context'
// import ViewTheatreRequest from './TheatreRequestView'
import ViewTheatreList from '../Theatre/TheatreListView'

const RadiologyList = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [detailsModalOpen, setDetailsModalOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [facilities, setFacilities] = useState([])
    const [selectedData, setSelectedData] = useState([])
    const { user } = useContext(UserContext)
    const OrderServ = client.service('clinicaldocument')
    console.log(facilities)

    const RequestSchema = [
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
            name: 'Date',
            key: 'documentdetail',
            description: '',
            selector: row =>
                format(new Date(row.documentdetail.date), 'dd-MM-yy'),
            inputType: 'HIDDEN',
            width: '100px',
        },
        {
            name: 'Client Name',
            key: 'client',
            description: '',
            selector: row => row.client,
            inputType: 'HIDDEN',
            width: '300px',
        },
        {
            name: 'Anaesthesia Type',
            key: 'documentdetail',
            description: '',
            selector: row => row.documentdetail.anaesthesiaType,
            inputType: 'HIDDEN',
            width: '300px',
        },
        {
            name: 'Indication',
            key: 'documentdetail',
            description: '',
            selector: row => row.documentdetail.indication,
            inputType: 'HIDDEN',
            width: '300px',
        },
        {
            name: 'Order Number',
            key: 'documentdetail',
            description: '',
            selector: row => row.documentdetail.orderNo,
            inputType: 'HIDDEN',
            width: '300px',
        },
        {
            name: 'Ward',
            key: 'documentdetail',
            description: '',
            selector: row => row.documentdetail.ward,
            inputType: 'HIDDEN',
            width: '300px',
        },
        {
            name: 'Anaesthetist',
            key: 'documentdetail',
            description: '',
            selector: row =>
                Array.isArray(row.documentdetail.anaesthetist)
                    ? row.documentdetail.anaesthetist
                          .map(item => `${item.firstname} ${item.lastname}`)
                          .join(', ')
                    : '',
            inputType: 'HIDDEN',
            width: '300px',
        },
        {
            name: 'Surgeon',
            key: 'documentdetail',
            description: '',
            selector: row =>
                Array.isArray(row.documentdetail.surgeon)
                    ? row.documentdetail.surgeon
                          .map(item => `${item.firstname} ${item.lastname}`)
                          .join(', ')
                    : '',
            inputType: 'HIDDEN',
            width: '300px',
        },
        {
            name: 'Requested By',
            key: 'createdByname',
            description: '',
            selector: row => row.createdByname,
            inputType: 'HIDDEN',
            width: '200px',
        },
    ]

    const getFacilities = async () => {
        try {
            setLoading(true)
            const theatreRequests = await OrderServ.find({
                query: {
                    documentname: 'Theatre Request Form',
                    facility: user.currentEmployee.facilityDetail._id,
                    $sort: { createdAt: -1 },
                    $limit: limit,
                    $skip: (page - 1) * limit,
                },
            })
            console.log(theatreRequests)
            setFacilities(theatreRequests.data)
            setTotal(theatreRequests.total)
        } catch (error) {
            console.error('Error fetching facilities:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRow = async data => {
        setDetailsModalOpen(true)
        await setSelectedData(data)
    }

    const onTableChangeRowsPerPage = size => {
        setLimit(size)
        setPage(1)
    }

    const onTablePageChange = newPage => {
        setPage(newPage)
    }

    useEffect(() => {
        getFacilities()
        OrderServ.on('created', () => getFacilities())
        OrderServ.on('updated', () => getFacilities())
        OrderServ.on('patched', () => getFacilities())
        OrderServ.on('removed', () => getFacilities())
        return () => {}
    }, [limit, page])

    return (
        <div>
            <PageWrapper
                style={{
                    flexDirection: 'column',
                    padding: '0.6rem 1rem',
                }}
            >
                <ModalBox
                    open={detailsModalOpen}
                    onClose={() => setDetailsModalOpen(false)}
                    header="View Theatre Order Details"
                    width={'50%'}
                >
                    <ViewTheatreList data={selectedData} />
                </ModalBox>

                <TableMenu>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        {/* <GlobalCustomButton
                            text="Add New Request"
                            onClick={() => setModalOpen(true)}
                            customStyles={{
                                float: 'right',
                                marginLeft: 'auto',
                            }}
                        /> */}
                    </div>
                </TableMenu>

                <div
                    style={{
                        width: '100%',
                        height: '600px',
                        overflow: 'auto',
                    }}
                >
                    <CustomTable
                        title={''}
                        columns={RequestSchema}
                        data={facilities}
                        pointerOnHover
                        highlightOnHover
                        striped
                        progressPending={loading}
                        onRowClicked={handleRow}
                        onChangeRowsPerPage={onTableChangeRowsPerPage}
                        onChangePage={onTablePageChange}
                        pagination
                        paginationServer
                        paginationTotalRows={total}
                    />
                </div>
            </PageWrapper>
        </div>
    )
}

export default RadiologyList
