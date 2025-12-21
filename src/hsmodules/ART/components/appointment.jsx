/* eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import client from "../../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../../context";
import { toast } from "react-toastify";
import LocationSearch from "../../helpers/LocationSearch";
import EmployeeSearch from "../../helpers/EmployeeSearch";
import "react-datepicker/dist/react-datepicker.css";
import { Box, Grid } from "@mui/material";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import RadioButton from "../../../components/inputs/basic/Radio";
import MuiDateTimePicker from "../../../components/inputs/DateTime/MuiDateTimePicker";
import CustomSelect from "../../../components/inputs/basic/Select";
import Textarea from "../../../components/inputs/basic/Textarea";
import { ClientSearch } from "../../helpers/ClientSearch";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

export function ArtAppointment({

}) {
  const { state, showActionLoader, hideActionLoader } =
        useContext(ObjectContext);
  const { user } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [appointmentData, setAppointmentData] = useState({
    clientId: '',
    locationId: '',
    practitionerId: '',
    appointment_type: '',
    appointment_status: '',
    start_time: null,
    appointment_reason: '',
    appointmentClass: '',
  });

  const [chosen, setChosen] = useState({
    client: null,
    location: null,
    practitioner: null,
  });

  const ClientServ = client.service("appointments");
  const appClass = ["On-site", "Teleconsultation", "Home Visit"];
  const profileFamily = state.ARTModule.selectedFamilyProfile
  

  // console.log(profileFamily,"profile family")

  
  const handleSearchResult = (type, obj) => {
    if (obj) {
      setChosen(prev => ({ ...prev, [type]: obj }));
    } else {
      setChosen(prev => ({ ...prev, [type]: null }));
    }
  };

  const onSubmit = async (data) => {
    showActionLoader()
    
    try {
      const mergedData = {
        ...data,
        start_time: new Date(),
        appointmentClass: data.appointmentClass,
        facility: user.currentEmployee?.facilityDetail._id,
        clientId:profileFamily?._id,
        firstname: profileFamily?.name,
        phone: profileFamily?.contactPhoneNumber,
        email: profileFamily?.email,
        practitioner_name: chosen.practitioner ? `${chosen.practitioner.firstname} ${chosen.practitioner.lastname}` : '',
        practitioner_profession: chosen.practitioner?.profession,
        practitioner_department: chosen.practitioner?.department,
        // location_name: chosen.location?.name,
        // location_type: chosen.location?.locationType,
        actions: [
          {
            action: appointmentData.appointment_status,
            actor: user.currentEmployee._id,
          },
        ],
      };

      await ClientServ.create(mergedData);
      toast.success("Appointment created successfully.");
      // openBill(true);
      
      resetForm();
      hideActionLoader()
    } catch (err) {
      toast.error(`Error creating Appointment: ${err}`);
      hideActionLoader()
    }
  };

  const resetForm = () => {
    setAppointmentData({
      clientId: '',
      locationId: '',
      practitionerId: '',
      appointment_type: '',
      appointment_status: '',
      start_time: null,
      appointment_reason: '',
      appointmentClass: '',
    });
    setChosen({
      client: null,
      location: null,
      practitioner: null,
    });
    reset();
  };

  return (
    <Box sx={{ width: "50vw" }}>
      <form >
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <GlobalCustomButton type="submit" onClick={handleSubmit(onSubmit)}>
            <ControlPointIcon fontSize="small" sx={{ marginRight: "5px" }} />
            Create Appointment
          </GlobalCustomButton>
        </Box>
        
        <Grid container spacing={2}>
          {/* <Grid item xs={12} sm={12} md={4}>
            
              <ClientSearch label="Search for family" getSearchfacility={(obj) => handleSearchResult('client', obj)} />
          
          </Grid> */}
          <Grid item xs={12} >
            <EmployeeSearch getSearchfacility={(obj) => handleSearchResult('practitioner', obj)} />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={4}>
            <LocationSearch getSearchfacility={(obj) => handleSearchResult('location', obj)} />
          </Grid> */}
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <RadioButton
              name="appointmentClass"
              options={appClass}
              register={register("appointmentClass", { required: "This field is required" })}
              // control={control}
              rules={{ required: "This field is required" }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} >
            <MuiDateTimePicker
              control={control}
              name="start_time"
              label="Date and Time"
              required
              important
            />
          </Grid>
          <Grid item xs={12} >
            <CustomSelect
              control={control}
              name="appointment_type"
              label="Appointment Type"
              required
              important
              options={[
                "New",
                "Followup",
                "Readmission with 24hrs",
                "Annual Checkup",
                "Walk-in",
              ]}
            />
          </Grid>
          <Grid item xs={12} >
            <CustomSelect
              control={control}
              name="appointment_status"
              label="Appointment Status"
              required
              important
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
          <Grid item xs={12} mt={1}>
            <Textarea
              label="Reason for Appointment"
              name="appointment_reason"
              important
              register={register("appointment_reason", { required: "This field is required" })}
              type="text"
              placeholder="Write here..."
            />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
