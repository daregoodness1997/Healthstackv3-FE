import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
// import ScheduleCalendar from "./Calendar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmployeeAvailability from "./EmployeeAvailability";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import EmployeeAvailabilityForm from "./AvailabilityForm";
import ModalBox from "../../../components/modal";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && <Box sx={{ py: 2, width: "100%" }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function EmployeeSchedule({ handleGoBack }) {
  const [value, setValue] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const employeeData = {
    id: "item-id-0",
    sn: 1,
    name: "John Smith",
    monday: "9:00 AM - 5:00 PM",
    tuesday: "9:00 AM - 5:00 PM",
    wednesday: "10:00 AM - 6:00 PM",
    thursday: "9:00 AM - 5:00 PM",
    friday: "9:00 AM - 4:00 PM",
    status: "Active",
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: 2,
        minHeight: "500px",
      }}
    >
      <Box
        sx={{
          borderRight: 1,
          borderColor: "divider",
          minWidth: "150px",
        }}
      >
        <Box sx={{ p: 1 }}>
          <GlobalCustomButton onClick={handleGoBack}>
            <ArrowBackIcon sx={{ marginRight: "3px" }} fontSize="small" />
            Back
          </GlobalCustomButton>
        </Box>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          orientation="vertical"
          sx={{
            "& .MuiTab-root": {
              alignItems: "flex-start",
              textAlign: "left",
              minWidth: "100px",
            },
          }}
        >
          <Tab label="Availability" {...a11yProps(0)} sx={{ py: 2 }} />
          <Tab label="Calendar" {...a11yProps(1)} sx={{ py: 2 }} />
        </Tabs>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <CustomTabPanel value={value} index={0}>
          <Box sx={{ width: "100%", minHeight: "400px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                py: 1,
              }}
            >
              <GlobalCustomButton onClick={() => setShowModal(true)}>
                <ControlPointIcon
                  fontSize="small"
                  sx={{ marginRight: "5px" }}
                />
                Create New availability
              </GlobalCustomButton>
            </Box>
            <EmployeeAvailability data={employeeData} />
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Box sx={{ width: "100%", minHeight: "400px" }}>
            {/* <ScheduleCalendar /> */}
          </Box>
        </CustomTabPanel>
      </Box>
      <ModalBox
        open={showModal}
        onClose={() => setShowModal(false)}
        header="Add Weekly Availability"
        width="65%"
      >
        <EmployeeAvailabilityForm
          // onSubmit={handleSubmit}
          closeModal={() => setShowModal(false)}
        />
      </ModalBox>
    </Box>
  );
}
