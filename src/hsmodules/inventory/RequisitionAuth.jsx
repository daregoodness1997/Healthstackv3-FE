/* eslint-disable */
import React, { useState, useContext, useEffect, useRef } from 'react';
import client from '../../feathers';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { UserContext, ObjectContext } from '../../context';
import { toast } from 'react-toastify';

import Input from '../../components/inputs/basic/Input';
import StoreSearch from '../helpers/storeSearch';
import { PageWrapper } from '../../ui/styled/styles';
import { TableMenu } from '../../ui/styled/global';
import FilterMenu from '../../components/utilities/FilterMenu';
import CustomTable from '../../components/customtable';
import 'react-datepicker/dist/react-datepicker.css';
import ModalBox from '../../components/modal';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { generateRandomString } from '../helpers/generateString';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Typography,
} from '@mui/material';

const filter = createFilterOptions();

import { Box, Grid, Button as MuiButton } from '@mui/material';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import { FormsHeaderText } from '../../components/texts';
import CustomConfirmationDialog from '../../components/confirm-dialog/confirm-dialog';

export default function ProductEntry() {
  const { state } = useContext(ObjectContext); //,setState

  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [recvdetailModal, setRecvDetailModal] = useState(false);
  const [modifyModal, setModifyModal] = useState(false);
 

  const handleOpenCreateModal = () => {
    setCreateModal(true);
  };
  const handleCloseCreateModal = () => {
    setCreateModal(false);
  };

  const handleOpenDetailModal = () => {
    setDetailModal(true);
  };
  const handleCloseDetailModal = () => {
    setDetailModal(false);
  };

  const handleOpenRecvDetailModal = () => {
    setRecvDetailModal(true);
  };
  const handleCloseRecvDetailModal = () => {
    setRecvDetailModal(false);
  };

  const handleOpenModifyModal = () => {
    setModifyModal(true);
  };
  const handleCloseModifyModal = () => {
    setModifyModal(false);
  };
  const toggleView = () => {
    setView((prev) => !prev);
  };

  return (
    <section className="section remPadTop">
      
        <TransferSentList
          openCreateModal={handleOpenCreateModal}
          openDetailModal={handleOpenDetailModal}
         // toggleView={toggleView}
        />
 

      <ModalBox
        open={detailModal}
        onClose={handleCloseDetailModal}
        header="Outbound Requisition Details"
      >
        <TransferDetail
          openModifyModal={handleOpenModifyModal}
          closeModal={handleCloseDetailModal} //{handleCloseCreateModal}
        />
      </ModalBox>

    </section>
  );
}



export function TransferSentList({
  openCreateModal,
  openDetailModal,
 // toggleView,
  //selectProduct,
}) {
  const [error, setError] = useState(false);

  const [success, setSuccess] = useState(false);

  const [message, setMessage] = useState('');
  const TransferEntryServ = client.service('transfer');
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedProductEntry, setSelectedProductEntry] = useState(); //

  const { state, setState } = useContext(ObjectContext);

  const { user, setUser } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10); //LIMITATIONS FOR THE NUMBER OF FACILITIES FOR SERVER TO RETURN PER PAGE
  const [total, setTotal] = useState(0); //TOTAL NUMBER OF FACILITIES AVAILABLE IN THE SERVER
  const [restful, setRestful] = useState(true);
  const [next, setNext] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [docToDel, setDocToDel] = useState({});
  const [view, setView] = useState(true);

  // console.log("Transfer data", transfers)

  const handleCreateNew = async () => {
    const newProductEntryModule = {
      selectedProductEntry: {},
      show: 'create',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ProductEntryModule: newProductEntryModule,
    }));
    //console.log(state);
    openCreateModal();
  };

  
  const toggleView = () => {
      setView((prev) => !prev);
    };

  

  const handleRow = async (data) => {
    const ProductEntry = await TransferEntryServ.get(data._id);
    await setSelectedProductEntry(ProductEntry);

    const newProductEntryModule = {
      selectedProductEntry: ProductEntry,
      show: 'detail',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ProductEntryModule: newProductEntryModule,
    }));
    //console.log(state)
    openDetailModal();
  };

  const handleSearch = async (val) => {
    const field = 'source';
    TransferEntryServ.find({
      query: {
        $or: [
          {
            source: {
              $regex: val,
              $options: 'i',
            },
          },
          {
            type: {
              $regex: val,
              $options: 'i',
            },
          },
        ],
        // transactioncategory: "credit",
        storeId: state.InventoryModule.selectedInventory._id,
        facility: user.currentEmployee.facilityDetail._id,
        $limit: 100,
        $sort: {
          createdAt: -1,
        },
      },
    })
      .then((res) => {
        //console.log(res)
        setFacilities(res.data);
        setTotal(res.total);
        setMessage(' ProductEntry  fetched successfully');
        setSuccess(true);
      })
      .catch((err) => {
        //  console.log(err)
        setMessage(
          'Error fetching ProductEntry, probable network issues ' + err,
        );
        setError(true);
      });
  };

  const getFacilities = async () => {
  //  console.log(user)
    const findTransfer = await TransferEntryServ.find({
      query: {
        org_facilityId: user.currentEmployee.facilityDetail._id||user.employeeData[0].facility,

        $select: ['org_date','org_store_name', 'dest_store_name', 'productitems', 'dest_status','authorization'],
        dest_status:view?"Pending":"Authorized",
        store_type:"Store",
        //org_storeId: state.InventoryModule.selectedInventory._id,
        type: 'requisition',
        $sort: {
          createdAt: -1,
        },
        $limit: limit,
        // $skip: (page - 1) * limit,
      },
    });
    setFacilities(findTransfer.data);
    //console.log(findTransfer.data);
    setTotal(findTransfer.total);
  };

  useEffect(() => {
    getFacilities();
    TransferEntryServ.on('created', (obj) => getFacilities());
    TransferEntryServ.on('updated', (obj) => getFacilities());
    TransferEntryServ.on('patched', (obj) => getFacilities());
    TransferEntryServ.on('removed', (obj) => getFacilities());
    return () => {};
  }, [limit,page]);

  useEffect(() => {
    //setFacilities([])

    getFacilities();
    return () => {};
  }, [state.InventoryModule.selectedInventory._id,view]);

  const handleDelete = async (obj) => {
    await TransferEntryServ.remove(obj._id)
      .then((resp) => {
        toast.success('Sucessfuly deleted ProductEntry ');
        setConfirmDialog(false);
      })
      .catch((err) => {
        toast.error('Error deleting ProductEntry ' + err);
        setConfirmDialog(false);
      });
  };

  const handleCancelConfirm = () => {
    setDocToDel({});
    setConfirmDialog(false);
  };

  const transferEntrySchema = [
    {
      name: 'S/NO',
      width: '100px',
      key: 'sn',
      description: 'Enter name of Disease',
      selector: (row, i) => i + 1,
      sortable: true,
      required: true,
      inputType: 'HIDDEN',
    },

    {
      name: 'Date',
      key: 'type',
      description: 'Enter Type',
      selector: (row) => dayjs(row.org_date).format('DD-MM-YY HH:mm'),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Source ',
      key: 'dest_quantity',
      description: 'Enter Source',
      selector: (row) => row.org_store_name,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Destination ',
      key: 'dest_quantity',
      description: 'Enter Source',
      selector: (row) => row.dest_store_name,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Number of Items',
      key: 'costprice',
      description: 'Enter Document Number',
      selector: (row) => (row.productitems ? row?.productitems?.length : ''),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Authorizations',
      key: 'costprice',
      description: 'Enter Document Number',
      selector: (row) => (row.authorization ? row?.authorization?.length : 0),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Status',
      key: 'org_totalamount',
      description: 'Enter Total Amount',
      selector: (row) => row.dest_status,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
    },
  ];

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={handleCancelConfirm}
        confirmationAction={() => handleDelete(docToDel)}
       // message={`Are you sure you want to delete this entry with Document No: ${docToDel?.documentNo}`}
      />
     
        <>
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
                <h2 style={{ marginLeft: '10px', fontSize: '0.95rem' }}>
                 {view? "List of Pending Requisitions":"List of Authorized Requisition"} 
                </h2>
                <div style={{ marginLeft: '10px', fontSize: '0.95rem' }}>
                  <GlobalCustomButton onClick={toggleView}>
                    {view?"View Authorized Requisitions":"View Pendng Requisition"}
                  </GlobalCustomButton>
                </div>
              </div>

             {/*  {handleCreateNew && (
                <GlobalCustomButton onClick={openCreateModal}>
                  <AddCircleOutline
                    fontSize="small"
                    sx={{ marginRight: '5px' }}
                  />
                  Add New
                </GlobalCustomButton>
              )} */}
            </TableMenu>

            <Box
              sx={{
                width: '100%',
                height: 'calc(100vh - 100px)',
                overflowY: 'auto',
              }}
            >
              <CustomTable
                title={''}
                columns={transferEntrySchema}
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
            </Box>
          </PageWrapper>
        </>
     
    </>
  );
}



export function TransferDetail({ openModifyModal, closeModal }) {
  //const { register, handleSubmit, watch, setValue } = useForm(); //errors,

  const [error, setError] = useState(false); //,

  const [message, setMessage] = useState(''); //,
  const [confirmDialog, setConfirmDialog] = useState(false);
  const { state, setState } = useContext(ObjectContext);

  const [createModal, setCreateModal] = useState(false);

  const handleCloseModal = () => {
    setCreateModal(false);
  };
  const handleClose = () => {
    closeModal();
  };
  const ProductEntry = state.ProductEntryModule.selectedProductEntry;

  const handleEdit = async () => {
    const newProductEntryModule = {
      selectedProductEntry: ProductEntry,
      show: 'modify',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ProductEntryModule: newProductEntryModule,
    }));
    //console.log(state)
    openModifyModal();
  };

  const ProductDetailSchema = [
    {
      name: 'S/N',
      width: '100px',
      key: 'sn',
      description: 'Serial Number',
      sortable: true,
      selector: (row) => row.sn,
      inputType: 'HIDDEN',
    },
    {
      name: 'Name',
      key: 'name',
      description: 'Enter Name',
      selector: (row) => row.name,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Quantity',
      key: 'quantity',
      description: 'Enter quantity',
      selector: (row) => row.quantitySent,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
      options: ['Front Desk', 'Clinic', 'Store', 'Laboratory', 'Finance'],
    },
    {
      name: 'Unit',
      key: 'baseunit',
      description: 'Enter unit',
      selector: (row) => row.baseunit,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
  ];
  const handleRow = () => {};

 // console.log(ProductEntry);
 // if (ProductEntry.dest_status === 'Pending') {
    return (
      <EditDetails
        //closeModal={handleCloseModal}
        closeModal={handleClose}
        // open={openModifyModal}
        ProductEntry={ProductEntry}
      />
    );
 
}

export function EditDetails({ closeModal, ProductEntry }) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const TransferEntryServ = client.service('transfer');
  const { user } = useContext(UserContext);

  const [currentUser, setCurrentUser] = useState();
  const [type, setType] = useState('requisition');
  const [documentNo, setDocumentNo] = useState('');
  const [org_totalamount, setOrg_totalamount] = useState(0);
  const [dest_facilityId, setDest_facilityId] = useState('');
  const [org_facilityId, setOrg_facilityId] = useState('');
  const [dest_storeId, setDest_storeId] = useState(ProductEntry.dest_storeId);
  const [org_storeId, setOrg_storeId] = useState('');
  const [dest_store_name, setDest_storename] = useState('');
  const [org_store_name, setOrg_storename] = useState('');
  const [org_quantity, setOrg_quantity] = useState('');
  const [productId, setProductId] = useState("");

  const [inventoryId, setInventoryId] = useState('');
  const [billingId, setBillingId] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState('');

  const [name, setName] = useState('');
  const [baseunit, setBaseunit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [costprice, setCostprice] = useState('');
  const [storeId, setStoreId] = useState('');
  //  const [productItem, setProductItem] = useState([]);
  const [sellingprice, setSellingprice] = useState('');
  const [dest_quantity, setDest_quantity] = useState('');
  const [amount, setAmount] = useState('');
  const [chosen1, setChosen1] = useState('');
  const [success1, setSuccess1] = useState(false);
  const [item, setItem] = useState('');
  const [comments, setComments] = useState('');

  const [storeName, setStoreName] = useState('');

  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [transfers, setTransfers] = useState([]);
  const [authorization, setAuthorization] = useState(false);
  const [authorizedBy, setAuthorizedBy] = useState('');
 


  const productItemI = ProductEntry?.productitems.map((item) => ({
    ...item,
    disabled:true,

  }));

  const authorizationData = {
    authorizedBy,
    authorizationDate: new Date(),
  };

  const authorizationFromCreate = ProductEntry?.authorization?.map((item) => ({
    ...item,
  }));
  //console.log('start', productItemI, ProductEntry);

  const [productItem, setProductItem] = useState(productItemI);

  const [authorizationArray, setAuthorizationArray] = useState(
    authorizationFromCreate,
  );

 // console.log('product items', productItem);
  //console.log('entry', ProductEntry, authorizationArray);

  // const [productItem, setProductItem] = useState([ProductEntry.productitems]);

  const SearchLocation = (obj) => {
    if (!obj) {
      setDest_storeId('');
      //setOrg_facilitystoreId("");
      setChosen1();
      setSuccess1(true);
    } else {
     // console.log(state?.employeeLocation);
     // console.log(obj);

      if (obj?._id === state.employeeLocation.locationId) {
        setSuccess1(true);
        setChosen1();
        toast.error('You can not select your current location as destination');
        return;
      } else {
        setDest_storeId(obj?._id);
        setDest_storename(obj.name);
        setChosen1(obj);
        setSuccess1(false);
      }
      // setOrg_facilityId(obj?._id);
    }
  };

  const getSearchproduct = (obj) => {
    // console.log(obj);
    setInventoryId(obj?._id);
    setProductId(obj?.productId);
    setBillingId(obj?.billingId);
    setName(obj?.name);
    setBaseunit(obj?.baseunit);
    setSellingprice(obj?.sellingprice);
    setCostprice(obj?.costprice);
    setQuantity(obj?.quantity);
    setItem(obj);
  };

  useEffect(() => {
    const totalStockValue = 0;

    productItem
      .map((item) => item.amount)
      .reduce((prev, next) => Number(prev) + Number(next), 0);
    setOrg_totalamount(totalStockValue);

    return () => {};
  }, [productItem]);

  const handleChangeType = async (e) => {
    setType(e.target.value);
  };

  const handleClickProd = async () => {
   // console.log(productId, quantity);
    if (!productId || !quantity) {
      toast.error('Kindly choose Product and quantity');
      return;
    }

    setProductItem((prevProd) => prevProd.concat(newItem));
    setSuccess(true);
    setProductId('');
  };

  const addAuthorization = async () => {
    if (!authorization || authorizedBy === '') {
      toast.error('Kindly Authorise and add a Name');
      return;
    }

    //setProductItem((prevProd) => prevProd.concat(productItemI));
    setAuthorizationArray((prevProd) => prevProd.concat(authorizationData));
    setAuthorization(false);
    setAuthorizedBy('');
    setSuccess(true);
  };

  const resetform = () => {
    setType('Invoice');
    setDocumentNo('');
    setOrg_totalamount(0);
    setProductId('');
    setSource('');
    setDate('');
    setName('');
    setBaseunit('');
    setCostprice('');
    setSellingprice('');
    setProductItem([]);
    setAuthorizationArray([])
  };

  //console.log("Transfer", transfers)

  const onSubmit = async (e) => {
    e.preventDefault();

    // showActionLoader();
    setMessage('');
    setError(false);
    setSuccess(false);
    let transferEntry = ProductEntry;

    transferEntry.source = dest_store_name;
    transferEntry.sourceId = dest_storeId;
    transferEntry.sourceType = 'Store';
    transferEntry.date = transferEntry.org_date; //dayjs(transferEntry.org_date).format("DD-MM-YY HH:mm")
    transferEntry.productitems = productItem;
    transferEntry.authorization = authorizationArray;
    transferEntry.createdby = user._id;
    transferEntry.createdbyName = user.firstname + ' ' + user.lastname;
    transferEntry.transactioncategory = 'debit';
    if (authorizationArray.length===3){
      transferEntry.dest_status="Authorized"

    }

   // console.log(transferEntry);

    if (user.currentEmployee) {
      transferEntry.facility = user.currentEmployee.facilityDetail._id; // or from facility dropdown
    } else {
      toast.error('You can not make requisition to any organization');
      return;
    }
    if (state.InventoryModule.selectedInventory._id) {
      transferEntry.storeId = state.InventoryModule.selectedInventory._id;
    } else {
      toast.error('You need to select a store before making requisition');
      return;
    }
    if (dest_storeId === '') {
      toast.error('You need to select a store ');
      return;
    }
    //console.log(transferEntry)
    let action = {
      actorname: user.firstname + ' ' + user.lastname,
      actorId: user._id,
      action: 'Created Authorization',
      description: '',
      comments: '',
      createdat: new Date(),
    };
    transferEntry.action_hx = ProductEntry.action_hx;
    transferEntry.action_hx.push(action);

    TransferEntryServ.patch(ProductEntry._id, transferEntry)
      .then(async (res) => {
        console.log(res);
        setTransfers(res.data);
        hideActionLoader();
        resetform();
        setSuccess(true);
        toast.success('Requision updated succesfully');
        setSuccess(false);
        setConfirmDialog(false);
       ///* setProductItem([]); */
        closeModal();
      })
      .catch((err) => {
        hideActionLoader();
        toast.error('Error making Requisition ' + err);
        setConfirmDialog(false);
      });
  };

  const removeEntity = (entity, i) => {
    setProductItem((prev) => prev.filter((obj, index) => index !== i));
    //console.log(i);
  };

  const removeAuthorization = (entity, i) => {
    setAuthorizationArray((prev) => prev.filter((obj, index) => index !== i));
    //console.log(i);
  };
const handleModify= (row,i)=>{
  console.log(row)
  const newRow=row
 newRow.disabled=false


 setProductItem(prev=>{
  const index=prev.findIndex(item=>item._id===row._id)
  if (index===-1)return prev
  const updated=[...prev]
  updated[index]= newRow
  return updated
 }) 
}

const handleSave=(row)=>{
  const newRow=row
  newRow.disabled=true
 
 
  setProductItem(prev=>{
   const index=prev.findIndex(item=>item._id===row._id)
   if (index===-1)return prev
   const updated=[...prev]
   updated[index]= newRow
   return updated
  }) 


}

const handleInputChange =(e,row)=>{
  
  const { value } = e.target;
  console.log(value)
  const newRow=row
  //newRow.disabled=false
  newRow.quantitySent=value
  setProductItem(prev=>{
    const index=prev.findIndex(item=>item._id===row._id)
    if (index===-1)return prev
    const updated=[...prev]
    updated[index]= newRow
    return updated
   }) 

}
  const productCreateSchema = [
    {
      name: 'S/N',
      key: 'sn',
      width: '100px',
      center: true,
      description: 'SN',
      selector: (row) => row.sn,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Name',
      key: 'type',
      description: 'Enter Name',
      selector: (row) => row.name,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Unit',
      key: 'baseunit',
      description: 'Base Unit',
      selector: (row) => row.baseunit,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'QTTY',
      //width: "70px",
      key: 'quanity',
      description: 'Enter quantity',
      selector: (row) =>(
        <>
        <input
          style={{ height: "200%", width: "100%" }}
          type="number"
          value={row.quantitySent}    //{itemStates[row._id].quantity}
          onChange={(e) => handleInputChange(e, row)}
          /*   placeholder="Enter quantity to accept" */
          
          min={0}
         disabled={row.disabled} // Disable input if finalized
        />
      </>
        
        
        
       // row.quantity
      ),
      sortable: true,
      required: true,
      inputType: 'TEXT',
      center: true,
    },

    {
      name: 'Actions',
      key: 'costprice',
    
      description: 'costprice',
      selector: (row, i) => (
        <>
       <IconButton size="small" onClick={() => removeEntity(row, i)}>
          <DeleteOutlineIcon fontSize="small" sx={{ color: 'red' }} />
        </IconButton> 
        <GlobalCustomButton 
           sx={{
            marginRight: '10px',
          }}
                onClick={() => handleModify(row) }//(row._id, row.quantitySent)}
               // disabled={itemStates[row._id].finalized} // Disable button if finalized
              >
              Modify
              </GlobalCustomButton>
              <GlobalCustomButton 
              color="error" 
                onClick={() => handleSave(row)}
             //   disabled={itemStates[row._id].rejected} // Disable if already rejected
              >
                Save
              </GlobalCustomButton>
        </>
      ),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
  ];

  const authorizationCreateSchema = [
    {
      name: 'S/N',
      key: 'sn',
      width: '100px',
      center: true,
      description: 'SN',
      selector: (row) => row.sn,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Authorized By',
      key: 'type',
      description: 'Enter Name',
      selector: (row) => row.authorizedBy,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Authorization Date',
      key: 'type',
      description: 'Enter Authorization date',
      //selector: (row) => row.authorizationDate,
      selector: (row) => dayjs(row.authorizationDate).format('DD-MM-YY'),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    
  /*{
       name: 'Actions',
      key: 'costprice',
      width: '70px',
      description: 'costprice',
      selector: (row, i) => (
        <IconButton size="small" onClick={() => removeAuthorization(row, i)}>
          <DeleteOutlineIcon fontSize="small" sx={{ color: 'red' }} />
        </IconButton>
      ),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    }, */
  ];
  //console.log('product item', productItem);

  return (
    <Box
      sx={{
        width: '80vw',
        maxHeight: '85vh',
        overflowY: 'auto',
      }}
    >
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={() => setConfirmDialog(false)}
        type="create"
        confirmationAction={onSubmit}
        // message="Are you sure you want to save this transfer ?"
      />
      <Grid container spacing={1}>
        <Grid item lg={12} md={12} sm={12}>
          <Box mb={1} sx={{ height: '40px' }}>
            <FormsHeaderText text="Requisition Detail" />
          </Box>
        {/*  {  (ProductEntry.dest_status !== 'Pending')&&  <Grid container spacing={1}>
            <Grid item lg={2} md={3} sm={4} xs={6}>
              <StoreSearch
                defaultLocation={storeName}
                getSearchfacility={SearchLocation}
                clear={success1}
              />
            </Grid>
          </Grid>} */}
        </Grid>
       <Grid container spacing={1} mb={1}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <Input
              value={ProductEntry.dest_store_name}
              label="Destination Store"
              disabled
            />
          </Grid>

          <Grid item lg={2} md={6} sm={6} xs={12}>
            <Input value={ProductEntry.type} label="Type" disabled />
          </Grid>

          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Input
              value={
                ProductEntry.org_date
                  ? dayjs(ProductEntry.org_date).format('DD-MM-YY HH:mm')
                  : '-----'
              }
              label="Date Sent"
              disabled
            />
          </Grid>

          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Input value={ProductEntry.dest_status} label="Status" disabled />
          </Grid>
        </Grid>

    

       
      </Grid>
      
      {productItem.length > 0 && (
        <Box mt={2}>
          <CustomTable
            title={''}
            columns={productCreateSchema}
            data={productItem}
            pointerOnHover
            highlightOnHover
            striped
          />
        </Box>
      )}
{ authorizationArray.length <=2 && <Grid item lg={12} md={12} sm={12}>
          <Box mt={1} sx={{ height: '40px' }}>
            <FormsHeaderText text="Authorisation Details" />
          </Box>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {/* <StoreSearch
                getSearchfacility={SearchLocation}
                clear={success1}
              /> */}
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={authorization}
                      //onChange={e => setSendMail(e.target.checked)}
                      onChange={(e) => {
                        setAuthorization(e.target.checked);
                        console.log(e.target.checked);
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontSize: '0.8rem',
                      }}
                    >
                      Authorize
                    </Typography>
                  }
                />
              </FormGroup>
            </Grid>
            {authorization && (
              <>
                <Grid item lg={2} md={3} sm={4} xs={6}>
                  {/* <StoreSearch
                getSearchfacility={SearchLocation}
                clear={success1}
              /> */}

                  <Input
                    value={authorizedBy}
                    name="quantity"
                    type="text"
                    onChange={async (e) => setAuthorizedBy(e.target.value)}
                    label=" Authorized By"
                    placeholder={'Enter your full name'}
                  />
                </Grid>

                <Grid item lg={2} md={3} sm={4} xs={6}>
                  <GlobalCustomButton onClick={addAuthorization}>
                    Authorize
                  </GlobalCustomButton>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>}
      {authorizationArray.length > 0 && (
        <Box mt={2}>
          <CustomTable
            title={''}
            columns={authorizationCreateSchema}
            data={authorizationArray}
            pointerOnHover
            highlightOnHover
            striped
          />
        </Box>
      )}

      <Box
        container
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
        mt={2}
      >
        <GlobalCustomButton
          disabled={!productItem.length > 0}
          onClick={() => setConfirmDialog(true)}
          sx={{
            marginRight: '10px',
          }}
        >
          Update Requisition
        </GlobalCustomButton>

        <GlobalCustomButton color="error" onClick={closeModal}>
          Cancel
        </GlobalCustomButton>
      </Box>
    </Box>
  );
}

