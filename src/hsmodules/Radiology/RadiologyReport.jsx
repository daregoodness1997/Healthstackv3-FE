import { useState, useContext, useEffect } from 'react';
import client from '../../feathers';
import { useNavigate } from 'react-router-dom';
import { UserContext, ObjectContext } from '../../context';
import { format } from 'date-fns';
import { PageWrapper } from '../../ui/styled/styles';
import { TableMenu } from '../../ui/styled/global';
import FilterMenu from '../../components/utilities/FilterMenu';
import CustomTable from '../../components/customtable';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import CustomConfirmationDialog from '../../components/confirm-dialog/confirm-dialog';

export default function RadiologyReport() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <section className="section remPadTop">
      <RadiologyOrderList openModal={openModal} setOpenModal={setOpenModal} />
    </section>
  );
}

export function RadiologyOrderList({ openModal, setOpenModal }) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const BillServ = client.service('bills');
  //const navigate=useNavigate()
  // const {user,setUser} = useContext(UserContext)
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const { state, setState } = useContext(ObjectContext);
  const { user, setUser } = useContext(UserContext);
  const [selectedFinance, setSelectedFinance] = useState('');
  const [oldClient, setOldClient] = useState('');
  const navigate = useNavigate();
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);
  const [resToDelete, setResToDelete] = useState(null);

  const handleSelectedClient = async (Client) => {
    // await setSelectedClient(Client)
    const newClientModule = {
      selectedClient: Client,
      show: 'detail',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ClientModule: newClientModule,
    }));
  };

  const onRowClicked = async (order) => {
    setOpenModal(true);
    await setSelectedFinance(order);
    await handleSelectedClient(order.orderInfo.orderObj.client); //order.participantInfo.client

    const newProductEntryModule = {
      selectedFinance: order,
      show: 'detail',
      report_status: order.report_status,
    };
    await setState((prevstate) => ({
      ...prevstate,
      financeModule: newProductEntryModule,
    }));
    navigate('/app/radiology/rad-details');
  };

  const handleSearch = (val) => {
    BillServ.find({
      query: {
        'orderInfo.orderObj.clientname': {
          $regex: val,
          $options: 'i',
        },

        $or: [
          {
            'orderInfo.orderObj.order_category': 'Radiology Order',
          },
          {
            'orderInfo.orderObj.order_category': 'Radiology',
          },
        ],
        noAgg: true,
        $limit: 1000,
        $sort: {
          createdAt: -1,
        },
        $select: [
          'createdAt',
          'orderInfo',
          'serviceInfo',
          'billing_status',
          'report_status',
        ],
      },
    })
      .then((res) => {
        setFacilities(res.data);
        setMessage(' ProductEntry  fetched successfully');
        setSuccess(true);
      })
      .catch((err) => {
        setMessage('Error fetching reqests, probable network issues ' + err);
        setError(true);
      });
  };
  const getFacilities = async () => {
    const findProductEntry = await BillServ.find({
      query: {
        'participantInfo.billingFacility':
          user.currentEmployee.facilityDetail._id,
        $or: [
          {
            'orderInfo.orderObj.order_category': 'Radiology Order',
          },
          {
            'orderInfo.orderObj.order_category': 'Radiology',
          },
        ],
        noAgg: true,
        $limit: 1000,
        $sort: {
          createdAt: -1,
        },
        $select: [
          'createdAt',
          'orderInfo',
          'serviceInfo',
          'billing_status',
          'report_status',
        ],
      },
    });

    await setFacilities(findProductEntry.data);
    console.log(findProductEntry.data);
  };

  useEffect(() => {
    getFacilities();
    BillServ.on('created', () => getFacilities());
    BillServ.on('updated', () => getFacilities());
    BillServ.on('patched', () => getFacilities());
    BillServ.on('removed', () => getFacilities());
    return () => {};
  }, []);

  useEffect(() => {
    return () => {};
  }, [selectedOrders]);

  useEffect(() => {
    if (state.financeModule.show === 'create') {
      selectedOrders.forEach((el) => (el.checked = ''));
      setSelectedOrders([]);
    }
    return () => {};
  }, [state.financeModule.show]);

  // ######### DEFINE FUNCTIONS AND SCHEMA HERE
  const radReportSchema = [
    {
      name: 'S/No',
      key: 'sn',
      description: 'Enter serial number',
      selector: (row) => row.sn,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Date',
      key: 'createdAt',
      description: 'Enter date',
      selector: (row) => format(new Date(row.createdAt), 'dd/MM/yyyy HH:mm'),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Client',
      key: 'client',
      description: 'Enter client name',
      selector: (row) => {
        return row.orderInfo.orderObj.clientname;
      },
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Test',
      key: 'description',
      description: 'Enter test result details',
      selector: (row) => row.orderInfo.orderObj.order,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    /*  {
            name: 'Amount',
            key: 'amount',
            description: 'Enter amount',
            selector: row => row.serviceInfo.price,
            sortable: true,
            required: true,
            inputType: 'TEXT',
        }, */
    {
      name: 'Requesting Doctor',
      key: 'report_status',
      description: 'Select facility',
      selector: (row) => row.orderInfo.orderObj.requestingdoctor_Name,
      sortable: true,
      required: true,
      inputType: 'TEXT', //requestingdoctor_locationName
    },
    {
      name: 'Request Location',
      key: 'report_status',
      description: 'Select facility',
      selector: (row) => row.orderInfo.orderObj.requestingdoctor_locationName,
      sortable: true,
      required: true,
      inputType: 'TEXT', //requestingdoctor_locationName
    },
    {
      name: 'Billing Status',
      key: 'billing_status',
      description: 'Enter Payment Status',
      selector: (row) => row.billing_status,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Report Status',
      key: 'report_status',
      description: 'Select facility',
      selector: (row) => row.report_status,
      sortable: true,
      required: true,
      inputType: 'TEXT',
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

  const handleDelete = () => {
    showActionLoader();
    BillServ.remove(resToDelete._id)
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
    setResToDelete(req);
    setConfirmationDialog(true);
  };

  const closeConfirmationDialog = () => {
    setResToDelete(null);
    setConfirmationDialog(false);
  };

  return (
    <>
      <PageWrapper style={{ flexDirection: 'column', padding: '0.6rem 1rem' }}>
        <TableMenu>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {handleSearch && (
              <div className="inner-table">
                <FilterMenu onSearch={handleSearch} />
              </div>
            )}
            <h2 style={{ marginLeft: '10px', fontSize: '0.95rem' }}>
              Radiology Results
            </h2>
          </div>

          {/* {handleCreate && (
            <GlobalCustomButton text="Add new " onClick={handleCreate} />
          )} */}
        </TableMenu>
        <CustomConfirmationDialog
          open={confirmationDialog}
          confirmationAction={() => handleDelete(resToDelete)}
          cancelAction={closeConfirmationDialog}
          type="danger"
          message={`You are about to delete a radiology result for: ${
            resToDelete?.orderInfo.orderObj.clientname
          } made by ${resToDelete?.orderInfo.orderObj.requestingdoctor_Name}?`}
        />

        <div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
          <CustomTable
            title={''}
            columns={radReportSchema}
            data={facilities}
            pointerOnHover
            highlightOnHover
            striped
            onRowClicked={onRowClicked}
            progressPending={loading}
          />
        </div>
      </PageWrapper>
    </>
  );
}
