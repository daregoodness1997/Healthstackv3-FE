import React, { useState, useContext, useEffect } from "react";
import client from "../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../context";
import { toast } from "react-toastify";
import { Grid, IconButton, Typography } from "@mui/material";

import Input from "../../components/inputs/basic/Input";
import { FormsHeaderText } from "../../components/texts";
import CloseIcon from "@mui/icons-material/Close";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import Textarea from "../../components/inputs/basic/Textarea";
import { Box } from "@mui/system";
import RadioButton from "../../components/inputs/basic/Radio";

export function OrthodonticAnalysis() {
  const { register, handleSubmit, setValue, reset, getValues } = useForm();
  const ClientServ = client.service("clinicaldocument");
  const { user } = useContext(UserContext);
  const { state, setState, hideActionLoader } = useContext(ObjectContext);
  const [docStatus, setDocStatus] = useState("Draft");
  const [confirmationDiaglog, setConfirmationDialog] = useState(false);

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
    e.preventDefault();
    let document = {};

    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }

    document.documentdetail = {
      ...data,
    };
    document.documentname = "Orthodontic Analysis";
    document.documentType = "Orthodontic Analysis";
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
          setConfirmationDialog(false);
          hideActionLoader(true);
          reset(data);
          toast.success("Documentation updated successfully");
          closeForm();
        })
        .catch((err) => {
          toast.error("Error updating Documentation: " + err);
          reset(data);
          setConfirmationDialog(false);
        });
    } else {
      ClientServ.create(document)
        .then(() => {
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });
          hideActionLoader();
          reset(data);
          setConfirmationDialog(false);
          toast.success("Orthodontic Analysis created successfully");
          closeForm();
        })
        .catch((err) => {
          toast.error("Error creating Orthodontic Analysis: " + err);
          setConfirmationDialog(false);
        });
    }
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

  const closeForm = async () => {
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
          open={confirmationDiaglog}
          cancelAction={() => setConfirmationDialog(false)}
          confirmationAction={handleSubmit(onSubmit)}
          type="create"
          message={`You are about to save this document ${getValues(
            "eye"
          )} Orthodontic Analysis?`}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          mb={1}
        >
          <FormsHeaderText color="none" text={"ORTHODONTIC ANALYSIS FORM"} />

          <IconButton onClick={closeEncounterRight}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <div className="card-content vscrollable remPad1">
          <>
            <Typography
              style={{ marginTop: "20px", marginBottom: "20px" }}
              fontWeight="bold"
              color="primary"
              variant="body1"
            >
              General Dental Analysis
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  Teeth Erupted
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("teetherupt")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  Teeth of Poor Prognosis
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("prognosis")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  First Permanent Molars:
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("molars")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
            </Grid>

            <Typography
              style={{ marginTop: "20px", marginBottom: "20px" }}
              fontWeight="bold"
              color="primary"
              variant="body1"
            >
              D. M .F
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography color="primary" variant="body2">
                  D:
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("d")}
                    name="text"
                    type="text"
                    placeholder="type here..."
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography color="primary" variant="body2">
                  M:
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("m")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography color="primary" variant="body2">
                  F:
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("f")}
                    name="text"
                    type="text"
                    placeholder="Type here"
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography color="primary" variant="body2">
                  Ant-post Relationship:
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("antpost")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography color="primary" variant="body2">
                  Overbite:
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("overbite")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography color="primary" variant="body2">
                  Overjet:
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("overjet")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography color="primary" variant="body2">
                  Tooth Bone Ratio:
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("toothbone")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography color="primary" variant="body2">
                  Upper:
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("upper")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography color="primary" variant="body2">
                  Lower:
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("lower")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  Dental Caries
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("dentalcaries")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  Oral Hygiene.Gingivities
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("oralhygiene")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  Lips
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("lips")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  Habits
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("habits")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography color="primary" variant="body2">
                  Tongue:
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("tongue")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography color="primary" variant="body2">
                  Speech:
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("speech")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography color="primary" variant="body2">
                  Dental Ortho Anomalies:
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("dentalortho")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
            </Grid>

            <Typography fontWeight="bold" color="primary" variant="body1">
              Clinial Skeletal Analysis
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  U.Incisor Angle
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("uincisor")}
                    name="text"
                    type="text"
                    placeholder="Enter rfa"
                  />
                </Box>
                <Typography color="primary" variant="body2">
                  L.Incisor Angle
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("lincisor")}
                    name="text"
                    type="text"
                    placeholder="TYpe here"
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  FM Angle
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("fmangle")}
                    name="text"
                    type="text"
                    placeholder="Type here"
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  SK Pattern
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("clinicalskpattern")}
                    name="text"
                    type="text"
                    placeholder="Type here"
                  />
                </Box>
              </Grid>
            </Grid>

            <Typography fontWeight="bold" color="primary" variant="body1">
              Cephalometric Analysis
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  U.Incisor Angle
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("uincisor2")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
                <Typography color="primary" variant="body2">
                  L.Incisor Angle
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("lincisor2")}
                    name="text"
                    type="text"
                    placeholder="Type here"
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  S.N.A
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("sna")}
                    name="text"
                    type="text"
                    placeholder="Type here"
                  />
                </Box>
                <Typography color="primary" variant="body2">
                  S.N.B
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("snb")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  A.N.B
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("anb")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
                <Typography color="primary" variant="body2">
                  S.K Pattern
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("cephalometricskpattern")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  MM Angle
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("mmangle")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
            </Grid>
            <Typography fontWeight="bold" color="primary" variant="body1">
              X-Ray Report
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  Unerupted Teeth
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("unreptedteeth")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
                <Typography color="primary" variant="body2">
                  Absent Teeth
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("absentteeth")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  Dental Care
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("dentalcare")}
                    name="text"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
            </Grid>
            <Typography fontWeight="bold" color="primary" variant="body1">
              Summary of Orthodontic Analysis
            </Typography>
            <Box style={{ marginTop: "10px", marginBottom: "30px" }}>
              <Textarea
                color="primary"
                register={register("summary")}
                name="findings"
                type="text"
                placeholder="Type here..."
              />
            </Box>

            <Typography fontWeight="bold" color="primary" variant="body1">
              Plan of Treatment
            </Typography>
            <Box style={{ marginTop: "10px", marginBottom: "30px" }}>
              <Textarea
                color="primary"
                register={register("plantreatment")}
                name="findings"
                type="text"
                placeholder="Type here..."
              />
            </Box>
            <Typography fontWeight="bold" color="primary" variant="body1">
              Other Remarks
            </Typography>
            <Box style={{ marginTop: "10px", marginBottom: "30px" }}>
              <Textarea
                color="primary"
                register={register("otherremarks")}
                name="findings"
                type="text"
                placeholder="Type here..."
              />
            </Box>

            <Box
              sx={{
                gap: "1rem",
              }}
            >
              <RadioButton
                onChange={handleChangeStatus}
                name="status"
                options={["Draft", "Final"]}
                value={docStatus}
              />
            </Box>
            <Box
              spacing={3}
              sx={{
                display: "flex",
                gap: "3rem",
              }}
            >
              <GlobalCustomButton
                color="secondary"
                type="submit"
                onClick={() => setConfirmationDialog(true)}
              >
                Submit Othodontic Form
              </GlobalCustomButton>
            </Box>
          </>
        </div>
      </div>
    </>
  );
}
