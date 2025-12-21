/* eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { UserContext, ObjectContext } from "../../../context";
import { Box } from "@mui/system";
import RadioButton from "../../../components/inputs/basic/Radio";
("../../");
import { FormsHeaderText } from "../../../components/texts";
import client from "../../../feathers";
import CloseIcon from "@mui/icons-material/Close";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import CustomConfirmationDialog from "../../../components/confirm-dialog/confirm-dialog";
import Consultation from "./Consultation";
import Examination from "./Examination";
import PreliminaryTest from "./Preliminarytest";
// import OtherNotes from "./Othernotes";
import LensPrescription from "./LensPrescription";
import IcdCoding from "./IcdCoding";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function EyeExamination() {
  const ClientServ = client.service("clinicaldocument");
  const { user } = useContext(UserContext);
  const { state, setState, hideActionLoader, showActionLoader } =
    useContext(ObjectContext);
  const [docStatus, setDocStatus] = useState("Draft");
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  const [tabValue, setTabValue] = React.useState(0);
  const [id, setId] = useState("");
  const [diagnosis, setDiagnosis] = useState([]);

  const useFormWithBlurHandler = () => {
    const { register, handleSubmit, setValue, reset, watch, control } =
      useForm();

    const handleInputBlur = (event) => {
      const data = watch();
      saveDraft(data, event);
    };

    const registerWithBlur = (name, rules) => {
      return register(name, {
        ...rules,
        onBlur: handleInputBlur,
      });
    };

    return {
      watch,
      handleSubmit,
      setValue,
      reset,
      control,
      registerWithBlur,
    };
  };

  const { handleSubmit, setValue, reset, registerWithBlur, watch, control } =
    useFormWithBlurHandler();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNext = () => {
    setTabValue(tabValue + 1);
  };

  useEffect(() => {
    // console.log(draftDoc);
    if ((!!draftDoc && draftDoc.status === "Draft") || draftDoc?._id) {
      setId(draftDoc?._id);
      Object.entries(draftDoc.documentdetail).map(([keys, value], i) => {
        if (keys === "Eye diagnosis") {
          let stuff = Array.isArray(value);
          // console.log("key", keys);
          // console.log("value", value);
          //setNewDiag(stuff);
          setDiagnosis(value);
        }
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

  function saveDraft(data, e) {
    e.preventDefault();
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName;
    }
    data["Eye diagnosis"] = diagnosis;
    document.documentdetail = data;

    document.documentname =
      state.DocumentClassModule.selectedDocumentClass.name;
    document.documentClassId =
      state.DocumentClassModule.selectedDocumentClass._id;
    document.location =
      state.employeeLocation.locationName +
      " " +
      state.employeeLocation.locationType;
    // document.locationId = state.employeeLocation.locationId;
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

    // console.log(draftDoc?._id, document);
    if ((!!draftDoc && draftDoc.status === "Draft") || id !== "") {
      //console.log(id, document);
      ClientServ.patch(id, document)
        .then((res) => {
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });

          setDocStatus("Draft");
        })
        .catch((err) => {
          toast.error("Error updating Documentation " + err);
          hideActionLoader();
        });
    } else {
      // console.log('Clinincal note created')
      ClientServ.create(document)
        .then((res) => {
          setId(res._id);
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });
        })
        .catch((err) => {
          toast.error("Error creating Documentation " + err);
          hideActionLoader();
        });
    }
  }

  const onSubmit = (data, e) => {
    // console.log(data);
    showActionLoader();
    e.preventDefault();
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    data["Eye diagnosis"] = diagnosis;
    document.documentdetail = data;

    document.documentname =
      state.DocumentClassModule.selectedDocumentClass.name;
    document.documentClassId =
      state.DocumentClassModule.selectedDocumentClass._id;
    document.location =
      state.employeeLocation.locationName +
      " " +
      state.employeeLocation.locationType;
    // document.locationId = state.employeeLocation.locationId;
    document.client = state.ClientModule.selectedClient._id;
    document.createdBy = user._id;
    document.createdByname = user.firstname + " " + user.lastname;
    document.status = docStatus === "Draft" ? "Draft" : "completed";
    document.appointment_id = state.AppointmentModule.selectedAllAppointment?._id || null;
    document.geolocation = {
      type: "Point",
      coordinates: [state.coordinates.latitude, state.coordinates.longitude],
    };

    //console.log(document);

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

    // console.log(draftDoc?._id, document);
    if (!!draftDoc && draftDoc.status === "Draft") {
      ClientServ.patch(draftDoc._id, document)
        .then((res) => {
          // console.log(res);
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
          // console.log(res);
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
        <Box sx={{ width: "100%" }}>
          <Box>
            <Tabs
              value={tabValue}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons={false}
              aria-label="scrollable auto tabs example"
            >
              <Tab label="Preliminary test" {...a11yProps(0)} />
              <Tab
                label="Examination"
                {...a11yProps(1)}
                //disabled={unlockedTabs <= 1}
              />
              {/* <Tab
                label="Other notes"
                {...a11yProps(2)}
                //disabled={unlockedTabs <= 2}
              /> */}
              <Tab
                label="Lens prescription"
                {...a11yProps(2)}
                //disabled={unlockedTabs <= 3}
              />
              {/* <Tab
                label="Consultation"
                {...a11yProps(3)}
                //disabled={unlockedTabs <= 4}
              /> */}
              <Tab
                label="ICD coding"
                {...a11yProps(3)}
                //disabled={unlockedTabs <= 5}
              />
            </Tabs>
          </Box>

          <>
            <CustomTabPanel value={tabValue} index={0}>
              <PreliminaryTest
                handleNext={handleNext}
                register={registerWithBlur}
                control={control}
              />
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={1}>
              <Examination
                handleNext={handleNext}
                register={registerWithBlur}
              />
            </CustomTabPanel>

            {/* <CustomTabPanel value={tabValue} index={2}>
              <OtherNotes handleNext={handleNext} register={registerWithBlur} />
            </CustomTabPanel> */}

            <CustomTabPanel value={tabValue} index={2}>
              <LensPrescription
                handleNext={handleNext}
                register={registerWithBlur}
              />
            </CustomTabPanel>

            {/* <CustomTabPanel value={tabValue} index={3}>
              <Consultation
                register={registerWithBlur}
                handleNext={handleNext}
              />
            </CustomTabPanel> */}

            <CustomTabPanel value={tabValue} index={3}>
              <IcdCoding
                handleSubmit={handleSubmit}
                control={control}
                handleNext={handleNext}
                register={registerWithBlur}
                reset={reset}
                diagnosis={diagnosis}
                setDiagnosis={setDiagnosis}
              />
            </CustomTabPanel>
          </>
        </Box>
        {tabValue === 3 && (
          <div
            style={{
              display: "flex",
              justifySelf: "right",
            }}
            className="card-content vscrollable"
          >
            <>
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
                  gap: "1rem",
                }}
              >
                <GlobalCustomButton
                  color="secondary"
                  type="submit"
                  onClick={() => setConfirmationDialog(true)}
                >
                  Submit Eye Examination Form
                </GlobalCustomButton>
              </Box>
            </>
          </div>
        )}
      </div>
    </>
  );
}
