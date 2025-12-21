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
import VoiceTextArea from "../../components/inputs/basic/Textarea/VoiceInput";
import Textarea from "../../components/inputs/basic/Textarea";
import { Box } from "@mui/system";
import RadioButton from "../../components/inputs/basic/Radio";

export function OperationNoteCreate() {
  const { register, handleSubmit, setValue, reset } = useForm();
  const ClientServ = client.service("clinicaldocument");
  const { user } = useContext(UserContext);
  const { state, setState, hideActionLoader, showActionLoader } =
    useContext(ObjectContext);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [voiceRecommendation, setVoiceRecommendation] = useState(false);
  const [voiceDocumentation, setVoiceDocumentation] = useState(false);
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

  const onSubmit = (data) => {
    showActionLoader();
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    document.documentdetail = data;
    document.documentname = "Operation Note";
    document.documentType = "Operation Note";
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
    // console.log(document)

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
          toast.success("Operation Note Document succesfully updated");
          reset(data);
          setConfirmDialog(false);
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
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });
          toast.success("Operation Note created succesfully");
          reset(data);
          setConfirmDialog(false);
          closeEncounterRight();
          hideActionLoader();
        })
        .catch((err) => {
          toast.error("Error creating Operation's Note " + err);
          hideActionLoader();
        });
    }
    //}
  };

  const handleChangeStatus = async (e) => {
    setDocStatus(e.target.value);
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
  return (
    <>
      <div className="card ">
        <CustomConfirmationDialog
          open={confirmDialog}
          confirmationAction={handleSubmit(onSubmit)}
          cancelAction={() => setConfirmDialog(false)}
          type="create"
          message="You're about to save this document Doctor Note?"
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          mb={1}
        >
          <FormsHeaderText text={"Operation's Note"} />

          <IconButton onClick={closeEncounterRight}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <div className="card-content vscrollable remPad1">
          <>
            <Box mb={1}>
              <Input register={register("Title")} type="text" label="Title" />
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                mb={1}
              >
                <FormsHeaderText text="Documentation" />

                <Box>
                  {voiceDocumentation ? (
                    <GlobalCustomButton
                      onClick={() => setVoiceDocumentation(false)}
                    >
                      Type
                    </GlobalCustomButton>
                  ) : (
                    <GlobalCustomButton
                      onClick={() => setVoiceDocumentation(true)}
                    >
                      Speech
                    </GlobalCustomButton>
                  )}
                </Box>
              </Box>

              {voiceDocumentation ? (
                <VoiceTextArea
                  handleChange={(value) => setValue("Documentation", value)}
                  placeholder="click start before talking...."
                />
              ) : (
                <Textarea
                  register={register("Documentation")}
                  type="text"
                  //label="Documentation"
                  placeholder="Write here......"
                />
              )}
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                mb={1}
              >
                <FormsHeaderText text="Recommendation" />

                <Box>
                  {voiceRecommendation ? (
                    <GlobalCustomButton
                      onClick={() => setVoiceRecommendation(false)}
                    >
                      Type
                    </GlobalCustomButton>
                  ) : (
                    <GlobalCustomButton
                      onClick={() => setVoiceRecommendation(true)}
                    >
                      Speech
                    </GlobalCustomButton>
                  )}
                </Box>
              </Box>

              {voiceRecommendation ? (
                <VoiceTextArea
                  handleChange={(value) => setValue("Recommendation", value)}
                  placeholder="click start before talking...."
                />
              ) : (
                <Textarea
                  register={register("Recommendation")}
                  type="text"
                  //label="Recommendation"
                  placeholder="Write here......"
                />
              )}
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
                type="button"
                onClick={() => setConfirmDialog(true)}
              >
                Submit Operation Note
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
