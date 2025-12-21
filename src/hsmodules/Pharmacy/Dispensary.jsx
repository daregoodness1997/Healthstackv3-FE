/* eslint-disable */
import React, { useState, useContext, useEffect, useRef } from 'react';
import client from '../../feathers';

import { UserContext, ObjectContext } from '../../context';

import { format } from 'date-fns';
import SellIcon from '@mui/icons-material/Sell';
import PrintIcon from '@mui/icons-material/Print';
import ScaleIcon from '@mui/icons-material/Scale';
import { ProductExitCreate } from './DispenseExit';

import { TableMenu } from '../../ui/styled/global';
import FilterMenu from '../../components/utilities/FilterMenu';

import CustomTable from '../../components/customtable';
import dayjs from "dayjs";
import ModalBox from '../../components/modal';
import { Box, Typography } from "@mui/material";
import { toast } from 'react-toastify';
import { formatDistanceStrict } from "date-fns";
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
  const [limit, setLimit] = useState(30);
  const [total, setTotal] = useState(0);
  const { user, setUser } = useContext(UserContext);
  const [selectedFinance, setSelectedFinance] = useState('');
  const [expanded, setExpanded] = useState('');
  const [oldClient, setOldClient] = useState('');
  const [selectedClient, setSelectedClient] = useState();
  const [clientBills, setClientBills] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
   const [clientdetails,setClientDetails] = useState('');
const [age,setAge] = useState('');
const [weightModal, setWeightModal] = useState(false);
 // const [branch, setBranch] = useState(null);
  const locationServ = client.service('location');

const employeeLocation = state.employeeLocation.locationId;

  const handleSelectedClient = async (Client) => {
    // await setSelectedClient(Client)
    console.log(Client);
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

  const handleSearch =async (val) => {
    const field = 'name';

  let branch=null

   const emploc= state.employeeLocation;
        //  console.log(emploc, 'emploc')
          if (!emploc.locationId) {
            toast.error("Your current location is missing, please login again");
          
            return;
          }
          try {
            const resp = await locationServ.get(emploc.locationId);
            const branchName = resp.branch || null;
            branch=branchName

          } catch (err) {
            toast.error("Error fetching branch: " + err);
          }
   
let query= {
  $or:[
   {'participantInfo.client.firstname': {
          $regex: val,
          $options: 'i',
        }},

      {'participantInfo.client.lastname': {
          $regex: val,
          $options: 'i',
        }},
        
      {'participantInfo.client.mrn': {
          $regex: val,
          $options: 'i',
        }},
      ],
        'participantInfo.billingFacility':
          user.currentEmployee.facilityDetail._id,
        'orderInfo.orderObj.order_category': 'Prescription',
        
        billing_status: { $ne: 'Unpaid' },
        'orderInfo.orderObj.fulfilled': { $ne: 'True' },
        $sort: { updatedAt: -1 },
        $limit: limit,
        $skip: (page - 1) * limit,
      }
if (branch){ 
  query['orderInfo.orderObj.destinationLocationId']=state.employeeLocation.locationId
}

      const findProductEntry = await BillServ.find({
        query,
    });
    console.log(findProductEntry,"findProductEntry")
    setFacilities(findProductEntry.groupedOrder);
    setTotal(findProductEntry.total);
    setLoading(false);




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
    let branch=null

   const emploc= state.employeeLocation;
        //  console.log(emploc, 'emploc')
          if (!emploc.locationId) {
            toast.error("Your current location is missing, please login again");
          
            return;
          }
          try {
            const resp = await locationServ.get(emploc.locationId);
            const branchName = resp.branch || null;
            branch=branchName

          } catch (err) {
            toast.error("Error fetching branch: " + err);
          }
    setLoading(true);
  // console.log(state.employeeLocation,"employeelocation")
  const start = new Date();
start.setDate(start.getDate() - 1);
start.setHours(0, 0, 0, 0);
// Today at 23:59:59.999
const end = new Date();
end.setHours(23, 59, 59, 999);

  let query= {
        'participantInfo.billingFacility':
          user.currentEmployee.facilityDetail._id,
        'orderInfo.orderObj.order_category': 'Prescription',
        createdAt: {
          $gte: start,
          $lte: end
        },
        billing_status: { $ne: 'Unpaid' },
        'orderInfo.orderObj.fulfilled': { $ne: 'True' },
        $sort: { updatedAt: -1 },
        $limit: limit,
        $skip: (page - 1) * limit,
      }
   //   console.log(branch,"branch")
if (branch){ 
  query['orderInfo.orderObj.destinationLocationId']=state.employeeLocation.locationId
}

      const findProductEntry = await BillServ.find({
        query,
    });
    console.log(findProductEntry,"findProductEntry")
    setFacilities(findProductEntry.groupedOrder);
    setTotal(findProductEntry.total);
    setLoading(false);
  };


  const handleRow = async (client, e) => {
   /*  console.log(client); */
    if (selectedClient && selectedClient.client_id === client.client_id)
      return setSelectedClient(null);
    await setSelectedClient(client);
    await setClientDetails(client.bills[0].order[0].participantInfo.client);

  await setAge( formatDistanceStrict(new Date(client.bills[0].order[0].participantInfo.client.dob), new Date(), {
                                  roundingMethod: "floor",
                                }))
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
 // console.log(facilities,"clientBills");
  //1.consider using props for global data
  useEffect(() => {
   
    getFacilities();
    BillServ.on('created', (obj) => getFacilities());
    BillServ.on('updated', (obj) => getFacilities());
    BillServ.on('patched', (obj) => getFacilities());
    BillServ.on('removed', (obj) => getFacilities());
  }, [limit, page,state.employeeLocation.locationId]);

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
const openWeightModal=()=>{ 
  setWeightModal(true);

}

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

  const generatePrintableHtml = (orders, clientInfo, totalAmount) => {
    const rows = orders
      .map((o, i) => {
        const date = format(new Date(o.createdAt || o.date || DateTime?.now || Date.now()), 'dd-MM-yy HH:mm');
        const description =
          o.serviceInfo?.name ||
          o.orderInfo?.orderObj?.itemName ||
          o.order ||
          o.serviceName ||
          o.description ||
          'N/A';
        const amount =
          (o.paymentInfo && o.paymentInfo.amountDue) ??
          o.serviceInfo?.amount ??
          o.amount ??
          0;
        const instruction = o.orderInfo?.orderObj?.instruction ?? '';
        const status = o.billing_status || o.order_status || o.status || '';
        const requesting =
          o.orderInfo?.orderObj?.requestingdoctor_Name ||
          o.requestingdoctor_Name ||
          '';

        return `
          <tr>
            <td style="padding:8px;border:1px solid #ddd;text-align:center">${i + 1}</td>
            <td style="padding:8px;border:1px solid #ddd">${date}</td>
            <td style="padding:8px;border:1px solid #ddd">${description}</td>
            <td style="padding:8px;border:1px solid #ddd">${instruction}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right">${amount}</td>
            <td style="padding:8px;border:1px solid #ddd">${status}</td>
            <td style="padding:8px;border:1px solid #ddd">${requesting}</td>
          </tr>
        `;
      })
      .join('');

    const clientDetailsHtml = clientInfo
      ? `<div style="margin-bottom:12px">
           <strong>Client:</strong> ${clientInfo.clientname || 'N/A'} &nbsp;
           <strong>Gender:</strong> ${clientInfo.gender || 'N/A'} &nbsp;
           <strong>MRN:</strong> ${clientInfo.mrn || 'N/A'}
         </div>`
      : '';

    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Print - Selected Prescriptions</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; margin: 20px; color: #222; }
            h2 { margin: 0 0 8px 0; }
            table { border-collapse: collapse; width: 100%; margin-top: 8px; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background:#f5f5f5; text-align:left; }
            .tot { margin-top:12px; text-align:right; font-weight:700; }
          </style>
        </head>
        <body>
          <h2>Paid Prescriptions</h2>
          ${clientDetailsHtml}
          <table>
            <thead>
              <tr>
                <th style="width:40px">#</th>
                <th style="width:140px">Date</th>
                <th>Description</th>
                <th>Instruction</th>
                <th style="width:110px;text-align:right">Amount</th>
                <th style="width:100px">Status</th>
                <th style="width:160px">Requesting Doctor</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <div class="tot">Total Amount: &#8358; ${totalAmount}</div>
        </body>
      </html>
    `;
  };

  const handlePrintSelected = () => {
    if (!selectedOrders || selectedOrders.length === 0) {
      toast.info('No items selected to print');
      return;
    }

    const html = generatePrintableHtml(selectedOrders, selectedClient || clientdetails, totalAmount);
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      toast.error('Unable to open print window. Please allow popups for this site.');
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    // Give the new window a moment to render before printing
    setTimeout(() => {
      printWindow.print();
      // optionally close after printing
      // printWindow.close();
    }, 500);
  };

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
   // console.log(doc);
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
      width: '50px', 
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
       width: '50px', 
      center: true,
    },
    {
      name: 'Prescription',
      key: 'description',
      description: 'Enter Description',
      selector: (row) => row.description,
      sortable: true,
      required: true,
        width: '200px',
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
      name: 'Source',
      key: 'Location',
      description: 'Enter Status',
      selector: (row) => row.order.orderInfo.orderObj.requestingdoctor_locationName,
      sortable: true,
      required: true,
       width: '150px', 
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
       width: '70px', 
      center: false,
    },
   /*  {
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
    }, */
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
      /* width: '100px', */
      center: true,
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.client_id === selectedClient?.client_id,
      style: {
        backgroundColor: '#4cc9f0',
        color: 'white',
      /*   '&:hover': {
          cursor: 'pointer',
        }, */
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



  return (
    <>
     <ModalBox
            open={weightModal}
            onClose={() => setWeightModal(false)}
            header={`Weight`}
          >
            <WeightModalContent patientid={selectedClient?.client_id} />

          </ModalBox>
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
              <FormsHeaderText text={` - ${selectedClient.clientname},  ${clientdetails?.gender}, ${clientdetails?.maritalstatus},  ${age}`} />
            )}
            <div style={{ margin: '0 10px', fontSize: '0.95rem' }}>
             {selectedClient && (   <GlobalCustomButton onClick={openWeightModal} >
              <ScaleIcon fontSize="small" sx={{ marginRight: '5px' }} />
             Body Weight
            </GlobalCustomButton>)}
            </div>
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
           {selectedOrders.length > 0 && (
            <GlobalCustomButton onClick={handlePrintSelected}>
              <PrintIcon fontSize="small" sx={{ marginRight: '5px' }} />
             Print List
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
              width: selectedClient ? '30%' : '100%',
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
              conditionalRowStyles={conditionalRowStyles}
              paginationTotalRows={total}
            />
          </div>

          {selectedClient && (
            <>
              <div
                style={{
                  height: 'calc(100vh - 170px)',
                  width: '69%',
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
export function WeightModalContent({ patientid}) {
   const { user } = useContext(UserContext);
    const { state, setState, showActionLoader, hideActionLoader } =
      useContext(ObjectContext);
  const ClinicServ = client.service("clinicaldocument");
  const [facilities, setFacilities] = useState([]);

  const getFacilities = async (page = 0) => {
    // console.log("client id",state.ClientModule.selectedClient._id)
    if (patientid === undefined) return;
    
      const findClinic = await ClinicServ.find({
        query: {
          client: patientid,
          facility: user.currentEmployee.facilityDetail._id,
          documentname:"Vital Signs",
          $limit: 10,
          /*  $skip:page*limit, */
          $sort: {
            createdAt: -1,
          },
        },
      });
      const total = findClinic.total;
     console.log(findClinic.data)
     // setFacilities(findClinic.data);
      if (total > 0 ) {
        let extracted = [];
     findClinic.data.map(o => {

      console.log(o)
        if (o.documentdetail.Weight) {
          console.log(o)
          extracted.push(
            {
                _id: o._id,
                date: o.createdAt,
                weight: o.documentdetail.Weight
              }

     )}})

      console.log(extracted)
      setFacilities(extracted)
      }
    
  };

useEffect(() => {
    getFacilities();
  }, []);


  return (
    <>
   {(facilities?.length > 0)? 
    <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
      
     { facilities.map((item)=>(
      
      <Box key={item._id} sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
        <Typography variant="subtitle1">{dayjs(item?.date).format("DD-MM-YY HH:mm")}</Typography><Typography variant="subtitle1">{item?.weight}KG</Typography>
      </Box>
   
      ))}
     
      </Box>:
      <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
      <Typography variant="h6"> No weight records found </Typography>
      </Box>
    }
   </>
  );
}