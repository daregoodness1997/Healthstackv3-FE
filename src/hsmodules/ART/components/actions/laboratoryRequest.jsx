import React, { useState, useContext, useEffect, useRef } from "react";
import client from "../../../../feathers";
import { UserContext, ObjectContext } from "../../../../context";
import FacilityPopup from "../../../helpers/FacilityPopup";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
import ModalBox from "../../../../components/modal";
import CustomTable from "../../../../components/customtable";
import Input from "../../../../components/inputs/basic/Input";
import { FormsHeaderText } from "../../../../components/texts";
import GlobalCustomButton from "../../../../components/buttons/CustomButton";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import ServiceSearch from "../../../helpers/ServiceSearch";
import { generateRandomString } from "../../../helpers/generateString";

export default function LaboratoryRequest() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const { user } = useContext(UserContext); //,setUser
  const BillCreateServ = client.service("createbilldirect");
  const [currentUser, setCurrentUser] = useState();
  const [type, setType] = useState("Purchase Invoice");
  const [documentNo, setDocumentNo] = useState("");
  const [totalamount, setTotalamount] = useState("");
  const [productId, setProductId] = useState("");
  const OrderServ = client.service("order");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [destinationModal, setDestinationModal] = useState(false);
  const [test, setTest] = useState();
  const [testObj, setTestObj] = useState();
  const [instruction, setInstruction] = useState();
  const [productItem, setProductItem] = useState([]);
  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const ClientServ = client.service("clinicaldocument");
  const [hidePanel, setHidePanel] = useState(false);
  const [billing, setBilling] = useState(true);
  const [billMode, setBillMode] = useState("");
  const [patient, setPatient] = useState("");
  const [paymentOptions, setPaymentOptions] = useState("");
  const [paymentmode, setPaymentMode] = useState("Cash");
  const [contracts, setContracts] = useState([]);
  const [billingId, setBilllingId] = useState("");
  const [category, setCategory] = useState("");
  const [baseunit, setBaseunit] = useState(0);
  const [inventoryId, setInventoryId] = useState("");
  const [sellingprice, setSellingPrice] = useState(0);
  const [branch, setBranch] = useState("");

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

  const checkPrice = async (contracts, billMode) => {
    const findContract = (filter) => contracts.find(filter);
    const setPrice = async (contract) => {
      if (contract) {
        setSellingPrice(contract.price);
      } else {
        toast.error("No price found for this service. Setting price to 0.");
        setSellingPrice(0);
      }
    };

    const handleNoCoverError = (entity) => {
      toast.error(
        `${entity} does not have cover/price for this service. Please set a price, try another service, or bill using cash.`
      );
    };

    switch (billMode.type) {
      case "HMO Cover":
        if (billMode.detail.plan === "NHIS") {
          setPrice(findContract((el) => el.source_org_name === "NHIS"));
          if (!findContract((el) => el.source_org_name === "NHIS"))
            handleNoCoverError("NHIS");
        } else {
          setPrice(
            findContract(
              (el) => el.source_org === billMode.detail.organizationId
            )
          );
          if (
            !findContract(
              (el) => el.source_org === billMode.detail.organizationId
            )
          )
            handleNoCoverError("HMO");
        }
        break;
      case "Company Cover":
        setPrice(
          findContract((el) => el.source_org === billMode.detail.organizationId)
        );
        if (
          !findContract(
            (el) => el.source_org === billMode.detail.organizationId
          )
        )
          handleNoCoverError("Company");
        break;
      case "Cash":
      case "Family Cover":
        setPrice(findContract((el) => el.source_org === el.dest_org));
        break;
      default:
        toast.error("Invalid billing mode");
    }
  };

  useEffect(() => {
    if (billMode && contracts && !billing) {
      checkPrice(contracts, billMode);
    }
  }, [testObj, billMode, contracts, billing]);

  useEffect(() => {
    const client = state.ARTModule.selectedFamilyProfile;
    if (client) {
      setPatient(client);
      setSource(client.clientname);

      if (client.clientname !== source) {
        setProductItem([]);
        setTotalamount(0);
      }
    }
  }, [state.ARTModule.selectedFamilyProfile, source]);

  useEffect(() => {
    const resetState = () => {
      setProductItem([]);
      setTotalamount(0);
    };

    const processPaymentInfo = () => {
      const paymentOptions = [];
      let defaultBillMode;

      patient?.paymentinfo?.forEach((pay) => {
        if (pay.active) {
          const option = createPaymentOption(pay);
          paymentOptions.push(option);
          setPaymentMode(option.name);
          defaultBillMode = option;
        }
      });

      setPaymentOptions(paymentOptions);
      setBillMode(defaultBillMode);
    };

    resetState();
    processPaymentInfo();
  }, [patient]);

  const createPaymentOption = (pay) => {
    const options = {
      Cash: { name: "Cash", cover: "Cash", type: "Cash" },
      Family: {
        name: "Family Cover",
        cover: "familyCover",
        type: "Family Cover",
      },
      Company: {
        name: `Company: ${pay.organizationName}(${pay.plan})`,
        cover: "CompanyCover",
        type: "Company Cover",
      },
      HMO: {
        name: `HMO: ${pay.organizationName}(${pay.plan})`,
        cover: "HMOCover",
        type: "HMO Cover",
      },
    };

    const option = options[pay.paymentmode] || {};
    return createObj(pay, option.name, option.cover, option.type);
  };

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
    sellingprice: sellingprice,
    amount: sellingprice * 1,
    category: "Lab",
    billingId,
    billMode,
    baseunit: baseunit,
  };

  const getSearchfacility = (obj) => {
    //return console.log(obj);
    if (!obj) {
      //"clear stuff"
      setInstruction("");
      setTest("");
    }
    setInstruction(obj.instruction);
    setTest(obj.test);
    setTestObj(obj);
  };

  const getServiceSearch = (service) => {
    if (!service) {
      setInstruction("");
      setTest("");
    }
    setInstruction(service?.instruction);
    setTest(service.name);
    setContracts(service.contracts);
    setProductId(service.productId);
    setCategory(service.category); //Lab Order
    setBaseunit(service.baseunit);
    setInventoryId(service.inventoryId);
    setBilllingId(service._id);
    setTestObj(service);
  };

  useEffect(() => {
    findbranch();
    return () => {};
  }, []);

  useEffect(() => {
    setDestination(state.DestinationModule.selectedDestination.facilityName);
    setDestinationId(state.DestinationModule.selectedDestination._id);
    return () => {};
  }, [state.DestinationModule.selectedDestination]);

  const handleClickProd = async () => {
    setSuccess(false);
    if (!productItemI.test) {
      toast.error("Test cannot be empty");
      return;
    }

    setProductItem((prevProd) => [...prevProd, productItemI]);
    setHidePanel(false);
    setName("");
    setTest("");
    setInstruction("");

    const facilityDetail = user.currentEmployee.facilityDetail;
    setDestination(facilityDetail.facilityName);
    setDestinationId(facilityDetail._id);

    setSuccess(true);

    // Assuming setState is defined elsewhere and needed
    // setState(prevState => ({
    //   ...prevState,
    //   DestinationModule: {
    //     selectedDestination: facilityDetail,
    //     show: "list"
    //   }
    // }));
  };

  const handleChangeDestination = () => {
    setDestinationModal(true);
  };

  const handleBypassBilling = async (orders, document) => {
    const serviceList = [];
    // console.log(document.clientobj);

    const clientObj = {
      ...document.clientobj,
      phone: document.clientobj.contactPhoneNumber,
    };
    // console.log(clientObj, "clientobj");
    orders.forEach(async (element) => {
      let orderinfo = {
        //for reach document
        documentationId: "", //tbf
        order_category: element.category, //category
        order: element.name, //name
        instruction: "",
        destination_name: document.facilityname, //facilityname
        destination: document.facility, //facility id
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

        client: clientObj,

        order_action: [],
        medication_action: [],
        treatment_action: [],
      };

      let billInfo = {
        orderInfo: {
          orderId: "", //tbf
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
      let items = {
        orderinfo,
        billInfo,
      };

      serviceList.push(items);
    });

    await BillCreateServ.create({
      document,
      serviceList,
    })
      .then((res) => {
        console.log(res, "lab");
        setSuccess(true);
        toast.success("Bill generated successfully");
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

  const onSubmit = async () => {
    setMessage("");
    setError(false);
    setSuccess(false);
    showActionLoader();

    try {
      const document = {
        facility: user.currentEmployee?.facilityDetail._id,
        facilityname: user.currentEmployee?.facilityDetail.facilityName,
        documentdetail: productItem,
        documentname: "Lab Orders",
        location: `${state.employeeLocation.locationName} ${state.employeeLocation.locationType}`,
        // locationId: state.employeeLocation.locationId,
        client: state.ARTModule.selectedFamilyProfile._id,
        clientname: `${state.ARTModule.selectedFamilyProfile.name}`,
        clientobj: state.ARTModule.selectedFamilyProfile,
        createdBy: user._id,
        createdByname: `${user.firstname} ${user.lastname}`,
        status: "completed",
      };

      if (billing) {
        await handleBypassBilling(productItem, document);
      }

      hideActionLoader();
      toast.success("Laboratory order created successfully");
      setDestination(user.currentEmployee.facilityDetail.facilityName);
      setDestinationId(user.currentEmployee.facilityDetail._id);
      setProductItem([]);
    } catch (err) {
      hideActionLoader();
      // console.error(err);
      toast.error(`Error creating LabOrders: ${err.message}`);
    } finally {
      hideActionLoader();
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
      name: "S/N",
      key: "_id",
      selector: (row) => row.sn,
      description: "Enter",
      sortable: true,
      inputType: "HIDDEN",
      width: "50px",
    },
    {
      name: "Test",
      key: "test",
      description: "Enter Test name",
      selector: (row) => row.test,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Destination",
      key: "destination",
      description: "Enter Destination",
      selector: (row) => row.destination,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Act",
      key: "destination",
      description: "Enter Destination",
      selector: (row, i) => (
        <DeleteOutlineIcon
          sx={{ color: "red" }}
          fontSize="small"
          onClick={() => handleRemoveProd(row, i)}
        />
      ),
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "60px",
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
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            mb={2}
          >
            <FormsHeaderText text="Create Laboratory Request" />

            <GlobalCustomButton
              onClick={() => {
                handleClickProd();
                () => setHidePanel(true);
              }}
            >
              <AddCircleOutline fontSize="small" sx={{ marginRight: "5px" }} />
              Add
            </GlobalCustomButton>
          </Box>

          <Box
            sx={{ display: "flex", flexDirection: "column" }}
            gap={1.5}
            mb={1.5}
          >
            <Box>
              <FormControlLabel
                required
                control={
                  <Checkbox
                    checked={billing}
                    onChange={handleBillingChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={`Auto Generate Bill`}
              />
            </Box>


            {billing && (
              <Box>
                <ServiceSearch
                  getSearchfacility={getServiceSearch}
                  clear={false}
                  mode={billMode}
                />
              </Box>
            )}

            <Box
              container
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                item
                sx={{
                  width: "calc(100% - 100px)",
                }}
              >
                <Input
                  value={
                    destination ===
                    user.currentEmployee.facilityDetail.facilityName
                      ? "In-house"
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
                  title={"Lab Orders"}
                  columns={productItemSchema}
                  data={productItem}
                  pointerOnHover
                  highlightOnHover
                  striped
                  progressPending={false}
                />
              </Box>
            )}

            {productItem.length > 0 && (
              <Box
                container
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
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
