import React, { useState, useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import client from "../../../feathers";
import { toast } from "react-toastify";
import { UserContext, ObjectContext } from "../../../context";
import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import CustomTable from "../../../components/customtable";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import Input from "../../../components/inputs/basic/Input";
import CustomSelect from "../../../components/inputs/basic/Select";
// import MuiCustomDatePicker from "../../../components/inputs/Date/MuiDatePicker";
import Textarea from "../../../components/inputs/basic/Textarea";
// import CloseIcon from "@mui/icons-material/Close";
import { FormsHeaderText } from "../../../components/texts";
import dayjs from "dayjs";
import CustomConfirmationDialog from "../../../components/confirm-dialog/confirm-dialog";
import { LineChart } from "@mui/x-charts";
// import MuiDateTimePicker from "../../../components/inputs/DateTime/MuiDateTimePicker";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
// import CustomTable from "../../components/customtable";

const FluidIntakeOutput = () => {
  const { register, handleSubmit, setValue, control, reset, getValues } =
    useForm();
  const fluidTypeOptions = ["Input", "Output"];
  const { user, setUser } = useContext(UserContext);
  const [facilities, setFacilities] = useState([]);
  const [selectedFluid, setSelectedFluid] = useState();
  const [chosen, setChosen] = useState(true);
  const [chosen1, setChosen1] = useState(true);
  const [chosen2, setChosen2] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [values, setValues] = useState("1");

  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [docStatus, setDocStatus] = useState("Draft");
  const ClientServ = client.service("clinicaldocument");
  const fac = useRef([]);
  const struc = useRef([]);

  const handleChange = (event, newValue) => {
    setValues(newValue);
  };

  // const handleRow = () => {
  //   console.log("let's pray");
  // };

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  const checkonadmission = () => {
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
    if (!data.fluidType || data.fluidType === "") {
      return toast.error("Please select a fluid type");
    }
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
    //handleSave()
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
          const resetData = {
            fluidType: "",
            fluidTime: null,
            route: "",
            fluid: "",
            volume: "",
            comment: "",
          };
          reset(resetData);
          setValue("fluidTime", null);
          toast.success("Fluid Input/Output entry successful");
        })
        .catch((err) => {
          hideActionLoader();
          setConfirmDialog(false);
          toast.error("Fluid Input/Output entry " + err);
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
          const resetData = {
            fluidType: "",
            fluidTime: null,
            route: "",
            fluid: "",
            volume: "",
            comments: "",
          };
          reset(resetData);
          setValue("fluidTime", null);
          toast.success("Fluid Input/Output entry successful");
        })
        .catch((err) => {
          setConfirmDialog(false);
          hideActionLoader();
          toast.error("Fluid Input/Output entry " + err);
        });
    }
  };

  const inputFluidSchema = [
    // {
    //   name: "S/N",
    //   key: "sn",
    //   description: "SN",
    //   selector: (row, i) => i + 1,
    //   sortable: true,
    //   inputType: "HIDDEN",
    //   width: "50px",
    // },

    {
      name: "Route",
      key: "route",
      description: "route",
      selector: (row) => row.route,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Volume",
      key: "fluid",
      description: "fluid",
      selector: (row) => row.volume,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    // {
    //   name: "comments",
    //   key: "comments",
    //   description: "comments",
    //   selector: (row) => row.comments,
    //   sortable: true,
    //   required: true,
    //   inputType: "TEXT",
    // },

    {
      name: "Fluid Type",
      key: "fluidtype",
      description: "fluidtype",
      selector: (row) => row.fluid,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Entry Time",
      key: "route",
      description: "route",
      selector: (row) => dayjs(row.entrytime).format("DD-MM HH:mm:ss"),
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
  ];

  const outputFluidSchema = [
    // {
    //   name: "S/N",
    //   key: "sn",
    //   description: "SN",
    //   selector: (row, i) => i + 1,
    //   sortable: true,
    //   inputType: "HIDDEN",
    //   width: "50px",
    // },

    // {
    //   name: "Date/Time",
    //   key: "route",
    //   description: "route",
    //   selector: (row) => dayjs(row.fluid_time).format("HH:mm:ss"),
    //   sortable: true,
    //   required: true,
    //   inputType: "TEXT",
    // },

    {
      name: "Route",
      key: "route",
      description: "route",
      selector: (row) => row.route,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Volume",
      key: "fluid",
      description: "fluid",
      selector: (row) => row.volume,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    // {
    //   name: "comments",
    //   key: "comments",
    //   description: "comments",
    //   selector: (row) => row.comments,
    //   sortable: true,
    //   required: true,
    //   inputType: "TEXT",
    // },

    {
      name: "Fluid Type",
      key: "fluidtype",
      description: "fluidtype",
      selector: (row) => row.fluid,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Entry Time",
      key: "route",
      description: "route",
      selector: (row) => dayjs(row.entrytime).format("DD-MM HH:mm:ss"),
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
  ];

  const data = facilities || [];

  const toNumber = (value) => (isNaN(Number(value)) ? 0 : Number(value));

  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.fluidTime);
    const hours = itemDate.getHours();
    return hours >= 0 && hours < 12;
  });

  const inputValues = new Array(12).fill(0);
  const outputValues = new Array(12).fill(0);

  let totalInputVolume = 0;
  let totalOutputVolume = 0;

  filteredData.forEach((item) => {
    const itemDate = new Date(item.fluidTime);
    const hour = itemDate.getHours();
    const volume = toNumber(item.volume);

    if (item.fluidType === "Input") {
      inputValues[hour] += volume;
      totalInputVolume += volume;
    }
    if (item.fluidType === "Output") {
      outputValues[hour] += volume;
      totalOutputVolume += volume;
    }
  });

  const series = [
    {
      data: inputValues,
      label: "Input",
      color: "#3b82f6",
      connectNulls: true,
    },
    {
      data: outputValues,
      label: "Output",
      color: "#ef4444",
      connectNulls: true,
    },
  ];

  const timeSlots = Array.from(
    { length: 12 },
    (_, hour) => `${hour.toString().padStart(2, "0")}:00`
  );

  if (!timeSlots.length) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>No fluid data available</Typography>
      </Box>
    );
  }

  return (
    <div className="card">
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={() => setConfirmDialog(false)}
        confirmationAction={handleSubmit(onSubmit)}
        type="create"
        message={`You are about to create an ${getValues("fluidType")} Chart ?`}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
        mb={1}
      >
        <FormsHeaderText text="Fluid Intake and Output Chart" />
      </Box>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={values}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Form" value="1" />
              <Tab label="Table" value="2" />
              <Tab label="Charts" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div className="card-content vscrollable  pt-0">
              <>
                <Box mb="1rem">
                  <Input
                    name="fluidDate/Time"
                    label="Fluid Date and Time"
                    register={register("fluidDate/Time")}
                    type="datetime-local"
                  />
                </Box>

                <Box mb="1rem">
                  <CustomSelect
                    control={control}
                    label="Fluid Type"
                    name="fluidType"
                    required={true}
                    // required={true}
                    options={fluidTypeOptions}
                  />
                </Box>
                <Box mb="1rem">
                  <Input
                    register={register("route")}
                    name="route"
                    label="Route"
                    type="text"
                  />
                </Box>
                <Box mb="1rem">
                  <Input
                    register={register("fluid")}
                    name="fluid"
                    label="Fluid"
                    type="text"
                  />
                </Box>
                <Box mb="1rem">
                  <Input
                    register={register("volume")}
                    name="volume"
                    label="Volume (mls)"
                    type="number"
                  />
                </Box>
                <Box mb="1rem">
                  <Input
                    register={register("Time Discontinued")}
                    name="Time Discontinued"
                    label="Time Discontinued"
                    type="time"
                  />
                </Box>
                <Box mb="1rem">
                  <Input
                    register={register("Total Input")}
                    name="Total Input"
                    label="Total Input"
                    type="number"
                  />
                </Box>
                <Box mb="1rem">
                  <Input
                    register={register("Total Output")}
                    name="Total Output"
                    label="Total Output"
                    type="number"
                  />
                </Box>
                <Box mb="1rem">
                  <Textarea
                    register={register("comments")}
                    name="comments"
                    label="Comments"
                    type="text"
                  />
                </Box>

                <Box mb="1rem">
                  <GlobalCustomButton
                    color="secondary"
                    onClick={() => setConfirmDialog(true)}
                    text={`Submit Chart`}
                  />
                </Box>
              </>
            </div>
          </TabPanel>
          <TabPanel value="2">
            <Box display="flex" flexDirection="row" alignItems="flex-start">
              {facilities?.filter((item) => item?.fluidType === "Input")
                ?.length > 0 && (
                <Box sx={{ marginRight: 2 }}>
                  <Typography py={1}>Input Fluid Type</Typography>
                  <CustomTable
                    title={"Fluid Intake"}
                    columns={inputFluidSchema}
                    data={facilities.filter(
                      (item) => item?.fluidType === "Input"
                    )}
                    // onRowClicked={handleRow}
                    pointerOnHover
                    highlightOnHover
                    striped
                    CustomEmptyData={
                      <Typography sx={{ fontSize: "0.85rem" }}>
                        No Fluid Intake added yet
                      </Typography>
                    }
                  />
                  <Typography variant="p" pt={8} fontSize="14px">
                    Total Input Volume (00:00 - 11:59): {totalInputVolume}
                  </Typography>
                </Box>
              )}

              {facilities?.filter((item) => item?.fluidType === "Output")
                ?.length > 0 && (
                <Box>
                  <Typography py={1}>Output Fluid Type</Typography>
                  <CustomTable
                    title={"Fluid Output"}
                    columns={outputFluidSchema}
                    data={facilities.filter(
                      (item) => item?.fluidType === "Output"
                    )}
                    // onRowClicked={handleRow}
                    pointerOnHover
                    highlightOnHover
                    striped
                    CustomEmptyData={
                      <Typography sx={{ fontSize: "0.85rem" }}>
                        No Fluid Output added yet
                      </Typography>
                    }
                  />
                  <Typography variant="p" pt={8} fontSize="14px">
                    Total Output Volume (00:00 - 11:59): {totalOutputVolume}
                  </Typography>
                </Box>
              )}
            </Box>
          </TabPanel>
          <TabPanel value="3">
            <Box sx={{ width: "100%", height: 500 }}>
              <LineChart
                xAxis={[
                  {
                    data: timeSlots,
                    scaleType: "point",
                    label: "Fluid Intake and Output Chart",
                  },
                ]}
                grid={{ vertical: true, horizontal: true }}
                yAxis={[{ label: "Volume", min: 0 }]}
                series={series}
                height={400}
                margin={{ top: 50, bottom: 70, left: 70, right: 20 }}
                slotProps={{
                  legend: {
                    direction: "row",
                    position: { vertical: "top", horizontal: "middle" },
                    padding: 0,
                    itemGap: 20,
                  },
                }}
              />
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default FluidIntakeOutput;
