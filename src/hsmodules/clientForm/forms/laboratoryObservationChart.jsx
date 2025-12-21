import React, { useState, useContext, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { formatDistanceToNowStrict, format, subDays, addDays } from "date-fns";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import Input from "../../../components/inputs/basic/Input";
import MuiCustomDatePicker from "../../../components/inputs/Date/MuiDatePicker";
import Textarea from "../../../components/inputs/basic/Textarea";
import CloseIcon from "@mui/icons-material/Close";
import { FormsHeaderText } from "../../../components/texts";
import { toast } from "react-toastify";
import CustomConfirmationDialog from "../../../components/confirm-dialog/confirm-dialog";
import { UserContext, ObjectContext } from "../../../context";
import client from "../../../feathers";
import CustomTable from "../../../components/customtable";
import { LineChart } from "@mui/x-charts";
import MuiDateTimePicker from "../../../components/inputs/DateTime/MuiDateTimePicker";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const LaboratoryObservationChart = () => {
  const { register, handleSubmit, setValue, control, reset, getValues } =
    useForm();
  const { user, setUser } = useContext(UserContext);
  const [facilities, setFacilities] = useState([]);
  const [chosen, setChosen] = useState(true);
  const [chosen1, setChosen1] = useState(true);
  const [chosen2, setChosen2] = useState(true);
  const [values, setValues] = useState("1");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const {
    state,
    setState,
    toggleSideMenu,
    showActionLoader,
    hideActionLoader,
  } = useContext(ObjectContext);
  const [docStatus, setDocStatus] = useState("Draft");
  const ClientServ = client.service("clinicaldocument");
  const fac = useRef([]);
  const struc = useRef([]);

  const handleRow = () => {
    console.log("let's pray");
  };

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  const checkonadmission = () => {
    // console.log(state.ClientModule.selectedClient.admission_id);
    if (state.ClientModule.selectedClient.admission_id) {
      setChosen2(false);
    } else {
      toast.error("Patient not on admission");
    }
  };

  useEffect(() => {
    checkonadmission();
    findexistingChart();

    return () => {};
  }, [draftDoc]);

  const findexistingChart = async () => {
    const findClinic = await ClientServ.find({
      query: {
        client: state.ClientModule.selectedClient._id,
        facility: user.currentEmployee.facilityDetail._id,
        documentname: state.DocumentClassModule.selectedDocumentClass.name,
        episodeofcare_id: state.ClientModule.selectedClient.admission_id,

        $limit: 20,
        $sort: {
          createdAt: -1,
        },
      },
    });

    fac.current = findClinic.data[0];
    //console.log(fac.current)
    if (findClinic.total > 1) {
      setChosen1(false);
      setFacilities(fac.current.documentdetail.recordings);
    }
  };

  const closeForm = async () => {
    let documentobj = {};
    documentobj.name = "";
    documentobj.facility = "";
    documentobj.document = "";
    //  alert("I am in draft mode : " + Clinic.documentname)
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

  useEffect(() => {
    if (!!draftDoc && draftDoc.status === "Draft") {
      setFacilities(draftDoc.documentdetail.recordings);
    }
    return () => {
      draftDoc = {};
    };
  }, [draftDoc]);

  const onSubmit = async (data) => {
    showActionLoader();
    data.entrytime = new Date();
    data.location =
      state.employeeLocation.locationName +
      " " +
      state.employeeLocation.locationType;
    data.locationId = state.employeeLocation.locationId;
    data.episodeofcare_id = state.ClientModule.selectedClient.admission_id;
    data.createdBy = user._id;
    data.createdByname = user.firstname + " " + user.lastname;
    struc.current = [data, ...facilities];
    setFacilities((prev) => [data, ...facilities]);
    setChosen(false);
    let document = {};
    data = {};
    data.recordings = struc.current;
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName;
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
    document.episodeofcare_id = state.ClientModule.selectedClient.admission_id;
    document.appointment_id = state.AppointmentModule.selectedAllAppointment?._id || null;
    document.geolocation = {
      type: "Point",
      coordinates: [state.coordinates.latitude, state.coordinates.longitude],
    };

    if (chosen1) {
      ClientServ.create(document)
        .then((res) => {
          setChosen(true);
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });
          setConfirmDialog(false);
          hideActionLoader();
          const resetValue = {
            name: "",
            regNumber: "",
            dateAndTime: null,
            temp: "",
            p: "",
            r: "",
            bldPre: "",
            fh: "",
            fluidIntake: "",
            fluidOutput: "",
            contractions: "",
            remark: "",
          };
          reset(resetValue);
          setValue("dateAndTime", null);

          toast.success("Labour Observation Chart entry successful");
        })
        .catch((err) => {
          hideActionLoader();
          setConfirmDialog(false);
          toast.error("Labour Observation Chart " + err);
        });
    } else {
      ClientServ.patch(fac.current._id, {
        documentdetail: document.documentdetail,
      })
        .then((res) => {
          setChosen(true);
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });
          hideActionLoader();
          setConfirmDialog(false);
          const resetValue = {
            name: "",
            regNumber: "",
            dateAndTime: null,
            temp: "",
            p: "",
            r: "",
            bldPre: "",
            fh: "",
            fluidIntake: "",
            fluidOutput: "",
            contractions: "",
            remark: "",
          };
          reset(resetValue);
          setValue("dateAndTime", null);
          toast.success("Labour Observation Chart entry successful");
        })
        .catch((err) => {
          setConfirmDialog(false);
          hideActionLoader();
          toast.error("Labour Observation Chart entry " + err);
        });
    }
  };

  // console.log(facilities, "facilities");

  const LabourObservationChartSchema = [
    {
      name: "Name",
      key: "name",
      description: "Name",
      selector: (row) => row.name,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Reg.No",
      key: "regNumber",
      description: "Reg.No",
      selector: (row) => row.regNumber,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Date & Time",
      key: "dateAndTime",
      description: "Date & Time",
      selector: (row) => dayjs(row.dateAndTime).format("DD_MM HH:mm:ss"),
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Temp",
      key: "temp",
      description: "Temp",
      selector: (row) => row.temp,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "P",
      key: "p",
      description: "P",
      selector: (row) => row.p,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "R",
      key: "r",
      description: "R",
      selector: (row) => row.r,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "B/P",
      key: "bldPre",
      description: "B/P",
      selector: (row) => row.bldPre,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "FH",
      key: "fh",
      description: "FH",
      selector: (row) => row.fh,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Fluid Intake",
      key: "fluidIntake",
      description: "Fluid Intake",
      selector: (row) => row.fluidIntake,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Fluid Output",
      key: "fluidOutput",
      description: "Fluid Output",
      selector: (row) => row.fluidOutput,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Contractions Frequency & Strength",
      key: "contractions",
      description: "Contractions Frequency & Strength",
      selector: (row) => row.contractions,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Remark",
      key: "remark",
      description: "Remark",
      selector: (row) => row.remark,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
  ];

  const data = facilities || [];

  const toNumber = (value) => Number(value) || 0;

  const generateTimeRange = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      const formattedTime = `${hour.toString().padStart(2, "0")}:00`;
      times.push(formattedTime);
    }
    return times;
  };

  const timeLabels = generateTimeRange();

  const metrics = {
    bloodPressure: new Array(timeLabels.length).fill(null),
    contractions: new Array(timeLabels.length).fill(null),
    fetalHeartRate: new Array(timeLabels.length).fill(null),
    pulse: new Array(timeLabels.length).fill(null),
    respiration: new Array(timeLabels.length).fill(null),
    temperature: new Array(timeLabels.length).fill(null),
    fluidIntake: new Array(timeLabels.length).fill(null),
    fluidOutput: new Array(timeLabels.length).fill(null),
  };

  data.forEach((item) => {
    const date = new Date(item.dateAndTime);
    const timeIndex = timeLabels.findIndex((label) => {
      const labelHour = parseInt(label.split(":")[0]);
      const itemHour = date.getHours();
      return labelHour === itemHour;
    });

    if (timeIndex !== -1) {
      metrics.bloodPressure[timeIndex] = toNumber(item.bldPre);
      metrics.contractions[timeIndex] = toNumber(item.contractions);
      metrics.fetalHeartRate[timeIndex] = toNumber(item.fh);
      metrics.pulse[timeIndex] = toNumber(item.p);
      metrics.respiration[timeIndex] = toNumber(item.r);
      metrics.temperature[timeIndex] = toNumber(item.temp);
      metrics.fluidIntake[timeIndex] = toNumber(item.fluidIntake);
      metrics.fluidOutput[timeIndex] = toNumber(item.fluidOutput);
    }
  });

  const series = [
    {
      data: metrics.bloodPressure,
      label: "Blood Pressure",
      color: "#ef4444",
      curve: "linear",
      connectNulls: true,
    },
    {
      data: metrics.contractions,
      label: "Contractions",
      color: "#3b82f6",
      curve: "linear",
      connectNulls: true,
    },
    {
      data: metrics.fetalHeartRate,
      label: "Fetal Heart Rate",
      color: "#22c55e",
      curve: "linear",
      connectNulls: true,
    },
    {
      data: metrics.pulse,
      label: "Pulse",
      color: "#f59e0b",
      curve: "linear",
      connectNulls: true,
    },
    {
      data: metrics.respiration,
      label: "Respiration",
      color: "#8b5cf6",
      curve: "linear",
      connectNulls: true,
    },
    {
      data: metrics.temperature,
      label: "Temperature",
      color: "#ec4899",
      curve: "linear",
      connectNulls: true,
    },
    {
      data: metrics.fluidIntake,
      label: "Fluid Intake",
      color: "#14b8a6",
      curve: "linear",
      connectNulls: true,
    },
    {
      data: metrics.fluidOutput,
      label: "Fluid Output",
      color: "#6366f1",
      curve: "linear",
      connectNulls: true,
    },
  ];

  const handleChange = (event, newValue) => {
    setValues(newValue);
  };

  return (
    <div className="card">
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={() => setConfirmDialog(false)}
        confirmationAction={handleSubmit(onSubmit)}
        type="create"
        message={`You are about to create an Labour Observation Chart?`}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
        mb={1}
      >
        <FormsHeaderText text="Labour Observation Chart" />

        {/* <IconButton onClick={closeForm}>
          <CloseIcon fontSize="small" />
        </IconButton> */}
      </Box>
      <Box sx={{ width: "100%" }}>
        <TabContext value={values}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Form" value="1" />
              <Tab label="Table" value="2" />
              <Tab label="Charts" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
           
              <Box mb="1rem">
                <Input
                  register={register("name")}
                  name="name"
                  label="Name"
                  type="text"
                />
              </Box>

              <Box mb="1rem">
                <Input
                  register={register("regNumber")}
                  name="regNumber"
                  label="Reg.No"
                  type="text"
                />
              </Box>

              <Box mb="1rem">
                <Input
                  name="dateAndTime"
                  label="Date & Time"
                  register={register("dateAndTime")}
                  type="datetime-local"
                />
              </Box>

              <Box mb="1rem">
                <Input
                  register={register("temp")}
                  name="temp"
                  label="Temp"
                  type="text"
                />
              </Box>

              <Box mb="1rem">
                <Input
                  register={register("p")}
                  name="P"
                  label="P"
                  type="text"
                />
              </Box>

              <Box mb="1rem">
                <Input
                  register={register("r")}
                  name="R"
                  label="R"
                  type="text"
                />
              </Box>

              <Box mb="1rem">
                <Input
                  register={register("bldPre")}
                  name="b/p"
                  label="B/P"
                  type="text"
                />
              </Box>

              <Box mb="1rem">
                <Input
                  register={register("fh")}
                  name="fh"
                  label="FH"
                  type="text"
                />
              </Box>

              <Box mb="1rem">
                <Input
                  register={register("fluidIntake")}
                  name="fluid_intake"
                  label="Fluid Intake"
                  type="text"
                />
              </Box>

              <Box mb="1rem">
                <Input
                  register={register("fluidOutput")}
                  name="fluidOutput"
                  label="Fluid Output"
                  type="text"
                />
              </Box>

              <Box mb="1rem">
                <Input
                  register={register("Cervical Dilation")}
                  name="Cervical Dilation"
                  label="Cervical Dilation"
                  type="text"
                />
              </Box>

              <Box mb="1rem">
                <Textarea
                  register={register("Presentation")}
                  name="Presentation"
                  label="Presentation"
                  type="text"
                />
              </Box>

              <Box mb="1rem">
                <Input
                  register={register("Pain")}
                  name="Pain"
                  label="Pain"
                  type="text"
                />
              </Box>

              <Box mb="1rem">
                <Input
                  register={register("contractions")}
                  name="contractions"
                  label="Contractions Frequency & Strength"
                  type="text"
                />
              </Box>

              <Box mb="1rem">
                <Textarea
                  register={register("remark")}
                  name="remark"
                  label="Remark"
                  type="text"
                />
              </Box>
              <Box mb="1rem">
                <GlobalCustomButton
                  color="secondary"
                  onClick={() => setConfirmDialog(true)}
                  text={`Submit Labour Observation Chart`}
                />
              </Box>
           
          </TabPanel>
          <TabPanel value="2">
            <Box>
              <CustomTable
                title={"Labour Observation Chart"}
                columns={LabourObservationChartSchema}
                data={facilities}
                onRowClicked={handleRow}
                pointerOnHover
                highlightOnHover
                striped
                CustomEmptyData={
                  <Typography sx={{ fontSize: "0.85rem" }}>
                    No Vital Signs added yet
                  </Typography>
                }
              />
            </Box>
          </TabPanel>
          <TabPanel value="3">
            <Box sx={{ width: "100%", height: 500 }}>
              <LineChart
                xAxis={[
                  {
                    data: timeLabels,
                    scaleType: "point",
                    label: "Labour Observation Chart",
                  },
                ]}
                yAxis={[
                  {
                    label: "Values",
                  },
                ]}
                series={series}
                height={450}
                margin={{ top: 100 }}
                slotProps={{
                  legend: {
                    direction: "row",
                    position: { vertical: "top", horizontal: "middle" },
                    padding: 0,
                    itemGap: 20,
                  },
                }}
                grid={{ vertical: true, horizontal: true }}
              />
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default LaboratoryObservationChart;
