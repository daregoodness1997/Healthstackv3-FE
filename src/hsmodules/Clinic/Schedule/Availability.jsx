import React from "react";
import CustomTable from "../../../components/customtable";
import { Box, Chip } from "@mui/material";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ModalBox from "../../../components/modal";
import { useState } from "react";
import EmployeeAvailabilityForm from "./AvailabilityForm";
import { TableMenu } from "../../../ui/styled/global";
import FilterMenu from "../../../components/utilities/FilterMenu";

const AvailabilityTable = ({ setCurrentView }) => {
  const [showModal, setShowModal] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  const handleSubmit = (formData) => {
    setSubmissions((prev) => [...prev, formData]);
  };

  const getStatusColor = (status) => {
    return status === "Active" ? "success" : "warning";
  };
  const data = [
    {
      id: 1,
      name: "John Smith",
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "10:00 AM - 6:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 4:00 PM",
      status: "Active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      monday: "8:00 AM - 4:00 PM",
      tuesday: "8:00 AM - 4:00 PM",
      wednesday: "Off",
      thursday: "8:00 AM - 4:00 PM",
      friday: "8:00 AM - 4:00 PM",
      status: "Active",
    },
    {
      id: 3,
      name: "Michael Brown",
      monday: "10:00 AM - 6:00 PM",
      tuesday: "10:00 AM - 6:00 PM",
      wednesday: "10:00 AM - 6:00 PM",
      thursday: "Off",
      friday: "10:00 AM - 6:00 PM",
      status: "On Leave",
    },
    {
      id: 4,
      name: "Emily Davis",
      monday: "7:00 AM - 3:00 PM",
      tuesday: "7:00 AM - 3:00 PM",
      wednesday: "7:00 AM - 3:00 PM",
      thursday: "7:00 AM - 3:00 PM",
      friday: "7:00 AM - 3:00 PM",
      status: "Active",
    },
    {
      id: 5,
      name: "James Wilson",
      monday: "Off",
      tuesday: "11:00 AM - 7:00 PM",
      wednesday: "11:00 AM - 7:00 PM",
      thursday: "11:00 AM - 7:00 PM",
      friday: "11:00 AM - 7:00 PM",
      status: "Active",
    },
  ];

  const columns = [
    {
      name: "Employee Name",
      selector: (row) => row.name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Monday",
      selector: (row) => row.monday,
      sortable: true,
      width: "150px",
    },
    {
      name: "Tuesday",
      selector: (row) => row.tuesday,
      sortable: true,
      width: "150px",
    },
    {
      name: "Wednesday",
      selector: (row) => row.wednesday,
      sortable: true,
      width: "150px",
    },
    {
      name: "Thursday",
      selector: (row) => row.thursday,
      sortable: true,
      width: "150px",
    },
    {
      name: "Friday",
      selector: (row) => row.friday,
      sortable: true,
      width: "150px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "150px",
      cell: (row) => (
        <Chip
          label={row.status}
          color={getStatusColor(row.status)}
          size="small"
          sx={{ minWidth: "80px" }}
        />
      ),
    },
  ];

  function handleRowCalendar(data) {
    console.log(data);
    setCurrentView("employee");
  }

  function handleSearch() {}

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f3f4f6",
        fontWeight: "bold",
      },
    },
    rows: {
      style: {
        minHeight: "60px",
        "&:nth-of-type(odd)": {
          backgroundColor: "#fafafa",
        },
      },
      stripedStyle: {
        backgroundColor: "#f9fafb",
      },
    },
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          py: 2,
        }}
      >
        <TableMenu>
          <div style={{ display: "flex", alignItems: "center" }}>
            {handleSearch && (
              <div className="inner-table">
                <FilterMenu onSearch={handleSearch} />
              </div>
            )}
            <h2 style={{ margin: "0 10px", fontSize: "0.95rem" }}>
              Availability
            </h2>
          </div>

          <GlobalCustomButton onClick={() => setShowModal(true)}>
            <ControlPointIcon fontSize="small" sx={{ marginRight: "5px" }} />
            Create New availability
          </GlobalCustomButton>
        </TableMenu>
      </Box>
      <CustomTable
        title="Employee Availability Schedule"
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        striped
        onRowClicked={handleRowCalendar}
      />

      <ModalBox
        open={showModal}
        onClose={() => setShowModal(false)}
        header="Add Weekly Availability"
        width="65%"
      >
        <EmployeeAvailabilityForm
          onSubmit={handleSubmit}
          closeModal={() => setShowModal(false)}
        />
      </ModalBox>
    </Box>
  );
};

export default AvailabilityTable;
