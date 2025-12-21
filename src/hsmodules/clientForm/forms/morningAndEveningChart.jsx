import React, { useContext, useState } from 'react';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import { useForm } from 'react-hook-form';
import Input from "../../../components/inputs/basic/Input";
import CustomTable from "../../../components/customtable";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import { FormsHeaderText } from '../../../components/texts';
import client from '../../../feathers';
import { ObjectContext, UserContext } from '../../../context';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { useEffect } from 'react';
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { LineChart } from '@mui/x-charts';
import { useMemo } from 'react';

const MorningAndEveningChart = () => {
    const { register, handleSubmit, setValue, control, reset, getValues } =
    useForm();
  const { user} = useContext(UserContext);
  const [facilities, setFacilities] = useState([]);
  const [chosen, setChosen] = useState(true);
  const [chosen1, setChosen1] = useState(true);
  const [chosen2, setChosen2] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [docStatus, setDocStatus] = useState("Draft");
  const ClientServ = client.service("clinicaldocument");
  const fac = useRef([]);
  const struc = useRef([]);
  const [values, setValues] = useState("1");

  const handleChange = (event,newValue) => {
    setValues(newValue);
  }

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
          const resetData = {
            date: "",
            time: null,
            pulse: "",
            bowel: "",
            daysOfDischarge: "",
            urine: "",
          };
          reset(resetData);
        //   setValue("fluidTime", null);
          toast.success("Form created successful");
        })
        .catch((err) => {
          hideActionLoader();
          setConfirmDialog(false);
          toast.error("An error occured " + err);
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
            date: "",
            time: null,
            pulse: "",
            bowel: "",
            daysOfDischarge: "",
            urine: "",
          };
          reset(resetData);
        //   setValue("fluidTime", null);
          toast.success("form successful");
        })
        .catch((err) => {
          setConfirmDialog(false);
          hideActionLoader();
          toast.error("An error occured " + err);
        });
    }
  };

  const morningAndEveningChartSchema = [
    {
      name: "Date",
      key: "date",
      description: "Date",
      selector: (row) => row.date,
      sortable: true,
      required: true,
      inputType: "DATE",
    },
    {
      name: "Time",
      key: "time",
      description: "Time",
      selector: (row) => row.time,
      sortable: true,
      required: true,
      inputType: "TIME",
    },
    {
      name: "Bowel",
      key: "bowel",
      description: "Bowel",
      selector: (row) => row.bowel,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Urine",
      key: "urine",
      description: "Urine",
      selector: (row) => row.urine,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Days of Discharge",
      key: "daysOfDischarge",
      description: "Days of Discharge",
      selector: (row) => row.daysOfDischarge,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
        name: "Pulse",
        key: "pulse",
        description: "Pulse",
        selector: (row) => row.pulse,
        sortable: true,
        required: true,
        inputType: "TEXT",
      },
  ];

  const processedData = useMemo(() => {
    const data = facilities || [];
    
    const toNumber = (value) => Number(value) || 0;

    return {
      times: data.map(item => {
        const date = new Date(item.entrytime);
        return date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        });
      }),
      bowel: data.map(item => toNumber(item.bowel)),
      urine: data.map(item => toNumber(item.urine)),
      respiration: data.map(item => toNumber(item.respiration)),
      pulse: data.map(item => toNumber(item.pulse)),
      daysOfDischarge: data.map(item => toNumber(item.daysOfDischarge))
    };
  }, [facilities]);

  const series = [
    {
      data: processedData.bowel,
      label: "Bowel",
      color: "#ef4444",
      curve: "linear",
    },
    {
      data: processedData.urine,
      label: "Urine",
      color: "#3b82f6",
      curve: "linear",
    },
    {
      data: processedData.respiration,
      label: "Respiration",
      color: "#22c55e",
      curve: "linear",
    },
    {
      data: processedData.pulse,
      label: "Pulse",
      color: "#f97316",
      curve: "linear",
    },
    {
      data: processedData.daysOfDischarge,
      label: "Days of Discharge",
      color: "#8b5cf6",
      curve: "linear",
    }
  ];


  return (
    <form>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 1 }}>
        <FormsHeaderText text="Morning and Evening Chart" />
        {/* <IconButton >
          <CloseIcon fontSize="small" />
        </IconButton> */}
      </Box>
      <TabContext value={values}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Form" value="1" />
              <Tab label="Table" value="2" />
              <Tab label="Charts" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Input label="Date" type="date" name="date" register={register("date")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Time" type="time" name="time" register={register("time")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Bowel" name="bowel" register={register("bowel")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Urine" name="urine" register={register("urine")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Days of Discharge" name="daysOfDischarge" register={register("daysOfDischarge")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="Respiration" name="respiration" register={register("respiration")} />
        </Grid>
        <Grid item xs={6} mb={6}>
          <Input label="Pulse" name="pulse" register={register("pulse")} />
        </Grid>
      </Grid>
      <GlobalCustomButton onClick={handleSubmit(onSubmit)} >
        Submit
      </GlobalCustomButton>
      </TabPanel>
      <TabPanel value="2">
      <Box>
              <CustomTable
                title={"Laboratory Observation Chart"}
                columns={morningAndEveningChartSchema}
                data={facilities}
                // onRowClicked={handleRow}
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
      <div className="w-full h-[500px]">
      <LineChart
        xAxis={[{
          data: processedData.times,
          scaleType: "point",
          label: "Time of Day",
          tickLabelStyle: {
            angle: 45,
            textAnchor: "start",
            fontSize: 10
          },
        }]}
        yAxis={[{
          label: "Values",
        }]}
        series={series}
        height={500}
        margin={{ top: 80, bottom: 80, left: 40, right: 40 }}
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "top", horizontal: "middle" },
            padding: 0,
            itemGap: 20,
          },
        }}
      />
    </div>

      </TabPanel>
      </TabContext>
    </form>
  );
};

export default MorningAndEveningChart;