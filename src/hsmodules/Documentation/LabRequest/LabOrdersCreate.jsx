/* eslint-disable */
import React, { useState, useContext, useEffect } from 'react';
import client from '../../../feathers';
import { UserContext, ObjectContext } from '../../../context';
import FacilityPopup from '../../helpers/FacilityPopup';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';
import ModalBox from '../../../components/modal';
import CustomTable from '../../../components/customtable';
import Input from '../../../components/inputs/basic/Input';
import { FormsHeaderText } from '../../../components/texts';
import GlobalCustomButton from '../../../components/buttons/CustomButton';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ServiceSearch from '../../helpers/ServiceSearch';
import { generateRandomString } from '../../helpers/generateString';
import { AllPureLifeSearch } from '../../helpers/PureLifeAllSearch';

export default function LabOrdersCreate() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const { user } = useContext(UserContext); //,setUser

  const [currentUser, setCurrentUser] = useState();
  const [type, setType] = useState('Purchase Invoice');
  const [documentNo, setDocumentNo] = useState('');
  const [totalamount, setTotalamount] = useState('');
  const [productId, setProductId] = useState('');
  const OrderServ = client.service('order');
  const [source, setSource] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [destinationModal, setDestinationModal] = useState(false);
  const [test, setTest] = useState();
  const [testObj, setTestObj] = useState();
  const [instruction, setInstruction] = useState();
  const [productItem, setProductItem] = useState([]);
  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const BillCreateServ = client.service('createbilldirect');
  const [hidePanel, setHidePanel] = useState(false);
  const [billing, setBilling] = useState(true);
  const [billMode, setBillMode] = useState('');
  const [patient, setPatient] = useState('');
  const [paymentOptions, setPaymentOptions] = useState('');
  const [paymentmode, setPaymentMode] = useState('Cash');
  const [contracts, setContracts] = useState([]);
  const [billingId, setBilllingId] = useState('');
  const [category, setCategory] = useState('');
  const [baseunit, setBaseunit] = useState(0);
  const [inventoryId, setInventoryId] = useState('');
  const [sellingprice, setSellingPrice] = useState(0);
  const [branch, setBranch] = useState('');
  const isPureLife = user.currentEmployee?.facilityDetail?.hasExternalLink
  // const [isPureLifeSearch, setIsPureLifeSearch] = useState("");
  const appointmentId = state.AppointmentModule.selectedAllAppointment?._id || null;

  const createObj = (pay, name, cover, type) => {
    let details = {};
    details = { ...pay };
    details.type = type;

    return {
      name,
      value: cover,
      detail: details,
      type,
    };
  };

  const findbranch = async () => {
    try {
      const resp = await locationServ.get(state.employeeLocation.locationId);
      setBranch(resp.branch);
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    findbranch();
    return () => {};
  }, []);

  const checkPrice = async (contracts, billMode) => {
    if (billMode.type === 'HMO Cover') {
      //paymentmode
      if (billMode.detail.plan === 'NHIS') {
        //find contract for NHIS
        let contract = contracts.filter((el) => el.source_org_name === 'NHIS');
        if (contract.length) {
          // console.log(contract[0].price)
          await setSellingPrice(contract[0].price);
        } else {
          toast.error(
            'Please NHIS does not have cover/price for this service. Either set service price for NHIS, try another service or bill using cash',
          );
          await setSellingPrice(0);
        }
      } else {
        let contract = contracts.filter(
          (el) => el.source_org === billMode.detail.organizationId,
        );
        if (contract.length) {
          // console.log(contract[0].price)
          await setSellingPrice(contract[0].price);
        } else {
          toast.error(
            'Please HMO does not have cover/price for this service. Either set service price for HMO , try another drug, bill using cash or adjust amount ',
          );
          await setSellingPrice(0);
        }
      }
    }
    if (billMode.type === 'Company Cover') {
      //paymentmode
      let contract = contracts.filter(
        (el) => el.source_org === billMode.detail.organizationId,
      );
      if (contract.length) {
        // console.log(contract[0].price)
        await setSellingPrice(contract[0].price);
      } else {
        toast.error(
          'Please company does not have cover/price for this service. Either set service price for Company or try another drug or bill using cash',
        );
        await setSellingPrice(0);
      }
    }
    if (billMode.type === 'Cash' || billMode.type === 'Family Cover') {
      //paymentmode
      let contract = contracts.filter((el) => el.source_org === el.dest_org);
      if (contract.length) {
        // console.log(contract[0].price)
        await setSellingPrice(contract[0].price);
      } else {
        toast.error(
          'Please there is no cover/price for this service. Either set service price or try another service. Setting price at zero ',
        );
        await setSellingPrice(0);
      }
    }
  };

  useEffect(() => {
    //update selling price
    if (!!billMode && !!contracts && !billing) {
      // console.log(contracts)
      checkPrice(contracts, billMode);
    }

    return () => {};
  }, [testObj]);

  useEffect(() => {
    const client = state.ClientModule.selectedClient;
    // console.log(client);
    setPatient(client);
    const oldname = client.clientname;
    // console.log("oldname",oldname)
    setSource(client.clientname);

    const newname = source;
    // console.log("newname",newname)
    if (oldname !== newname) {
      //newdispense

      setProductItem([]);
      setTotalamount(0);
    }

    return () => {};
  }, [state.ClientModule]);

  useEffect(() => {
    //setPatient(medication.client)
    setProductItem([]);
    setTotalamount(0);
    const paymentoptions = [];
    // const info = client.paymentinfo
    let billme;
    let obj;
    patient &&
      patient.paymentinfo.forEach((pay, i) => {
        if (pay.active) {
          switch (pay.paymentmode) {
            case 'Cash':
              // code block
              obj = createObj(pay, 'Cash', 'Cash', 'Cash');

              paymentoptions.push(obj);
              setPaymentMode('Cash');
              billme = obj;
              // console.log("billme",billme)
              break;
            case 'Family':
              // code block
              obj = createObj(
                pay,
                'Family Cover',
                'familyCover',
                'Family Cover',
              );
              paymentoptions.push(obj);
              setPaymentMode('Family Cover');
              billme = obj;
              // console.log("billme",billme)
              break;
            case 'Company':
              // code block
              let name =
                'Company: ' + pay.organizationName + '(' + pay.plan + ')';

              obj = createObj(pay, name, 'CompanyCover', 'Company Cover');
              paymentoptions.push(obj);
              setPaymentMode(
                'Company: ' + pay.organizationName + '(' + pay.plan + ')',
              );
              billme = obj;
              // console.log("billme",billme)
              break;
            case 'HMO':
              // code block
              let sname = 'HMO: ' + pay.organizationName + '(' + pay.plan + ')';

              obj = createObj(pay, sname, 'HMOCover', 'HMO Cover');
              paymentoptions.push(obj);
              setPaymentMode(
                'HMO: ' + pay.organizationName + '(' + pay.plan + ')',
              );
              billme = obj;
              //  console.log("billme",billme)
              break;
            default:
            // code block
          }
        }
      });

    setPaymentOptions(paymentoptions);
    setBillMode(billme);
    //console.log(paymentoptions)
    // console.log(billMode)
    return () => {};
  }, [source]);

  const handlecloseModal = () => {
    setDestinationModal(false);
    //handleSearch(val)
  };
  const productItemI = {
    productId,
    test,
    name: test,
    destination,
    instruction,
    destinationId,
    testObj,
    quantity: 1,
    sellingprice: isPureLife  ? contracts?.lst_price :contracts?.length > 0 ? contracts[0].price : 0,
    amount: isPureLife  ? contracts?.lst_price : contracts?.length > 0 ? contracts[0].price * 1 : 0,
    category: 'Laboratory',
    billingId,
    billMode,
    baseunit: baseunit,
  };
 

  const getServiceSearch = (service) => {
   // console.log(service, 'service');
    if (!service) {
      setInstruction('');
      setTest('');
    }
    setInstruction(service?.instruction);
    setTest(service?.name);
    setContracts(isPureLife ? service : service?.contracts );
    setProductId(isPureLife ? null : service?.productId);
    setCategory(service?.category); 
    setBaseunit(service?.baseunit);
    setInventoryId(service?.inventoryId);
    setBilllingId(isPureLife ? null : service?._id);
    setTestObj(service);
  };

  useEffect(() => {
    setCurrentUser(user);

    return () => {};
  }, [user]);

  useEffect(() => {
    setDestination(state.DestinationModule.selectedDestination.facilityName);
    setDestinationId(state.DestinationModule.selectedDestination._id);
    return () => {};
  }, [state.DestinationModule.selectedDestination]);

  const handleChangeType = async (e) => {
    await setType(e.target.value);
  };

  const handleClickProd = async () => {
    //console.log(productItemI);
     setSuccess(false);
    if (!(productItemI.test && productItemI.test.length > 0)) {
      toast.error('Test can not be empty ');
      return;
    }
     setProductItem((prevProd) => prevProd.concat(productItemI));
    setHidePanel(false);
    setName('');
    setTest('');
    setInstruction('');
    setDestination(user.currentEmployee.facilityDetail.facilityName);
    setDestinationId(user.currentEmployee.facilityDetail._id);
    // setDestination("")
     setSuccess(true);
    
  };

  const handleChangeDestination = () => {
    setDestinationModal(true);
  };

  const handleBypassBilling = async (orders, document) => {
    const serviceList = [];
    // console.log(document.clientobj);

    const clientObj = {
      ...document.clientobj,
      phone: document.clientobj.phone,
    };
    // console.log(clientObj, "clientobj");
    orders.forEach(async (element) => {
      let orderinfo = {
        //for reach document
        documentationId: '', //tbf
        order_category: element.category, //category
        order: element.name, //name
        instruction: '',
        destination_name: document.facilityname, //facilityname
        destination: document.facility, //facility id
        order_status: 'Billed',
        payer: element.billMode.organizationName,
        paymentmode: element.billMode.paymentmode,

        requestingdoctor_Id: document.createdBy,
        requestingdoctor_Name: document.createdByname,
        requestingdoctor_locationid: document.locationId,
        requestingdoctor_locationName: document.location,
        requestingdoctor_facilityId: document.facility,
        requestingdoctor_facilityname: document.facilityname,
        clientId: document.client,
        clientname: document.clientname,
        
        client: clientObj,

        order_action: [],
        medication_action: [],
        treatment_action: [],
      };

      let billInfo = {
        orderInfo: {
          orderId: '', //tbf
          orderObj: orderinfo,
        },
        serviceInfo: {
          price: element.sellingprice,
          quantity: element.quantity,
          productId: element.productId,
          name: element.name,
          baseunit: element.baseunit,
          amount: element.amount,
          billingId: element.billingId,
          billingContract: element.billingContract,
          createdby: user._id,
        },
        paymentInfo: {
          amountDue: element.amount,
          paidup: 0,
          balance: element.amount,
          paymentDetails: [],
        },
        participantInfo: {
          billingFacility: orderinfo.destination,
          billingFacilityName: orderinfo.destination_name,
          locationId: document.locationId,
          clientId: orderinfo.clientId,
          branch: branch,
          client: orderinfo.client,
          paymentmode: element.billMode,
        },
        createdBy: user._id,
        billing_status: 'Unpaid',
      };
      let items = {
        orderinfo,
        billInfo,
      };

      serviceList.push(items);
    });
     document.directBilling=true

    await BillCreateServ.create({
      document,
      serviceList,
    })
      .then((res) => {
        setSuccess(true);
        toast.success('Bill generated successfully');
        setSuccess(false);
        setProductItem([]);
        // sentCalcAmount(0);
        const today = new Date().toLocaleString();
        // console.log(today)
        setDate(today);
        const invoiceNo = generateRandomString(6);
        setDocumentNo(invoiceNo);
        // resetform();
        hideActionLoader();
        // setConfirmationDialog(false);
        // console.log("billing info",res)
      })
      .catch((err) => {
        // console.log(err);
        toast.error(`Error creating Billed Orders" + ${err}`);
        hideActionLoader();
        // setConfirmationDialog(false);
      });
  };

  const onSubmit = () => {
    //data,e
    // e.preventDefault();
    setMessage('');
    setError(false);
    setSuccess(false);
    try {
      //write document
      let document = {};
      showActionLoader();

      if (user.currentEmployee) {
        document.facility = user.currentEmployee.facilityDetail._id;
        document.facilityname =
          user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
      }
      document.documentdetail = productItem;
      document.appointment_id = appointmentId ;
      document.documentname = 'Lab Orders'; //state.DocumentClassModule.selectedDocumentClass.name
      // document.documentClassId=state.DocumentClassModule.selectedDocumentClass._id
      document.location =
        state.employeeLocation.locationName +
        ' ' +
        state.employeeLocation.locationType;
      document.locationId = state.employeeLocation.locationId;
      document.client = state.ClientModule.selectedClient._id;
      document.clientname =
        state.ClientModule.selectedClient.firstname +
        ' ' +  state.ClientModule.selectedClient.lastname;
      document.clientobj = state.ClientModule.selectedClient;
      document.createdBy = user._id;
      document.createdByname = user.firstname + ' ' + user.lastname;
      document.status = 'completed';

      //return console.log(document);
      // ClientServ.create(document)
      //   .then(async (res) => {
      if (billing) {
        handleBypassBilling(productItem, document);
      }

      setSuccess(true);
      hideActionLoader();
      toast.success('Laboratory order created successfully');
      setDestination(user.currentEmployee.facilityDetail.facilityName);
      setDestinationId(user.currentEmployee.facilityDetail._id);
      setSuccess(false);
      setProductItem([]);

      //console.log(res);
    } catch (err) {
      hideActionLoader();
      //console.log(err);
      toast(`Error creating LabOrders ${err}`);
    }
  };

  useEffect(() => {
    setDestination(user.currentEmployee.facilityDetail.facilityName);
    setDestinationId(user.currentEmployee.facilityDetail._id);
    return () => {};
  }, []);

  const handleRemoveProd = (prod, index) => {
    setProductItem((prev) => prev.filter((item, i) => i !== index));
  };

  const productItemSchema = [
    {
      name: 'S/N',
      key: '_id',
      selector: (row) => row.sn,
      description: 'Enter',
      sortable: true,
      inputType: 'HIDDEN',
      width: '50px',
    },
    {
      name: 'Test',
      key: 'test',
      description: 'Enter Test name',
      selector: (row) => row.test,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },
    {
      name: 'Amount',
      key: 'test',
      description: 'Enter Test name',
      selector: (row) => row.amount,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Destination',
      key: 'destination',
      description: 'Enter Destination',
      selector: (row) => row.destination,
      sortable: true,
      required: true,
      inputType: 'TEXT',
    },

    {
      name: 'Act',
      key: 'destination',
      description: 'Enter Destination',
      selector: (row, i) => (
        <DeleteOutlineIcon
          sx={{ color: 'red' }}
          fontSize="small"
          onClick={() => handleRemoveProd(row, i)}
        />
      ),
      sortable: true,
      required: true,
      inputType: 'TEXT',
      width: '60px',
    },
  ];

  const handleBillingChange = (event) => {
    setBilling(event.target.checked);
  };

  return (
    <>
      <Box>
        <div className="card card-overflow">
          <Box
            container
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            mb={2}
          >
            <FormsHeaderText text="Create Laboratory order" />

            
          </Box>

          <Box
            sx={{ display: 'flex', flexDirection: 'column' }}
            gap={1.5}
            mb={1.5}
          >
            {/* <Box>
              <FormControlLabel
                required
                control={
                  <Checkbox
                    checked={billing}
                    onChange={handleBillingChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                    disabled
                  />
                }
                label={`Auto Generate Bill`}
              />
            </Box>  */}
            

            {isPureLife ? (
              <Box>
                <AllPureLifeSearch
                  getSearchfacility={getServiceSearch}
                  clear={success}
                  searchCategory="18"
                  label="Search for Test"
                />
              </Box>
            ) : (
              billing && (
                <Box>
                  <ServiceSearch
                    getSearchfacility={getServiceSearch}
                    clear={success}
                    mode={billMode}
                  />
                </Box>
              )
            )}
            <Box sm={6} sx={{ display: 'flex' }}>
            <GlobalCustomButton
            sx={{ ml:'auto' ,mt:0.5 }}
              onClick={() => {
                handleClickProd();
                () => setHidePanel(true);
              }}
            >
              <AddCircleOutline fontSize="small" sx={{ marginRight: '5px' }} />
              Add
            </GlobalCustomButton>
            </Box>
            <Box sm={6}
              container
              sx={{
                display: 'flex',
                width: '50%',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt:-5
              }}
            >
              <Box
                item
                sx={{
                  width: 'calc(100% - 100px)',
                }}
              >
                <Input
                  value={
                    destination ===
                    user.currentEmployee.facilityDetail.facilityName
                      ? 'In-house'
                      : destination
                  }
                  disabled={true}
                  type="text"
                  onChange={(e) => setDestination(e.target.value)}
                  label="Destination Laboratory"
                  name="destination"
                />
              </Box>

              <Box item>
                <GlobalCustomButton onClick={handleChangeDestination}>
                  Change
                </GlobalCustomButton>
              </Box>
            </Box>
          </Box>

          <Box>
            {productItem.length > 0 && (
              <Box mb={1.5}>
                <CustomTable
                  title={'Lab Orders'}
                  columns={productItemSchema}
                  data={productItem}
                  pointerOnHover
                  highlightOnHover
                  striped
                  //onRowClicked={handleRow}
                  progressPending={false}
                  //selectableRowsComponent={Checkbox}
                />
              </Box>
            )}

            {productItem.length > 0 && (
              <Box
                container
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <GlobalCustomButton onClick={onSubmit}>
                  Complete
                </GlobalCustomButton>
              </Box>
            )}
          </Box>
        </div>

        <ModalBox
          open={destinationModal}
          onClose={handlecloseModal}
          header="Choose Destination"
        >
          <FacilityPopup
            facilityType="Laboratory"
            closeModal={handlecloseModal}
          />
        </ModalBox>
      </Box>
    </>
  );
}
