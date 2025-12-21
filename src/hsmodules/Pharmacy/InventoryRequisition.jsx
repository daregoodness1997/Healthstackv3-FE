/* eslint-disable */
import React, { useState, useContext, useEffect, useRef } from 'react';
import client from '../../feathers';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { UserContext, ObjectContext } from '../../context';
import { toast } from 'react-toastify';
import PrintIcon from '@mui/icons-material/Print';
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
  const [view, setView] = useState(true);

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
      {view ? (
        <TransferSentList
          openCreateModal={handleOpenCreateModal}
          openDetailModal={handleOpenDetailModal}
          toggleView={toggleView}
        />
      ) : (
        <TransferReceiveList
          openRecvDetailModal={handleOpenRecvDetailModal}
          toggleView={toggleView}
        />
      )}

      <ModalBox
        open={createModal}
        onClose={handleCloseCreateModal}
        header="Requisition Request"
      >
        <TransferCreate closeModal={handleCloseCreateModal} />
      </ModalBox>

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

      <ModalBox
        open={recvdetailModal}
        onClose={handleCloseRecvDetailModal}
        header="Inbound Requisition Details"
      >
        <RecvTransferDetail
          handleCloseRecvDetailModal={handleCloseRecvDetailModal}
        />
      </ModalBox>
    </section>
  );
}

export function TransferCreate({ closeModal }) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const TransferEntryServ = client.service('transfer');
  const { user } = useContext(UserContext);
  const [type, setType] = useState('requisition');
  const [documentNo, setDocumentNo] = useState('');
  const [org_totalamount, setOrg_totalamount] = useState(0);
  const [dest_facilityId, setDest_facilityId] = useState('');
  const [org_facilityId, setOrg_facilityId] = useState('');
  const [dest_storeId, setDest_storeId] = useState('');
  const [dest_type, setDest_type] = useState('');
  const [dest_store_name, setDest_storename] = useState('');

  const [org_quantity, setOrg_quantity] = useState('');
  const [productId, setProductId] = useState('');
  const [inventoryId, setInventoryId] = useState('');
  const [billingId, setBillingId] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [baseunit, setBaseunit] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [costprice, setCostprice] = useState('');
  const [productItem, setProductItem] = useState([]);
  const [authorizationArray, setAuthorizationArray] = useState([]);
  const [sellingprice, setSellingprice] = useState('');
  const [chosen1, setChosen1] = useState('');
  const [success1, setSuccess1] = useState(false);
  const [item, setItem] = useState('');
  const [comments, setComments] = useState('');
  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [transfers, setTransfers] = useState([]);
  const [authorization, setAuthorization] = useState(false);
  const [authorizedBy, setAuthorizedBy] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const productItemI = {
    type,
    dest_facilityId,
    org_facilityId,
    dest_storeId,
    org_storeId: state.employeeLocation.locationId,
    org_quantity,
    inventoryId,
    name,
    quantity,
    costprice,
    amount: quantity * costprice,
    baseunit,
    sellingprice,
    quantitySent: quantity,
    quantityRecv: 0,
    productId,
    billingId,
    dest_status: 'Pending', //Accepted, Partly-accepted, Pending, Rejected
    org_status: 'sent',
    item,
    comments,
    createdby: user._id,
  };

  const authorizationData = {
    authorizedBy,
    authorizationDate: new Date(),
  };

  const SearchLocation = (obj) => {
    if (!obj) {
      setDest_storeId('');
      //setOrg_facilitystoreId("");
      setChosen1();
      setSuccess1(true);
    } else {
      //console.log(state?.employeeLocation);
      //console.log(obj);

      if (obj?._id === state.employeeLocation.locationId) {
        setSuccess1(true);
        setChosen1();
        toast.error('You can not select your current location as destination');
        return;
      } else {
        setDest_storeId(obj?._id);
        setDest_storename(obj.name);
        setDest_type(obj.locationType);
        setChosen1(obj);
        setSuccess1(false);
      }
      // setOrg_facilityId(obj?._id);
    }
  };

  const getSearchproduct = (obj) => {
    // //console.log("this is the item", obj)
    //setInventoryId(obj?._id);

    setBillingId(obj?.billingId);
    setProductId(obj?.productId);
    setName(obj?.name);
    setBaseunit(obj?.baseunit);
    /*  setSellingprice(obj?.sellingprice);
     setCostprice(obj?.costprice); */
    setQuantity(1);
    setItem(obj.productDetail);
  };

  useEffect(() => {
    /*  const totalStockValue = 0;
 
     productItem
       .map((item) => item.amount)
       .reduce((prev, next) => Number(prev) + Number(next), 0);
     setOrg_totalamount(totalStockValue); */
    setSuccess(false)
    setProductId("")
    return () => { };
  }, [productItem]);

  /*   useEffect(() => {
      //console.log("I ran also"  , simpa)
      
      return () => {};
    }, [name]); */

  const handleChangeType = async (e) => {
    setType(e.target.value);
  };

  const handleClickProd = async () => {
    if (!productId) {
      toast.error('Kindly choose Product ');
      return;
    }

    setProductItem((prevProd) => prevProd.concat(productItemI));
    //setAuthorizationArray((prevProd) => prevProd.concat(authorizationData));
    setName('');
    setBaseunit('');
    setQuantity(1);
    setCostprice('');
    setSellingprice('');
    //setAuthorization(null);
    //setAuthorizedBy('');
    setSuccess(true);
  };

  const handleUpdateProd = () => {
    if (!productId) {
      toast.error('Kindly choose Product ');
      return;
    }

    const updatedItem = {
      ...productItemI,
      quantity: quantity,
      amount: quantity * costprice, // Recalculate amount if needed
    };

    setProductItem((prevProd) => {
      const newProd = [...prevProd];
      newProd[editingIndex] = updatedItem;
      return newProd;
    });

    setName('');
    setBaseunit('');
    setQuantity(1);
    setCostprice('');
    setSellingprice('');
    setIsEditing(false);
    setEditingIndex(null);
    setSuccess(true);
  };

  const handleCancelEdit = () => {
    setName('');
    setBaseunit('');
    setQuantity(1);
    setCostprice('');
    setSellingprice('');
    setIsEditing(false);
    setEditingIndex(null);
    setSuccess(false);
  };
  const flag = () => {
    setSuccess(false)
  }


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
    setAuthorization(null);
    setAuthorizedBy('');
    setProductItem([]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError(false);
    setSuccess(false);

    //  //console.log('product-item', productItem);

    let transferEntry = {
      type,

      dest_facilityId: user.currentEmployee.facilityDetail._id,
      org_totalamount,
      org_facilityId: user.currentEmployee.facilityDetail._id,
      org_storeId: state.employeeLocation.locationId, //originating
      //originating
      dest_storeId: dest_storeId, //originating
      org_store_name: state.employeeLocation.locationName,
      store_type: dest_type,
      dest_store_name: dest_store_name,
      documentNo: generateRandomString(6),
      totalamount: org_totalamount,
      org_date: new Date(),
      // rev_date: "",
      org_facility_name: user.currentEmployee.facilityDetail.facilityName,
      dest_facility_name: user.currentEmployee.facilityDetail.facilityName,

      dest_totalamount: 0,

      // transactioncategory: { type: String, required: true }, //credit=entry , debit=exit
      dest_status: 'Pending', //Accepted, Partly-fulfilled, Pending, Rejected
      org_status: 'Sent', //Fulfiled, Partly-fulfilled, Pending, Rejected
      org_trx_status: 'Sent', //Draft,Approved,Sent
      dest_trx_status: '',
    };
    transferEntry.source = dest_store_name;
    transferEntry.sourceId = dest_storeId;
    transferEntry.sourceType = 'Store';
    transferEntry.date = transferEntry.org_date; //dayjs(transferEntry.org_date).format("DD-MM-YY HH:mm")
    transferEntry.productitems = productItem;
    transferEntry.authorization = authorizationArray;
    transferEntry.createdby = user._id;
    transferEntry.createdbyName = user.firstname + ' ' + user.lastname;
    transferEntry.transactioncategory = 'debit';

    if (user.currentEmployee) {
      transferEntry.facility = user.currentEmployee.facilityDetail._id; // or from facility dropdown
    } else {
      toast.error('You can not make requisition to any organization');
      return;
    }
    if (state.StoreModule.selectedStore._id) {
      transferEntry.storeId = state.StoreModule.selectedStore._id;
    } else {
      toast.error('You need to select a store before making requisition');
      return;
    }
    if (dest_storeId === '') {
      toast.error('You need to select a store ');
      return;
    }
    ////console.log(transferEntry)
    let action = {
      actorname: user.firstname + ' ' + user.lastname,
      actorId: user._id,
      action: 'Created Transfer',
      description: '',
      comments: '',
      createdat: transferEntry.org_date,
    };
    transferEntry.action_hx = [];
    transferEntry.action_hx.push(action);

    //console.log(transferEntry)

    TransferEntryServ.create(transferEntry)
      .then(async (res) => {
        setTransfers(res.data);
        hideActionLoader();
        resetform();
        setSuccess(true);
        toast.success('Requision made succesfully');
        setSuccess(false);
        setConfirmDialog(false);
        setProductItem([]);
        closeModal();
      })
      .catch((err) => {
        hideActionLoader();
        toast.error('Error making Requisition ' + err);
        //console.log(err)
        setConfirmDialog(false);
      });
  };

  const removeEntity = (entity, i) => {
    setProductItem((prev) => prev.filter((obj, index) => index !== i));
    ////console.log(i);
  };
  const editEntity = (entity, i) => {
    //console.log(entity);
    setQuantity(entity.quantity);
    setName(entity.name);
    setBaseunit(entity.baseunit);
    setProductId(entity.productId);
    setBillingId(entity.billingId);
    setCostprice(entity.costprice);
    setSellingprice(entity.sellingprice);
    setItem(entity.item);

    setIsEditing(true);
    setEditingIndex(i);
  };


  const removeAuthorization = (entity, i) => {
    setAuthorizationArray((prev) => prev.filter((obj, index) => index !== i));
    ////console.log(i);
  };

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
      name: 'QTY',
      //width: "70px",
      key: 'quanity',
      description: 'Enter quantity',
      selector: (row) => row.quantity,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      center: true,
    },
    {
      name: 'Actions',
      key: 'costprice',
      width: '70px',
      description: 'costprice',
      selector: (row, i) => (
        <>
          <IconButton size="small" onClick={() => editEntity(row, i)}>
            <EditNoteOutlinedIcon fontSize="small" sx={{ color: 'red' }} />
          </IconButton>
          <IconButton size="small" onClick={() => removeEntity(row, i)}>
            <DeleteOutlineIcon fontSize="small" sx={{ color: 'red' }} />
          </IconButton>
        </>
      ),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
  ];

  /*  const authorizationCreateSchema = [
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
     {
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
     },
   ]; */

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
          <Grid container spacing={1}>
            <Grid item lg={2} md={3} sm={4} xs={6}>
              <StoreSearch
                getSearchfacility={SearchLocation}
                clear={success1}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item lg={12} md={12} sm={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '40px',
            }}
            mb={1}
          >
            <FormsHeaderText text="Add Product" />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {isEditing ? (
                <>
                  <GlobalCustomButton onClick={handleUpdateProd}>
                    <EditNoteOutlinedIcon
                      sx={{ marginRight: '5px' }}
                      fontSize="small"
                    />
                    Update Product
                  </GlobalCustomButton>
                  <GlobalCustomButton
                    onClick={handleCancelEdit}
                    variant="outlined"
                    color="error"
                  >
                    Cancel
                  </GlobalCustomButton>
                </>
              ) : (
                <GlobalCustomButton onClick={handleClickProd}>
                  <AddCircleOutline
                    sx={{ marginRight: '5px' }}
                    fontSize="small"
                  />
                  Add Product
                </GlobalCustomButton>
              )}
            </Box>
          </Box>

          <Grid container spacing={1}>
            <Grid item lg={6} md={6} sm={8} xs={12}>
              <ProductSearch
                getSearchfacility={getSearchproduct}
                clear={success}
                storeId={dest_storeId}
              /*  flag={flag} */
              />
              {/*   <input
                className="input is-small"
                value={productId}
                name="productId"
                type="text"
                onChange={(e) => setProductId(e.target.value)}
                placeholder="Product Id"
                style={{ display: 'none' }}
              /> */}
            </Grid>

            <Grid item lg={2} md={3} sm={2}>
              <Input
                name="baseunit"
                value={baseunit}
                type="text"
                disabled={true}
                label="Base Unit"
              />
            </Grid>
            <Grid item lg={2} md={3} sm={4} xs={6}>
              <Input
                value={quantity}
                name="quantity"
                type="text"
                //disabled={true}
                onChange={async (e) => setQuantity(e.target.value)}
                label=" Available Quantity"
              />
            </Grid>
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

      {/*  {authorizationArray.length > 0 && (
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
      )} */}

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
          Create Requisition
        </GlobalCustomButton>

        <GlobalCustomButton color="error" onClick={closeModal}>
          Cancel
        </GlobalCustomButton>
      </Box>
    </Box>
  );
}

export function TransferSentList({
  openCreateModal,
  openDetailModal,
  toggleView,
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
  const [limit, setLimit] = useState(20); //LIMITATIONS FOR THE NUMBER OF FACILITIES FOR SERVER TO RETURN PER PAGE
  const [total, setTotal] = useState(0); //TOTAL NUMBER OF FACILITIES AVAILABLE IN THE SERVER
  const [restful, setRestful] = useState(true);
  const [next, setNext] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [docToDel, setDocToDel] = useState({});

  // //console.log("Transfer data", transfers)

  const handleCreateNew = async () => {
    const newProductEntryModule = {
      selectedProductEntry: {},
      show: 'create',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ProductEntryModule: newProductEntryModule,
    }));
    ////console.log(state);
    openCreateModal();
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
    ////console.log(state)
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
        storeId: state.StoreModule.selectedStore._id,
        facility: user.currentEmployee.facilityDetail._id || '',
        $limit: 100,
        $sort: {
          createdAt: -1,
        },
      },
    })
      .then((res) => {
        ////console.log(res)
        setFacilities(res.data);
        setTotal(res.total);
        setMessage(' ProductEntry  fetched successfully');
        setSuccess(true);
      })
      .catch((err) => {
        //  //console.log(err)
        setMessage(
          'Error fetching ProductEntry, probable network issues ' + err,
        );
        setError(true);
      });
  };

  const getFacilities = async () => {
    const findTransfer = await TransferEntryServ.find({
      query: {
        // facility: user.currentEmployee.facilityDetail._id,

        $select: ['org_date', 'org_store_name', 'dest_store_name', 'productitems', 'dest_status', 'dest_trx_status'],

        org_storeId: state.StoreModule.selectedStore._id,
        type: 'requisition',
        $sort: {
          createdAt: -1,
        },
      },
    });
    setFacilities(findTransfer.data);
    console.log(findTransfer.data);
    setTotal(findTransfer.total);
  };

  useEffect(() => {
    getFacilities();
    TransferEntryServ.on('created', (obj) => getFacilities());
    TransferEntryServ.on('updated', (obj) => getFacilities());
    TransferEntryServ.on('patched', (obj) => getFacilities());
    TransferEntryServ.on('removed', (obj) => getFacilities());
    return () => { };
  }, []);

  useEffect(() => {
    //setFacilities([])

    getFacilities();
    return () => { };
  }, [state.StoreModule.selectedStore._id]);

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
      name: 'Status',
      key: 'org_totalamount',
      description: 'Enter Total Amount',
      selector: (row) => row.dest_status,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
    },
    {
      name: 'Transfer Status',
      key: 'org_totalamount',
      description: 'Enter Total Amount',
      selector: (row) => row.dest_trx_status,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
    },
  ];

  return (
    <>
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={handleCancelConfirm}
        confirmationAction={() => handleDelete(docToDel)}
        message={`Are you sure you want to delete this entry with Document No: ${docToDel?.documentNo}`}
      />
      {state.StoreModule.selectedStore ? (
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
                  List of Outbound Requisition
                </h2>
                <div style={{ marginLeft: '10px', fontSize: '0.95rem' }}>
                  <GlobalCustomButton onClick={toggleView}>
                    View Inbound Requisition
                  </GlobalCustomButton>
                </div>
              </div>

              {handleCreateNew && (
                <GlobalCustomButton onClick={openCreateModal}>
                  <AddCircleOutline
                    fontSize="small"
                    sx={{ marginRight: '5px' }}
                  />
                  Add New
                </GlobalCustomButton>
              )}
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
              />
            </Box>
          </PageWrapper>
        </>
      ) : (
        <div>loading... </div>
      )}
    </>
  );
}

export function TransferReceiveList({ openRecvDetailModal, toggleView }) {
  // const { register, handleSubmit, watch, errors } = useForm();

  const [error, setError] = useState(false);
  const TransferEntryServ = client.service('transfer');
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedProductEntry, setSelectedProductEntry] = useState(); //

  const { state, setState } = useContext(ObjectContext);

  const { user, setUser } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20); //LIMITATIONS FOR THE NUMBER OF FACILITIES FOR SERVER TO RETURN PER PAGE
  const [total, setTotal] = useState(0); //TOTAL NUMBER OF FACILITIES AVAILABLE IN THE SERVER

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [docToDel, setDocToDel] = useState({});

  // //console.log("Transfer data", transfers)

  const handleCreateNew = async () => {
    const newProductEntryModule = {
      selectedProductEntry: {},
      show: 'create',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ProductEntryModule: newProductEntryModule,
    }));
    ////console.log(state)
    openCreateModal();
  };

  const handleRow = async (data) => {
    const ProductEntry = await TransferEntryServ.get(data._id);
    //console.log(ProductEntry);
    setSelectedProductEntry(ProductEntry);

    const newProductEntryModule = {
      selectedProductEntry: ProductEntry,
      show: 'detail',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ProductEntryModule: newProductEntryModule,
    }));
    ////console.log(state)
    openRecvDetailModal();
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
        storeId: state.StoreModule.selectedStore._id,
        facility: user.currentEmployee.facilityDetail._id || '',
        $limit: 100,
        $sort: {
          createdAt: -1,
        },
      },
    })
      .then((res) => {
        ////console.log(res)
        setFacilities(res.data);
        setTotal(res.total);

      })
      .catch((err) => {
        //  //console.log(err)


      });
  };

  const getFacilities = async () => {
    console.log(state.StoreModule.selectedStore._id)
    const findTransfer = await TransferEntryServ.find({
      query: {
        // facility: user.currentEmployee.facilityDetail._id,
        $select: ['org_date', 'org_store_name', 'dest_store_name', 'productitems', 'dest_status', 'dest_trx_status'],
        dest_storeId: state.StoreModule.selectedStore._id,
        type: 'requisition',
        dest_status: { $ne: "Pending" },
        /*  $limit: limit,
          $skip: page * limit, */
        /*  $limit:20, */
        $sort: {
          createdAt: -1,
        },
        /*  $limit: limit,
         $skip: (page - 1) * limit, */
      },
    });
    setFacilities(findTransfer.data);
    console.log(findTransfer.data);
    setTotal(findTransfer.total);
  };

  useEffect(() => {
    getFacilities();
    TransferEntryServ.on('created', (obj) => getFacilities());
    TransferEntryServ.on('updated', (obj) => getFacilities());
    TransferEntryServ.on('patched', (obj) => getFacilities());
    TransferEntryServ.on('removed', (obj) => getFacilities());
    return () => { };
  }, [limit, page]);

  useEffect(() => {
    //setFacilities([])

    getFacilities();
    return () => { };
  }, [state.StoreModule.selectedStore._id, limit, page]);

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
      name: 'Origination ',
      key: 'dest_quantity',
      description: 'Enter Source',
      selector: (row) => row.org_store_name,
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
      name: 'Requisition Status',
      key: 'org_totalamount',
      description: 'Enter Total Amount',
      selector: (row) => row.dest_status,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
    },
    {
      name: 'Transfer Status',
      key: 'org_totalamount',
      description: 'Enter Total Amount',
      selector: (row) => row.dest_trx_status,
      sortable: true,
      required: true,
      inputType: 'TEXT',
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
        message={`Are you sure you want to delete this entry with Document No: ${docToDel?.documentNo}`}
      />
      {state.StoreModule.selectedStore ? (
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
                  List of Inbound Requisition
                </h2>
                <div style={{ marginLeft: '10px', fontSize: '0.95rem' }}>
                  <GlobalCustomButton onClick={toggleView}>
                    View Outbound Requisition
                  </GlobalCustomButton>
                </div>
              </div>
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
      ) : (
        <div>loading... </div>
      )}
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


  const generatePrintableHtml = (entry) => {
    const rows = (entry.productitems || [])
      .map((it, i) => {
        return `
          <tr>
            <td style="padding:8px;border:1px solid #ddd;text-align:center">${i + 1}</td>
            <td style="padding:8px;border:1px solid #ddd">${it.name || ''}</td>
            <td style="padding:8px;border:1px solid #ddd">${it.baseunit || ''}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center">${it.quantitySent || it.quantity || ''}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center">${it.quantityRecv || ''}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right">${it.amount || ''}</td>
          </tr>
        `;
      })
      .join('');

    const sentDate = entry.org_date
      ? dayjs(entry.org_date).format('DD-MM-YY HH:mm')
      : '';

    return `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Requisition - ${entry.documentNo || ''}</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; margin: 20px; color: #222; }
            h2 { margin: 0 0 8px 0; }
            table { border-collapse: collapse; width: 100%; margin-top: 8px; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background:#f5f5f5; text-align:left; }
            .meta { margin-bottom:12px; }
            .right { text-align:right; }
          </style>
        </head>
        <body>
          <h2>Requisition ${entry.documentNo || ''}</h2>
          <div class="meta">
            <strong>From:</strong> ${entry.org_store_name || ''} &nbsp; 
            <strong>To:</strong> ${entry.dest_store_name || ''} &nbsp; 
            <strong>Date:</strong> ${sentDate}
          </div>
          <table>
            <thead>
              <tr>
                <th style="width:40px">#</th>
                <th>Name</th>
                <th>Unit</th>
                <th style="width:80px">Qty Sent</th>
                <th style="width:80px">Qty Recv</th>
                <th style="width:120px" class="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <div style="margin-top:12px" class="right"><strong>Total items:</strong> ${entry.productitems?.length || 0}</div>
        </body>
      </html>`;
  };

  const handlePrint = () => {
    if (!ProductEntry) {
      toast.info('No requisition selected to print');
      return;
    }
    const html = generatePrintableHtml(ProductEntry);
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) {
      toast.error('Unable to open print window. Allow popups for this site.');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
    }, 300);
  };


  const handleEdit = async () => {
    const newProductEntryModule = {
      selectedProductEntry: ProductEntry,
      show: 'modify',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ProductEntryModule: newProductEntryModule,
    }));
    ////console.log(state)
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
  const handleRow = () => { };

  //console.log(ProductEntry);
  if (ProductEntry.dest_status === 'Pending') {
    return (
      <EditDetails
        //closeModal={handleCloseModal}
        closeModal={handleClose}
        // open={openModifyModal}
        ProductEntry={ProductEntry}
      />
    );
  }

  return (
    <>
      <Box
        container
        sx={{
          width: '85vw',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
        pt={1}
      >
        {/* header row: print button aligned right */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1 }}>
          <GlobalCustomButton onClick={handlePrint}>
            <PrintIcon fontSize="small" sx={{ marginRight: '5px' }} />
            Print
          </GlobalCustomButton>
        </Box>

        <Grid container spacing={1} mb={1}>

          <Grid item lg={4} md={6} sm={6} xs={12}>
            <Input
              value={ProductEntry.dest_store_name}
              label="Destination Stores"
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

        <Box sx={{ width: '100%', overflowY: 'auto' }}>
          <CustomTable
            title={''}
            columns={ProductDetailSchema}
            data={ProductEntry.productitems}
            pointerOnHover
            highlightOnHover
            striped
            onRowClicked={handleRow}
          />
        </Box>
      </Box>
    </>
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
  const [productId, setProductId] = useState(
    ProductEntry.productitems[0].productId,
  );

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

  const newItem = {
    type,
    dest_storeId,
    org_storeId: state.employeeLocation.locationId,
    org_quantity,
    name,
    quantity,
    amount: quantity * costprice,
    baseunit,
    quantitySent: quantity,
    quantityRecv: 0,
    productId,
    dest_status: 'Pending', //Accepted, Partly-accepted, Pending, Rejected
    org_status: 'sent',
    item,
    comments,
    createdby: user._id,
    _id: ProductEntry._id,
  };

  const productItemI = ProductEntry?.productitems.map((item) => ({
    ...item,
    quantity: item.quantitySent,
    //type: item.type,
    dest_storeId,
    org_storeId: state.employeeLocation.locationId,
    item,
    org_quantity,
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

  //console.log('product items', productItem);
  //console.log('entry', ProductEntry, authorizationArray);

  // const [productItem, setProductItem] = useState([ProductEntry.productitems]);

  const SearchLocation = (obj) => {
    if (!obj) {
      setDest_storeId('');
      //setOrg_facilitystoreId("");
      setChosen1();
      setSuccess1(true);
    } else {
      //console.log(state?.employeeLocation);
      //console.log(obj);

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
    // //console.log(obj);
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
    /*  const totalStockValue = 0;
 
     productItem
       .map((item) => item.amount)
       .reduce((prev, next) => Number(prev) + Number(next), 0);
     setOrg_totalamount(totalStockValue); */
    setSuccess(false)
    return () => { };
  }, [productItem]);

  const handleChangeType = async (e) => {
    setType(e.target.value);
  };

  const handleClickProd = async () => {
    //console.log(productId, quantity);
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

  ////console.log("Transfer", transfers)

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

    //console.log(transferEntry);

    if (user.currentEmployee) {
      transferEntry.facility = user.currentEmployee.facilityDetail._id; // or from facility dropdown
    } else {
      toast.error('You can not make requisition to any organization');
      return;
    }
    if (state.StoreModule.selectedStore._id) {
      transferEntry.storeId = state.StoreModule.selectedStore._id;
    } else {
      toast.error('You need to select a store before making requisition');
      return;
    }
    if (dest_storeId === '') {
      toast.error('You need to select a store ');
      return;
    }
    ////console.log(transferEntry)
    let action = {
      actorname: user.firstname + ' ' + user.lastname,
      actorId: user._id,
      action: 'Created Transfer',
      description: '',
      comments: '',
      createdat: transferEntry.org_date,
    };
    transferEntry.action_hx = [];
    transferEntry.action_hx.push(action);

    TransferEntryServ.patch(ProductEntry._id, transferEntry)
      .then(async (res) => {
        //console.log(res);
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
    ////console.log(i);
  };

  const removeAuthorization = (entity, i) => {
    setAuthorizationArray((prev) => prev.filter((obj, index) => index !== i));
    ////console.log(i);
  };

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
      name: 'QTY',
      //width: "70px",
      key: 'quanity',
      description: 'Enter quantity',
      selector: (row) => row.quantity,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      center: true,
    },

    {
      name: 'Actions',
      key: 'costprice',
      width: '70px',
      description: 'costprice',
      selector: (row, i) => (
        <IconButton size="small" onClick={() => removeEntity(row, i)}>
          <DeleteOutlineIcon fontSize="small" sx={{ color: 'red' }} />
        </IconButton>
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
    {
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
    },
  ];
  ////console.log('product item', productItem);

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
          {(ProductEntry.dest_status !== 'Pending') && <Grid container spacing={1}>
            <Grid item lg={2} md={3} sm={4} xs={6}>
              <StoreSearch
                defaultLocation={storeName}
                getSearchfacility={SearchLocation}
                clear={success1}
              />
            </Grid>
          </Grid>}
        </Grid>
        {(ProductEntry.dest_status === 'Pending') && <Grid container spacing={1} mb={1}>
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
        </Grid>}

        {(ProductEntry.dest_status !== 'Pending') && <Grid item lg={12} md={12} sm={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '40px',
            }}
            mb={1}
          >
            <FormsHeaderText text="Add Product" />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {/* <UploadExcelSheet updateState={setProductItem} /> */}

              <GlobalCustomButton onClick={handleClickProd}>
                <AddCircleOutline
                  sx={{ marginRight: '5px' }}
                  fontSize="small"
                />
                Add Product
              </GlobalCustomButton>
            </Box>
          </Box>

          <Grid container spacing={1}>
            <Grid item lg={6} md={6} sm={8} xs={12}>
              <ProductSearch
                initialValue={name}
                getSearchfacility={getSearchproduct}
                clear={success}
              />
              {/* // value={ProductEntry.productitems[0].productId}
              //name="productId" */}
              <input
                className="input is-small"
                // value={ProductEntry.productitems[0].productId}
                value={productId}
                name="productId"
                type="text"
                onChange={(e) => setProductId(e.target.value)}
                placeholder="Product Id"
                style={{ display: 'none' }}
              />
            </Grid>

            <Grid item lg={2} md={3} sm={2}>
              <Input
                name="baseunit"
                // value={ProductEntry.productitems[0].baseunit}
                value={baseunit}
                type="text"
                disabled={true}
                label="Base Unit"
              />
            </Grid>
            <Grid item lg={2} md={3} sm={4} xs={6}>
              <Input
                // value={ProductEntry.productitems[0].quantitySent}
                value={quantity}
                name="quantity"
                type="text"
                //disabled={true}
                onChange={async (e) => setQuantity(e.target.value)}
                label=" Quantity"
              />
            </Grid>
          </Grid>
        </Grid>}


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

      {authorizationArray?.length > 0 && (
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

export function RecvTransferDetail({ handleCloseRecvDetailModal }) {
  //const { register, handleSubmit, watch, setValue } = useForm(); //errors,
  const { user } = useContext(UserContext);
  const [error, setError] = useState(false); //,
  const TransferEntryServ = client.service('transfer');
  const [message, setMessage] = useState(''); //,
  const { state, setState } = useContext(ObjectContext);
  const [qtty, setQtty] = useState([]);
  const [name, setName] = useState("");
  const [unattended, setUnattended] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const ProductEntry = state.ProductEntryModule.selectedProductEntry;
  const [dest_totalamount, setDest_totalamount] = useState(0);
  const [currentUser, setCurrentUser] = useState();
  const [type, setType] = useState("transfer");
  const [documentNo, setDocumentNo] = useState("");
  const [org_totalamount, setOrg_totalamount] = useState(0);
  const [dest_facilityId, setDest_facilityId] = useState("");
  const [org_facilityId, setOrg_facilityId] = useState("");
  const [dest_storeId, setDest_storeId] = useState("");
  const [org_storeId, setOrg_storeId] = useState("");
  const [dest_store_name, setDest_storename] = useState("");
  const [org_store_name, setOrg_storename] = useState("");
  const [org_quantity, setOrg_quantity] = useState("");
  const [productId, setProductId] = useState("");
  const [inventoryId, setInventoryId] = useState("");
  const [billingId, setBillingId] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");

  const [baseunit, setBaseunit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [costprice, setCostprice] = useState("");
  const [storeId, setStoreId] = useState("");
  const [productItem, setProductItem] = useState([]);
  const [sellingprice, setSellingprice] = useState("");
  const [dest_quantity, setDest_quantity] = useState("");
  const [amount, setAmount] = useState("");
  const [chosen1, setChosen1] = useState("");
  const [success1, setSuccess1] = useState(false);
  const [item, setItem] = useState("");
  const [comments, setComments] = useState("");
  let n = 0;
  // State to track both accepted quantities and whether the item is finalized
  const [itemStates, setItemStates] = useState(
    ProductEntry.productitems.reduce(
      (acc, item) => ({
        ...acc,
        [item._id]: {
          amount: item.amount,
          quantity: item.quantitySent,
          finalized: false,
          rejected: false,
          comment: '',
        },
      }),
      {},
    ),
  );

  // //console.log(ProductEntry)

  // generate printable HTML for received requisition
  const generateRequisitionHtml = (entry) => {
    if (!entry) return '<!doctype html><html><body><p>No data to print</p></body></html>';

    const rows = (entry.productitems || [])
      .map((it, i) => {
        const qtySent = it.quantitySent ?? it.quantity ?? '';
        const qtyRecv = it.quantityRecv ?? '';
        const unit = it.baseunit ?? '';
        const status = it.dest_status === '' ? 'Pending' : it.dest_status;
        const comments = it.comments || '-';
        return `
          <tr>
            <td style="padding:8px;border:1px solid #ddd;text-align:center">${i + 1}</td>
            <td style="padding:8px;border:1px solid #ddd">${it.name || ''}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center">${unit}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center">${qtySent}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center">${qtyRecv}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center">${status}</td>
            <td style="padding:8px;border:1px solid #ddd">${comments}</td>
          </tr>`;
      })
      .join('');

    const orgDate = entry.org_date ? dayjs(entry.org_date).format('DD-MM-YY HH:mm') : '';
    const totalSent = entry.org_totalamount || 0;

    return `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Received Requisition - ${entry.documentNo || ''}</title>
          <style>
            body{font-family:Arial,Helvetica,sans-serif;margin:16px;color:#222}
            h2{margin:0 0 8px 0}
            table{border-collapse:collapse;width:100%;margin-top:8px}
            th,td{border:1px solid #ddd;padding:8px}
            th{background:#f5f5f5;text-align:left}
            .meta{margin-bottom:12px}
            .right{text-align:right}
            .summary{margin-top:12px;padding:10px;background:#f9f9f9;border:1px solid #ddd}
          </style>
        </head>
        <body>
          <h2>Received Requisition ${entry.documentNo || ''}</h2>
          <div class="meta">
            <strong>From:</strong> ${entry.org_store_name || ''} &nbsp;
            <strong>To:</strong> ${entry.dest_store_name || ''} &nbsp;
            <strong>Date Sent:</strong> ${orgDate} &nbsp;
            <strong>Status:</strong> ${entry.dest_status || 'Pending'}
          </div>
          <table>
            <thead>
              <tr>
                <th style="width:40px">#</th>
                <th>Name</th>
                <th style="width:80px">Unit</th>
                <th style="width:100px">Qty Requested</th>
                <th style="width:100px">Qty Sent</th>
                <th style="width:100px">Status</th>
                <th style="width:150px">Comments</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <div class="summary">
            <div><strong>Total Amount Goods Sent:</strong> ${totalSent.toLocaleString()}</div>
            <div><strong>Total Amount Goods Accepted:</strong> ${dest_totalamount.toLocaleString()}</div>
          </div>
        </body>
      </html>`;
  };

  // print handler
  const handlePrint = () => {
    if (!ProductEntry) {
      toast.info('No requisition selected to print');
      return;
    }
    const html = generateRequisitionHtml(ProductEntry);
    const w = window.open('', '_blank', 'width=1000,height=800');
    if (!w) {
      toast.error('Unable to open print window. Please allow popups for this site.');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  };

  const handleAccept = (id, quantitySent) => {
    const { quantity } = itemStates[id];
    const parsedQuantity = parseInt(quantity, 10);

    if (isNaN(parsedQuantity)) {
      alert('Please enter a valid number.');
      return;
    }
    if (parsedQuantity < 0) {
      alert('Accepted quantity cannot be negative.');
      return;
    }
    if (parsedQuantity > quantitySent) {
      alert(`You cannot accept more than the sent quantity (${quantitySent}).`);
      return;
    }

    // If the quantity is valid, mark the item as finalized
    if (parsedQuantity > 0 && parsedQuantity <= quantitySent) {
      setItemStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], finalized: true, rejected: false },
      }));
      //alert(`You have accepted ${parsedQuantity} of item ID: ${id}.`);
    }
  };

  useEffect(() => {
    let totalStockValue = 0;
    for (const itemId in itemStates) {
      if (
        itemStates[itemId].finalized === true &&
        itemStates[itemId].rejected === false
      ) {
        totalStockValue = totalStockValue + itemStates[itemId].amount;
        setDest_totalamount(totalStockValue);
      }
    }
    return () => { };
  }, [itemStates]);

  const handleReset = (id) => {
    setItemStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], finalized: false, rejected: false, comment: '' },
    }));
  };

  const handleReject = (id) => {
    // Mark the item as rejected and disable further edits
    setItemStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], rejected: true, finalized: true, quantity: 0 },
    }));
    const item = ProductEntry.productitems.find((el) => el._id === id);
    alert(`You have rejected the transfer for item: ${item.name}!`);
  };

  const handleInputChange = (e, id) => {
    const { value } = e.target;
    setItemStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], quantity: value },
    }));
  };

  const handleCommentChange = (e, id) => {
    const { value } = e.target;
    setItemStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], comment: value },
    }));
  };
  const handleEdit = async () => {
    const newProductEntryModule = {
      selectedProductEntry: ProductEntry,
      show: 'modify',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ProductEntryModule: newProductEntryModule,
    }));
    ////console.log(state)
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
      name: 'Quantity Requested',
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

    {
      name: 'Status',
      key: 'sellingprice',
      description: 'Enter unit',
      selector: (row) => (row.dest_status === '' ? 'Pending' : row.dest_status),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Qtty Sent',
      key: 'sellingprice',
      description: 'Enter unit',
      selector: (row, i) => (
        <>
          <input
            style={{ height: '200%', width: '100%' }}
            type="number"
            value={itemStates[row._id].quantity}
            onChange={(e) => handleInputChange(e, row._id)}
            /*   placeholder="Enter quantity to accept" */
            max={row.quantitySent}
            min={0}
            disabled={itemStates[row._id].finalized} // Disable input if finalized
          />
        </>
      ),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Comments',
      key: 'sellingprice',
      description: 'Enter unit',
      selector: (row) => (
        <>
          <input
            onChange={(e) => handleCommentChange(e, row._id)}
            type="text"
            value={itemStates[row._id].comment}
            style={{ width: '100%' }}
            disabled={itemStates[row._id].finalized}
          ></input>
        </>
      ),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Action',
      key: 'sellingprice',
      description: 'Enter unit',
      selector: (row, i) => (
        <>
          {!itemStates[row._id].finalized && (
            <>
              <button
                onClick={() => handleAccept(row._id, row.quantitySent)}
                disabled={itemStates[row._id].finalized} // Disable button if finalized
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(row._id)}
                disabled={itemStates[row._id].rejected} // Disable if already rejected
              >
                Reject
              </button>
            </>
          )}
          {/* Reset button to re-enable the accept button and input */}
          {itemStates[row._id].finalized && (
            <button onClick={() => handleReset(row._id)}>Reset</button>
          )}
        </>
      ),
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
  ];
  const handleRow = () => { };

  const submitTransfer = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let updateditems = ProductEntry.productitems;

    for (const itemId in itemStates) {
      // Check if any item is not finalized and not rejected

      if (!itemStates[itemId].finalized) {
        setUnattended(true); // Found an item that is not finalized
        alert('You have unattended items in your transfer list');
        return;
      }
      if (unattended) {
        setUnattended(false);
        return;
      }
      for (const itemId in itemStates) {
        const itemu = updateditems.find((e) => e._id === itemId);
        itemu.comments = itemStates[itemId].comment;
        itemu.quantityRecv = parseInt(itemStates[itemId].quantity, 10);
        itemu.dest_status = itemStates[itemId].rejected
          ? 'Rejected'
          : 'Accepted';
      }
      let transferEntry = ProductEntry;

      //org_date:new Date(),
      (transferEntry.rev_date = new Date()),
        //dest_totalamount:0,
        (transferEntry.totalamount = dest_totalamount),
        // transactioncategory: { type: String, required: true }, //credit=entry , debit=exit
        (transferEntry.dest_status = 'Processed'), // Pending, Processed
        (transferEntry.source = state.StoreModule.selectedStore.name); //dest_store_name
      transferEntry.sourceId = state.StoreModule.selectedStore._id; // dest_storeId
      transferEntry.sourceType = 'Store';
      transferEntry.date = transferEntry.rev_date; //dayjs(transferEntry.org_date).format("DD-MM-YY HH:mm")
      transferEntry.productitems = updateditems;
      transferEntry.processedby = user._id;
      transferEntry.processedbyName = user.firstname + ' ' + user.lastname;
      transferEntry.transactioncategory = 'credit';

      if (user.currentEmployee) {
        transferEntry.facility = user.currentEmployee.facilityDetail._id; // or from facility dropdown
      } else {
        toast.error('You can not add inventory to any organization');
        return;
      }
      if (state.StoreModule.selectedStore._id) {
        transferEntry.storeId = state.StoreModule.selectedStore._id;
      } else {
        toast.error('You need to select a store before adding inventory');
        return;
      }
      let action = {
        actorname: user.firstname + ' ' + user.lastname,
        actorId: user._id,
        action: 'Received and Processed Transfer',
        description: '',
        comments: '',
        createdat: transferEntry.rev_date,
      };
      // transferEntry.action_hx=[]
      transferEntry.action_hx.push(action);

      // //console.log(new Date());

      TransferEntryServ.patch(ProductEntry._id, transferEntry)
        .then(async (res) => {
          setConfirmDialog(false);
          //hideActionLoader();
          // handleCloseRecvDetailModal();

          //  alert("saved")
          toast.success('Requisition accepted succesfully');
        })
        .catch((err) => {
          // hideActionLoader();
          setConfirmDialog(false);
          toast.error('Error accepting Requisition ' + err);
        });
    }
  };

  const handleTransfer = async (productEntry) => {
    const productServ = client.service("inventory");
    //update requisition status
    const products = []
    const notAvailable = []

    let totalamount = 0
    //console.log("PE",productEntry)
    await Promise.all(productEntry.productitems.map(async (el, i) => {

      await productServ
        .find({
          query: {
            //service
            facility: user.currentEmployee.facilityDetail._id,
            productId: el.productId,
            storeId: state.employeeLocation.locationId,
            $limit: 10,
            $sort: {
              createdAt: -1,
            },
          },
        })
        .then((res) => {
          //console.log("Product, ", res);
          if (res.total === 0) {
            //console.log("item does not exist in your inventory")
            notAvailable.push(el.name)
          } else {
            let obj = res.data[0]
            //console.log(obj)
            /*   const getSearchproduct = (obj) => {
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

              let abd=getSearchproduct(obj)
              products.push(abd) */
            const productItemI = {
              type: "transfer",
              dest_facilityId: productEntry.org_facilityId,
              org_facilityId: productEntry.dest_facilityId,
              dest_storeId: productEntry.org_storeId,
              org_storeId: state.employeeLocation.locationId,
              org_quantity: el.quantityRecv,
              inventoryId: obj._id,
              name: obj.name,//
              quantity: el.quantitySent,
              costprice: obj.costprice,//
              amount: el.quantityRecv * obj.costprice, //
              baseunit: obj.baseunit, //
              sellingprice: obj.sellingprice,//
              quantitySent: el.quantityRecv,//
              quantityRecv: 0,//
              productId: obj.productId,//
              billingId: obj.billingId,//
              dest_status: "Pending", //Accepted, Partly-accepted, Pending, Rejected
              org_status: "sent",//
              item: obj,//
              comments: el.comments,//
              createdby: user._id,//
            };
            // //console.log(products)
            setProductItem((prevProd) => prevProd.concat(productItemI));
            products.push(productItemI)
            //console.log("products",products)
            totalamount = totalamount + productItemI.amount

            /*  setName("");
             setBaseunit("");
             setQuantity("");
             setCostprice("");
             setSellingprice(""); */
            // setSuccess(true);
          }
          /* setFacilities(res.data);
          setSearchMessage(" product  fetched successfully");
          setShowPanel(true); */
        })
        .catch((err) => {
          /*  toast({
             message: "Error creating ProductEntry " + err,
             type: "is-danger",
             dismissible: true,
             pauseOnHover: true,
           }); */
          //console.log("productfetch error",err)
        });

    })
    )
    //console.log("here", products)
    //  onSubmit()
    // map productEntry.items=> get inventory item
    //create new productItemi for items
    //recreate Productentry for transfer



    /*   const onSubmit = async () => { */
    //e.preventDefault();

    // showActionLoader();
    /*  setMessage("");
     setError(false);
     setSuccess(false); */

    let transferEntry = {
      type,

      dest_facilityId: user.currentEmployee.facilityDetail._id,
      org_totalamount: totalamount,
      org_facilityId: user.currentEmployee.facilityDetail._id,
      // org_quantity
      //
      //orginatinating
      org_storeId: state.employeeLocation.locationId, //originating
      //originating
      dest_storeId: productEntry.org_storeId, //originating
      org_store_name: state.employeeLocation.locationName,
      dest_store_name: productEntry.org_store_name,
      documentNo: generateRandomString(6),
      totalamount: totalamount,
      org_date: new Date(),
      // rev_date: "",
      org_facility_name: user.currentEmployee.facilityDetail.facilityName,
      dest_facility_name: user.currentEmployee.facilityDetail.facilityName,

      dest_totalamount: 0,

      // transactioncategory: { type: String, required: true }, //credit=entry , debit=exit
      dest_status: "Pending", //Accepted, Partly-fulfilled, Pending, Rejected
      org_status: "Sent", //Fulfiled, Partly-fulfilled, Pending, Rejected
      org_trx_status: "Sent", //Draft,Approved,Sent
      dest_trx_status: "",
    };
    transferEntry.source = productEntry.org_store_name;
    transferEntry.sourceId = productEntry.org_storeId
    transferEntry.sourceType = "Store";
    transferEntry.date = transferEntry.org_date; //dayjs(transferEntry.org_date).format("DD-MM-YY HH:mm")
    transferEntry.productitems = products;
    transferEntry.createdby = user._id;
    transferEntry.createdbyName = user.firstname + " " + user.lastname;
    transferEntry.transactioncategory = "debit";

    if (user.currentEmployee) {
      transferEntry.facility = user.currentEmployee.facilityDetail._id; // or from facility dropdown
    } else {
      toast.error("You can not add inventory to any organization");
      return;
    }
    if (state.StoreModule.selectedStore._id) {
      transferEntry.storeId = state.StoreModule.selectedStore._id;
      //console.log("store", transferEntry.storeId)
    } else {
      toast.error("You need to select a store before adding inventory");
      return;
    }

    //
    let action = {
      actorname: user.firstname + " " + user.lastname,
      actorId: user._id,
      action: "Created Transfer",
      description: "",
      comments: "",
      createdat: transferEntry.org_date,
    };
    transferEntry.action_hx = [];
    transferEntry.action_hx.push(action);
    ////console.log("TE",transferEntry)
    const pl = products.length
    const al = notAvailable.length
    let goahead = false
    //console.log(al,pl)


    if (al !== 0) {
      alert(`${notAvailable} not available for transfer.`)
    }

    if (pl !== 0) {

      //alert(products)

      TransferEntryServ.create(transferEntry)
        .then(async (res) => {
          //console.log(res);


          toast.success(`Created succesfully for ${pl} items, ${al} items not available for transfer`);
          TransferEntryServ.patch(ProductEntry._id, { dest_trx_status: "Transferred" })
            .then()
            .catch()

          setProductItem([]);

          handleCloseRecvDetailModal();
        })
        .catch((err) => {

          toast.error("Error creating Transfer " + err);
          //console.log(err)

        });
      /* }; */
    } else {
      toast.error("Transfer not successful, No item matched in inventory")
    }

  }

  return (
    <>
      <Box
        container
        sx={{
          width: '85vw',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >

        <CustomConfirmationDialog
          open={confirmDialog}
          cancelAction={() => setConfirmDialog(false)}
          type="create"
          confirmationAction={(e) => submitTransfer(e)}
        // message="Are you sure you want to save this transfer ?"
        />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1 }}>
          <GlobalCustomButton onClick={handlePrint}>
            <PrintIcon fontSize="small" sx={{ marginRight: '5px' }} />
            Print
          </GlobalCustomButton>
        </Box>

        <Grid container spacing={1} mb={1}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <Input
              value={ProductEntry.org_store_name}
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

          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Input
              value={ProductEntry.org_totalamount}
              label="Total Amount Goods Sent"
              disabled
            />
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Input
              value={dest_totalamount}
              label="Total Amount Goods Accepted"
              disabled
            />
          </Grid>
        </Grid>

        <Box sx={{ width: '100%', overflowY: 'auto' }}>
          <CustomTable
            title={''}
            columns={ProductDetailSchema}
            data={ProductEntry.productitems}
            pointerOnHover
            highlightOnHover
            striped
            onRowClicked={handleRow}
          />
        </Box>
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
            disabled={!ProductEntry.productitems.length > 0 || ProductEntry.dest_status === "Processed"}
            onClick={() => setConfirmDialog(true)}
            sx={{
              marginRight: '10px',
            }}
          >
            Save
          </GlobalCustomButton>

          <GlobalCustomButton
            color="error"
            onClick={handleCloseRecvDetailModal}
          >
            Cancel
          </GlobalCustomButton>
          <GlobalCustomButton
            disabled={(!ProductEntry.dest_status === "Processed") || ProductEntry.dest_trx_status === "Transferred" || (ProductEntry.dest_status === "Authorized")}
            color="success"
            onClick={() => handleTransfer(ProductEntry)}
            sx={{
              marginLeft: '10px',
            }}
          >
            Create Transfer
          </GlobalCustomButton>
        </Box>
      </Box>
    </>
  );
}

export function ProductEntryModify() {
  const { register, handleSubmit, setValue, reset, errors } = useForm(); //watch, errors,

  const [error, setError] = useState(false);

  const [success, setSuccess] = useState(false);

  const [message, setMessage] = useState('');

  const ProductEntryServ = client.service('productentry');
  //const navigate=useNavigate()

  const { user } = useContext(UserContext);
  const { state, setState } = useContext(ObjectContext);

  const ProductEntry = state.ProductEntryModule.selectedProductEntry;

  useEffect(() => {
    setValue('name', ProductEntry.name, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue('ProductEntryType', ProductEntry.ProductEntryType, {
      shouldValidate: true,
      shouldDirty: true,
    });

    return () => { };
  });

  const handleCancel = async () => {
    const newProductEntryModule = {
      selectedProductEntry: {},
      show: 'create',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ProductEntryModule: newProductEntryModule,
    }));
    ////console.log(state)
  };

  const changeState = () => {
    const newProductEntryModule = {
      selectedProductEntry: {},
      show: 'create',
    };
    setState((prevstate) => ({
      ...prevstate,
      ProductEntryModule: newProductEntryModule,
    }));
  };
  const handleDelete = async () => {
    let conf = window.confirm('Are you sure you want to delete this data?');

    const dleteId = ProductEntry._id;
    if (conf) {
      ProductEntryServ.remove(dleteId)
        .then((res) => {
          reset();
          toast({
            message: 'ProductEntry deleted succesfully',
            type: 'is-success',
            dismissible: true,
            pauseOnHover: true,
          });
          changeState();
        })
        .catch((err) => {
          // setMessage("Error deleting ProductEntry, probable network issues "+ err )
          // setError(true)
          toast({
            message:
              'Error deleting ProductEntry, probable network issues or ' + err,
            type: 'is-danger',
            dismissible: true,
            pauseOnHover: true,
          });
        });
    }
  };

  const onSubmit = (data, e) => {
    e.preventDefault();

    setSuccess(false);
    // //console.log(data)
    data.facility = ProductEntry.facility;
    ////console.log(data);

    ProductEntryServ.patch(ProductEntry._id, data)
      .then((res) => {
        ////console.log(JSON.stringify(res))
        // e.target.reset();
        // setMessage("updated ProductEntry successfully")
        toast({
          message: 'ProductEntry updated succesfully',
          type: 'is-success',
          dismissible: true,
          pauseOnHover: true,
        });

        changeState();
      })
      .catch((err) => {
        //setMessage("Error creating ProductEntry, probable network issues "+ err )
        // setError(true)
        toast({
          message:
            'Error updating ProductEntry, probable network issues or ' + err,
          type: 'is-danger',
          dismissible: true,
          pauseOnHover: true,
        });
      });
  };

  return (
    <>
      <div className="card ">
        <div className="card-header">
          <p className="card-header-title">ProductEntry Details-Modify</p>
        </div>
        <div className="card-content vscrollable">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
              <label className="label is-small">
                {' '}
                Name
                <p className="control has-icons-left has-icons-right">
                  <input
                    className="input  is-small"
                    {...register('x', { required: true })}
                    name="name"
                    type="text"
                    placeholder="Name"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-hospital"></i>
                  </span>
                </p>
              </label>
            </div>
            <div className="field">
              <label className="label is-small">
                ProductEntry Type
                <p className="control has-icons-left has-icons-right">
                  <input
                    className="input is-small "
                    {...register('x', { required: true })}
                    disabled
                    name="ProductEntryType"
                    type="text"
                    placeholder="ProductEntry Type"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-map-signs"></i>
                  </span>
                </p>
              </label>
            </div>
          </form>

          <div className="field  is-grouped mt-2">
            <p className="control">
              <button
                type="submit"
                className="button is-success is-small"
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </button>
            </p>
            <p className="control">
              <button
                className="button is-warning is-small"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </p>
            <p className="control">
              <button
                className="button is-danger is-small"
                onClick={() => handleDelete()}
                type="delete"
              >
                Delete
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

//product search component for requisition

export function ProductSearch({
  getSearchfacility,
  clear,
  label,
  storeId,
  // flag
  // initialValue,
}) {
  const productServ = client.service('inventory');
  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [facilities, setFacilities] = useState([]);

  const [searchError, setSearchError] = useState(false);

  const [showPanel, setShowPanel] = useState(false);

  const [searchMessage, setSearchMessage] = useState('');

  const [simpa, setSimpa] = useState("") //(initialValue);

  const [chosen, setChosen] = useState(false);
  const { user } = useContext(UserContext);

  const [count, setCount] = useState(0);
  const inputEl = useRef(null);
  const [val, setVal] = useState('');
  const [productModal, setProductModal] = useState(false);

  const handleRow = async (obj) => {

    if (obj.quantity < 2) {
      toast.error(`Only ${obj.quantity} ${obj.baseunit} of ${obj.name} left in inventory! You can not request for this item`);
      return;
    }
    setChosen(true);
    getSearchfacility(obj);

    setSimpa(obj.name);
    setShowPanel(false);
    setCount(2);
  };
  const handleBlur = async (e) => { };

  const handleSearch = async (value) => {
    setVal(value);
    //setVal("heeko");
    if (value === '') {
      setShowPanel(false);
      return;
    }
    if (storeId === "") {

      toast.error("You need to select a destinationstore to search for products")
      return
    }
    const field = 'name'; //field variable

    if (value.length >= 3) {
      productServ
        .find({
          query: {
            //service
            [field]: {
              $regex: value,
              $options: 'i',
            },
            facility: user.currentEmployee.facilityDetail._id,
            storeId: storeId,
            $limit: 10,
            $sort: {
              createdAt: -1,
            },
          },
        })
        .then((res) => {
          ////console.log('Product, ', res.data);
          const drugs = res.data
          const seen = new Set();
          const distinctDrugs = drugs.filter(drug => {
            if (seen.has(drug.name)) return false;
            seen.add(drug.name);
            return true;
          });


          setFacilities(distinctDrugs);
          console.log("distinctDrugs", distinctDrugs);
          setSearchMessage(' product  fetched successfully');
          setShowPanel(true);
        })
        .catch((err) => {
          toast({
            message: 'Error creating ProductEntry ' + err,
            type: 'is-danger',
            dismissible: true,
            pauseOnHover: true,
          });
        });
    } else {
      setShowPanel(false);
      setFacilities([]);
    }
  };

  const handleAddproduct = () => {
    setProductModal(true);
  };
  const handlecloseModal = () => {
    setProductModal(false);
    handleSearch(val);
  };
  useEffect(() => {
    // //console.log("ythis thing", clear)
    if (clear) {
      setSimpa('');
    }
    // flag()
    return () => { };
  }, [clear]);


  return (
    <div>
      <div>
        {' '}
        <Autocomplete
          size="small"
          value={simpa}
          key={'somehting'}
          onChange={(event, newValue, reason) => {
            if (reason === 'clear') {
              setSimpa('');
              return;
            } else {
              if (typeof newValue === 'string') {
                setTimeout(() => {
                  handleAddproduct();
                });
              } else if (newValue && newValue.inputValue) {
                handleAddproduct();
              } else {
                handleRow(newValue);
              }
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            if (facilities.length === 0 && params.inputValue !== '') {
              filtered.push({
                inputValue: params.inputValue,
                name: `${params.inputValue} does not exist in your inventory`,
              });
            }

            return filtered;
          }}
          id="free-solo-dialog-demo"
          options={facilities}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.name;
          }}
          isOptionEqualToValue={(option, value) =>
            value === undefined || value === '' || option._id === value._id
          }
          onInputChange={(event, newInputValue, reason) => {
            if (reason === 'reset') {
              setVal('');
              return;
            } else {
              handleSearch(newInputValue);
            }
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          renderOption={(props, option) => (
            <li {...props} style={{ fontSize: '0.75rem' }}>
              {option.name} {option.baseunit}
            </li>
          )}
          sx={{ width: '100%' }}
          freeSolo
          //size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              label={label ? label : 'Search for Product'}
              //onChange={e => handleSearch(e.target.value)}
              ref={inputEl}
              sx={{
                fontSize: '0.75rem !important',
                backgroundColor: '#ffffff !important',
                '& .MuiInputBase-input': {
                  height: '0.9rem',
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
      </div>
    </div>
  );
}
