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
import { FormsHeaderText } from "../../../components/texts";
import client from "../../../feathers";
import CloseIcon from "@mui/icons-material/Close";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import CustomConfirmationDialog from "../../../components/confirm-dialog/confirm-dialog";
import PatientInformation from "./PatientInformation";
import MedicalHistory from "./MedicalHistory";
//import SpecialHistory from "./PediatricHistory";
import PhysicalExamination from "./PhysicalExamination";
import ManagementPlan from "./ManagementPlan";
import FamilyHistory from "./FamilyHistory";
import PediatricHistory from "./PediatricHistory";

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

export default function ClerkingForm() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const ClientServ = client.service("clinicaldocument");
  //const navigate=useNavigate()
  const { user } = useContext(UserContext);

  const [currentUser, setCurrentUser] = useState();
  const { state, setState, hideActionLoader, showActionLoader } =
    useContext(ObjectContext);
  const [docStatus, setDocStatus] = useState("Draft");
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  const [tabValue, setTabValue] = React.useState(0);
  const [id, setId] = useState("");

  const useFormWithBlurHandler = () => {
    const { register, handleSubmit, setValue, reset, watch } = useForm();

    const handleInputBlur = (event) => {
      // Perform your custom logic here
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
      registerWithBlur,
    };
  };

  const { handleSubmit, setValue, reset, registerWithBlur, watch } =
    useFormWithBlurHandler();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNext = () => {
    setTabValue(tabValue + 1);
  };

  useEffect(() => {
    console.log(draftDoc);
    if ((!!draftDoc && draftDoc.status === "Draft") || draftDoc?._id) {
      setId(draftDoc?._id);
      Object.entries(draftDoc.documentdetail).map(([keys, value], i) => {
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

  useEffect(() => {
    setCurrentUser(user);
    return () => {};
  }, [user]);

  const document_name = state.DocumentClassModule.selectedDocumentClass.name;

  // Start

  function saveDraft(data, e) {
    // console.log(data);

    e.preventDefault();
    setError(false);
    setSuccess(false);
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
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

    // console.log(draftDoc?._id, document);
    if ((!!draftDoc && draftDoc.status === "Draft") || id !== "") {
      //console.log(id, document);
      ClientServ.patch(id, document)
        .then((res) => {
          console.log(res);
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
          console.log(res);
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
    setError(false);
    setSuccess(false);
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
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
          //console.log(res);
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });

          setDocStatus("Draft");
          setSuccess(true);
          toast.success("Documentation updated succesfully");
          setSuccess(false);
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
          setSuccess(true);
          toast.success("Documentation created succesfully");
          setSuccess(false);
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
              <Tab label="Patient Information" {...a11yProps(0)} />
              <Tab
                label="Medical History"
                {...a11yProps(1)}
                //disabled={unlockedTabs <= 1}
              />
              <Tab
                label="Family & Social History"
                {...a11yProps(2)}
                //disabled={unlockedTabs <= 2}
              />
              <Tab
                label="Pediatrics History"
                {...a11yProps(3)}
                //disabled={unlockedTabs <= 3}
              />
              <Tab
                label="Physical & Clinical Examination"
                {...a11yProps(4)}
                //disabled={unlockedTabs <= 4}
              />
              <Tab
                label="Management Plan"
                {...a11yProps(5)}
                //disabled={unlockedTabs <= 5}
              />
            </Tabs>
          </Box>

          <>
            <CustomTabPanel value={tabValue} index={0}>
              <PatientInformation
                register={registerWithBlur}
                handleNext={handleNext}
              />
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={1}>
              <MedicalHistory
                handleNext={handleNext}
                register={registerWithBlur}
              />
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={2}>
              <FamilyHistory
                handleNext={handleNext}
                register={registerWithBlur}
              />
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={3}>
              <PediatricHistory
                handleNext={handleNext}
                register={registerWithBlur}
              />
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={4}>
              <PhysicalExamination
                handleNext={handleNext}
                register={registerWithBlur}
              />
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={5}>
              <ManagementPlan
                handleNext={handleNext}
                register={registerWithBlur}
              />
            </CustomTabPanel>
          </>
        </Box>
        {tabValue === 5 && (
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
                  Submit Clerking Form
                </GlobalCustomButton>
              </Box>
            </>
          </div>
        )}
      </div>
    </>
  );
}
