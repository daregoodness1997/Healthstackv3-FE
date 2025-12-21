/* eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import client from "../../feathers";
import { UserContext, ObjectContext } from "../../context";
import { format, subDays, addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { PageWrapper } from "../../ui/styled/styles";
import { TableMenu } from "../../ui/styled/global";
import FilterMenu from "../../components/utilities/FilterMenu";
import CustomTable from "../../components/customtable";
import Switch from "../../components/switch";
import { BsFillGridFill, BsList } from "react-icons/bs";
import CalendarGrid from "../../components/calender";
import { AppointmentSchema } from "../Appointment/schema";
import MuiClearDatePicker from "../../components/inputs/Date/MuiClearDatePicker";

export default function ClientVisitationHistory() {
  const ClientServ = client.service("appointments");
  const [facilities, setFacilities] = useState([]);
  const { state, setState } = useContext(ObjectContext);
  const { user } = useContext(UserContext);
  const [startDate, setStartDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [value, setValue] = useState("list");

  const handleRow = async (Client) => {
    const newClientModule = {
      selectedAppointment: Client,
      show: "detail",
    };
    await setState((prevstate) => ({
      ...prevstate,
      AppointmentModule: newClientModule,
    }));
  };

  const handleSearch = (val) => {
    let query = {
      $or: [
        {
          firstname: {
            $regex: val,
            $options: "i",
          },
        },
        {
          lastname: {
            $regex: val,
            $options: "i",
          },
        },
        {
          middlename: {
            $regex: val,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: val,
            $options: "i",
          },
        },
        {
          appointment_type: {
            $regex: val,
            $options: "i",
          },
        },
        {
          appointment_status: {
            $regex: val,
            $options: "i",
          },
        },
        {
          appointment_reason: {
            $regex: val,
            $options: "i",
          },
        },
        {
          location_type: {
            $regex: val,
            $options: "i",
          },
        },
        {
          location_name: {
            $regex: val,
            $options: "i",
          },
        },
        {
          practitioner_department: {
            $regex: val,
            $options: "i",
          },
        },
        {
          practitioner_profession: {
            $regex: val,
            $options: "i",
          },
        },
        {
          practitioner_name: {
            $regex: val,
            $options: "i",
          },
        },
      ],
      facility: user.currentEmployee.facilityDetail._id,
      $limit: 20,
      $sort: {
        createdAt: -1,
      },
    };
    if (state.employeeLocation.locationType !== "Front Desk") {
      query.locationId = state.employeeLocation.locationId;
    }

    ClientServ.find({ query: query })
      .then((res) => {
        setFacilities(res.data);
      })
      .catch((err) => {
        return err;
      });
  };

  const getFacilities = async () => {
    if (user.currentEmployee) {
      let stuff = {
        facility: user.currentEmployee.facilityDetail._id,
        $limit: limit,
        $skip: (page - 1) * limit,
        $sort: {
          createdAt: -1,
        },
        $select: [
          "start_time",
          "firstname",
          "lastname",
          "appointmentClass",
          "location_name",
          "appointment_type",
          "appointment_status",
        ],
      };
      const findClient = await ClientServ.find({ query: stuff });
      setFacilities(findClient.data);
      setTotal(findClient.total);
    } else {
      if (user.stacker) {
        const findClient = await ClientServ.find({
          query: {
            $limit: limit,
            $skip: (page - 1) * limit,
            $sort: {
              createdAt: -1,
            },
            $select: [
              "start_time",
              "firstname",
              "lastname",
              "appointmentClass",
              "location_name",
              "appointment_type",
              "appointment_status",
            ],
          },
        });

        setFacilities(findClient.data);
      }
    }
  };

  useEffect(() => {
    if (user) {
      handleCalendarClose();
    }
    ClientServ.on("created", () => handleCalendarClose());
    ClientServ.on("updated", () => handleCalendarClose());
    ClientServ.on("patched", () => handleCalendarClose());
    ClientServ.on("removed", () => handleCalendarClose());
  }, [limit, page]);

  const handleCalendarClose = async () => {
    let query = {
      start_time: {
        $gt: subDays(startDate, 1),
        $lt: addDays(startDate, 1),
      },
      facility: user.currentEmployee?.facilityDetail._id,

      $limit: limit,
      $skip: (page - 1) * limit,
      $sort: {
        createdAt: -1,
      },
    };
    const findClient = await ClientServ.find({ query: query });
    setFacilities(findClient.data);
  };

  useEffect(() => {
    if (!!startDate) {
      handleCalendarClose();
    } else {
      getFacilities();
    }

    return () => {};
  }, [startDate]);

  const mapFacilities = () => {
    let mapped = [];
    facilities.map((facility, i) => {
      mapped.push({
        title: facility?.firstname + " " + facility?.lastname,
        start: format(new Date(facility?.start_time), "yyyy-MM-ddTHH:mm"),
        end: facility?.end_time,
        id: i,
      });
    });
    return mapped;
  };
  const activeStyle = {
    backgroundColor: "#0064CC29",
    border: "none",
    padding: "0 .8rem",
  };

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <>
      {user ? (
        <>
          <div className="level">
            <PageWrapper
              style={{ flexDirection: "column", padding: "0.6rem 1rem" }}
            >
              <TableMenu>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {handleSearch && (
                    <div className="inner-table">
                      <FilterMenu onSearch={handleSearch} />
                    </div>
                  )}
                  <h2 style={{ margin: "0 10px", fontSize: "0.95rem" }}>
                    Appointments
                  </h2>
                  <MuiClearDatePicker
                    value={startDate}
                    setValue={setStartDate}
                    label="Filter By Dates now"
                    format="dd/MM/yyyy"
                  />
                  {/* <SwitchButton /> */}
                  <Switch>
                    <button
                      value={value}
                      onClick={() => {
                        setValue("list");
                      }}
                      style={value === "list" ? activeStyle : {}}
                    >
                      <BsList style={{ fontSize: "1rem" }} />
                    </button>
                    <button
                      value={value}
                      onClick={() => {
                        setValue("grid");
                      }}
                      style={value === "grid" ? activeStyle : {}}
                    >
                      <BsFillGridFill style={{ fontSize: "1rem" }} />
                    </button>
                  </Switch>
                </div>
              </TableMenu>
              <div style={{ width: "100%", height: "600px", overflow: "auto" }}>
                {value === "list" ? (
                  <CustomTable
                    title={""}
                    columns={AppointmentSchema}
                    data={facilities}
                    pointerOnHover
                    highlightOnHover
                    striped
                    onRowClicked={handleRow}
                    onChangeRowsPerPage={onTableChangeRowsPerPage}
                    onChangePage={onTablePageChange}
                    pagination
                    paginationServer
                    paginationTotalRows={total}
                  />
                ) : (
                  <CalendarGrid appointments={mapFacilities()} />
                )}
              </div>
            </PageWrapper>
          </div>
        </>
      ) : (
        <div>loading</div>
      )}
    </>
  );
}
