import React, { useState, useContext, useEffect } from "react";
import client from "../../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../../context";
import { toast } from "react-toastify";
import { IconButton, Typography } from "@mui/material";
import { FormsHeaderText } from "../../../components/texts";
import CloseIcon from "@mui/icons-material/Close";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import CustomConfirmationDialog from "../../../components/confirm-dialog/confirm-dialog";
import Textarea from "../../../components/inputs/basic/Textarea";
import { Box, Grid } from "@mui/material";
import RadioButton from "../../../components/inputs/basic/Radio";
import Input from "../../../components/inputs/basic/Input";
import Icd11Search from "../../helpers/icd11search";
import CustomTable from "../../../components/customtable";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ModalBox from "../../../components/modal";
import CreateOperations from "./createOperations";
import Doctor from "./doctor";

const DischargeSummary = () => {
  const { register, handleSubmit, setValue, reset, watch } = useForm();
  const ClientServ = client.service("clinicaldocument");
  const { user } = useContext(UserContext);
  const { state, setState, hideActionLoader, showActionLoader } =
    useContext(ObjectContext);
  const [docStatus, setDocStatus] = useState("Draft");
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [definiteDiagnosis, setDefiniteDiagnosis] = useState("");
  const [codeNumber, setCodeNumber] = useState("");
  const [operationModal, setOperationModal] = useState(false);

  const [operations, setOperations] = useState([]);
  const [newOperation, setNewOperation] = useState(true);
  const [nameOfDoctor, setNameOfDoctor] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;
  const { firstname, lastname, middlename, dob, mrn, maritalstatus, gender } =
    state.ClientModule.selectedClient;
  //console.log(state);

  const id = state.ClientModule.selectedClient._id;

  //console.log(watch());

  //   const handleRow = async () => {
  //     try {
  //       const getClientbyId = await ClientServ.get(id);
  //       console.log(getClientbyId);
  //       // Set state or do something with the client data
  //     } catch (error) {
  //       console.error("Error fetching client:", error);
  //     }
  //   };

  //   useEffect(() => {
  //     handleRow();
  //   }, [id]);

  useEffect(() => {
    // console.log(draftDoc);
    if (!!draftDoc && draftDoc.status === "Draft") {
      Object.entries(draftDoc.documentdetail).map(([keys, value], i) => {
        if (keys === "operations") {
          setOperations(value);
        }

        setValue(keys, value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      });
      //setNameOfDoctor(draftDoc.documentdetail["Name of Doctor"]);
      setSignatureUrl(draftDoc.documentdetail["Doctor Signature"]);
      setDefiniteDiagnosis(draftDoc.documentdetail["Definite Diagnosis"]);
      setCodeNumber(draftDoc.documentdetail["Code Number"]);
    }
    return () => {
      draftDoc = {};
    };
  }, [draftDoc]);

  //console.log(watch());

  const handleGetCode = (param) => {
    if (param) {
      const { Code, Title } = param;
      setDefiniteDiagnosis(Title);
      setCodeNumber(Code);
    }
  };

  const document_name = state.DocumentClassModule.selectedDocumentClass.name;

  const onSubmit = (data, e) => {
    data = {
      ...data,
      "Definite Diagnosis": definiteDiagnosis,
      "Code Number": codeNumber,
      //"Name of Doctor": nameOfDoctor,
      "Doctor Signature": signatureUrl,
    };
    //console.log("data", data);

    showActionLoader();
    e.preventDefault();
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    data.operations = operations;
    document.documentdetail = data;
    document.documentname =
      state.DocumentClassModule.selectedDocumentClass.name;
    document.documentClassId =
      state.DocumentClassModule.selectedDocumentClass._id;
    document.location =
      state.employeeLocation.locationName +
      " " +
      state.employeeLocation.locationType;
    document.locationId = state.employeeLocation.locationId;
    document.client = state.ClientModule.selectedClient._id;
    document.createdBy = user._id;
    document.createdByname = user.firstname + " " + user.lastname;
    document.status = docStatus === "Draft" ? "Draft" : "completed";
    document.appointment_id = state.AppointmentModule.selectedAllAppointment?._id || null;
    document.geolocation = {
      type: "Point",
      coordinates: [state.coordinates.latitude, state.coordinates.longitude],
    };

    if (
      document.location === undefined ||
      !document.createdByname ||
      !document.facilityname
    ) {
      toast.error(
        "Documentation data missing, requires location and facility details"
      );
      return;
    }

    //console.log("Document", document);

    if (!!draftDoc && draftDoc.status === "Draft") {
      ClientServ.patch(draftDoc._id, document)
        .then(() => {
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });

          setDocStatus("Draft");

          toast.success("Documentation updated succesfully");
          reset(data);
          setConfirmationDialog(false);
          closeEncounterRight();
          hideActionLoader();
        })
        .catch((err) => {
          toast.error("Error updating Documentation " + err);
          hideActionLoader();
        });
    } else {
      ClientServ.create(document)
        .then((res) => {
          //console.log(res);
          setOperations([]);
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });
          toast.success("Documentation created succesfully");
          reset(data);
          setConfirmationDialog(false);
          closeEncounterRight();
          hideActionLoader();
        })
        .catch((err) => {
          toast.error("Error creating Documentation " + err);
          hideActionLoader();
        });
    }
  };

  const handleChangeStatus = async (e) => {
    setDocStatus(e.target.value);
  };

  const closeEncounterRight = async () => {
    setState((prevstate) => ({
      ...prevstate,
      DocumentClassModule: {
        ...prevstate.DocumentClassModule,
        encounter_right: false,
      },
    }));
  };

  const columnSchema = [
    {
      name: "S/N",
      key: "sn",
      width: "100px",
      description: "SN",

      selector: (row, i) => i + 1,
      sortable: true,
      inputType: "HIDDEN",
    },

    {
      name: "Operations",
      key: "operations",
      width: "200px",

      description: "Operations",
      selector: (row, i) => row.Operation,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "Surgeon",
      key: "surgeon",
      description: "Surgeon",
      width: "200px",
      selector: (row, i) => row.Surgeons,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "Code Number",
      key: "code",

      description: "code number",
      selector: (row, i) => row["Doctor Code Number"],
      sortable: true,
      inputType: "HIDDEN",
    },
  ];

  return (
    <>
      <div className="card ">
        <CustomConfirmationDialog
          open={confirmationDialog}
          cancelAction={() => setConfirmationDialog(false)}
          type="create"
          message={`You are about to save this document ${document_name}`}
          confirmationAction={handleSubmit(onSubmit)}
        />

        <ModalBox
          open={operationModal}
          onClose={() => setOperationModal(false)}
          header="Add Operations"
        >
          <CreateOperations
            closeModal={() => setOperationModal(false)}
            setOperations={setOperations}
            // setDiagnosis={setDiagnosis}
          />
        </ModalBox>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          mb={1}
        >
          <FormsHeaderText
            text={state?.DocumentClassModule.selectedDocumentClass.name || ""}
          />

          <IconButton onClick={closeEncounterRight}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <div className="card-content vscrollable">
          <>
            <Grid container spacing={1}>
              <Grid item md={4} sm={4} xs={6}>
                <Input
                  register={register("Surname", {
                    value: lastname,
                  })}
                  type="text"
                  value={lastname}
                  label="Surname"
                  disabled
                />
              </Grid>

              <Grid item md={4} sm={4} xs={6}>
                <Input
                  register={register("Other Names", {
                    value: `${firstname} ${middlename}`,
                  })}
                  value={`${firstname} ${middlename}`}
                  type="text"
                  label="Other Names"
                  disabled
                />
              </Grid>

              <Grid item md={4} sm={4} xs={6}>
                <Input
                  register={register("Hospital Number", {
                    value: mrn,
                  })}
                  value={mrn}
                  type="text"
                  label="Hospital Number"
                  disabled
                />
              </Grid>

              <Grid item md={4} sm={4} xs={6}>
                <Input
                  register={register("Date Admitted")}
                  type="date"
                  label="Date Admitted"
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Textarea
                  register={register("Provisional Diagnosis")}
                  type="text"
                  label="Provisional Diagnosis"
                />
              </Grid>

              <Grid item md={6} sm={6} xs={6}>
                <Icd11Search
                  register={register("Definite Diagnosis", {
                    value: definiteDiagnosis,
                  })}
                  value={definiteDiagnosis}
                  label={"Definite Diagnosis"}
                  getSearchfacility={handleGetCode}
                />
              </Grid>

              <Grid item md={6} sm={6} xs={6}>
                <Input
                  register={register("Code number", {
                    value: codeNumber,
                  })}
                  value={codeNumber}
                  type="text"
                  label="Code Number"
                  disabled
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Textarea
                  register={register("History and Investigation")}
                  type="text"
                  label="History and Investigation"
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Textarea
                  register={register("Investigation and Result")}
                  type="text"
                  label="Investigation and Result"
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Textarea
                  register={register("Treatment")}
                  type="text"
                  label="Treatment"
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Textarea
                  register={register("Complications")}
                  type="text"
                  label="Complications"
                />
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  marginLeft: "9px",
                  marginY: "5px",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormsHeaderText text="Operations" />

                <GlobalCustomButton
                  onClick={() => {
                    setOperationModal(true);
                  }}
                >
                  <AddBoxIcon fontSize="small" />
                  Add Operations
                </GlobalCustomButton>
              </Box>

              <Box sx={{ width: " 100%", marginLeft: "9px", marginY: "10px" }}>
                <CustomTable
                  title={""}
                  columns={columnSchema}
                  data={operations}
                  pointerOnHover
                  highlightOnHover
                  striped
                  progressPending={false}
                  CustomEmptyData={
                    <Typography sx={{ fontSize: "0.8rem", marginTop: "5px" }}>
                      You've not added any Operations yet...
                    </Typography>
                  }
                />
              </Box>

              <Doctor
                //signatureUrl={signatureUrl}
                setSignatureUrl={setSignatureUrl}
                //nameOfDoctor={nameOfDoctor}
                //setNameOfDoctor={setNameOfDoctor}
                register={register}
              />
            </Grid>

            <Box>
              <RadioButton
                onChange={handleChangeStatus}
                name="status"
                options={["Draft", "Final"]}
                value={docStatus}
              />
            </Box>
            <Box
              spacing={1}
              sx={{
                display: "flex",
                gap: "2rem",
              }}
            >
              <GlobalCustomButton
                color="secondary"
                type="submit"
                onClick={() => setConfirmationDialog(true)}
              >
                Submit Discharge Summary
              </GlobalCustomButton>
            </Box>
          </>
        </div>
      </div>
    </>
  );
};

export default DischargeSummary;
