/* eslint-disable */
import React, { useState, useContext, useEffect, useRef } from 'react';
import client from '../../feathers';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import { UserContext, ObjectContext } from '../../context';
import { toast } from 'react-toastify';
import { ProductCreate } from './Products';

import Input from '../../components/inputs/basic/Input';
import StoreSearch from '../helpers/storeSearch';
import { OrgFacilitySearch } from '../helpers/FacilitySearch';
import { PageWrapper } from '../../ui/styled/styles';
import { TableMenu } from '../../ui/styled/global';
import FilterMenu from '../../components/utilities/FilterMenu';
import CustomTable from '../../components/customtable';
import CustomSelect from '../../components/inputs/basic/Select';
import 'react-datepicker/dist/react-datepicker.css';
import ModalBox from '../../components/modal';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { generateRandomString } from '../helpers/generateString';
import { IconButton } from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import DehazeIcon from '@mui/icons-material/Dehaze';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import { green, red, yellow } from '@mui/material/colors';

const filter = createFilterOptions();

import { Box, Grid, Button as MuiButton } from '@mui/material';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import moment from 'moment';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import { FormsHeaderText } from '../../components/texts';
import CustomConfirmationDialog from '../../components/confirm-dialog/confirm-dialog';

export default function ProductEntry() {
  const { state } = useContext(ObjectContext); //,setState

  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [recvdetailModal, setRecvDetailModal] = useState(false);
  const [modifyModal, setModifyModal] = useState(false);
  const [view, setView] = useState(true); //true=out ; false=in

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
    // alert(view)
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
          /* openCreateModal={handleOpenCreateModal} */
          openRecvDetailModal={handleOpenRecvDetailModal}
          toggleView={toggleView}
        />
      )}

      <ModalBox
        open={createModal}
        onClose={handleCloseCreateModal}
        header="Transfer Request"
      >
        <TransferCreate closeModal={handleCloseCreateModal} />
      </ModalBox>

      <ModalBox
        open={detailModal}
        onClose={handleCloseDetailModal}
        header="Outbound Transfer Details"
      >
        <TransferDetail openModifyModal={handleOpenModifyModal} />
      </ModalBox>
      <ModalBox
        open={recvdetailModal}
        onClose={handleCloseRecvDetailModal}
        header="Inbound Transfer Details"
      >
        <RecvTransferDetail
          handleCloseRecvDetailModal={handleCloseRecvDetailModal}
        />
      </ModalBox>

      {/* <ModalBox open={modifyModal} onClose={handleCloseModifyModal}>
        <ProductEntryModify />
      </ModalBox> */}
    </section>
  );
}

export function TransferCreate({ closeModal }) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const TransferEntryServ = client.service('transfer');
  const { user } = useContext(UserContext);

  const [currentUser, setCurrentUser] = useState();
  const [type, setType] = useState('transfer');
  const [documentNo, setDocumentNo] = useState('');
  const [org_totalamount, setOrg_totalamount] = useState(0);
  const [dest_facilityId, setDest_facilityId] = useState('');
  const [org_facilityId, setOrg_facilityId] = useState('');
  const [dest_storeId, setDest_storeId] = useState('');
  const [org_storeId, setOrg_storeId] = useState('');
  const [dest_store_name, setDest_storename] = useState('');
  const [org_store_name, setOrg_storename] = useState('');
  const [org_quantity, setOrg_quantity] = useState('');
  const [productId, setProductId] = useState('');
  const [inventoryId, setInventoryId] = useState('');
  const [billingId, setBillingId] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [baseunit, setBaseunit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [costprice, setCostprice] = useState('');
  const [storeId, setStoreId] = useState('');
  const [productItem, setProductItem] = useState([]);
  const [sellingprice, setSellingprice] = useState('');
  const [dest_quantity, setDest_quantity] = useState('');
  const [amount, setAmount] = useState('');
  const [chosen1, setChosen1] = useState('');
  const [success1, setSuccess1] = useState(false);
  const [item, setItem] = useState('');
  const [comments, setComments] = useState('');
  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [transfers, setTransfers] = useState([]);

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

  const SearchLocation = (obj) => {
    if (!obj) {
      setDest_storeId('');
      //setOrg_facilitystoreId("");
      setChosen1();
      setSuccess1(true);
    } else {
      console.log(state?.employeeLocation);
      console.log(obj);

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
  /*  const SearchOrgFacility = (obj) => {
    setOrg_facilityId(obj?._id);
    setChosen1(obj);
    if (!obj) {
      setOrg_facilityId(obj?._id);
      org_facilityId(obj?._id);
      setChosen1();
    }
  };
 */
  const getSearchproduct = (obj) => {
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
    if (!productId || !quantity || costprice < 0) {
      toast.error('Kindly choose Product,price and quantity');
      return;
    }

    setProductItem((prevProd) => prevProd.concat(productItemI));
    setName('');
    setBaseunit('');
    setQuantity('');
    setCostprice('');
    setSellingprice('');
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
  };

  //console.log("Transfer", transfers)

  const onSubmit = async (e) => {
    e.preventDefault();

    // showActionLoader();
    setMessage('');
    setError(false);
    setSuccess(false);

    let transferEntry = {
      type,

      dest_facilityId: user.currentEmployee.facilityDetail._id,
      org_totalamount,
      org_facilityId: user.currentEmployee.facilityDetail._id,
      // org_quantity
      //
      //orginatinating
      org_storeId: state.employeeLocation.locationId, //originating
      //originating
      dest_storeId: dest_storeId, //originating
      org_store_name: state.employeeLocation.locationName,
      dest_store_name: dest_store_name,
      documentNo: generateRandomString(6),
      totalamount: org_totalamount,
      org_date: new Date(),
      // rev_date: "",
      org_facility_name: user.currentEmployee.facilityDetail.facilityName,
      dest_facility_name: user.currentEmployee.facilityDetail.facilityName,

      dest_totalamount: 0,

      dest_status: 'Pending',
      org_status: 'Sent',
      org_trx_status: 'Sent',
      dest_trx_status: '',
    };
    transferEntry.source = dest_store_name;
    transferEntry.sourceId = dest_storeId;
    transferEntry.sourceType = 'Store';
    transferEntry.date = transferEntry.org_date; //dayjs(transferEntry.org_date).format("DD-MM-YY HH:mm")
    transferEntry.productitems = productItem;
    transferEntry.createdby = user._id;
    transferEntry.createdbyName = user.firstname + ' ' + user.lastname;
    transferEntry.transactioncategory = 'debit';

    if (user.currentEmployee) {
      transferEntry.facility = user.currentEmployee.facilityDetail._id; // or from facility dropdown
    } else {
      toast.error('You can not add inventory to any organization');
      return;
    }
    if (state.InventoryModule.selectedInventory._id) {
      transferEntry.storeId = state.InventoryModule.selectedInventory._id;
    } else {
      toast.error('You need to select a store before adding inventory');
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
      action: 'Created Transfer',
      description: '',
      comments: '',
      createdat: transferEntry.org_date,
    };
    transferEntry.action_hx = [];
    transferEntry.action_hx.push(action);

    TransferEntryServ.create(transferEntry)
      .then(async (res) => {
        setTransfers(res.data);
        hideActionLoader();
        resetform();
        setSuccess(true);
        toast.success('Transfer created succesfully');
        setSuccess(false);
        setConfirmDialog(false);
        setProductItem([]);
        closeModal();
      })
      .catch((err) => {
        hideActionLoader();
        toast.error('Error creating Transfer ' + err);
        setConfirmDialog(false);
      });
  };

  const productCreateSchema = [
    {
      name: 'S/N',
      key: 'sn',
      width: '70px',
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
      name: 'Cost Price',
      key: 'costprice',
      description: 'Enter cost price',
      selector: (row) => row.costprice,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      center: true,
    },
    {
      name: 'QTY',
      width: '70px',
      key: 'quanity',
      description: 'Enter quantity',
      selector: (row) => row.quantity,
      sortable: true,
      required: true,
      inputType: 'TEXT',
      center: true,
    },

    {
      name: 'Amount',
      key: 'amount',
      description: 'Enter amount',
      selector: (row) => row.amount,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
  ];

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
      />
      <Grid container spacing={1}>
        <Grid item lg={12} md={12} sm={12}>
          <Box mb={1} sx={{ height: '40px' }}>
            <FormsHeaderText text="Transfer Detail" />
          </Box>
          <Grid container spacing={1}>
            <Grid item lg={2} md={3} sm={4} xs={6}>
              <StoreSearch
                getSearchfacility={SearchLocation}
                clear={success1}
              />
            </Grid>

            <Grid item lg={2} md={3} sm={4} xs={6}>
              <Input
                value={org_totalamount}
                name="org_totalamount"
                type="text"
                disabled
                onChange={async (e) => setOrg_totalamount(e.target.value)}
                label="Total Amount"
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
                getSearchfacility={getSearchproduct}
                clear={success}
              />
              <input
                className="input is-small"
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
                label="Quantity"
              />
            </Grid>

            <Grid item lg={2} md={3} sm={2}>
              <Input
                name="costprice"
                value={costprice}
                type="text"
                disabled={true}
                // onChange={e => setCostprice(e.target.value)}
                label="Cost Price"
              />
            </Grid>
            <Grid item lg={6} md={3} sm={6} xs={12}>
              <Input
                name="comments"
                value={comments}
                type="text"
                //disabled={true}
                onChange={(e) => setComments(e.target.value)}
                label="Comments"
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
          Create Transfer
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
}) {
  // const { register, handleSubmit, watch, errors } = useForm();

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
    //console.log(state)
    openCreateModal();
  };

  const handleRow = async (ProductEntry) => {
    console.log(ProductEntry);
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
        facility: user.currentEmployee.facilityDetail._id || '',
        $limit: 100,
        $sort: {
          createdAt: -1,
        },
      },
    })
      .then((res) => {
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
    const findTransfer = await TransferEntryServ.find({
      query: {
        $select: [
          'org_date',
          'dest_store_name',
          'productitems',
          'org_totalamount',
          'dest_status',
          'type',
        ],

        // facility: user.currentEmployee.facilityDetail._id,
        org_storeId: state.InventoryModule.selectedInventory._id,
        type: 'transfer',

        $limit: limit,
        // $skip: page * limit, */
        /*  $limit:20, */
        $sort: {
          createdAt: -1,
        },
      },
    });
    //console.log(findTransfer);
    setFacilities(findTransfer.data);
    //  console.log(findTransfer.data)
    setTotal(findTransfer.total);
  };

  useEffect(() => {
    getFacilities();
    TransferEntryServ.on('created', (obj) => getFacilities());
    TransferEntryServ.on('updated', (obj) => getFacilities());
    TransferEntryServ.on('patched', (obj) => getFacilities());
    TransferEntryServ.on('removed', (obj) => getFacilities());
    return () => {};
  }, [limit, page]);

  useEffect(() => {
    //setFacilities([])

    getFacilities();
    return () => {};
  }, [state.InventoryModule.selectedInventory._id]);

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

  // const handleConfirmDelete = doc => {
  //   setDocToDel(doc);
  //   setConfirmDialog(true);
  // };

  const handleCancelConfirm = () => {
    setDocToDel({});
    setConfirmDialog(false);
  };

  const transferEntrySchema = [
    {
      name: 'S/NO',
      width: '60px',
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
      name: 'Total Amount',
      key: 'org_totalamount',
      description: 'Enter Total Amount',
      selector: (row) => row.org_totalamount,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
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
        message={`Are you sure you want to delete this entry with Document No: ${docToDel?.documentNo}`}
      />
      {state.InventoryModule.selectedInventory ? (
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
                  List of Transfers Out
                </h2>
                <div style={{ marginLeft: '10px', fontSize: '0.95rem' }}>
                  <GlobalCustomButton onClick={toggleView}>
                    View Transfer In
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

export function TransferReceiveList({ openRecvDetailModal, toggleView }) {
  // const { register, handleSubmit, watch, errors } = useForm();

  const [error, setError] = useState(false);

  const [success, setSuccess] = useState(false);

  const [message, setMessage] = useState('');
  const TransferEntryServ = client.service('transfer');
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedProductEntry, setSelectedProductEntry] = useState(); //

  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);

  const { user, setUser } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20); //LIMITATIONS FOR THE NUMBER OF FACILITIES FOR SERVER TO RETURN PER PAGE
  const [total, setTotal] = useState(0); //TOTAL NUMBER OF FACILITIES AVAILABLE IN THE SERVER
  const [restful, setRestful] = useState(true);
  const [next, setNext] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [docToDel, setDocToDel] = useState({});

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
    //console.log(state)
    openCreateModal();
  };

  const handleRow = async (ProductEntry) => {
    console.log(ProductEntry);
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
        storeId: state.InventoryModule.selectedInventory._id,
        facility: user.currentEmployee.facilityDetail._id || '',
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
    const findTransfer = await TransferEntryServ.find({
      query: {
        // facility: user.currentEmployee.facilityDetail._id,
        $select: [
          'org_date',
          'org_store_name',
          'productitems',
          'org_totalamount',
          'dest_status',
          'type',
        ],
        dest_storeId: state.InventoryModule.selectedInventory._id,
        type: 'transfer',

        /*  $limit: limit,
          $skip: page * limit, */
        /*  $limit:20, */
        $sort: {
          createdAt: -1,
        },
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
  }, []);

  useEffect(() => {
    //setFacilities([])

    getFacilities();
    return () => {};
  }, [state.InventoryModule.selectedInventory._id]);

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

  // const handleConfirmDelete = doc => {
  //   setDocToDel(doc);
  //   setConfirmDialog(true);
  // };

  const handleCancelConfirm = () => {
    setDocToDel({});
    setConfirmDialog(false);
  };

  const transferEntrySchema = [
    {
      name: 'S/NO',
      width: '60px',
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
      name: 'Total Amount',
      key: 'org_totalamount',
      description: 'Enter Total Amount',
      selector: (row) => row.org_totalamount,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
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

  return (
    <>
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={handleCancelConfirm}
        /*  confirmationAction={() => handleDelete(docToDel)} */
        message={`Are you sure you want to delete this entry with Document No: ${docToDel?.documentNo}`}
      />
      {state.InventoryModule.selectedInventory ? (
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
                  List of Transfers In
                </h2>
                <div style={{ marginLeft: '10px', fontSize: '0.95rem' }}>
                  <GlobalCustomButton onClick={toggleView}>
                    View Transfer Out
                  </GlobalCustomButton>
                </div>
              </div>

              {/*    {handleCreateNew && (
                <GlobalCustomButton onClick={openCreateModal}>
                  <AddCircleOutline
                    fontSize="small"
                    sx={{marginRight: "5px"}}
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
export function TransferDetail({ openModifyModal }) {
  //const { register, handleSubmit, watch, setValue } = useForm(); //errors,

  const [error, setError] = useState(false); //,
  //const [success, setSuccess] =useState(false)

  const [message, setMessage] = useState(''); //,
  //const ProductEntryServ=client.service('/ProductEntry')
  //const navigate=useNavigate()
  //const {user,setUser} = useContext(UserContext)
  const { state, setState } = useContext(ObjectContext);

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
      width: '80px',
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
    {
      name: 'sellingprice',
      key: 'sellingprice',
      description: 'Enter unit',
      selector: (row) => row.sellingprice,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Cost Price',
      key: 'costprice',
      description: 'Enter cost price',
      selector: (row) => row.costprice,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
    },
    {
      name: 'Amount',
      key: 'amount',
      description: 'Enter amount',
      selector: (row) => row.amount,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
    },
  ];
  const handleRow = () => {};

  console.log(ProductEntry.date);

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

          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Input
              value={ProductEntry.org_totalamount}
              label="Total Amount"
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
            // progressPending={loading}
          />
        </Box>
      </Box>
    </>
  );
}
export function RecvTransferDetail({ handleCloseRecvDetailModal }) {
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [unattended, setUnattended] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const ProductEntry = state.ProductEntryModule.selectedProductEntry;
  const [dest_totalamount, setDest_totalamount] = useState(0);
   const TransferEntryServ = client.service('transfer');
  // console.log(ProductEntry, "ProductEntry")
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

  // console.log(ProductEntry)

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

  /* useEffect(()=>{

console.log("efect",itemStates)
  return () => {
    setUnattended(false)
  };
},[itemStates]) */

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
    return () => {};
  }, [itemStates]);

  const handleReset = (id) => {
    // Allow editing again by setting the item as not finalized
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

  const ProductDetailSchema = [
    {
      name: 'S/N',
      width: '80px',
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
    /* {
      name: "sellingprice",
      key: "sellingprice",
      description: "Enter unit",
      selector: row => row.sellingprice,
      sortable: true,
      required: true,
      inputType: "TEXT",
    }, */
    {
      name: 'Cost Price',
      key: 'costprice',
      description: 'Enter cost price',
      selector: (row) => row.costprice,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
    },
    {
      name: 'Amount',
      key: 'amount',
      description: 'Enter amount',
      selector: (row) => row.amount,
      sortable: true,
      required: true,
      inputType: 'NUMBER',
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
      name: 'Qtty Received',
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
  const handleRow = () => {};
  const submitTransfer = async () => {
    try {
      showActionLoader();
      let updateditems = ProductEntry.productitems;

      // Validate all items are finalized
      for (const itemId in itemStates) {
        if (!itemStates[itemId].finalized) {
          setUnattended(true);
          hideActionLoader();
          toast.error('You have unattended items in your transfer list');
          return;
        }
      }

      // Update items with new values
      for (const itemId in itemStates) {
        const itemu = updateditems.find((e) => e._id === itemId);
        if (!itemu) continue;

        itemu.comments = itemStates[itemId].comment;
        itemu.quantityRecv = parseInt(itemStates[itemId].quantity, 10);
        itemu.dest_status = itemStates[itemId].rejected
          ? 'Rejected'
          : 'Accepted';
        itemu.quantity = parseInt(itemStates[itemId].quantity, 10);
      }

      // Prepare transfer entry
      let transferEntry = {
        ...ProductEntry,
        rev_date: new Date(),
        totalamount: dest_totalamount,
        dest_status: 'Accepted',
        source: state.InventoryModule.selectedInventory.name,
        sourceId: state.InventoryModule.selectedInventory._id,
        sourceType: 'Store',
        date: new Date(),
        productitems: updateditems,
        processedby: user._id,
        processedbyName: `${user.firstname} ${user.lastname}`,
        transactioncategory: 'credit',
      };

      // Validate user permissions
      if (!user.currentEmployee) {
        hideActionLoader();
        toast.error('You cannot add inventory to any organization');
        return;
      }

      transferEntry.facility = user.currentEmployee.facilityDetail._id;

      if (!state.InventoryModule.selectedInventory._id) {
        hideActionLoader();
        toast.error('You need to select a store before adding inventory');
        return;
      }

      transferEntry.storeId = state.InventoryModule.selectedInventory._id;

      // Add action history
      const action = {
        actorname: `${user.firstname} ${user.lastname}`,
        actorId: user._id,
        action: 'Received and Processed Transfer',
        description: '',
        comments: '',
        createdat: transferEntry.rev_date,
      };

      transferEntry.action_hx = [...(transferEntry.action_hx || []), action];

      // Submit transfer
      await TransferEntryServ.patch(ProductEntry._id, transferEntry);

      setConfirmDialog(false);
      hideActionLoader();
      toast.success('Transfer accepted successfully');
      handleCloseRecvDetailModal();
    } catch (error) {
      hideActionLoader();
      setConfirmDialog(false);
      toast.error(`Error accepting Transfer: ${error.message}`);
      console.error('Transfer error:', error);
    }
  };

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
        <Grid container spacing={1} mb={1} mt={4}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <Input
              value={ProductEntry.org_store_name}
              label="Source Store"
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
              value={
                ProductEntry?.dest_status === 'Pending'
                  ? dest_totalamount
                  : ProductEntry.productitems?.reduce(
                      (acc, item) => acc + item.amount,
                      0,
                    )
              }
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
            // progressPending={loading}
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
            disabled={
              !ProductEntry.productitems.length > 0 ||
              ProductEntry.dest_status === 'Processed'
            }
            onClick={() => setConfirmDialog(true)}
            /*  onClick={(e) => submitTransfer(e)} */
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

    return () => {};
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
    //console.log(state)
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
    // console.log(data)
    data.facility = ProductEntry.facility;
    //console.log(data);

    ProductEntryServ.patch(ProductEntry._id, data)
      .then((res) => {
        //console.log(JSON.stringify(res))
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

export function ProductSearch({ getSearchfacility, clear, label }) {
  const productServ = client.service('inventory');
  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [facilities, setFacilities] = useState([]);

  const [searchError, setSearchError] = useState(false);

  const [showPanel, setShowPanel] = useState(false);

  const [searchMessage, setSearchMessage] = useState('');

  const [simpa, setSimpa] = useState('');

  const [chosen, setChosen] = useState(false);

  const [count, setCount] = useState(0);
  const inputEl = useRef(null);
  const [val, setVal] = useState('');
  const [productModal, setProductModal] = useState(false);

  const handleRow = async (obj) => {
    setChosen(true);
    getSearchfacility(obj);

    setSimpa(obj.name);
    setShowPanel(false);
    setCount(2);
  };
  const handleBlur = async (e) => {};
  const handleSearch = async (value) => {
    setVal(value);
    if (value === '') {
      setShowPanel(false);
      return;
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
            storeId: state.employeeLocation.locationId,
            $limit: 10,
            $sort: {
              createdAt: -1,
            },
          },
        })
        .then((res) => {
          console.log('Product, ', res.data);
          setFacilities(res.data);
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

  // const handleSearch = async (value) => {
  //   setVal(value);
  //   if (value === "") {
  //     setShowPanel(false);
  //     return;
  //   }
  //   const field = "name";

  //   if (value.length >= 3) {
  //     productServ
  //       .find({
  //         query: {
  //           "productitems.name": {
  //             $regex: value,
  //             $options: "i",
  //           },
  //           $limit: 10,
  //           $sort: {
  //             createdAt: -1,
  //           },
  //         },
  //       })
  //       .then((res) => {
  //         console.log("Product, ", res.data);
  //         setFacilities(res.data);
  //         setSearchMessage("Product fetched successfully");
  //         setShowPanel(true);
  //         if (res.data.length > 0) {
  //           setCostprice(res.data[0].productitems[0].costprice);
  //           setSellingprice(res.data[0].productitems[0].sellingprice);
  //         }
  //       })
  //       .catch((err) => {
  //         toast({
  //           message: "Error searching for products " + err,
  //           type: "is-danger",
  //           dismissible: true,
  //           pauseOnHover: true,
  //         });
  //       });
  //   } else {
  //     setShowPanel(false);
  //     setFacilities([]);
  //   }
  // };

  const handleAddproduct = () => {
    setProductModal(true);
  };
  const handlecloseModal = () => {
    setProductModal(false);
    handleSearch(val);
  };
  useEffect(() => {
    if (clear) {
      setSimpa('');
    }
    return () => {};
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
              {option.name} - {option.category}
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
      {/*  <ModalBox
        open={productModal}
        onClose={handlecloseModal}
        header="Create New Product"
      >
        <ProductCreate />
      </ModalBox> */}
    </div>
  );
}
