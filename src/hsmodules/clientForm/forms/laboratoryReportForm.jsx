import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import client from "../../../feathers";
import Encounter from "../../Documentation/Documentation";
import { UserContext, ObjectContext } from "../../../context";
import { toast } from "react-toastify";
import Input from "../../../components/inputs/basic/Input/index";
import Textarea from "../../../components/inputs/basic/Textarea/index";
import {
  Grid,
  Typography,
} from "@mui/material";
import ModalBox from "../../../components/modal";
import CustomSelect from "../../../components/inputs/basic/Select";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import { PrintBarcode } from "./PrintBarcode";
import { format, formatDistanceToNowStrict } from "date-fns";

const useStyles = makeStyles({
  boldLabel: {
    fontWeight: "bold",
  },
  inputField: {
    marginTop: "8px",
  },
  subscript: {
    fontSize: "0.8rem",
    verticalAlign: "sub",
  },
  supscript: {
    fontSize: "0.8rem",
    verticalAlign: "super",
  },
});

export default function LaboratoryReportForm() {
  const { register, handleSubmit, setValue, watch, control } = useForm();
  const labServ = client.service("labrefvalue");
  const { state, setState } = useContext(ObjectContext);
  const [choosenForm, setChoosenForm] = useState(false);
  const [labRef, setLabRef] = useState([]);
  const [productModal, setProductModal] = useState(false);
  const { user } = useContext(UserContext);
  const order = state.financeModule.selectedFinance;
  const bill_report_status = state.financeModule.report_status;

  const formType = watch("FormType");

  //console.log(formType)
  //added
  useEffect(() => {
    if (formType) {
      if (formType !== "") {
        setChoosenForm(true);
        const test = labRef.find((e) => e.testname === formType);
        setState((prevstate) => ({ ...prevstate, labFormType: test }));
      } else {
        setChoosenForm(false);
        setState((prevstate) => ({ ...prevstate, labFormType: {} }));
      }
    }
  }, [formType, labRef, setState]);

  useEffect(() => {
    getLabRef();
    return () => { };
  }, []);

  useEffect(() => {
    if (order.resultDetail?.labFormType == null) {
      setState((prevstate) => ({ ...prevstate, labFormType: "unknown" }));
    } else {
      setState((prevstate) => ({
        ...prevstate,
        labFormType:
          state.financeModule.selectedFinance.resultDetail.labFormType,
      }));
    }
    if (order.resultDetail == null) {
      setState((prevstate) => ({ ...prevstate, labFormType: "" }));
    }
    //console.log(state.financeModule.selectedFinance.resultDetail.labFormType)
    return () => { };
  }, [order]);

  const showDocumentation = async (value) => {
    setProductModal(true);
  };

  const ProperCase = (text) => {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getLabRef = async () => {
    const findLabref = await labServ.find({
      query: {
        facilityId: user.currentEmployee.facilityDetail._id,
        $sort: {
          testname: 1,
        },
      },
    });

    // console.log(order.orderInfo.orderObj,"CLIENTS")
    setLabRef(findLabref.data);
  };
  //  console.log(formtype, choosenForm);
  // const clientName = order.orderInfo.orderObj.clientname;

  return (
    <>
      <div className="card">
        <Grid
          container
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          <Grid item xs={12} md={6} my={4}>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div>
                <p style={{ maxWidth: "400px", fontWeight: "700" }}>

                  {ProperCase(
                    ` ${order.serviceInfo?.name} for ${order.orderInfo.orderObj?.clientname}  ${order.orderInfo.orderObj?.client.gender} ${order.orderInfo.orderObj.client?.phone}
                   `
                  )}

                  {order.orderInfo.orderObj?.client?.dob ? formatDistanceToNowStrict(new Date(order.orderInfo.orderObj.client?.dob)) : ''}

                </p>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <GlobalCustomButton
              text="Documentation"
              onClick={showDocumentation}
              customStyles={{
                float: "right",
                marginLeft: "auto",
              }}
              color="success"
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          <Grid item xs={12} md={6}>
            {bill_report_status === "Pending" && (
              <CustomSelect
                label="Form Type"
                name="FormType"
                options={[
                  ...labRef.map((option) => ({
                    value: option.testname,
                    label: option.testname,
                  })),
                ]}
                register={register("FormType")}
                placeholder="Choose Form"
                control={control}
              />
            )}
          </Grid>
        </Grid>
        <div className="card-content mb-0 vscrollable">
          <div>
            {choosenForm && <Haematology />}
            {bill_report_status !== "Pending" && <EditLabForm />}
          </div>
        </div>
      </div>
      {productModal && (
        <ModalBox open onClose={() => setProductModal(false)}>
          <Encounter standalone={true} />
        </ModalBox>
      )}
    </>
  );
}

export function Haematology() {
  const { state, setState } = useContext(ObjectContext);
  const order = state.financeModule.selectedFinance;
  const bill_report_status = state.financeModule.report_status;
  const { user } = useContext(UserContext);
  const [reportStatus, setReportStatus] = useState("Draft");
  const ClientServ = client.service("labresults");
  const BillServ = client.service("bills");
  const { register, handleSubmit, setValue, reset, control, getValues } =
    useForm({
      defaultValues: {
        labResults: state.labFormType.tests?.map((test) => ({
          test: test.test,
          texttype: test?.texttype || false,
          value: "",
          unit: test.normalValues
            ? test.normalValues[0]?.unitMeasure || ""
            : "",
          min: test.normalValues ? test.normalValues[0]?.lowerLimit || "" : "",
          max: test.normalValues ? test.normalValues[0]?.upperLimit || "" : "",
          status: "No Input",
        })),
      },
    });
  const [refresh, setRefresh] = useState(false);

  // Check if current user is a pathologist
  // const isPathologist = user?.currentEmployee?.position?.toLowerCase() === 'pathologist';

  // Lab scientist name (person who filled the report)
  // const labScientistName = `${user?.firstname || ''} ${user?.lastname || ''}`.trim();

  const [showModal, setShowModal] = useState(false);
  const [barcodeDetails, setBarcodeDetails] = useState({
    specimenName: "",
    dateOfRequest: "",
    dateOfCollection: "",
    volume: "",
    clientName: "",
    labTestName: "",
    specimenRoute: "",
  });

  const labResults = useWatch({
    control,
    name: "labResults",
  });

  useEffect(() => {
    if (!order.resultDetail?.documentdetail) {
      setValue("Finding", "", { shouldValidate: true, shouldDirty: true });
      setValue("Recommendation", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      // setValue("labScientistName", labScientistName, { shouldValidate: true, shouldDirty: true });
      // setValue("pathologistComments", "", { shouldValidate: true, shouldDirty: true });
      // setValue("pathologistName", "", { shouldValidate: true, shouldDirty: true });
      return;
    }
    if (order.report_status !== "Pending") {
      Object.entries(order.resultDetail.documentdetail).forEach(
        ([keys, value]) => {
          if (keys !== "results") {
            setValue(keys, value, { shouldValidate: true, shouldDirty: true });
          }
        }
      );
      let results = order.resultDetail.documentdetail.results;
      // console.log(order.resultDetail.documentdetail);
      results &&
        results.forEach((result, index) => {
          setValue(`labResults[${index}].test`, result.test);
          setValue(`labResults[${index}].value`, result.value);
          setValue(`labResults[${index}].unit`, result.unit);
          setValue(`labResults[${index}].min`, result.min);
          setValue(`labResults[${index}].max`, result.max);
          setValue(`labResults[${index}].status`, result.status);
        });

      // Populate new fields from existing data
      // setValue("labScientistName", order.resultDetail.documentdetail.labScientistName || labScientistName, { shouldValidate: true, shouldDirty: true });
      // setValue("pathologistComments", order.resultDetail.documentdetail.pathologistComments || "", { shouldValidate: true, shouldDirty: true });
      // setValue("pathologistName", order.resultDetail.documentdetail.pathologistName || "", { shouldValidate: true, shouldDirty: true });
    }
  }, [order, setValue]);

  useEffect(() => {
    reset({
      labResults: state.labFormType.tests?.map((test) => ({
        test: test.test,
        texttype: test?.texttype || false,
        value: "",
        unit: test.normalValues ? test.normalValues[0]?.unitMeasure || "" : "",
        min: test.normalValues ? test.normalValues[0]?.lowerLimit || "" : "",
        max: test.normalValues ? test.normalValues[0]?.upperLimit || "" : "",
        status: "No Input",
      })),
    });
  }, [state.labFormType, reset]);

  const validateAndDisplayMessage = useCallback((value, min, max) => {
    if (value === "" || value === undefined) {
      return "No Input";
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return ""; //"Invalid Input";
    if (numValue < min) return "Low";
    if (numValue > max) return "High";
    return "Normal";
  }, []);

  const updateStatus = useCallback(
    (index) => {
      const result = getValues(`labResults[${index}]`);
      if (!result) return "No Input";
      const { value, min, max } = result;
      const status = validateAndDisplayMessage(value, min, max);
      return status;
    },
    [getValues, validateAndDisplayMessage]
  );

  useEffect(() => {
    const updatedLabResults = labResults.map((lab, index) => ({
      ...lab,
      status: updateStatus(index),
    }));

    if (JSON.stringify(updatedLabResults) !== JSON.stringify(labResults)) {
      setValue("labResults", updatedLabResults, { shouldValidate: false });
    }
  }, [labResults, updateStatus, setValue]);

  const getNormalRange = useCallback((test, selectedUnit) => {
    const selectedUnitData = test.normalValues.find(
      (unitData) => unitData.unitMeasure === selectedUnit
    );
    return selectedUnitData || {};
  }, []);

  const handleSelectChange = (e, index, test) => {
    console.log(e.target.value);
    const selectedUnit = e.target.value;
    const { lowerLimit: min, upperLimit: max } = getNormalRange(
      test,
      selectedUnit
    );
    console.log(min, max);
    setValue(`labResults[${index}].min`, min);
    setValue(`labResults[${index}].max`, max);
    setValue(`labResults[${index}].unit`, selectedUnit);
  };

  // const forceRefresh = () => {
  //   setRefresh((prev) => !prev); // Toggle between true/false to force a re-render
  // };

  // const recommendationText = useMemo(() => {
  //   if (!Array.isArray(labResults)) return null;
  //   return labResults?.map((lab, index) => (
  //     <React.Fragment key={index}>
  //       {state.labFormType?.tests[index]?.test} : {lab.value} ({lab.status}){" "}
  //       {lab.unit} {lab.min} {lab.max}
  //       {index < labResults.length - 1 ? <br /> : null}
  //     </React.Fragment>
  //   ));
  // }, [labResults, state.labFormType.tests]);

  const handleChangePart = async (e) => {
    setReportStatus(e.target.value);
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();

    // console.log(data);

    // Validate pathologist comments if finalizing
    /* if (reportStatus === "Final") {
      if (!isPathologist) {
        toast.error("Only pathologists can finalize lab reports");
        return;
      }

      if (!data.pathologistComments || data.pathologistComments.trim() === "") {
        toast.error("Pathologist comments are required before finalizing the report");
        return;
      }

      const modResults = data.labResults.map((lab) => removeEmptyValues(lab));

      const cleanedArray = removeObjectsWithEmptyValue(modResults);

      delete data.labResults;
      data.results = cleanedArray;

      // Add pathologist name and timestamp when finalizing
      data.pathologistName = `${user?.firstname || ''} ${user?.lastname || ''}`.trim();
      data.pathologistSignedAt = new Date().toISOString();
    } else { */
    data.results = data.labResults;
    delete data.labResults;
    // }

    // Always include lab scientist name
    // data.labScientistName = data.labScientistName || labScientistName;

    data.test = state.labFormType.testname;

    console.log("mod", data);
    //return

    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    document.documentdetail = data;
    document.documentType = "Laboratory Result";
    document.documentname = `${order.serviceInfo.name} Result`;
    // document.documentClassId=state.DocumentClassModule.selectedDocumentClass._id
    document.location =
      state.employeeLocation.locationName +
      " " +
      state.employeeLocation.locationType;
    document.locationId = state.employeeLocation.locationId;
    document.client = order.orderInfo.orderObj.clientId;
    document.createdBy = user._id;
    document.createdByname = user.firstname + " " + user.lastname;
    document.status = reportStatus;
    document.billId = order._id;

    if (
      document.location === undefined ||
      !document.createdByname ||
      !document.facilityname
    ) {
      toast.error(
        " Documentation data missing, requires location and facility details"
      );
      return;
    }

    if (bill_report_status === "Pending") {
      document.labFormType = state.labFormType;
      await ClientServ.create(document)
        .then(async (res) => {
          toast.success("Lab Result created succesfully");
        })
        .catch((err) => {
          toast.error("Error creating Lab Result " + err);
        });
    }

    if (bill_report_status === "Draft") {
      await ClientServ.patch(order.resultDetail._id, document)
        .then(async (res) => {
          toast.success("Lab Result updated succesfully");
        })
        .catch((err) => {
          toast.error("Error updating Lab Result " + err);
        });
    }
    let updatedorder = await BillServ.get(order._id);

    order.resultDetail = updatedorder.resultDetail;

    const newProductEntryModule = {
      selectedFinance: order,
      show: "show",
      // report_status:order.report_status
    };
    await setState((prevstate) => ({
      ...prevstate,
      financeModule: newProductEntryModule,
    }));
  };

  const removeEmptyValues = (obj) => {
    // Iterate through the object's properties
    for (let key in obj) {
      // Check if the property is actually part of the object (not from the prototype chain)
      if (obj.hasOwnProperty(key)) {
        // If the value is an empty string, delete the property
        if (obj[key] === "") {
          delete obj[key];
        }
      }
    }
    return obj;
  };

  function removeObjectsWithEmptyValue(arr) {
    return arr.filter(
      (obj) => obj.value !== "" && obj.value !== null && obj.value !== undefined
    );
  }
  // console.log(state.labFormType.tests,"TESTSS")

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {showModal && (
        <ModalBox open={showModal} onClose={() => setShowModal(false)}>
          <PrintBarcode data={barcodeDetails} />
        </ModalBox>
      )}

      {/* specimen details field */}
      <Grid container spacing={1} mt={2}>
        <Grid item xs={12} sm={12}>
          <Typography
            variant="p"
            sx={{
              color: "blue",
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            {`${state.labFormType?.testname}` ||
              order.resultDetail.documentdetail.test}
          </Typography>
          <Grid container alignItems="center" mt={1} spacing={1}>
            {!!state.labFormType.tests &&
              state.labFormType.tests.map((data, index) => (
                <Grid
                  key={index}
                  item
                  xs={6}
                  mb={2}
                  style={{
                    marginTop: Array.isArray(data.normalValues) ? "" : "-25px",
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Input
                        label={data.test}
                        name={`labResults[${index}].value`}
                        type={
                          data?.texttype ? "text" : "number"
                          // Array.isArray(data.normalValues) ? "number" : "text"
                        }
                        register={register(`labResults[${index}].value`)}
                      />
                    </Grid>
                    {Array.isArray(data.normalValues) && (
                      <Grid item xs={6}>
                        {/*  <CustomSelect
                label="unit"
                name={`labResults[${index}].unit`}
                options={[
                  ...data.normalValues.map((option) => ({
                    value: option.unitMeasure,
                    label: option.unitMeasure,
                   })),
                ]}
                register={register(`labResults[${index}].unit`)}
                value={getValues(`labResults[${index}].unit`)}
              
                onChange={(e) => handleSelectChange(e, index, data)}
                control={control}
              /> */}
                        <select
                          className="selectadd"
                          style={{
                            border: "1px solid #b6b6b6",
                            height: "2rem",
                            borderRadius: "4px",
                            width: "100%",
                            fontSize: "0.75rem",
                          }}
                          name={`labResults[${index}].unit`}
                          register={register(`labResults[${index}].unit`)}
                          onChange={(e) => handleSelectChange(e, index, data)}
                        /*   value={value} onChange={onChange} */
                        >
                          {data.normalValues.map((option) => (
                            <option
                              key={option.unitMeasure}
                              value={option.unitMeasure}
                            >
                              {option.unitMeasure}
                            </option>
                          ))}
                        </select>
                      </Grid>
                    )}

                    {/* Displaying current lab result value */}
                    {Array.isArray(data.normalValues) && (
                      <Grid item xs={12} sm={6}>
                        <Typography
                          sx={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            marginBottom: "4px",
                          }}
                          style={{
                            color:
                              labResults[index]?.status !== "Normal"
                                ? "red"
                                : "black",
                          }}
                        >
                          {labResults[index]?.status} ({labResults[index]?.min}{" "}
                          - {labResults[index]?.max})
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Recommendation field */}
      <React.Fragment>
        {/* {Array.isArray(labResults) && labResults.map((lab, index) => (
  <React.Fragment key={index}>
    {lab?.test} : {lab?.value} ({lab?.status})
  </React.Fragment>
))} */}
        {/* {recommendationText} */}
      </React.Fragment>

      <Grid container spacing={1} mt={2}>
        <Typography
          variant="p"
          sx={{
            color: "blue",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "4px",
          }}
        >
          Recommendation
        </Typography>
      </Grid>

      <Grid container spacing={1} mt={2}>
        <Grid item xs={12} sm={6}>
          <Textarea
            placeholder="Recommendation"
            name="Recommendation"
            type="text"
            register={register("Recommendation")}
          />
        </Grid>
      </Grid>

      {/* Lab Scientist Name */}
      {/* <Grid container spacing={1} mt={2}>
        <Typography
          variant="p"
          sx={{
            color: "blue",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "4px",
          }}
        >
          Lab Scientist Name
        </Typography>
      </Grid>
      <Grid container spacing={1} mt={1}>
        <Grid item xs={12} sm={6}>
          <Input
            label="Lab Scientist Name"
            name="labScientistName"
            type="text"
            register={register("labScientistName")}
            disabled={true}
          />
        </Grid>
      </Grid> */}

      {/* Pathologist Comments */}
      {/* <Grid container spacing={1} mt={2}>
        <Typography
          variant="p"
          sx={{
            color: "blue",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "4px",
          }}
        >
          Pathologist Comments
        </Typography>
      </Grid>
      <Grid container spacing={1} mt={1}>
        <Grid item xs={12} sm={6}>
          <Textarea
            placeholder="Pathologist Comments (Required for finalization)"
            name="pathologistComments"
            type="text"
            register={register("pathologistComments")}
            disabled={!isPathologist || bill_report_status === "Final"}
          />
        </Grid>
      </Grid> */}

      {/* Pathologist Name - Only show if report has been finalized */}
      {/* {bill_report_status === "Final" && (
        <>
          <Grid container spacing={1} mt={2}>
            <Typography
              variant="p"
              sx={{
                color: "blue",
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              Pathologist Name
            </Typography>
          </Grid>
          <Grid container spacing={1} mt={1}>
            <Grid item xs={12} sm={6}>
              <Input
                label="Pathologist Name"
                name="pathologistName"
                type="text"
                register={register("pathologistName")}
                disabled={true}
              />
            </Grid>
          </Grid>
        </>
      )} */}

      <Grid container spacing={1} mt={1}>
        <Grid item xs={12} sm={2}>
          <input
            type="radio"
            name="status"
            value="Draft"
            checked={reportStatus === "Draft" || reportStatus === "Pending"}
            onChange={handleChangePart}
            disabled={bill_report_status === "Final"}
            style={{ margin: "1rem" }}
          />
          <span style={{ fontSize: "1rem" }}> Draft </span>
        </Grid>
        <Grid item xs={12} sm={2}>
          <input
            type="radio"
            name="status"
            value="Final"
            checked={reportStatus === "Final"}
            onChange={handleChangePart}
            disabled={bill_report_status === "Final"}
            style={{ margin: "1rem" }}
          />
          <span style={{ fontSize: "1rem" }}> Final </span>
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} sm={12}>
          {bill_report_status !== "Final" && (
            <GlobalCustomButton
              text={bill_report_status === "Pending" ? "Save" : "Update"}
              onClick={handleSubmit(onSubmit)}
              color="success"
            />
          )}
        </Grid>
      </Grid>
    </form>
  );
}

export function EditLabForm() {
  const { state, setState } = useContext(ObjectContext);
  const labServ = client.service("labrefvalue");
  const order = state.financeModule.selectedFinance;
  const bill_report_status = state.financeModule.report_status;
  const { user } = useContext(UserContext);
  const [reportStatus, setReportStatus] = useState("Draft");
  const ClientServ = client.service("labresults");
  const [labRef, setLabRef] = useState({ tests: [] });
  const { register, handleSubmit, setValue, reset, control, getValues } =
    useForm({
      defaultValues: {
        labResults: order?.resultDetail?.documentdetail
          ? order?.resultDetail?.documentdetail
          : {},
      },
    });
  const [refresh, setRefresh] = useState(false);

  // Check if current user is a pathologist
  // const isPathologist = user?.currentEmployee?.position?.toLowerCase() === 'pathologist';

  // Lab scientist name (person who filled the report)
  // const labScientistName = `${user?.firstname || ''} ${user?.lastname || ''}`.trim();

  const [showModal, setShowModal] = useState(false);
  const [barcodeDetails, setBarcodeDetails] = useState({
    specimenName: "",
    dateOfRequest: "",
    dateOfCollection: "",
    volume: "",
    clientName: "",
    labTestName: "",
    specimenRoute: "",
  });
  const labResults = useWatch({
    control,
    name: "labResults",
  });

  const getLabRef = async () => {
    console.log(order?.resultDetail?.documentdetail?.test);
    const findLabref = await labServ.find({
      query: {
        testname: order?.resultDetail?.documentdetail?.test,
        $sort: {
          testname: 1,
        },
      },
    });
    /*  console.log(findLabref.data[0]) */
    setLabRef(findLabref.data[0]);
  };

  useEffect(() => {
    //call labref
    getLabRef();
    // console.log("order", order.resultDetail.documentdetail);
    // console.log("labresults", labResults);
    // console.log("labref", labRef);

    return () => { };
  }, []);

  /* useEffect(() => {
   if (!order.resultDetail?.documentdetail) {
      setValue("Finding", "", { shouldValidate: true, shouldDirty: true });
      setValue("Recommendation", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      return;
    }
    if (order.report_status !== "Pending") {
      Object.entries(order.resultDetail.documentdetail).forEach(
        ([keys, value]) => {
          console.log(keys, value);
          if (keys !== "results") {
            setValue(keys, value, { shouldValidate: true, shouldDirty: true });
          }
        }
      );

      console.log("midway", labResults);
      let results = order.resultDetail.documentdetail.results;
      console.log(order.resultDetail.documentdetail.results);
      results &&
        results.forEach((result, index) => {
          setValue(`labResults.results[${index}].test`, result.test);
          setValue(`labResults.results[${index}].value`, result.value);
          setValue(`labResults.results[${index}].unit`, result.unit);
          setValue(`labResults.results[${index}].min`, result.min);
          setValue(`labResults.results[${index}].max`, result.max);
          setValue(`labResults.results[${index}].status`, result.status);
        });
    }
    //  console.log("final", labResults)
  }, [order, setValue]);

  /*  useEffect(() => {
    reset({
      labResults: bill_report_status==="pending"? state.labFormType.tests.map(test => ({
        test: test.test,
        value: '',
        unit: test.normalValues?test.normalValues[0]?.unitMeasure || '':"",
        min:test.normalValues? test.normalValues[0]?.lowerLimit || '':"",
        max: test.normalValues?test.normalValues[0]?.upperLimit || '':"",
        status: 'No Input'
      })):
      order.resultDetail.documentdetail
    })
    }, [state.labFormType, reset]); */

  const validateAndDisplayMessage = useCallback((value, min, max) => {
    if (value === "" || value === undefined) {
      return "No Input";
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return ""; //"Invalid Input";
    if (numValue < min) return "Low";
    if (numValue > max) return "High";
    return "Normal";
  }, []);
  const handleSelectChange = (e, index, test) => {
    const selectedUnit = e.target.value;
    const { lowerLimit: min, upperLimit: max } = getNormalRange(
      test,
      selectedUnit
    );

    setValue(`labResults.results[${index}].min`, min);
    setValue(`labResults.results[${index}].max`, max);
    setValue(`labResults.results[${index}].unit`, selectedUnit);
  };

  const updateStatus = useCallback(
    (index) => {
      const { value, min, max } = getValues(`labResults.results[${index}]`);

      const status = validateAndDisplayMessage(value, min, max);

      return status;
    },
    [getValues, validateAndDisplayMessage]
  );

  useEffect(() => {
    /*  labResults.results.map((lab, index) => (
      setValue(`labResults[${index}].status`, updateStatus(index))
    )) */

    // updateStatus(index)
    const updatedLabResults = labResults?.results?.map((lab, index) => ({
      ...lab,
      status: updateStatus(index),
    }));

    if (
      JSON.stringify(updatedLabResults) !== JSON.stringify(labResults.results)
    ) {
      setValue("labResults.results", updatedLabResults, {
        shouldValidate: false,
      });
    }
  }, [labResults, updateStatus, setValue]);

  const getNormalRange = useCallback((test, selectedUnit) => {
    const selectedUnitData = test?.normalValues?.find(
      (unitData) => unitData?.unitMeasure === selectedUnit
    );
    return selectedUnitData || {};
  }, []);

  const forceRefresh = () => {
    setRefresh((prev) => !prev); // Toggle between true/false to force a re-render
  };

  const handleChangePart = async (e) => {
    setReportStatus(e.target.value);
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();

    // Validate pathologist comments if finalizing
    /* if (reportStatus === "Final") {
      if (!isPathologist) {
        toast.error("Only pathologists can finalize lab reports");
        return;
      }

      if (!data.labResults?.pathologistComments || data.labResults?.pathologistComments.trim() === "") {
        toast.error("Pathologist comments are required before finalizing the report");
        return;
      }

      data = data?.labResults;

      const modResults = data?.results?.map((lab) => removeEmptyValues(lab));

      const cleanedArray = removeObjectsWithEmptyValue(modResults);

      delete data?.labResults;
      data.results = cleanedArray;

      // Add pathologist name and timestamp when finalizing
      data.pathologistName = `${user?.firstname || ''} ${user?.lastname || ''}`.trim();
      data.pathologistSignedAt = new Date().toISOString();

      // console.log(data);
    } else { */
    data = data?.labResults;
    delete data?.labResults;
    // console.log(data);
    // }

    // Always include lab scientist name
    // data.labScientistName = data.labScientistName || labScientistName;

    // data.test = state.labFormType.testname;

    /*  const modResults=  data.labResults.map((lab)=>(
      removeEmptyValues(lab)
    ))

    const cleanedArray = removeObjectsWithEmptyValue(modResults); */

    /*    delete data.labResults
    data.results=cleanedArray
  }else{
    data.results=data.labResults
    delete data.labResults
  }
    data.test=order.resultDetail.documentdetail.test

    console.log("mod", data)
    //return */

    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    document.documentdetail = data;
    document.documentType = "Laboratory Result";
    document.documentname = `${order.serviceInfo.name} Result`;
    // document.documentClassId=state.DocumentClassModule.selectedDocumentClass._id
    document.location =
      state.employeeLocation.locationName +
      " " +
      state.employeeLocation.locationType;
    document.locationId = state.employeeLocation.locationId;
    document.client = order.orderInfo.orderObj.clientId;
    document.createdBy = user._id;
    document.createdByname = user.firstname + " " + user.lastname;
    document.status = reportStatus;
    document.billId = order._id;

    if (
      document.location === undefined ||
      !document.createdByname ||
      !document.facilityname
    ) {
      toast.error(
        " Documentation data missing, requires location and facility details"
      );
      return;
    }

    if (bill_report_status === "Pending") {
      document.labFormType = order.resultDetail.documentdetail.labFormType; //state.labFormType;||
      ClientServ.create(document)
        .then((res) => {
          toast.success("Lab Result created succesfully");
        })
        .catch((err) => {
          toast.error("Error creating Lab Result " + err);
        });
    }

    if (bill_report_status === "Draft") {
      ClientServ.patch(order.resultDetail._id, document)
        .then((res) => {
          toast.success("Lab Result updated succesfully");
        })
        .catch((err) => {
          toast.error("Error updating Lab Result " + err);
        });
    }
    const newProductEntryModule = {
      selectedFinance: order,
      show: "show",
      // report_status:order.report_status
    };
    await setState((prevstate) => ({
      ...prevstate,
      financeModule: newProductEntryModule,
    }));
  };

  const removeEmptyValues = (obj) => {
    // Iterate through the object's properties
    for (let key in obj) {
      // Check if the property is actually part of the object (not from the prototype chain)
      if (obj.hasOwnProperty(key)) {
        // If the value is an empty string, delete the property
        if (obj[key] === "") {
          delete obj[key];
        }
      }
    }
    return obj;
  };

  function removeObjectsWithEmptyValue(arr) {
    return arr?.filter(
      (obj) => obj?.value !== "" && obj.value !== null && obj.value !== undefined
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {showModal && (
        <ModalBox open={showModal} onClose={() => setShowModal(false)}>
          <PrintBarcode data={barcodeDetails} />
        </ModalBox>
      )}

      {/* specimen details field */}
      <Grid container spacing={1} mt={2}>
        <Grid item xs={12} sm={12}>
          <Typography
            variant="p"
            sx={{
              color: "blue",
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            {order?.resultDetail?.documentdetail?.test}
          </Typography>
          <Grid container alignItems="center" mt={1} spacing={1}>
            {order &&
              order?.resultDetail?.documentdetail?.results.map(
                (data, index) => (
                  <Grid
                    key={index}
                    item
                    xs={6}
                    mb={
                      2
                    } /* style={{marginTop:Array.isArray(data.normalValues)?"":"-25px"}} */
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Input
                          label={data.test}
                          name={`labResults.results[${index}].value`}
                          type={
                            Array.isArray(labRef?.tests[index]?.normalValues)
                              ? "number"
                              : "text"
                          }
                          register={register(
                            `labResults.results[${index}].value`
                          )}
                        />
                      </Grid>
                      {/*  {Array.isArray(labRef?.tests[index]?.normalValues)&&  */}{" "}
                      <Grid item xs={6}>
                        <select
                          className="selectadd"
                          style={{
                            border: "1px solid #b6b6b6",
                            height: "2rem",
                            borderRadius: "4px",
                            width: "100%",
                            fontSize: "0.75rem",
                          }}
                          name={`labResults.results[${index}].unit`}
                          register={register(
                            `labResults.results[${index}].unit`
                          )}
                          onChange={(e) =>
                            handleSelectChange(e, index, labRef?.tests[index])
                          }
                        >
                          {labRef?.tests[index]?.normalValues?.map((option) => (
                            <option
                              key={option.unitMeasure}
                              value={option.unitMeasure}
                            >
                              {option.unitMeasure}
                            </option>
                          ))}
                        </select>
                      </Grid>
                      {/* Displaying current lab result value */}
                      {/*  {Array.isArray(data.normalValues)&& */}{" "}
                      <Grid item xs={12} sm={6}>
                        <Typography
                          sx={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            marginBottom: "4px",
                          }}
                          style={{
                            color:
                              labResults?.results?.[index]?.status !== "Normal"
                                ? "red"
                                : "black",
                          }}
                        >
                          {labResults?.results[index]?.status} (
                          {labResults?.results[index]?.min} -{" "}
                          {labResults?.results[index]?.max})
                        </Typography>
                      </Grid>
                      {/*  } */}
                    </Grid>
                  </Grid>
                )
              )}
          </Grid>
        </Grid>
      </Grid>

      {/* Recommendation field */}
      {/*  <React.Fragment> */}
      {/* {Array.isArray(labResults) && labResults.map((lab, index) => (
  <React.Fragment key={index}>
    {lab?.test} : {lab?.value} ({lab?.status})
  </React.Fragment>
))} */}
      {/* {recommendationText} */}
      {/* </React.Fragment> */}

      <Grid container spacing={1} mt={2}>
        <Typography
          variant="p"
          sx={{
            color: "blue",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "4px",
          }}
        >
          Recommendation
        </Typography>
      </Grid>

      <Grid container spacing={1} mt={2}>
        <Grid item xs={12} sm={6}>
          <Textarea
            placeholder="Recommendation"
            name="Recommendation"
            type="text"
            register={register("labResults.Recommendation")}
          />
        </Grid>
      </Grid>

      {/* Lab Scientist Name */}
      {/* <Grid container spacing={1} mt={2}>
        <Typography
          variant="p"
          sx={{
            color: "blue",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "4px",
          }}
        >
          Lab Scientist Name
        </Typography>
      </Grid>
      <Grid container spacing={1} mt={1}>
        <Grid item xs={12} sm={6}>
          <Input
            label="Lab Scientist Name"
            name="labScientistName"
            type="text"
            register={register("labResults.labScientistName")}
            disabled={true}
          />
        </Grid>
      </Grid> */}

      {/* Pathologist Comments */}
      {/* <Grid container spacing={1} mt={2}>
        <Typography
          variant="p"
          sx={{
            color: "blue",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "4px",
          }}
        >
          Pathologist Comments
        </Typography>
      </Grid>
      <Grid container spacing={1} mt={1}>
        <Grid item xs={12} sm={6}>
          <Textarea
            placeholder="Pathologist Comments (Required for finalization)"
            name="pathologistComments"
            type="text"
            register={register("labResults.pathologistComments")}
            disabled={!isPathologist || bill_report_status === "Final"}
          />
        </Grid>
      </Grid> */}

      {/* Pathologist Name - Only show if report has been finalized */}
      {/* {bill_report_status === "Final" && (
        <>
          <Grid container spacing={1} mt={2}>
            <Typography
              variant="p"
              sx={{
                color: "blue",
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              Pathologist Name
            </Typography>
          </Grid>
          <Grid container spacing={1} mt={1}>
            <Grid item xs={12} sm={6}>
              <Input
                label="Pathologist Name"
                name="pathologistName"
                type="text"
                register={register("labResults.pathologistName")}
                disabled={true}
              />
            </Grid>
          </Grid>
        </>
      )} */}

      <Grid container spacing={1} mt={1}>
        <Grid item xs={12} sm={2}>
          <input
            type="radio"
            name="status"
            value="Draft"
            checked={reportStatus === "Draft" || reportStatus === "Pending"}
            onChange={handleChangePart}
            disabled={bill_report_status === "Final"}
            style={{ margin: "1rem" }}
          />
          <span style={{ fontSize: "1rem" }}> Draft </span>
        </Grid>
        <Grid item xs={12} sm={2}>
          <input
            type="radio"
            name="status"
            value="Final"
            checked={reportStatus === "Final"}
            onChange={handleChangePart}
            disabled={bill_report_status === "Final"}
            style={{ margin: "1rem" }}
          />
          <span style={{ fontSize: "1rem" }}> Final </span>
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} sm={12}>
          {bill_report_status !== "Final" && (
            <GlobalCustomButton
              text={bill_report_status === "Pending" ? "Save" : "Update"}
              onClick={handleSubmit(onSubmit)}
              color="success"
            />
          )}
        </Grid>
      </Grid>
    </form>
  );
}
