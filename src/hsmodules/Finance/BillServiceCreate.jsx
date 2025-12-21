/* eslint-disable */
import React, { useState, useContext, useEffect, useRef } from "react";
import client from "../../feathers";
import { DebounceInput } from "react-debounce-input";
import { useForm } from "react-hook-form";
//import {useNavigate} from 'react-router-dom'
import { UserContext, ObjectContext } from "../../context";
import { toast } from "react-toastify";
// import { ProductCreate } from "./Products";
// import Encounter from "../Documentation/Documentation";
import { ClientSearch } from "../helpers/ClientSearch";
import ServiceSearch from "../helpers/ServiceSearch";
import Input from "../../components/inputs/basic/Input";
import { Box, Card, Collapse, Divider, Grid, Typography } from "@mui/material";
// import BasicDatePicker from "../../components/inputs/Date";
import CustomSelect from "../../components/inputs/basic/Select";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CustomTable from "../../components/customtable";
import { FormsHeaderText } from "../../components/texts";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import { generateRandomString } from "../helpers/generateString";
import { FamilyProfileSearch } from "../helpers/familyProfileSearch";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";

export default function BillServiceCreate() {
  // const { register, handleSubmit,setValue} = useForm(); //, watch, errors, reset
  //const [error, setError] =useState(false)
  const [success, setSuccess] = useState(false);
  const [success1, setSuccess1] = useState(false);
  const [message, setMessage] = useState([]);

  const [facility, setFacility] = useState();
  //const ProductEntryServ=client.service('productentry')
  const OrderServ = client.service("order");
  const BillCreateServ = client.service("createbilldirect");
  const locationServ = client.service("location");
  //const navigate=useNavigate()
  const { user } = useContext(UserContext); //,setUser

  const [currentUser, setCurrentUser] = useState();
  const [type, setType] = useState("Bill");
  const [documentNo, setDocumentNo] = useState("");
  const [totalamount, setTotalamount] = useState(0);
  const [qamount, setQAmount] = useState(null);
  const [productId, setProductId] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [inventoryId, setInventoryId] = useState("");
  const [baseunit, setBaseunit] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sellingprice, setSellingPrice] = useState("");
  const [costprice, setCostprice] = useState(0);
  const [invquantity, setInvQuantity] = useState("");
  const [calcamount, setCalcAmount] = useState(0);
  const [productItem, setProductItem] = useState([]);
  const [billingId, setBilllingId] = useState("");
  const [changeAmount, setChangeAmount] = useState(true);
  const [paymentmode, setPaymentMode] = useState("");
  const [category, setCategory] = useState("");
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [billMode, setBillMode] = useState("");
  const [obj, setObj] = useState("");
  const [productModal, setProductModal] = useState(false);
  const [patient, setPatient] = useState("");
  const [contracts, setContracts] = useState("");
  const [branch, setBranch] = useState("");
  const [familyProfile, setFamilyProfile] = useState(null);
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const { showActionLoader, state, hideActionLoader } =
    useContext(ObjectContext);
  // const inputEl = useRef(0);
  // let calcamount1;
  // let hidestatus;

  // let medication = state.medicationModule.selectedMedication;

  let getArt = user?.currentEmployee?.facilityDetail?.facilityModules || [];
  const includesArt = getArt.includes("Art");

  const handleChangeMode = async (value) => {
    setPaymentMode(value);
    const billm = paymentOptions.find((el) => el.name === value);
    setBillMode(billm || null);
  };

  const productItemI = {
    productId,
    name,
    quantity,
    sellingprice,
    amount: calcamount,
    baseunit,
    costprice,
    category: category === "Inventory" ? "Prescription" : category,
    billingId,
    billingContract: contracts,
    billMode,
  };

  const checkPrice = async (contracts, billMode) => {
    const findContract = (filter) => contracts.find(filter);
    const setPrice = async (contract) => {
      if (contract) {
        setSellingPrice(contract.price);
      } else {
        toast.error("No cover/price for this service. Setting price to zero.");
        setSellingPrice(0);
      }
    };

    switch (billMode.type) {
      case "HMO Cover":
        setPrice(findContract((el) => el.source_org === el.dest_org));
        break;
      case "Company Cover":
        setPrice(
          findContract((el) => el.source_org === billMode.detail.organizationId)
        );
        break;
      case "Cash":
      case "Family Cover":
        setPrice(findContract((el) => el.source_org === el.dest_org));
        break;
      default:
        toast.error("Invalid billing mode");
    }
  };

  const getSearchfacility = async (service) => {
    if (!service) {
      // Clear fields
      setProductId("");
      setName("");
      setBaseunit("");
      setInventoryId("");
      setSellingPrice(0);
      setInvQuantity("");
      setQAmount(null);
      setCostprice("");
      setContracts("");
      setCategory("");
      setInventoryId("");
      setBilllingId("");
      return;
    }

    setContracts(service.contracts);
    setProductId(service.productId);
    setName(service.name);
    setCategory(service.category);
    setBaseunit(service.baseunit);
    setInventoryId(service.inventoryId);
    setBilllingId(service._id);
    setObj(service);
  };

  const getSearchfacility1 = async (person) => {
    if (!person) {
      setPatient("");
      setSource("");
      return;
    }
    setPatient(person);
    setSource(`${person.firstname} ${person.lastname}`);
  };

  const getSearchFamilyProfile = (profile) => {
    const newProfile = profile;
    newProfile.phone = profile.contactPhoneNumber;
    setFamilyProfile(newProfile);
  };

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleUpdateTotal = async () => {
    setTotalamount((prevtotal) => Number(prevtotal) + Number(calcamount));
  };

  const handleClickProd = async () => {
    setSuccess(false);
    setProductItem((prevProd) => [...prevProd, productItemI]);
    handleUpdateTotal();

    setName("");
    setBaseunit("");
    setQuantity(1);
    setInventoryId("");
    setSellingPrice(0);
    setInvQuantity("");
    setCalcAmount(0);
    setSuccess(true);
    getSearchfacility(false);
    setObj("");
    setChangeAmount(true);
    setContracts("");
  };

  const handleQtty = async (e) => {
    const newQuantity = e.target.value === "" ? 1 : Number(e.target.value);
    setQuantity(newQuantity);
  };

  const handleChangeAmount = () => {
    setChangeAmount((rev) => !rev);
  };

  const createObj = (pay, name, cover, type) => ({
    name,
    value: cover,
    detail: { ...pay, type },
    type,
  });

  useEffect(() => {
    if (billMode && contracts) {
      checkPrice(contracts, billMode);
    }
  }, [obj, billMode, contracts]);

  useEffect(() => {
    const initializePaymentOptions = () => {
      setProductItem([]);
      setTotalamount(0);
      const paymentoptions = [];
      let billme;

      const currentProfile = includesArt ? familyProfile : patient;

      if (currentProfile?.paymentinfo) {
        currentProfile?.paymentinfo?.forEach((pay) => {
          if (pay.active) {
            let obj;
            switch (pay.paymentmode) {
              case "Cash":
                obj = createObj(pay, "Cash", "Cash", "Cash");
                break;
              case "Family":
                obj = createObj(
                  pay,
                  "Family Cover",
                  "familyCover",
                  "Family Cover"
                );
                break;
              case "Company":
                obj = createObj(
                  pay,
                  `Company: ${pay.organizationName} (${pay.plan})`,
                  "CompanyCover",
                  "Company Cover"
                );
                break;
              case "HMO":
                obj = createObj(
                  pay,
                  `HMO: ${pay.organizationName} (${pay.plan})`,
                  "HMOCover",
                  "HMO Cover"
                );
                break;
              default:
                return;
            }
            paymentoptions.push(obj);
            setPaymentMode(obj.name);
            billme = obj;
          }
        });

        setPaymentOptions(paymentoptions);
        setBillMode(billme);
      }
    };

    initializePaymentOptions();
  }, [source, familyProfile, patient, includesArt]);

  const findbranch = async () => {
    try {
      const resp = await locationServ.get(state.employeeLocation.locationId);
      setBranch(resp.branch);
    } catch (err) {
      return err;
      // console.error("Error finding branch:", err);
    }
  };

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        await findbranch();
        const today = new Date().toLocaleString();
        setDate(today);
        const invoiceNo = generateRandomString(6);
        setDocumentNo(invoiceNo);
      } catch (error) {
        console.error("Error initializing component:", error);
      }
    };

    initializeComponent();

    return () => {
      // const today = new Date().toLocaleString();
      setDate("");
      // const invoiceNo = generateRandomString(6);
      setDocumentNo("");
      setCalcAmount(0);
    };
  }, []);

  useEffect(() => {
    const calcamount1 = quantity * sellingprice;
    setCalcAmount(calcamount1);
    setChangeAmount(true);
  }, [quantity, sellingprice]);

  useEffect(() => {
    if (success) setSuccess(false);
  }, [success]);

  useEffect(() => {
    if (success1) setSuccess1(false);
  }, [success1]);

  useEffect(() => {
    getSearchfacility1(state.ClientModule.selectedClient);
    // getSearchFamilyProfile(state.ARTModule.selectedFamilyProfile);
  }, [
    state.ClientModule.selectedClient,
    // state.ARTModule.selectedFamilyProfile,
  ]);

  const handleRemoveBill = (item, index) => {
    // console.log(item);
    setProductItem((prev) => prev.filter((el, i) => i !== index));
  };

  const productSchema = [
    {
      name: "S/N",
      key: "sn",
      description: "SN",
      selector: (row) => row.sn,
      sortable: true,
      required: true,
      inputType: "HIDDEN",
      width: "50px",
    },
    {
      name: "Category",
      key: "category",
      description: "Enter Category",
      selector: (row) => row.category,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Name",
      key: "name",
      description: "Enter Name",
      selector: (row) => row.name,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "qty",
      key: "quantity",
      description: "Enter Quantity",
      selector: (row) => row.quantity,
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "50px",
    },
    {
      name: "Unit",
      key: "baseunit",
      description: "Enter Unit",
      selector: (row) => row.baseunit,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Price",
      key: "sellingprice",
      description: "Enter selling price",
      selector: (row) => row.sellingprice,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Amt",
      key: "amount",
      description: "Enter Amount",
      selector: (row) => row.amount,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Mode",
      key: "billMode",
      description: "Enter Bill mode",
      selector: (row) => row.billMode.type,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Del",
      key: "name",
      description: "Enter Name",
      selector: (row, index) => (
        <DeleteOutlineIcon
          sx={{
            color: "red",
          }}
          fontSize="small"
          onClick={() => {
            handleRemoveBill(row, index);
          }}
        />
      ),
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
  ];

  const resetform = () => {
    setDocumentNo("");
    setTotalamount("");
    setProductId("");
    setSource("");
    setDate("");
    setName("");
    setBaseunit();
    setCostprice();
    setProductItem([]);
    setContracts("");
  };

  const getClientName = () => {
    if (includesArt) {
      return familyProfile?.name || "Unknown Client";
    }
    return (
      `${patient?.firstname || ""} ${patient?.lastname || ""}`.trim() ||
      "Unknown Client"
    );
  };

  // const getClientPhone = () => {
  //   if (includesArt) {
  //     return familyProfile?.contactPhoneNumber || "";
  //   }
  // };

  useEffect(() => {
    findbranch();
  }, [state.employeeLocation]);

  const handleCreateBill = async () => {
    try {
      showActionLoader();

      let serviceList = [];
      let document = {};

      if (user.currentEmployee) {
        const { facilityDetail } = user.currentEmployee;
        document.facility = facilityDetail._id;
        document.facilityname = facilityDetail.facilityName;
      }

      document.documentdetail = productItem;
      document.documentname = "Billed Orders";
      document.location = `${state.employeeLocation.locationName} ${state.employeeLocation.locationType}`;
      document.locationId = state.employeeLocation.locationId;
      document.client = includesArt ? familyProfile?._id : patient?._id;
      document.clientname = getClientName();
      document.clientobj = includesArt ? familyProfile : patient;
      document.createdBy = user?._id;
      document.createdByname = `${user.firstname} ${user.lastname}`;
      document.status = "completed";

      for (const element of document.documentdetail) {
        // console.log(element, "element");
        const orderinfo = {
          documentationId: "",
          order_category: element.category,
          order: element.name,
          instruction: "",
          destination_name: document.facilityname,
          destination: document.facility,
          order_status: "Billed",
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
          client: document.clientobj,
          order_action: [],
          medication_action: [],
          treatment_action: [],
        };
        console.log(orderinfo, "order");
        const billInfo = {
          orderInfo: {
            orderId: "",
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
          billing_status: "Unpaid",
        };

        serviceList.push({ orderinfo, billInfo });
      }

      setMessage(serviceList);

      const res = await BillCreateServ.create({ document, serviceList });
      // console.log(res, "my res");
      setSuccess(true);
      toast.success("Billed Orders created successfully");
      setSuccess(false);
      setProductItem([]);
      setCalcAmount(0);
      const today = new Date().toLocaleString();
      setDate(today);
      const invoiceNo = generateRandomString(6);
      setDocumentNo(invoiceNo);
      resetform();
      hideActionLoader();
      setConfirmationDialog(false);
    } catch (error) {
      toast.error(`Error creating Billed Orders: ${error.message}`);
      hideActionLoader();
      setConfirmationDialog(false);
    }
  };

  const handleConfirm = () => {
    setConfirmationDialog(true);
  };

  const closeConfirmationDialog = () => {
    setConfirmationDialog(false);
  };

  return (
    <>
      <CustomConfirmationDialog
        open={confirmationDialog}
        confirmationAction={() => handleCreateBill()}
        cancelAction={closeConfirmationDialog}
        type="danger"
        message={`You are about to bill ${getClientName()} for ${message.length} service(s)?`}
      />
      <Box sx={{ width: "85vw", maxHeight: "85vh" }}>
        <Grid container spacing={0.5}>
          <Grid item lg={12} md={12} sm={12}>
            <Box>
              <Box mb={0.5} sx={{ height: "40px" }}>
                <FormsHeaderText text="Bill Information" />
              </Box>
              <Grid container spacing={1} mb={1}>
                <Grid item lg={4} md={4} sm={6} xs={12}>
                  {includesArt ? (
                    <FamilyProfileSearch
                      getSearchFamilyProfile={getSearchFamilyProfile}
                      clear={success1}
                      id={familyProfile?._id}
                      label="Search for Family"
                    />
                  ) : (
                    <ClientSearch
                      getSearchfacility={getSearchfacility1}
                      clear={success1}
                      id={patient._id}
                    />
                  )}
                </Grid>

                <Grid item lg={2} md={4} sm={6} xs={12}>
                  <CustomSelect
                    name="paymentmode"
                    defaultValue={paymentmode}
                    onChange={(e) => handleChangeMode(e.target.value)}
                    options={paymentOptions.map((item) => item.name)}
                    initialOption="Payment option"
                    placeholder="Billing Mode"
                    //label="Billing Mode"
                  />
                </Grid>
                <Grid item lg={2} md={4} sm={6} xs={12}>
                  <Input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    name="date"
                    label="Date and Time"
                    disabled
                  />
                </Grid>

                <Grid item lg={2} md={4} sm={6} xs={12}>
                  <Input
                    value={documentNo}
                    onChange={(e) => setDocumentNo(e.target?.value)}
                    label="Invoice Number"
                    type="text"
                    disabled
                  />
                </Grid>

                <Grid item lg={2} md={4} sm={6} xs={12}>
                  <Input
                    value={totalamount}
                    type="text"
                    onChange={(e) => setTotalamount(e.target.value)}
                    label=" Total Amount"
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item lg={12} md={12} sm={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "40px",
              }}
              mb={0.5}
            >
              <FormsHeaderText text="Choose Service Item" />

              <GlobalCustomButton onClick={handleClickProd}>
                <AddCircleOutlineIcon
                  fontSize="small"
                  sx={{ marginRight: "5px" }}
                />{" "}
                Add
              </GlobalCustomButton>
            </Box>

            <Box mb={1}>
              <Grid container spacing={1}>
                <Grid item xs={7}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <ServiceSearch
                      getSearchfacility={getSearchfacility}
                      clear={success}
                      mode={billMode}
                    />
                    <input
                      className="input is-small"
                      value={productId}
                      name="productId"
                      type="text"
                      onChange={(e) => setProductId(e.target.value)}
                      placeholder="Product Id"
                      style={{ display: "none" }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={2}>
                  <Input
                    name="quantity"
                    value={quantity}
                    type="text"
                    onChange={(e) => handleQtty(e)}
                    label="Quantity"
                  />
                </Grid>
                <Grid item xs={3}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Input
                      name="qamount"
                      disabled={changeAmount}
                      value={calcamount}
                      type="text"
                      onChange={async (e) => setCalcAmount(e.target.value)}
                      label="Amount"
                    />

                    <GlobalCustomButton
                      disabled={
                        user.currentEmployee?.roles.includes("Adjust Price") ||
                        user.currentEmployee?.roles.length === 0 ||
                        user.stacker
                      }
                      sx={{
                        marginTop: "7px",
                      }}
                      onClick={handleChangeAmount}
                    >
                      Adjust
                    </GlobalCustomButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Collapse in={productItem.length > 0}>
              <Box
                sx={{
                  width: "100%",

                  overflowY: "auto",
                }}
              >
                <CustomTable
                  title={""}
                  columns={productSchema}
                  //data={dummyData}
                  data={productItem}
                  pointerOnHover
                  highlightOnHover
                  striped
                  onRowClicked={(row) => onRowClicked(row)}
                  progressPending={false}
                />
              </Box>
            </Collapse>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            marginTop: "15px",
          }}
        >
          <GlobalCustomButton
            disabled={!productItem.length > 0}
            onClick={handleConfirm}
            sx={{
              marginRight: "10px",
            }}
          >
            Complete
          </GlobalCustomButton>

          <GlobalCustomButton
            color="error"
            //onClick={onSubmit}
          >
            Cancel
          </GlobalCustomButton>
        </Box>
      </Box>

      {/* <div
        className="card card-overflow"
        style={{width: "600px", maxHeight: "70vh"}}
      >
        <div className="card-content ">
          <form onSubmit={onSubmit}>
         
            <div className="field is-horizontal">
              <div className="field-body">
                {state.ClientModule.selectedClient.firstname !== undefined ? (
                  <div className="field">
                    <label className="label is-size-7">
                      {" "}
                      {state.ClientModule.selectedClient.firstname}{" "}
                      {state.ClientModule.selectedClient.lastname}
                    </label>
                  </div>
                ) : (
                  <div className="field"></div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div> */}
    </>
  );
}

export function ServiceSearch2({ getSearchfacility, clear }) {
  const productServ = client.service("billing");
  const [facilities, setFacilities] = useState([]);

  const [searchError, setSearchError] = useState(false);

  const [showPanel, setShowPanel] = useState(false);

  const [searchMessage, setSearchMessage] = useState("");

  const [simpa, setSimpa] = useState("");

  const [chosen, setChosen] = useState(false);

  const [count, setCount] = useState(0);
  const inputEl = useRef(null);
  const [val, setVal] = useState("");
  const { user } = useContext(UserContext);
  const { state } = useContext(ObjectContext);
  const [productModal, setProductModal] = useState(false);

  const handleRow = async (obj) => {
    setChosen(true);
    //alert("something is chaning")
    setSimpa(obj.name);
    getSearchfacility(obj);
    // setSelectedFacility(obj)
    setShowPanel(false);
    //  setCount(2)
    /* const    newfacilityModule={
            selectedFacility:facility,
            show :'detail'
        }
    setState((prevstate)=>({...prevstate, facilityModule:newfacilityModule})) */
    //console.log(state)
  };
  const handleBlur = async (e) => {
    /* if (count===2){
             console.log("stuff was chosen")
         } */
    /*  console.log("blur")
         setShowPanel(false)
        console.log(JSON.stringify(simpa))
        if (simpa===""){
            console.log(facilities.length)
            setSimpa("abc")
            setSimpa("")
            setFacilities([])
            inputEl.current.setValue=""
        }
        console.log(facilities.length)
        console.log(inputEl.current) */
  };
  const handleSearch = async (value) => {
    setVal(value);
    if (value === "") {
      setShowPanel(false);
      getSearchfacility(false);
      return;
    }
    const field = "name"; //field variable

    if (value.length >= 3) {
      productServ
        .find({
          query: {
            //service
            [field]: {
              $regex: value,
              $options: "i",
            },
            facility: user.currentEmployee.facilityDetail._id,
            //storeId: state.StoreModule.selectedStore._id,
            $limit: 10,
            $sort: {
              createdAt: -1,
            },
          },
        })
        .then((res) => {
          //console.log("product  fetched successfully")
          //console.log(res.data)
          setFacilities(res.data);
          setSearchMessage(" product  fetched successfully");
          setShowPanel(true);
        })
        .catch((err) => {
          toast.error(`Error creating ProductEntry  ${err}`);
        });
    } else {
      //console.log("less than 3 ")
      // console.log(val)
      setShowPanel(false);
      setFacilities([]);
      // console.log(facilities)
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
    if (clear) {
      // console.log("success has changed",clear)
      setSimpa("");
    }
    return () => {};
  }, [clear]);
  return (
    <div>
      <div className="field">
        <div className="control has-icons-left  ">
          <div
            className={`dropdown ${showPanel ? "is-active" : ""}`}
            style={{ width: "100%" }}
          >
            <div className="dropdown-trigger" style={{ width: "100%" }}>
              <DebounceInput
                className="input is-small  is-expanded"
                type="text"
                placeholder="Search Services"
                value={simpa}
                minLength={3}
                debounceTimeout={400}
                onBlur={(e) => handleBlur(e)}
                onChange={(e) => handleSearch(e.target.value)}
                inputRef={inputEl}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-search"></i>
              </span>
            </div>
            {/* {searchError&&<div>{searchMessage}</div>} */}
            <div className="dropdown-menu expanded" style={{ width: "100%" }}>
              <div className="dropdown-content">
                {facilities.length > 0 ? (
                  ""
                ) : (
                  <div
                    className="dropdown-item selectadd" /* onClick={handleAddproduct} */
                  >
                    {" "}
                    <span> {val} is not in your inventory</span>{" "}
                  </div>
                )}

                {facilities.map((facility, i) => (
                  <div
                    className="dropdown-item"
                    key={facility._id}
                    onClick={() => handleRow(facility)}
                  >
                    <div>
                      <span>{facility.name}</span>
                    </div>
                    <div>
                      <span>
                        <strong>{facility.quantity}</strong>
                      </span>
                      <span>{facility.baseunit}(s) remaining</span>
                      <span className="padleft">
                        <strong>Price:</strong> N{facility.sellingprice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
