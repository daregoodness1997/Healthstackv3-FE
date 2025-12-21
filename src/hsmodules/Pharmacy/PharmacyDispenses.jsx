
/* eslint-disable */
import React, { useState, useContext, useEffect, useRef } from 'react';
import client from '../../feathers';

import { UserContext, ObjectContext } from '../../context';

import { format } from 'date-fns';
import SellIcon from '@mui/icons-material/Sell';
import { ProductExitCreate } from './DispenseExit';

import { TableMenu } from '../../ui/styled/global';
import FilterMenu from '../../components/utilities/FilterMenu';

import CustomTable from '../../components/customtable';

import ModalBox from '../../components/modal';

import { toast } from 'react-toastify';

import { IconButton, Button as MuiButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import { FormsHeaderText } from '../../components/texts';
// import { DeleteOutline } from "@mui/icons-material";
import CustomConfirmationDialog from '../../components/confirm-dialog/confirm-dialog';

export default function Dispense() {
  //const {state}=useContext(ObjectContext) //,setState

  const [success, setSuccess] = useState(false);

  const [message, setMessage] = useState('');
  const BillServ = client.service('bills');

  const { state, setState } = useContext(ObjectContext);

  const { user, setUser } = useContext(UserContext);
  const [createModal, setCreateModal] = useState(false);

  const handleOpenCreateModal = () => {
    setCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModal(false);
  };

  return (
    <section className="section remPadTop">
      <DispenseList openCreateModal={handleOpenCreateModal} />

      <ModalBox
        open={createModal}
        onClose={handleCloseCreateModal}
        header="Point of Sale: Sales, Dispense, Audit, Transfer out"
      >
        <ProductExitCreate closeModal={handleCloseCreateModal} />
      </ModalBox>
    </section>
  );
}

export function DispenseList({ openCreateModal }) {
  // const { register, handleSubmit, watch, errors } = useForm();

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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const { user, setUser } = useContext(UserContext);
  const [selectedFinance, setSelectedFinance] = useState('');
  const [expanded, setExpanded] = useState('');
  const [oldClient, setOldClient] = useState('');
  const [selectedClient, setSelectedClient] = useState();
  const [clientBills, setClientBills] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

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

  const handleChoseClient = async (client, e, order) => {
    setOldClient(client.clientname);

    order.checked = e.target.checked;
    await handleSelectedClient(order.participantInfo.client);
    //handleMedicationRow(order)
    await setSelectedFinance(order);
    const newProductEntryModule = {
      ...state.financeModule,
      selectedFinance: order,
      show: 'detail',
      state: e.target.checked,
    };
    await setState((prevstate) => ({
      ...prevstate,
      financeModule: newProductEntryModule,
    }));

    //set of checked items
    if (e.target.checked) {
      await setState((prev) => ({
        ...prev,
        financeModule: {
          ...prev.financeModule,
          selectedBills: prev?.financeModule?.selectedBills?.concat(order),
        },
      }));
      await setSelectedOrders((prevstate) => prevstate.concat(order));
    } else {
      await setState((prev) => ({
        ...prev,
        financeModule: {
          ...prev.financeModule,
          selectedBills: prev.financeModule.selectedBills.filter(
            (el) => el._id !== order._id,
          ),
        },
      }));

      setSelectedOrders((prevstate) =>
        prevstate.filter((el) => el._id !== order._id),
      );
    }

    // console.log(selectedOrders)
  };

  const handleSearch = (val) => {
    const field = 'name';
    //console.log(val)
    BillServ.find({
      query: {
        order: {
          $regex: val,
          $options: 'i',
        },
        order_status: {
          $regex: val,
          $options: 'i',
        },
        order_category: 'Prescription',
        // storeId:state.StoreModule.selectedStore._id,
        //facility:user.currentEmployee.facilityDetail._id || "",
        $limit: 10,
        $sort: {
          createdAt: -1,
        }``,
      },
    })
      .then((res) => {
        // console.log(res)
        setFacilities(res.data);
        setMessage(' ProductEntry  fetched successfully');
        setSuccess(true);
      })
      .catch((err) => {
        // console.log(err)
        setMessage(
          'Error fetching ProductEntry, probable network issues ' + err,
        );
        setError(true);
      });
  };
  const getFacilities = async () => {
    setLoading(true);
    const findProductEntry = await BillServ.find({
      query: {
        'participantInfo.billingFacility':
          user.currentEmployee.facilityDetail._id,
        'orderInfo.orderObj.order_category': 'Prescription',
        billing_status: { $ne: 'Unpaid' },
        'orderInfo.orderObj.fulfilled': { $ne: 'False' },
        $sort: { updatedAt: -1 },
        $limit: limit,
        $skip: (page - 1) * limit,
      },
    });

    setFacilities(findProductEntry.groupedOrder);
    setTotal(findProductEntry.total);
    setLoading(false);
  };

  const handleRow = async (client, e) => {
    console.log(client.client_id);
    if (selectedClient && selectedClient.client_id === client.client_id)
      return setSelectedClient(null);
    await setSelectedClient(client);

    setOldClient(client.clientname);
    let newClient = client.clientname;

    if (oldClient !== newClient) {
      selectedOrders.forEach((el) => (el.checked = ''));
      setSelectedOrders([]);
      setState((prev) => ({
        ...prev,
        financeModule: {
          ...prev.financeModule,
          selectedBills: [],
        },
      }));
    }

    const clientOrders = client.bills.map((data) => {
      const allOrders = [];

      data.order.map((order) => {
        const orderData = {
          date: order.createdAt,
          status: order.billing_status,
          description: order.serviceInfo.name,
          amount: order.serviceInfo.amount,
          order: order,
        };

        allOrders.push(orderData);
      });
      return allOrders;
    });

    // console.log(clientOrders.flat(1));
    setClientBills(clientOrders.flat(1));
  };
  console.log(facilities,"clientBills");
  //1.consider using props for global data
  useEffect(() => {
   
    getFacilities();
    BillServ.on('created', (obj) => getFacilities());
    BillServ.on('updated', (obj) => getFacilities());
    BillServ.on('patched', (obj) => getFacilities());
    BillServ.on('removed', (obj) => getFacilities());
  }, [limit, page]);

  const cleanup = async () => {
    const newClientModule = {
      selectedClient: {},
      show: 'create',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ClientModule: newClientModule,
    }));

    const newProductEntryModule = {
      selectedFinance: {},
      show: 'create',
      state: '',
    };
    await setState((prevstate) => ({
      ...prevstate,
      financeModule: newProductEntryModule,
    }));
  };

  // useEffect(() => {
  //   //changes with checked box
  //   // console.log(selectedOrders);

  //   return () => {};
  // }, [selectedOrders]);

  useEffect(() => {
    if (state.financeModule.show === 'create') {
      selectedOrders.forEach((el) => (el.checked = ''));
      setSelectedOrders([]);
    }
    return () => {};
  }, [state.financeModule.show]);

  const getTotal = async () => {
    console.log(selectedOrders[0]);
    setTotalAmount(0);
    selectedOrders.forEach((el) => {
      setTotalAmount(
        (prevtotal) => Number(prevtotal) + Number(el?.paymentInfo?.amountDue),
      );
    });
  };

  useEffect(() => {
    getTotal();
  }, [selectedOrders]);

  // const DispensorySummary = [
  //   {name: "S/N", selector: row => row.sn},
  //   {name: "Client Name", selector: row => row.clientname},
  //   {
  //     name: "Bill Items",
  //     selector: row => row.bills.map(obj => obj.order).flat().length,
  //   },
  // ];

  const dispensarySchema = [
    {
      name: 'S/NO',
      key: 'sn',
      description: 'Enter name of Disease',
      selector: (row, i) => i + 1,
      sortable: true,
      required: true,
      inputType: 'HIDDEN',
      width: '80px',
    },
    {
      name: 'Client Name',
      key: 'clientname',
      description: 'Enter client name',
      selector: (row) => row.clientname,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      style: {
        textTransform: 'capitalize',
      },
    },
    {
      name: 'Prescription(s)',
      key: 'bills',
      description: 'Enter bills',
      selector: (row) => row.bills.map((obj) => obj.order).flat().length,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Actions',
      key: 'action',
      description: 'Enter Action',
      selector: (row) => (
        <IconButton size="small" onClick={() => handleConfirmDelete(row)}>
          <DeleteOutlineIcon fontSize="small" sx={{ color: 'red' }} />
        </IconButton>
      ),
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '100px',
      center: true,
    },
  ];

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [docToDel, setDocToDel] = useState({});

  const handleDelete = async (obj) => {
    //console.log(obj);
    await BillServ.remove(obj.client_id)
      .then((resp) => {
        toast.success('Sucessfuly deleted  ');
        setConfirmDialog(false);
      })
      .catch((err) => {
        toast.error('Error deleting  ' + err);
        setConfirmDialog(false);
      });
  };

  const handleConfirmDelete = (doc) => {
    console.log(doc);
    setDocToDel(doc);
    setConfirmDialog(true);
  };

  const handleCancelConfirm = () => {
    setDocToDel({});
    setConfirmDialog(false);
  };

  const selectedClientSchema = [
    {
      name: 'S/NO',
      width: '80px',
      key: 'sn',
      description: 'Enter name of Disease',
      selector: (row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            //name={order._id}
            style={{ marginRight: '3px' }}
            onChange={(e) => handleChoseClient(selectedClient, e, row.order)}
            checked={row.order.checked}
          />
          {row.sn}
        </div>
      ),
      sortable: true,
      required: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Date',
      key: 'date',
      description: 'Enter Date',
      selector: (row) => format(new Date(row.date), 'dd-MM-yy'),
      sortable: true,
      required: true,
      inputType: 'DATE',
      width: '100px',
      center: true,
    },
    {
      name: 'Description',
      key: 'description',
      description: 'Enter Description',
      selector: (row) => row.description,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Instruction',
      key: 'description',
      description: 'Enter Description',
      selector: (row) => row.order.orderInfo.orderObj.instruction,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Status',
      key: 'status',
      description: 'Enter Status',
      selector: (row) => row.status,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Amount',
      key: 'amount',
      description: 'Enter Amount',
      selector: (row) => row.amount,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
      width: '100px',
      center: true,
    },
    {
      name: 'Client Name',
      key: 'clientName',
      description: 'Client Full Name',
      selector: (row) => {
        const client = row.order?.participantInfo?.client;
        if (!client) return 'N/A';
        return `${client.firstname || ''} ${client.middlename || ''} ${client.lastname || ''}`.trim();
      },
      sortable: true,
      required: false,
      inputType: 'TEXT',
      width: '150px',
    },
    {
      name: 'Gender',
      key: 'gender',
      description: 'Client Gender',
      selector: (row) => row.order?.participantInfo?.client?.gender || 'N/A',
      sortable: true,
      required: false,
      inputType: 'TEXT',
      width: '80px',
      center: true,
    },
    {
      name: 'DOB',
      key: 'dob',
      description: 'Date of Birth',
      selector: (row) => {
        const dob = row.order?.participantInfo?.client?.dob;
        return dob ? format(new Date(dob), 'dd-MM-yyyy') : 'N/A';
      },
      sortable: true,
      required: false,
      inputType: 'DATE',
      width: '100px',
      center: true,
    },
    {
      name: 'Marital Status',
      key: 'maritalStatus',
      description: 'Marital Status',
      selector: (row) => row.order?.participantInfo?.client?.maritalstatus || 'N/A',
      sortable: true,
      required: false,
      inputType: 'TEXT',
      width: '100px',
      center: true,
    },
    {
      name: 'Email',
      key: 'email',
      description: 'Client Email',
      selector: (row) => row.order?.participantInfo?.client?.email || 'N/A',
      sortable: true,
      required: false,
      inputType: 'TEXT',
      width: '150px',
    },
    {
      name: 'Payment Mode',
      key: 'paymentMode',
      description: 'Payment Mode',
      selector: (row) => {
        const paymentInfo = row.order?.participantInfo?.client?.paymentinfo?.[0];
        return paymentInfo?.paymentmode || 'N/A';
      },
      sortable: true,
      required: false,
      inputType: 'TEXT',
      width: '100px',
      center: true,
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.client_id === selectedClient?.client_id,
      style: {
        backgroundColor: '#4cc9f0',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
  ];

  const onTableChangeRowsPerPage = (newLimit, newPage) => {
    setLimit(newLimit);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  console.log(selectedClient,"selectedClient");

  return (
    <>
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={handleCancelConfirm}
        confirmationAction={() => handleDelete(docToDel)}
        message={`Are you sure you want to delete this exit with No: ${docToDel?.sn}`}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          flex: '1',
        }}
      >
        <TableMenu>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {handleSearch && (
              <div className="inner-table">
                <FilterMenu onSearch={handleSearch} />
              </div>
            )}
            <h2 style={{ margin: '0 10px', fontSize: '0.95rem' }}>
              Paid Prescriptions
            </h2>
            {selectedClient && (
              <FormsHeaderText text={` - ${selectedClient.clientname}`} />
            )}
          </div>

          {selectedOrders.length > 0 && (
            <h2 style={{ marginLeft: '10px', fontSize: '0.9rem' }}>
              Amount Due : <span>&#8358;</span>
              {totalAmount}
            </h2>
          )}

          {selectedOrders.length > 0 && (
            <GlobalCustomButton onClick={openCreateModal}>
              <SellIcon fontSize="small" sx={{ marginRight: '5px' }} />
              Sell Product(s)
            </GlobalCustomButton>
          )}
        </TableMenu>

        <div
          className="columns"
          style={{
            display: 'flex',
            width: '100%',
            //flex: "1",
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              height: 'calc(100vh - 170px)',
              transition: 'width 0.5s ease-in',
              width: selectedClient ? '40%' : '100%',
            }}
          >
            <CustomTable
              title={''}
              columns={dispensarySchema}
              data={facilities}
              pointerOnHover
              highlightOnHover
              striped
              onRowClicked={handleRow}
              progressPending={loading}
              onChangeRowsPerPage={onTableChangeRowsPerPage}
              onChangePage={onTablePageChange}
              pagination
              paginationServer
              paginationTotalRows={total}
            />
          </div>

          {selectedClient && (
            <>
              <div
                style={{
                  height: 'calc(100vh - 170px)',
                  width: '59%',
                  transition: 'width 0.5s ease-in',
                }}
              >
                <CustomTable
                  title={''}
                  columns={selectedClientSchema}
                  data={clientBills}
                  pointerOnHover
                  highlightOnHover
                  striped
                  //onRowClicked={row => onRowClicked(row)}
                  progressPending={loading}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export function DispenseDetail() {
  //const { register, handleSubmit, watch, setValue } = useForm(); //errors,

  const [error, setError] = useState(false); //,
  const [selectedMedication, setSelectedMedication] = useState('');
  const [currentOrder, setCurrentOrder] = useState('');

  const [message, setMessage] = useState(''); //,
  //const ProductEntryServ=client.service('/ProductEntry')
  //const navigate=useNavigate()
  //const {user,setUser} = useContext(UserContext)
  const { state, setState } = useContext(ObjectContext);
  const BillServ = client.service('order');
  /* const [ProductEntry, setProductEntry] = useState("")
    const [facilities, setFacilities] = useState("") */

  let ProductEntry = state.DispenseModule.selectedDispense;
  //const facilities=ProductEntry.orders

  const handleRow = async (ProductEntry) => {
    //console.log("b4",state)

    //console.log("handlerow",ProductEntry)

    await setSelectedMedication(ProductEntry);

    const newProductEntryModule = {
      selectedMedication: ProductEntry,
      show: 'detail',
    };
    await setState((prevstate) => ({
      ...prevstate,
      medicationModule: newProductEntryModule,
    }));
    //console.log(state)
    // ProductEntry.show=!ProductEntry.show
  };

  const handleEdit = async (ProductEntry) => {
    const newProductEntryModule = {
      selectedDispense: ProductEntry,
      show: 'modify',
    };
    await setState((prevstate) => ({
      ...prevstate,
      DispenseModule: newProductEntryModule,
    }));
    //console.log(state)
  };

  useEffect(() => {
    const client1 = state.currentClients.find((el) => {
      return (
        JSON.stringify(el.client_id) ===
        JSON.stringify(state.DispenseModule.selectedDispense)
      );
    });

    setCurrentOrder(client1);
    // console.log(client1)
    return () => {};
  }, []);

  /*  
     const setprod=async()=>{
        await setProductEntry(state.DispenseModule.selectedDispense)
    } */

  useEffect(() => {
    /* BillServ.on('created', (obj)=>getFacilities())
        BillServ.on('updated', (obj)=>getFacilities())
       
        BillServ.on('removed', (obj)=>getFacilities()) */
    BillServ.on('patched', (obj) => {
      //update state.DispenseModule.selectedDispense
      // console.log(obj.clientId)
      // console.log("currentClients",state.currentClients)
      const current1 = state.currentClients.find(
        (el) => JSON.stringify(el.client_id) === JSON.stringify(obj.clientId),
      );
      setCurrentOrder(current1);
      // console.log("currentone",current1)
    });

    return () => {};
  }, []);

  return (
    <>
      <div className="card ">
        <div className="card-header">
          <p className="card-header-title">Dispense Details</p>
        </div>
        <div className="card-content vscrollable">
          {/* {JSON.stringify(ProductEntry.orders,2,10)} */}
          <div className="table-container pullup ">
            <table className="table is-striped is-narrow is-hoverable is-fullwidth is-scrollable ">
              <thead>
                <tr>
                  <th>
                    <abbr title="Serial No">S/No</abbr>
                  </th>
                  {/* <th><abbr title="Client Name">Client Name</abbr></th> */}
                  {/* <th><abbr title="Number of Orders"># of Medication</abbr></th> */}
                  <th>
                    <abbr title="Date">Date</abbr>
                  </th>
                  <th>
                    <abbr title="Order">Medication</abbr>
                  </th>
                  <th>Fulfilled</th>
                  <th>
                    <abbr title="Status">Status</abbr>
                  </th>
                  <th>
                    <abbr title="Requesting Physician">
                      Requesting Physician
                    </abbr>
                  </th>

                  {/* <th><abbr title="Actions">Actions</abbr></th> */}
                </tr>
              </thead>
              <tfoot></tfoot>
              <tbody>
                {state.DispenseModule.selectedDispense.orders.map(
                  (order, i) => (
                    <tr
                      key={order._id}
                      onClick={() => handleRow(order)}
                      className={
                        order._id === (selectedMedication?._id || null)
                          ? 'is-selected'
                          : ''
                      }
                    >
                      <th>{i + 1}</th>
                      {/* <td>{ProductEntry.clientname}</td> 
                                                <td>{ProductEntry.orders.length}</td> */}
                      <td>
                        <span>
                          {format(new Date(order.createdAt), 'dd-MM-yy')}
                        </span>
                      </td>{' '}
                      {/* {formatDistanceToNowStrict(new Date(ProductEntry.createdAt),{addSuffix: true})} <br/> */}
                      <th>{order.order}</th>
                      <td>{order.fulfilled === 'True' ? 'Yes' : 'No'}</td>
                      <td>{order.order_status}</td>
                      <td>{order.requestingdoctor_Name}</td>
                      {/*  <td><span className="showAction"  >...</span></td> */}
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

