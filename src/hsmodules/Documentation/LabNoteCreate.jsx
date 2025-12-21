import React, { useState, useContext, useEffect } from "react";
import client from "../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../context";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";

import Input from "../../components/inputs/basic/Input";
import { FormsHeaderText } from "../../components/texts";
import CloseIcon from "@mui/icons-material/Close";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import Textarea from "../../components/inputs/basic/Textarea";
import { Box } from "@mui/system";
import RadioButton from "../../components/inputs/basic/Radio";

export default function LabNoteCreate() {
  const { register, handleSubmit, setValue, reset, getValues } = useForm();
  const ClientServ = client.service("clinicaldocument");
  const { user } = useContext(UserContext);
  const { state, setState, hideActionLoader, showActionLoader } =
    useContext(ObjectContext);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [docStatus, setDocStatus] = useState("Draft");
  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  useEffect(() => {
    if (!!draftDoc && draftDoc.status === "Draft") {
      Object.entries(draftDoc.documentdetail).map(([keys, value], i) =>
        setValue(keys, value, {
          shouldValidate: true,
          shouldDirty: true,
        })
      );
    }
    return () => {
      draftDoc = {};
    };
  }, [draftDoc]);

  const onSubmit = (data, e) => {
    showActionLoader();
    e.preventDefault();
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName;
    }
    document.documentdetail = data;
    document.documentname = `${data.Investigation} Result`;
    document.documentType = "Diagnostic Result";
    // document.documentClassId=state.DocumentClassModule.selectedDocumentClass._id
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
          setConfirmDialog(false);
          closeEncounterRight();
          hideActionLoader();
        })
        .catch((err) => {
          toast.error("Error updating Documentation " + err);
          reset(data);
          setConfirmDialog(false);
          hideActionLoader();
        });
    } else {
      ClientServ.create(document)
        .then(() => {
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });
          toast.success("Lab Result created succesfully");
          reset(data);
          setConfirmDialog(false);
          closeEncounterRight();
          hideActionLoader();
        })
        .catch((err) => {
          toast.error("Error creating Lab Result " + err);
          setConfirmDialog(false);
          hideActionLoader();
        });
    }
    // }
  };

  const closeEncounterRight = async () => {
    let documentobj = {};
    documentobj.name = "";
    documentobj.facility = "";
    documentobj.document = "";
    const newDocumentClassModule = {
      selectedDocumentClass: documentobj,
      encounter_right: false,
      show: "detail",
    };
    await setState((prevstate) => ({
      ...prevstate,
      DocumentClassModule: newDocumentClassModule,
    }));
  };

  const handleChangeStatus = async (e) => {
    setDocStatus(e.target.value);
  };

  return (
    <>
      <div className="card ">
        <CustomConfirmationDialog
          open={confirmDialog}
          cancelAction={() => setConfirmDialog(false)}
          confirmationAction={handleSubmit(onSubmit)}
          type="create"
          message={`You are about to save this document ${getValues(
            "investigation"
          )} Result?`}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          mb={1}
        >
          <FormsHeaderText text={"Lab Result"} />

          <IconButton onClick={closeEncounterRight}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <div className="card-content vscrollable remPad1">
          <>
            <Box mb={1}>
              <Input
                register={register("Investigation")}
                name="text"
                type="text"
                label="Investigation"
              />
            </Box>

            <Box>
              <Textarea
                register={register("findings")}
                name="findings"
                type="text"
                label="Finding"
                placeholder="Write here....."
              />
            </Box>

            <Box>
              <Textarea
                register={register("recommendation")}
                name="text"
                type="text"
                label="Recommendation"
                placeholder="Write here....."
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
                onClick={() => setConfirmDialog(true)}
              >
                Submit Lab Result
              </GlobalCustomButton>
              {/* <Button variant="outlined" type="button">
                  Cancel
                </Button> */}
            </Box>
          </>
        </div>
      </div>
    </>
  );
}
