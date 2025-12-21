import { useContext, useEffect, useState } from 'react';
import ModalBox from '../../components/modal';
import { TableMenu } from '../../ui/styled/global';
import { PageWrapper } from '../../ui/styled/styles';
import CustomTable from '../../components/customtable';
import client from '../../feathers';
import { format } from 'date-fns';
import { ObjectContext, UserContext } from '../../context';
import ViewTheatreList from './TheatreListView';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomConfirmationDialog from '../../components/confirm-dialog/confirm-dialog';

const TheatreList = () => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const { user } = useContext(UserContext);
  const DocumentServ = client.service('clinicaldocument');
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);
  const [reqToDelete, setReqToDelete] = useState(null);
  console.log(facilities);
  const handleDelete = () => {
    showActionLoader();
    DocumentServ.remove(reqToDelete._id)
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
      width: '100px',
    },
    {
      name: 'Date',
      key: 'documentdetail',
      description: '',
      selector: (row) => format(new Date(row.documentdetail.date), 'dd-MM-yy'),
      inputType: 'HIDDEN',
      width: '100px',
    },
    {
      name: 'Client Name',
      key: 'documentdetail',
      description: '',
      //   selector: (row) => row.documentdetail.orderDetails.clientname,
      inputType: 'HIDDEN',
      width: '300px',
    },
    {
      name: 'Anaesthesia Type',
      key: 'documentdetail',
      description: '',
      selector: (row) => row.documentdetail.anaesthesiaType,
      inputType: 'HIDDEN',
      width: '300px',
    },
    {
      name: 'Indication',
      key: 'documentdetail',
      description: '',
      selector: (row) => row.documentdetail.indication,
      inputType: 'HIDDEN',
      width: '300px',
    },
    {
      name: 'Location',
      key: 'documentdetail',
      description: '',
      selector: (row) => row.documentdetail.ward,
      inputType: 'HIDDEN',
      width: '300px',
    },
    {
      name: 'Anaesthetist',
      key: 'documentdetail',
      description: '',
      selector: (row) =>
        Array.isArray(row.documentdetail.anaesthetist)
          ? row.documentdetail.anaesthetist
              .map((item) => `${item.firstname} ${item.lastname}`)
              .join(', ')
          : '',
      inputType: 'HIDDEN',
      width: '300px',
    },
    {
      name: 'Surgeon',
      key: 'documentdetail',
      description: '',
      selector: (row) =>
        Array.isArray(row.documentdetail.surgeon)
          ? row.documentdetail.surgeon
              .map((item) => `${item.firstname} ${item.lastname}`)
              .join(', ')
          : '',
      inputType: 'HIDDEN',
      width: '300px',
    },
    {
      name: 'Requested By',
      key: 'createdByname',
      description: '',
      selector: (row) => row.createdByname,
      inputType: 'HIDDEN',
      width: '200px',
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
      const theatreRequests = await DocumentServ.find({
        query: {
          documentname: 'Theatre Request Form',
          facility: user.currentEmployee.facilityDetail._id,
          $sort: { createdAt: -1 },
          $limit: limit,
          $skip: (page - 1) * limit,
        },
      });

      console.log(theatreRequests);
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
    DocumentServ.on('created', () => getFacilities());
    DocumentServ.on('updated', () => getFacilities());
    DocumentServ.on('patched', () => getFacilities());
    DocumentServ.on('removed', () => getFacilities());
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
          message={`You are about to delete a theatre list item for: ${
            reqToDelete?.documentdetail.orderDetails.clientname
          } requested by ${reqToDelete?.createdByname}?`}
        />
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
  );
};

export default TheatreList;
