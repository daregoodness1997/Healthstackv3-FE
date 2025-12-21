import { useContext, useEffect, useState } from 'react';
import ModalBox from '../../components/modal';
import { TableMenu } from '../../ui/styled/global';
import { PageWrapper } from '../../ui/styled/styles';
import CreateTheatreRequest from './CreateTheatreRequest';
import CustomTable from '../../components/customtable';
import client from '../../feathers';
import { format } from 'date-fns';
import { ObjectContext, UserContext } from '../../context';
import ViewTheatreRequest from './TheatreRequestView';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomConfirmationDialog from '../../components/confirm-dialog/confirm-dialog';
import { toast } from 'react-toastify';

const TheatreRequest = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [reqToDelete, setReqToDelete] = useState(null);
  const { user } = useContext(UserContext);
  const Orders = client.service('order');
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);

  const handleDelete = () => {
    showActionLoader();
    Orders.remove(reqToDelete._id)
      .then(() => {
        hideActionLoader();
        toast.success(`Request Deleted succesfully`);
        setConfirmationDialog(false);
      })
      .catch((err) => {
        hideActionLoader();
        toast.error('Error deleting request ' + err);
      });
  };

  const handleConfirmDelete = (req) => {
    setReqToDelete(req);
    setConfirmationDialog(true);
  };

  const closeConfirmationDialog = () => {
    setReqToDelete(null);
    setConfirmationDialog(false);
  };

  const RequestSchema = [
    {
      name: 'S/N',
      key: 'sn',
      description: 'SN',
      selector: (row, i) => i + 1,
      sortable: true,
      inputType: 'HIDDEN',
      // width: '100px',
    },
    {
      name: 'Date',
      key: 'createdAt',
      description: '',
      selector: (row) => format(new Date(row.createdAt), 'dd-MM-yy'),
      inputType: 'HIDDEN',
      // width: '100px',
    },
    {
      name: 'Client Name',
      key: 'client',
      description: '',
      selector: (row) => row.clientname,
      inputType: 'HIDDEN',
      // width: '300px',
    },
    {
      name: 'Procedure',
      key: 'order',
      description: '',
      selector: (row) => row.order,
      inputType: 'HIDDEN',
      // width: '300px',
    },
    {
      name: 'Location',
      key: 'location',
      description: '',
      selector: (row) => row.requestingdoctor_locationName,
      // width: '300px',
    },
    {
      name: 'Status',
      key: 'status',
      description: '',
      selector: (row) => row.order_status,
      // width: '300px',
    },
    {
      name: 'Requesting Doctor',
      key: 'requestingdoctor_Name',
      description: '',
      selector: (row) => row.requestingdoctor_Name,
    },
    {
      name: 'Action',
      key: 'action',
      selector: (row) => row.action,
      cell: (row) => (
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
  ];

  const getFacilities = async () => {
    try {
      setLoading(true);
      const theatreRequests = await Orders.find({
        query: {
          order_category: 'Procedure',
          order_status: 'Pending',
          destination: user.currentEmployee.facilityDetail._id,
          $sort: { createdAt: -1 },
          $limit: limit,
          $skip: (page - 1) * limit,
        },
      });
      console.log(theatreRequests, 'The requests');
      setFacilities(theatreRequests.data);
      setTotal(theatreRequests.total);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      // Handle error appropriately (e.g., show a toast notification)
    } finally {
      setLoading(false);
    }
  };

  const handleRow = async (data) => {
    console.log(data);
    setDetailsModalOpen(true);
    await setSelectedData(data);
  };

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    getFacilities();
    Orders.on('created', () => getFacilities());
    Orders.on('updated', () => getFacilities());
    Orders.on('patched', () => getFacilities());
    Orders.on('removed', () => getFacilities());
    return () => {};
  }, [limit, page]);

  return (
    <div>
      <PageWrapper
        style={{
          flexDirection: 'column',
          padding: '0.6rem 1rem',
        }}
      >
        <CustomConfirmationDialog
          open={confirmationDialog}
          confirmationAction={() => handleDelete(reqToDelete)}
          cancelAction={closeConfirmationDialog}
          type="danger"
          message={`You are about to delete a theatre request for: ${
            reqToDelete?.clientname
          } made by ${reqToDelete?.requestingdoctor_Name}?`}
        />
        <ModalBox
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          header="Add New Theatre Request"
          width={'70%'}
        >
          <CreateTheatreRequest
            orderDetails={selectedData}
            setModalOpen={setModalOpen}
          />
        </ModalBox>
        <ModalBox
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          header="View Theatre Order Details"
          width={'50%'}
        >
          <ViewTheatreRequest data={selectedData} setModalOpen={setModalOpen} />
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
  );
};

export default TheatreRequest;
