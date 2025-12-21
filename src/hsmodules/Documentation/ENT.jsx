import React, { useState, useContext, useEffect } from "react";
import client from "../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../context";
import { toast } from "react-toastify";
import { IconButton, Typography } from "@mui/material";
import { FormsHeaderText } from "../../components/texts";
import CloseIcon from "@mui/icons-material/Close";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import Textarea from "../../components/inputs/basic/Textarea";
import { Box } from "@mui/system";
import RadioButton from "../../components/inputs/basic/Radio";
import CustomTable from "../../components/customtable";
import ModalBox from "../../components/modal";
import ClaimCreateDiagnosis from "../Corporate/components/claims/Diagnosis";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Input } from "semantic-ui-react";

export default function ENT() {
  const { register, handleSubmit, setValue, reset, watch } = useForm();
  const ClientServ = client.service("clinicaldocument");
  const { user } = useContext(UserContext);
  const { state, setState, hideActionLoader, showActionLoader } =
    useContext(ObjectContext);
  const [docStatus, setDocStatus] = useState("Draft");
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [newDiag, setNewDiag] = useState(true);
  const [diagnosis, setDiagnosis] = useState([]);
  const [diagnosisModal, setDiagnosisModal] = useState(false);

  console.log(watch());
  //   const columnSchema = [
  //     {
  //       name: "S/N",
  //       key: "sn",
  //       description: "SN",
  //       selector: (row, i) => i + 1,
  //       sortable: true,
  //       inputType: "HIDDEN",
  //       width: "50px",
  //     },
  //     {
  //       name: "Type",
  //       key: "sn",
  //       description: "SN",
  //       selector: (row, i) => row.type,
  //       sortable: true,
  //       inputType: "HIDDEN",
  //     },
  //     {
  //       name: "Diagnosis",
  //       key: "sn",
  //       description: "SN",
  //       selector: (row, i) => row.diagnosis,
  //       sortable: true,
  //       inputType: "HIDDEN",
  //     },
  //     {
  //       name: "ICD 11 Code",
  //       key: "sn",
  //       description: "SN",
  //       selector: (row, i) => row.Code,
  //       sortable: true,
  //       inputType: "HIDDEN",
  //     },
  //     {
  //       name: "ICD11 Diagnosis",
  //       key: "sn",
  //       description: "SN",
  //       selector: (row, i) => row.Title,
  //       sortable: true,
  //       inputType: "HIDDEN",
  //     },
  //   ];

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  useEffect(() => {
    console.log(draftDoc);
    if (!!draftDoc && draftDoc.status === "Draft") {
      Object.entries(draftDoc.documentdetail).map(([keys, value], i) => {
        // if (keys === "diagnosis") {
        //   let stuff = Array.isArray(value);
        //   // console.log("key", keys);
        //   // console.log("value", value);
        // //   setNewDiag(stuff);
        // //   setDiagnosis(value);
        // }
        setValue(keys, value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      });
    }
    return () => {
      draftDoc = {};
    };
  }, [draftDoc]);

  const document_name = state.DocumentClassModule.selectedDocumentClass.name;

  const onSubmit = (data, e) => {
    showActionLoader();
    e.preventDefault();
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    // data.diagnosis = diagnosis;
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
        .then(() => {
          setDiagnosis([]);
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
          open={diagnosisModal}
          onClose={() => setDiagnosisModal(false)}
          header="Add Diagnosis to Claim"
        >
          <ClaimCreateDiagnosis
            closeModal={() => setDiagnosisModal(false)}
            setDiagnosis={setDiagnosis}
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
            <Box mb={1.5}>
              <FormsHeaderText text="Presenting Complain (PC)" />
              <FormsHeaderText
                textTransform="Capitalise"
                color="black"
                text="
              A. History of PC"
              />
              <Textarea
                register={register("History of Presenting Complain")}
                type="text"
                placeholder="Enter HPC......"
              />
            </Box>

            <Box mb={1.5}>
              <Textarea
                register={register("Past ENT History")}
                label={"Past ENT History"}
                type="text"
              />
            </Box>

            <Box mb={1.5}>
              <Textarea
                register={register("Past Surgical History")}
                label={"Past Surgical History"}
                type="text"
                placeholder={"Enter surgical history"}
              />
            </Box>

            <Box mb={1.5}>
              <Textarea
                register={register("Past Medical History")}
                label={"Past Medical History"}
                type="text"
                placeholder={"Enter medical history"}
              />
            </Box>

            <Box mb={1.5}>
              <FormsHeaderText text=" Pediatrics" />

              <Textarea
                register={register("Pregnancy history")}
                label={"Pregnancy history"}
                type="text"
                placeholder="Enter Pregnanacy History..."
              />
            </Box>

            <Box mb={1.5}>
              <Textarea
                register={register("Immunization history")}
                label={"Immunization history"}
                type="text"
                placeholder="Enter Immunization History..."
              />
            </Box>

            <Box mb={1.5}>
              <FormsHeaderText text=" Family and  Social History" />

              <Textarea
                register={register("Family and  Social History")}
                type="text"
                placeholder="Enter Family and  Social History..."
              />
            </Box>

            <Box mb={1.5}>
              <FormsHeaderText text="Examination " />

              <Textarea
                register={register("Ear Examination")}
                type="text"
                label={"Ear Examination"}
              />
            </Box>

            <Box mb={1.5}>
              <Textarea
                register={register("Nose Examination")}
                type="text"
                label={"Nose Examination"}
              />
            </Box>

            <Box mb={1.5}>
              <Textarea
                register={register("Throat Examination")}
                type="text"
                label={"Throat Examination"}
              />
            </Box>

            <Box mb={1.5}>
              <Textarea
                register={register("Neck Examination")}
                type="text"
                label={"Neck Examination"}
              />
            </Box>

            <Box mb={1.5}>
              <Textarea
                register={register("Chest Examination")}
                type="text"
                label={"Chest Examination"}
              />
            </Box>

            <Box mb={1.5}>
              <Textarea
                register={register("Abdomen Examination")}
                type="text"
                label={"Abdomen Examination"}
              />
            </Box>

            <Box mb={1.5}>
              <Textarea
                register={register("CNS Examination")}
                type="text"
                label={"CNS Examination"}
              />
            </Box>

            <Box mb={1.5}>
              <Textarea
                register={register("Assessment/Diagnosis")}
                type="text"
                label={"Assessment/Diagnosis"}
              />
            </Box>

            <Box mb={1.5}>
              <Textarea
                register={register("Plan")}
                type="text"
                label={"Plan"}
              />
            </Box>

            <Box mb={1.5}>
              <Textarea
                register={register("Follow up")}
                type="text"
                label={"Follow up"}
              />
            </Box>

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
                Submit Clinical Note
              </GlobalCustomButton>
            </Box>
          </>
        </div>
      </div>
    </>
  );
}
