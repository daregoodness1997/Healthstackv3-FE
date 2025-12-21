import React, { useState, useContext, useEffect } from "react";
import client from "../../../../feathers";
import { UserContext, ObjectContext } from "../../../../context";
import FacilityPopup from "../../../helpers/FacilityPopup";
import { toast } from "react-toastify";
import { Box, Button as MuiButton, Grid, Typography } from "@mui/material";
import ModalBox from "../../../../components/modal";
import CustomTable from "../../../../components/customtable";
import Input from "../../../../components/inputs/basic/Input";
import { FormsHeaderText } from "../../../../components/texts";
import GlobalCustomButton from "../../../../components/buttons/CustomButton";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { InventorySearch } from "../../../Pharmacy/BillPrescriptionCreate";
import { useForm, Controller } from "react-hook-form";
import CustomSelect from "../../../../components/inputs/basic/Select";

export default function PrescriptionRequest() {
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
      paymentmode: "",
    },
  });

  const [productItems, setProductItems] = useState([]);
  const [destinationModal, setDestinationModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [changeAmount, setChangeAmount] = useState(true);
  const [invQuantity, setInvQuantity] = useState("");
  const [patient, setPatient] = useState(null);
  const [source, setSource] = useState("");
  const BillCreateServ = client.service("createbilldirect");
  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const { user } = useContext(UserContext);
  const [branch, setBranch] = useState("");
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [paymentMode, setPaymentMode] = useState(null);
  const [billMode, setBillMode] = useState(null);

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
    const calcAmount = watchQuantity * watchSellingPrice;
    setValue("calcAmount", calcAmount);
  }, [watchQuantity, watchSellingPrice, setValue]);

  useEffect(() => {
    setValue("destination", user.currentEmployee.facilityDetail.facilityName);
    setValue("destinationId", user.currentEmployee.facilityDetail._id);
  }, [user, setValue]);

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

  const getSearchfacility = (obj) => {
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

    setValue("instruction", obj.instruction);
    setValue("productId", obj.productId);
    setValue("name", obj.name);
    setValue("baseunit", obj.baseunit);
    setValue("sellingPrice", obj.sellingprice);
    setValue("costPrice", obj.costprice);
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
  };

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

      case "Cash":
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

  useEffect(() => {
    const client = state.ARTModule.selectedFamilyProfile;
    if (client) {
      setPatient(client);
      setSource(client.clientname);

      if (client.clientname !== source) {
        setProductItems([]);
      }
    }
  }, [state.ARTModule.selectedFamilyProfile, source]);

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
        location: `${state.employeeLocation.locationName} ${state.employeeLocation.locationType}`,
        client: state.ARTModule.selectedFamilyProfile._id,
        clientname: state.ARTModule.selectedFamilyProfile.name,
        clientobj: state.ARTModule.selectedFamilyProfile,
        createdBy: user._id,
        createdByname: `${user.firstname} ${user.lastname}`,
        status: "completed",
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
        <GlobalCustomButton onClick={handleAddProduct}>
          <AddCircleOutline fontSize="small" sx={{ mr: 0.5 }} />
          Add
        </GlobalCustomButton>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 1.5 }}>
        <Controller
          name="billing"
          control={control}
          defaultValue={paymentOptions}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Auto Generate Billing"
            />
          )}
        />
        <Grid item lg={2} md={4} sm={6} xs={6}>
          <CustomSelect
            name="paymentmode"
            value={watch("paymentmode")}
            onChange={(e) => handleChangeMode(e.target.value)}
            options={paymentOptions.map((item) => item.name)}
            initialOption="Payment option"
            label="Billing Mode"
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12}>
          <Box>
            <InventorySearch
              getSearchfacility={getSearchfacility}
              clear={success}
            />
            {watchSellingPrice && (
              <Typography variant="caption" component="span">
                N{watchSellingPrice} per {watch("baseunit")}
                {invQuantity} remaining
              </Typography>
            )}
          </Box>
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
              <GlobalCustomButton
                onClick={() => setChangeAmount((prev) => !prev)}
                sx={{ mt: 0.5 }}
              >
                {changeAmount ? "Adjust" : "Done"}
              </GlobalCustomButton>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item sm={6}>
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
          </Grid>
          <Grid item sm={6}>
            <GlobalCustomButton onClick={() => setDestinationModal(true)}>
              Change
            </GlobalCustomButton>
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
  );
}
