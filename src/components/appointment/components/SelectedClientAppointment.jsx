/* eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import client from "../../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../../context";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import { Box, Grid } from "@mui/material";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import RadioButton from "../../../components/inputs/basic/Radio";
import { FormsHeaderText } from "../../../components/texts";
import MuiDateTimePicker from "../../../components/inputs/DateTime/MuiDateTimePicker";
import CustomSelect from "../../../components/inputs/basic/Select";
import Textarea from "../../../components/inputs/basic/Textarea";
import { ClientSearch } from "../../../hsmodules/helpers/ClientSearch";
import EmployeeSearch from "../../../hsmodules/helpers/EmployeeSearch";
import LocationSearch from "../../../hsmodules/helpers/LocationSearch";
import Input from "../../inputs/basic/Input";

export default function SelectedClientAppointment({ setShowModal, openBill }) {
  const { state, setState } = useContext(ObjectContext);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [success, setSuccess] = useState(false);
  const [success1, setSuccess1] = useState(false);
  const [success2, setSuccess2] = useState(false);
  const [clientId, setClientId] = useState();
  const [locationId, setLocationId] = useState();
  const [practionerId, setPractionerId] = useState();
  const ClientServ = client.service("appointments");
  const { user } = useContext(UserContext);
  const [appointment_status, setAppointment_status] = useState("");
  const [chosen, setChosen] = useState();
  const [chosen1, setChosen1] = useState();
  const [chosen2, setChosen2] = useState();
  const appClass = ["On-site", "Teleconsultation", "Home Visit"];

  const getSearchfacility = (obj) => {
    setClientId(obj._id);
    setChosen(obj);
    if (!obj) {
      setClientId();
      setChosen();
    }
  };
  const getSearchfacility1 = (obj) => {
    setLocationId(obj._id);
    setChosen1(obj);

    if (!obj) {
      //"clear stuff"
      setLocationId();
      setChosen1();
    }
  };
  const getSearchfacility2 = (obj) => {
    setPractionerId(obj._id);
    setChosen2(obj);

    if (!obj) {
      setPractionerId();
      setChosen2();
    }
  };

  const onSubmit = (data, e) => {
    e.preventDefault();
    setState((prevstate) => ({
      ...prevstate,
      AppointmentModule: {
        selectedAppointment: {},
        show: "list",
      },
    }));
    console.log(data);
    if (user.currentEmployee) {
      data.facility = user.currentEmployee.facilityDetail._id;
    }
    data.locationId = locationId;
    data.practitionerId = practionerId;
    data.clientId = clientId;
    data.firstname = chosen.firstname;
    data.middlename = chosen.middlename;
    data.lastname = chosen.lastname;
    data.dob = chosen.dob;
    data.gender = chosen.gender;
    data.phone = chosen.phone;
    data.email = chosen.email;
    data.practitioner_name = chosen2.firstname + " " + chosen2.lastname;
    data.practitioner_profession = chosen2.profession;
    data.practitioner_department = chosen2.department;
    data.location_name = chosen1.name;
    data.location_type = chosen1.locationType;
    data.actions = [
      {
        action: appointment_status,
        actor: user.currentEmployee._id,
      },
    ];
    ClientServ.create(data)
      .then((res) => {
        setAppointment_status("");
        setClientId("");
        setLocationId("");
        setSuccess(true);
        setSuccess1(true);
        setSuccess2(true);
        toast.success(
          "Appointment created succesfully, Kindly bill patient if required"
        );
        openBill(true);
        setSuccess(false);
        setSuccess1(false);
        setSuccess2(false);
      })
      .catch((err) => {
        toast.error("Error creating Appointment " + err);
      });
  };

  useEffect(() => {
    getSearchfacility(state.ClientModule.selectedClient);
    return () => {};
  }, [state.ClientModule.selectedClient]);

  return (
    <>
      <div className="card " style={{ width: "70vw" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4}>
              {state.ClientModule.selectedClient.firstname !== undefined ? (
                <>
                  <FormsHeaderText
                    text={`
                    ${state.ClientModule.selectedClient.firstname}
                    ${state.ClientModule.selectedClient.lastname}`}
                  />
                </>
              ) : (
                <ClientSearch
                  getSearchfacility={getSearchfacility}
                  clear={success}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={4} mb={1.5}>
              <EmployeeSearch
                getSearchfacility={getSearchfacility2}
                clear={success2}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <LocationSearch
                getSearchfacility={getSearchfacility1}
                clear={success1}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <RadioButton
                name="appointmentClass"
                register={register("appointmentClass")}
                options={appClass}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid item xs={12} sm={12} md={4} lg={4}>
               <Input
                type="datetime-local"
                name="start_time"
                label="Date and Time"
                register={register("start_time")}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <CustomSelect
                control={control}
                name="appointment_type"
                label="Appointment Type"
                options={[
                  "New",
                  "Followup",
                  "Readmission with 24hrs",
                  "Annual Checkup",
                  "Walk-in",
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <CustomSelect
                control={control}
                name="appointment_status"
                label="Appointment Status "
                options={[
                  "Scheduled",
                  "Confirmed",
                  "Checked In",
                  "Vitals Taken",
                  "With Nurse",
                  "With Doctor",
                  "No Show",
                  "Cancelled",
                  "Billed",
                ]}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Textarea
                label="Reason for Appointment"
                name="appointment_reason"
                register={register("appointment_reason")}
                type="text"
                placeholder="write here.."
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <GlobalCustomButton
              text="Submit"
              onClick={handleSubmit(onSubmit)}
              customStyles={{
                marginRight: "15px",
              }}
            />
            <GlobalCustomButton
              variant="contained"
              color="error"
              text="Cancel"
              onClick={() => setShowModal(false)}
            />
          </Box>
        </form>
      </div>
    </>
  );
}
