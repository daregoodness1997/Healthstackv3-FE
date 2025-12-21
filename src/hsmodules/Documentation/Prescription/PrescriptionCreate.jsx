/* eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import client from "../../../feathers";
import { UserContext, ObjectContext } from "../../../context";
import FacilityPopup from "../../helpers/FacilityPopup";
import { toast } from "react-toastify";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import ModalBox from "../../../components/modal";
import CustomTable from "../../../components/customtable";
import Input from "../../../components/inputs/basic/Input";
import { FormsHeaderText } from "../../../components/texts";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useForm, Controller } from "react-hook-form";
import { InventorySearch } from "../../Pharmacy/BillPrescriptionCreate";
import CustomSelect from "../../../components/inputs/basic/Select";
import { AllPureLifeSearch } from "../../helpers/PureLifeAllSearch";
import { da } from "date-fns/locale";

export default function PrescriptionCreate() {
  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      instruction: "",
      quantity: "",
      calcAmount: 0,
      destination: "",
      destinationId: "",
      
     
      name: "",
      billing: true,
      productId: "",
      billingId: "",
      baseunit: "",
      sellingPrice: "",
      costPrice: 0,
      paymentmode: '',
    },
  });
 const [pharmacyUnits, setPharmacyUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [productItems, setProductItems] = useState([]);
  const [destinationModal, setDestinationModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [changeAmount, setChangeAmount] = useState(true);
  const [invQuantity, setInvQuantity] = useState("");
  const [patient, setPatient] = useState(null);
  const [source, setSource] = useState("");
  const BillCreateServ = client.service("createbilldirect");
  const locationServ = client.service("location");
  const { state, setState,showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const { user, setUser } = useContext(UserContext);
  const [branch, setBranch] = useState("");
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [paymentMode, setPaymentMode] = useState('');
  const [billMode, setBillMode] = useState("");
  // const [isPureLife, setIsPureLife] = useState(false);
  const isPureLife = user.currentEmployee?.facilityDetail?.hasExternalLink
  const [destinationLocation, setDestinationLocation] = useState({
    destinationLocationId: "",
    destinationLocation: "",
  });
  const employeeFacility = user.currentEmployee.facilityDetail;
  
  const createObj = (pay, name, cover, type) => ({
    ...pay,
    name,
    value: cover,
    detail: { ...pay },
    type,
  });

  const watchBilling = watch("billing");
  const watchQuantity = watch("quantity");
  const watchSellingPrice = watch("sellingPrice");

  useEffect(() => {
    const quantity = parseFloat(watchQuantity) || 0;
    const sellingPrice = parseFloat(watchSellingPrice) || 0;
    const calcAmount = quantity * sellingPrice;
    setValue("calcAmount", calcAmount);
}, [watchQuantity, watchSellingPrice, setValue]);

  useEffect(() => {
    setValue("destination", user.currentEmployee.facilityDetail.facilityName);
    setValue("destinationId", user.currentEmployee.facilityDetail._id);
  }, [user, setValue]);


   /** ✅ Helper: Populate pharmacies for a destination */
  const fetchPharmacies = async (facilityId, branchName = null) => {
    try {
      const result = await locationServ.find({
        query: {
          locationType: "Pharmacy",
          facility: facilityId,
        },
      });

      const pharmacies = result.data || [];
      setPharmacyUnits(pharmacies);

      if (pharmacies.length === 0) return;

      let selectedPharm = null;

      if (branchName) {
        selectedPharm = pharmacies.find((p) => p.branch === branchName);
      }

      if (!selectedPharm) {
        selectedPharm = pharmacies[0];
      }

      setSelectedUnit(selectedPharm._id);
      /* setValue("destinationLocation", selectedPharm.name);
      setValue("destinationLocationId", selectedPharm._id); */
      setDestinationLocation({
        destinationLocation: selectedPharm.name,
        destinationLocationId: selectedPharm._id,
      });
    } catch (err) {
      toast.error("Could not fetch pharmacy units " + err);
    }
  };

   /** ✅ On load: set destination to employee facility */
  useEffect(() => {
    if (employeeFacility) {
      setValue("destination", employeeFacility.facilityName);
      setValue("destinationId", employeeFacility._id);

      // find employee branch + pharmacies
      const fetchInitial = async () => {
        const emploc= state.employeeLocation;
       // console.log(emploc, 'emploc')
        if (!emploc.locationId) {
          toast.error("Your current location is missing, please login again");

          return;
        }
        try {
          const resp = await locationServ.get(emploc.locationId);
          const branchName = resp.branch || null;
          setBranch(branchName);

          await fetchPharmacies(employeeFacility._id, branchName);
        } catch (err) {
          toast.error("Error fetching branch: " + err);
        }
      };

      fetchInitial();
    }
  }, [employeeFacility, setValue, state.employeeLocation.locationId]);

   /** ✅ When destination changes (from FacilityPopup) */
  useEffect(() => {
    if (state?.DestinationModule?.selectedDestination) {
      const dest = state.DestinationModule.selectedDestination;

      setValue("destination", dest.facilityName);
      setValue("destinationId", dest._id);

      if (dest._id === employeeFacility._id) {
        // destination is employee’s facility → use branch logic
        fetchPharmacies(employeeFacility._id, branch);
      } else {
        // destination is external → just fetch all pharmacies
        fetchPharmacies(dest._id);
      }
    }
  }, [state?.DestinationModule, branch, employeeFacility, setValue]);

  useEffect( () => {
   
    setPaymentOptions([]);
    const newfacilityModule = {
      selectedDestination: user.currentEmployee.facilityDetail,
      show: "detail",
    };
     setState(prevstate => ({
      ...prevstate,
      DestinationModule: newfacilityModule,
    }));
    // findbranch();
    return () => {};
  }, []);

  const getSearchfacility = (obj) => {
 //   console.log(obj, 'obj');
    if (!obj) {
      reset({
        instruction: "",
        productId: "",
        billingId: "",
        costPrice: "",
        name: "",
        baseunit: "",
        sellingPrice: "",
      });
      setInvQuantity("");
      return;
    }
    //need to convert value from purelife to obj props
    setValue("instruction", obj.instruction);
    setValue("productId",isPureLife ?  obj.id : obj.productId); //obj.id
    setValue("name", obj.name);
    setValue("baseunit", obj.baseunit);
    setValue("sellingPrice",isPureLife ? obj.lst_price : obj.sellingprice);
    setValue("costPrice",isPureLife ? obj.lst_price : obj.costprice);
    setValue("billingId", obj.billingId);
    setInvQuantity(obj.quantity);
  };

  const handleQtty = (e) => {
    const value = e.target.value;
    if (invQuantity < value) {
      toast.error("You cannot sell more quantity than exists in inventory");
      return;
    }
    setValue("quantity", value);
  };

  const handleAddProduct = handleSubmit((data) => {
    if (!data.quantity || !data.productId) {
      toast.error("You need to choose a product and quantity to proceed");
      return;
    }

    if(isPureLife){
      data.productId=null

    }
    const newProduct = {
      ...data,

      destination: user.currentEmployee.facilityDetail.facilityName,
      destinationId: user.currentEmployee.facilityDetail._id,
      category: "Prescription",
      billMode,
    };

    setProductItems((prev) => [...prev, newProduct]);
    reset({
      instruction: "",
      quantity: "",
      calcAmount: 0,
      name: "",
      productId: "",
    });
  });

  const handleRemoveProduct = (index) => {
    setProductItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBypassBilling = async (orders, document) => {
    const serviceList = [];
    const clientObj = {
      ...document.clientobj,
      phone: document.clientobj.contactPhoneNumber,
    };

    orders.forEach((element) => {
      const orderinfo = {
        documentationId: "",
        order_category: element.category,
        order: element.name,
        instruction: element.instruction || "",
        destination_name: document.facilityname,
        destination: document.facility,
        destinationLocationId:document.destinationLocationId,
        destinationLocation: document.destinationLocation,
        order_status: "Billed",
        payer: element.billMode?.organizationName,
        paymentmode: element.billMode?.paymentmode,

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

      const billInfo = {
        orderInfo: {
          orderId: "",
          orderObj: orderinfo,
        },
        serviceInfo: {
          price: element.sellingPrice,
          quantity: element.quantity,
          productId: element.productId,
          name: element.name,
          baseunit: element.baseunit,
          amount: element.calcAmount,
          billingId: element.billingId,
          billingContract: element.billingContract,
          createdby: user._id,
        },
        paymentInfo: {
          amountDue: element.calcAmount,
          paidup: 0,
          balance: element.calcAmount,
          paymentDetails: [],
        },
        participantInfo: {
          billingFacility: orderinfo.destination,
          billingFacilityName: orderinfo.destination_name,
          locationId: document.locationId,
          clientId: orderinfo.clientId,
          client: orderinfo.client,
          paymentmode: element.billMode,
          branch,
        },
        createdBy: user._id,
        billing_status: "Unpaid",
      };

      serviceList.push({ orderinfo, billInfo });
    });
    document.directBilling=true
    try {
      const response = await BillCreateServ.create({
        document,
        serviceList,
      });
      // console.log(response);
      toast.success("Bill generated successfully");
      return response;
    } catch (error) {
      toast.error(`Error creating Billed Orders: ${error}`);
      throw error;
    } 
  }
  const checkPrice = async (contracts, billMode) => {
    const findContract = (filter) => contracts.find(filter);

    const setPrice = async (contract) => {
      if (contract) {
        setValue("sellingPrice", contract.price);
      } else {
        toast.error("No price found for this service. Setting price to 0.");
        setValue("sellingPrice", 0);
      }
    };

    const handleNoCoverError = (entity) => {
      toast.error(
        `${entity} does not have cover/price for this service. Please set a price, try another service, or bill using cash.`
      );
    };

    if (!billMode) return;

    switch (billMode.type) {
      case "HMO Cover":
        if (billMode.detail.plan === "NHIS") {
          const contract = findContract((el) => el.source_org_name === "NHIS");
          await setPrice(contract);
          if (!contract) handleNoCoverError("NHIS");
        } else {
          const contract = findContract(
            (el) => el.source_org === billMode.detail.organizationId
          );
          await setPrice(contract);
          if (!contract) handleNoCoverError("HMO");
        }
        break;

      case "Company Cover":
        const companyContract = findContract(
          (el) => el.source_org === billMode.detail.organizationId
        );
        await setPrice(companyContract);
        if (!companyContract) handleNoCoverError("Company");
        break;

      case "Cash"://something is missing here
      case "Family Cover":
        const defaultContract = findContract(
          (el) => el.source_org === el.dest_org
        );
        await setPrice(defaultContract);
        break;

      default:
        toast.error("Invalid billing mode");
    }
  };

  useEffect(() => {
    if (watchBilling && billMode) {
      checkPrice(billMode);
    }
  }, [billMode, watchBilling]);



  const handleChangeMode = async (value) => {
    setPaymentMode(value);
    let selectedBillMode = paymentOptions.find((el) => el.name === value);
    setBillMode(selectedBillMode);
    setValue("paymentmode", value);
  };

  useEffect(() => {
    const processPaymentInfo = () => {
      if (!patient?.paymentinfo) return;

      const options = patient.paymentinfo
        .filter((pay) => pay.active)
        .map((pay) => {
          const paymentModeOptions = {
            Cash: {
              name: "Cash",
              cover: "Cash",
              type: "Cash",
            },
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

          const option = paymentModeOptions[pay.paymentmode] || {};
          return {
            ...pay,
            name: option.name,
            value: option.cover,
            detail: { ...pay },
            type: option.type,
          };
        });

      setPaymentOptions(options);

      if (options.length > 0) {
        handleChangeMode(options[0].name);
      }
    };

    processPaymentInfo();
  }, [patient]);

  const handleSubmitPrescription = async () => {
    if (productItems.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    showActionLoader();
    try {
      const document = {
        facility: user.currentEmployee?.facilityDetail._id,
        facilityname: user.currentEmployee?.facilityDetail.facilityName,
        documentdetail: productItems,
        documentname: "Prescription",
        appointment_id: state.AppointmentModule.selectedAllAppointment?._id || null,
        location: `${state.employeeLocation.locationName} ${state.employeeLocation.locationType}`,
        client: state.ClientModule.selectedClient._id,
        clientname: state.ClientModule.selectedClient.name,
        clientobj: state.ClientModule.selectedClient,
        createdBy: user._id,
        createdByname: `${user.firstname} ${user.lastname}`,
        status: "completed",
    
        destinationLocationId:destinationLocation.destinationLocationId,
        destinationLocation:destinationLocation.destinationLocation
      };

      await handleBypassBilling(productItems, document);

      toast.success("Prescription created successfully");
      setProductItems([]);
      reset();
    } catch (err) {
      toast.error(`Error creating Prescription: ${err}`);
    } finally {
      hideActionLoader();
    }
  };
 // Handle dropdown change
  const handleUnitChange = (e) => {
    const unitId = e.target.value;
    setSelectedUnit(unitId);
    const unit = pharmacyUnits.find(u => u._id === unitId);
    if (unit) {
      setDestinationLocation({
        destinationLocation: unit.name,
        destinationLocationId: unit._id,
      });
    }
  };
  const productItemSchema = [
    {
      name: "S/N",
      width: "45px",
      selector: (_, index) => index + 1,
    },
    {
      name: "Test",
      selector: (row) => row.name,
    },
    {
      name: "Amount",
      selector: (row) => row.calcAmount,
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
    },
    {
      name: "Instruction",
      selector: (row) => row.instruction || "-------",
    },
    {
      name: "Destination",
      selector: (row) => row.destination,
    },
    {
      name: "Action",
      width: "60px",
      selector: (_, index) => (
        <DeleteOutlineIcon
          sx={{ color: "red", cursor: "pointer" }}
          fontSize="small"
          onClick={() => handleRemoveProduct(index)}
        />
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <FormsHeaderText text="Create Prescription Request" />
       
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 1.5 }}>
       {/*  <Controller
          name="billing"
          control={control}
          defaultValue={paymentOptions}
          render={({ field }) => (
            <FormControlLabel
              
              control={<Checkbox {...field} checked={field.value}  />}
              label="Auto Generate Billing"
            />
          )}
        /> */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomSelect
              name="paymentmode"
              value={watch("paymentmode")||''}
              onChange={(e) => handleChangeMode(e.target.value)}
              options={paymentOptions.map((item) => item.name)}
              initialOption="Payment option"
              label="Billing Mode"
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12}>
            <Box>
              
                {isPureLife ? (
                <AllPureLifeSearch
                  getSearchfacility={getSearchfacility}
                  clear={success}
                  label="Search for Prescription"
                  prescription={true}
                />
              ) : (
                <InventorySearch
                getSearchfacility={getSearchfacility}
                clear={success}
              />
              )}
              {watchSellingPrice && (
                <Typography variant="caption" component="span">
                  N{watchSellingPrice} per {watch("baseunit")}
                  {invQuantity} remaining
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        <Controller
          name="instruction"
          control={control}
          render={({ field }) => <Input {...field} label="Instructions/Note" />}
        />

        <Grid container spacing={2}>
          <Grid item sm={6}>
            <Input
              register={register("quantity")}
              label="Quantity"
              onChange={handleQtty}
            />
          </Grid>

          <Grid item sm={6}>
            <Box>
              <Input
                register={register("calcAmount")}
                label="Amount"
                disabled={changeAmount}
              />
              <Box sx={{ display: 'flex' }}>
              <GlobalCustomButton
                onClick={() => setChangeAmount((prev) => !prev)}
                sx={{ mt: 0.5 }}
              >
                {changeAmount ? "Adjust" : "Done"}
              </GlobalCustomButton>
               <GlobalCustomButton onClick={handleAddProduct} sx={{ ml:'auto' ,mt:0.5 }}>
                <AddCircleOutline fontSize="small" sx={{ mr: 0.5 }} />
                Add
                </GlobalCustomButton>
            </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2 } alignItems="center">
          <Grid item sm={6}xs={12} >
          <Box sm={4} xs={12} flexDirection={"row"} display="flex" alignItems="center" >
            <Input
              register={register("destination")}
              label="Destination Pharmacy"
              disabled
              value={
                watch("destination") ===
                user.currentEmployee.facilityDetail.facilityName
                  ? "In-house"
                  : watch("destination")
              }
            />
       
            <GlobalCustomButton onClick={() => setDestinationModal(true)}>
              Change
            </GlobalCustomButton>
          </Box>
       
      </Grid>
        <Grid item sm={6} xs={12}>
          <CustomSelect
            name="destinationUnit"
            label="Destination Unit"
            defaultValue={selectedUnit}
            onChange={handleUnitChange}
            options={pharmacyUnits.map(unit => ({
              label: unit.name,
              value: unit._id
            }))}
            initialOption="Select Pharmacy Unit"
          />
             
        </Grid>
        </Grid>
          
      </Box>

      {productItems.length > 0 && (
        <>
          <Box mb={1.5}>
            <CustomTable
              title="Prescription Orders"
              columns={productItemSchema}
              data={productItems}
              pointerOnHover
              highlightOnHover
              striped
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <GlobalCustomButton onClick={handleSubmitPrescription}>
              Complete
            </GlobalCustomButton>
          </Box>
        </>
      )}

      <ModalBox
        open={destinationModal}
        onClose={() => setDestinationModal(false)}
      >
        <FacilityPopup
          facilityType="Pharmacy"
          closeModal={() => setDestinationModal(false)}
        />
      </ModalBox>
    </Box>
  )
}
