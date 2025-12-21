import React from "react";
import { Box, Grid } from "@mui/material";
import GlobalCustomButton from "../../../../components/buttons/CustomButton";
import Input from "../../../../components/inputs/basic/Input";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { ObjectContext, UserContext } from "../../../../context";
import client from "../../../../feathers";
import { toast } from "react-toastify";
import EmployeeSearch from "../../../helpers/EmployeeSearch";
import { useState } from "react";
import { generateRandomString } from "../../../helpers/generateString";
import { useEffect } from "react";

export default function CreateProfileManagement({ closeModal }) {
  const { register, handleSubmit, setValue, reset } = useForm();
  const familyProfileServ = client.service("familyprofile");
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);
  const { user } = useContext(UserContext);
  const [practitioner, setPractitioner] = useState(null);

  const handleGetSearchPractitioner = (practitioner) => {
    setPractitioner(practitioner);
  };
  // console.log(practitioner,"Practitioner")
  const onSubmit = async (data) => {
    showActionLoader();
    const profileData = {
      ...data,
      facilityId: user.currentEmployee.facilityDetail._id,
      practitioner: `${practitioner.firstname} ${practitioner.lastname}`,
      createdby: user.currentEmployee.userId,
    };
    // console.log(data);
    try {
      const res =await familyProfileServ.create(profileData);
      toast.success("Profile created successfully");

      reset();
      closeModal();
    } catch (err) {
      toast.error("Error submitting Profile: " + err);
      // console.log(err);
    } finally {
      hideActionLoader();
    }

    // console.log(profileData);
  };

  useEffect(() => {
    setValue("file_number", generateRandomString(12));
  }, []);

  return (
    <Box
      sx={{
        width: "50vw",
      }}
    >
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <GlobalCustomButton type="submit" onClick={handleSubmit(onSubmit)}>
          <ControlPointIcon fontSize="small" sx={{ marginRight: "5px" }} />
          Create New Profile
        </GlobalCustomButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Input
            label="File Number"
            name="file_number"
            register={register("file_number")}
            disabled={true}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            label="Profile Name"
            name="name"
            type="text"
            register={register("name")}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            label="Years TTC"
            name="yearTtc"
            type="text"
            register={register("yearTtc")}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            label="Email"
            name="email"
            type="email"
            register={register("email")}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            label="Phone Number"
            name="contactPhoneNumber"
            type="tel"
            register={register("contactPhoneNumber")}
          />
        </Grid>
        <Grid item xs={12}>
          <EmployeeSearch
            label="Practitioner"
            getSearchfacility={handleGetSearchPractitioner}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            label="How long have your been married?"
            name="marriedHowLong"
            type="number"
            register={register("marriedHowLong")}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
