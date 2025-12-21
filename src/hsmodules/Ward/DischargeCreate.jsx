/* eslint-disable */
import React, { useState, useContext, useEffect, useRef } from 'react';
import client from '../../feathers';

//import {useNavigate} from 'react-router-dom'
import { UserContext, ObjectContext } from '../../context';
import { toast } from 'react-toastify';
//import {ProductCreate} from './Products'
import Encounter from '../Documentation/Documentation';
// import ServiceSearch from '../helpers/ServiceSearch';
// var random = require('random-string-generator');
 
import ModalBox from '../../components/modal';
import { MdCancel } from 'react-icons/md';
import { Box, Grid } from '@mui/material';
import ModalHeader from '../Appointment/ui-components/Heading/modalHeader';
import Button from './ui-components/buttons/Button';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import Input from '../../components/inputs/basic/Input';
const searchfacility = {};

export default function DischargeCreate() {
  // const { register, handleSubmit,setValue} = useForm(); //, watch, errors, reset
  //const [error, setError] =useState(false)
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
   

  const LocationServ = client.service('location');
  const OrderServ = client.service('order');
  const ClientServ = client.service('clinicaldocument');
 // const AdmissionServ = client.service('admission');
  //const navigate=useNavigate()
  const { user } = useContext(UserContext); //,setUser
   
  const [currentUser, setCurrentUser] = useState();
  const [type, setType] = useState('Bill');
  const [documentNo, setDocumentNo] = useState('');
  const [totalamount, setTotalamount] = useState(0);
  const [qamount, setQAmount] = useState(null);
  const [productId, setProductId] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [inventoryId, setInventoryId] = useState('');
  const [baseunit, setBaseunit] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sellingprice, setSellingPrice] = useState('');
  const [costprice, setCostprice] = useState(0);
  const [invquantity, setInvQuantity] = useState('');
  const [calcamount, setCalcAmount] = useState(0);
  const [productItem, setProductItem] = useState([]);
  const [billingId, setBilllingId] = useState('');
  const [changeAmount, setChangeAmount] = useState(true);
  const [paymentmode, setPaymentMode] = useState('');
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [billMode, setBillMode] = useState('');
  const [productModal, setProductModal] = useState(false);
  const [obj, setObj] = useState('');
  const [objService, setObjService] = useState('');
  const [patient, setPatient] = useState('');
  const [contracts, setContracts] = useState('');
  const [category, setCategory] = useState('');
  const [chosenBed, setChosenBed] = useState();
  const [bedObject, setBedObject] = useState();

  const { state, setState } = useContext(ObjectContext);
  const inputEl = useRef(0);
  let calcamount1;
  let hidestatus;

  let medication = state.DischargeModule.selectedDischarge;
  /*  let physicalbeds=state.WardModule.selectedWard?.sublocations
   console.log(medication) */

  const showDocumentation = async (value) => {
    setProductModal(true);
  };
  const handlecloseModal = () => {
    setProductModal(false);
    // handleSearch(val)
  };

  const handleChangeMode = async (value) => {
    // console.log(value)
    await setPaymentMode(value);
    // console.log(paymentOptions)
    let billm = paymentOptions.filter((el) => el.name === value);
    await setBillMode(billm[0]);
    //console.log(billm)
    // at startup
    // check payment mode options from patient financial info
    // load that to select options
    // default to HMO-->company-->family-->cash
    //when chosen
    //append payment mode to order
    //check service contract for pricing info
    // calculate pricing
    // pricing
  };

  const [productEntry, setProductEntry] = useState({
    productitems: [],
    date,
    documentNo,
    type,
    totalamount,
    source,
  });

  const productItemI = {
    productId,
    name,
    quantity,
    sellingprice,
    amount: calcamount, //||qamount
    baseunit,
    costprice,
    category: 'Prescription', //category==="Inventory"?"Prescription":category,
    billingId,
    billMode,
  };

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
          toast.info(
            'Please NHIS does not have cover/price for this service. Either set service price for NHIS, try another service or bill using cash'
          );
          await setSellingPrice(0);
        }
      } else {
        let contract = contracts.filter(
          (el) => el.source_org === billMode.detail.organizationId
        );
        if (contract.length) {
          // console.log(contract[0].price)
          await setSellingPrice(contract[0].price);
        } else {
          toast.info(
            'Please HMO does not have cover/price for this service. Either set service price for HMO , try another drug, bill using cash or adjust amount '
          );
          await setSellingPrice(0);
        }
      }
    }
    if (billMode.type === 'Company Cover') {
      //paymentmode
      let contract = contracts.filter(
        (el) => el.source_org === billMode.detail.organizationId
      );
      if (contract.length) {
        // console.log(contract[0].price)
        await setSellingPrice(contract[0].price);
      } else {
        toast.info(
          'Please company does not have cover/price for this service. Either set service price for Company or try another drug or bill using cash'
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
        toast.info(
          'Please there is no cover/price for this service. Either set service price or try another service. Setting price at zero '
        );
        await setSellingPrice(0);
      }
    }
  };
  // consider batchformat{batchno,expirydate,qtty,baseunit}
  //consider baseunoit conversions
 
  useEffect(() => {}, [obj]);

  useEffect(() => {
    setCurrentUser(user);
    //console.log(currentUser)
    return () => {};
  }, [user]);

  const handleQtty = async (e) => {
    /*  if (invquantity<e.target.value){
             toast({
                 message: 'You can not sell more quantity than exist in inventory ' ,
                 type: 'is-danger',
                 dismissible: true,
                 pauseOnHover: true,
               })
             return
         } */
    setQuantity(e.target.value);
    if (e.target.vlue === '') {
      setQuantity(1);
    }
    /*  calcamount1=quantity*sellingprice
         await setCalcAmount(calcamount1) */
    //console.log(calcamount)
  };

  useEffect(() => {
    setProductEntry({
      date,
      documentNo,
      type,
      totalamount,
      source,
    });
    setCalcAmount(quantity * sellingprice);
    return () => {};
  }, [date]);

  

  const handleDischarge = async (e) => {
    //handle admit

    //alert("something")
    //update order
    //create admission resource
    //?create bill?
   
    const note = {
      Note:
        'Patient was discharged from ' +
        medication.client.ward +
        ' ' +
        state.employeeLocation.locationType +
        ', bed:' +
        medication.client.bed +
        ' at ' +
        Date().toLocaleString(),
      Instruction: medication.instruction,
    };

    //console.log(note)
    let document = {};
    // data.createdby=user._id
    // console.log(data);
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    document.documentdetail = note;
   // console.log(document.documentdetail);
    document.documentname = 'Discharge'; //state.DocumentClassModule.selectedDocumentClass.name
    // document.documentClassId=state.DocumentClassModule.selectedDocumentClass._id
    document.location =
      state.employeeLocation.locationName +
      ' ' +
      state.employeeLocation.locationType;
    document.locationId = state.employeeLocation.locationId;
    document.client = medication.client._id;
    document.clientname =
      medication.client.firstname +
      ' ' +
      medication.client.middlename +
      ' ' +
      medication.client.lastname;
    document.clientobj = medication.client;
    document.createdBy = user._id;
    document.createdByname = user.firstname + ' ' + user.lastname;
    document.status = 'completed';

    const admission = {
      //  encounter_id:{type: Schema.Types.ObjectId,},
      //  hospitalization_id:{type: Schema.Types.ObjectId,},
      //order
      order: medication,
      order_id: medication._id,

      //location: ward/bed
      ward_name: state.WardModule.selectedWard.typeName,
      ward_id: state.WardModule.selectedWard._id,
      bed: medication.client.bed,
      bed_id: medication.client.bed_id,
      facility: user.currentEmployee.facilityDetail._id,
      //billing:perpertuity
      /* bill:{type:Schema.Types.Mixed},
                bill_id:{type: Schema.Types.ObjectId,}, */
      //status
      status: 'free',
      //client
      client: medication.client,
      client_id: medication.clientId,
      //careteam
      admissionhx: [],
      careteam: [],
      //start_time: new Date(),
      end_time: new Date(),
      createdby: user._id,
    };
    document.admission = admission;
   // console.log(document);
    e.preventDefault();
    setMessage('');
    //  setError(false)
    setSuccess(false);
    // data.createdby=user._id
    // console.log(data);
    /*   if (user.currentEmployee){
                 data.facility=user.currentEmployee.facilityDetail._id  // or from facility dropdown
                  } */
    // data.locationType="Front Desk"
    ClientServ.create(document)
      .then(async (res) => {
        //console.log(JSON.stringify(res))
        // e.target.reset();
        /*  setMessage("Created Clinic successfully") */
        updateBedStatus(medication.client.bed_id)
        setSuccess(true);
        toast.success('Discharge successfull');
        setSuccess(false);
        setChosenBed();
        setBedObject();
        const newProductEntryModule = {
          selectedDischarge: {},
          show: '',
        };
        await setState((prevstate) => ({
          ...prevstate,
          DischargeModule: newProductEntryModule,
        }));
        medication = '';
      })
      .catch((err) => {
        toast.error('Error creating Discharge ' + err);
      });
  };


  const  updateBedStatus =async(id)=>{

    
    let chosenId=id
 let otherbeds=    state.WardModule.selectedWard?.sublocations.filter(sub=>sub._id !==chosenId)
 let currentbedArray=state.WardModule.selectedWard?.sublocations.filter(sub=>sub._id ===chosenId)
 let currentbed=currentbedArray[0]
 //console.log("otherbed",otherbeds)
currentbed.availability=true
  //console.log(currentbed)
 otherbeds.push(currentbed)
 let sWard= state.WardModule.selectedWard
 //console.log("1",sWard)
 sWard.sublocations=otherbeds

// console.log("2",sWard)
setState(prevstate => ({
  ...prevstate,
  WardModule: {
    ...prevstate.WardModule,
    selectedWard:{
      ...prevstate.WardModule.selectedWard,
      sublocations: sWard.sublocations
    },
  },
}));
await LocationServ.patch(state.WardModule.selectedWard._id,state.WardModule.selectedWard)


  }
 
  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    //setError(false)
    setSuccess(false);
    await setProductEntry({
      date,
      documentNo,
      type,
      totalamount,
      source,
    });
    productEntry.productitems = productItem;
    productEntry.createdby = user._id;
    productEntry.transactioncategory = 'debit';
    if (user.currentEmployee) {
      productEntry.facility = user.currentEmployee.facilityDetail._id; // or from facility dropdown
    } else {
      toast.warning('You can not remove inventory from any organization');
      return;
    }

    if (state.StoreModule.selectedStore._id) {
      productEntry.storeId = state.StoreModule.selectedStore._id;
    } else {
      toast.info('You need to select a store before removing inventory');
      return;
    }
  };

 
 

  useEffect(() => {
    setPatient(medication.client);
    const oldname = medication.clientname;
    // console.log("oldname",oldname)
    setSource(medication.clientname);

    const newname = source;
    // console.log("newname",newname)
    if (oldname !== newname) {
      //newclient

      //recalculate bedspace: subtract occupied from physical space

      setProductItem([]);
      setTotalamount(0);
    }

    return () => {};
  }, [medication]);

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
                'Family Cover'
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
                'Company: ' + pay.organizationName + '(' + pay.plan + ')'
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
                'HMO: ' + pay.organizationName + '(' + pay.plan + ')'
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
  }, [source]); //source

 

  useEffect(() => {
    //get the admission info for the discharge order

    const ward = state.WardModule.selectedWard;
    return () => {};
  }, []);

  useEffect(() => {
    // console.log("success", success)
    if (success) {
      setSuccess(false);
    }
  }, [success]);

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

  useEffect(() => {
    //update selling price
    if (!!billMode && !!contracts) {
      // console.log(contracts)
      checkPrice(contracts, billMode);
    }

    return () => {};
  }, [obj]);

  useEffect(() => {
    calcamount1 = quantity * sellingprice;
    setCalcAmount(calcamount1);
    // console.log(calcamount)
    setChangeAmount(true);
    return () => {};
  }, [quantity, sellingprice]);

  useEffect(() => {
    if (!!billMode && !!contracts) {
      checkPrice(contracts, billMode);
    }

    return () => {};
  }, [billMode]);

  
  return (
    <>
      <div style={{ padding: '1rem' }}>
        <form onSubmit={onSubmit}>
          <Grid
            container
            spacing={2}
            style={{
              borderBottom: '1px solid #ccc',
              paddingBottom: '1rem',
            }}
          >
            <Grid item xs={12} sm={6}>
              <ModalHeader text={'Discharge Patient'} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <GlobalCustomButton
                text="Documentation"
                onClick={showDocumentation}
                customStyles={{
                  float: 'right',
                  marginLeft: 'auto',
                }}
                color="success"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} my={1}>
            {/* <Grid item xs={12} sm={8}>
              <Input
                name="client"
                type="text"
                onChange={(e) => setSource(e.target.value)}
                placeholder="Client"
                defaultValue={source}
              />
            </Grid> */}
            <Grid item xs={12} sm={4}>
              <select
                name="paymentmode"
                value={paymentmode}
                onChange={(e) => handleChangeMode(e.target.value)}
                className="selectadd"
                style={{
                  border: '1px solid #b6b6b6',
                  height: '38px',
                  borderRadius: '4px',
                  width: '100%',
                }}
              >
                <option value="">Billing Mode </option>
                {paymentOptions.map((option, i) => (
                  <option key={i} value={option.details}>
                    {' '}
                    {option.name}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <p>Discharge Order:</p>
              <Input
                name="order"
                type="text"
                onChange={(e) => handleQtty(e)}
                placeholder="Quantity"
                defaultValue={medication.order}
                disabled
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} my={1}>
            <Grid item xs={12} sm={12}>
              <label className="label" htmlFor="appointment_reason">
                Instructions:
              </label>
              <textarea
                className="input is-small"
                name="appointment_reason"
                value={medication?.instruction}
                type="text"
                placeholder="Appointment Reason"
                rows="3"
                cols="50"
                style={{
                  border: '1px solid #b6b6b6',
                  borderRadius: '4px',
                  color: ' #979DAC',
                  width: '100%',
                }}
              >
                {' '}
              </textarea>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Input
                name="Current Bed:"
                type="text"
                defaultValue={medication?.client?.bed}
                disabled
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={12}>
              <GlobalCustomButton
                text="Discharge"
                onClick={handleDischarge}
                color="success"
              />
            </Grid>
          </Grid>
        </form>
      </div>
      {productModal && (
        <ModalBox
          open
          header=""
          onClose={() => {
            setProductModal(false);
          }}
        >
          <MdCancel
            onClick={() => {
              setProductModal(false);
            }}
            style={{
              fontSize: '2rem',
              color: 'crimson',
              cursor: 'pointer',
              float: 'right',
            }}
          />
          <Encounter standalone={true} />
        </ModalBox>
      )}
    </>
  );
}


