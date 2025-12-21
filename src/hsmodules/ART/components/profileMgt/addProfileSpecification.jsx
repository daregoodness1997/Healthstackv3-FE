import React from "react";
import { Box, Grid } from "@mui/material";
import GlobalCustomButton from "../../../../components/buttons/CustomButton";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import Input from "../../../../components/inputs/basic/Input";
import CustomSelect from "../../../../components/inputs/basic/Select";
import { useForm } from "react-hook-form";

export default function ProfileSpecification({ onClick }) {
  const { register, handleSubmit } = useForm();
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <GlobalCustomButton type="submit" onClick={handleSubmit(onClick)}>
          <ControlPointIcon fontSize="small" sx={{ marginRight: "5px" }} />
          Add Health Conditions
        </GlobalCustomButton>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Input
            label="Name"
            name="name"
            type="text"
            register={register("name")}
            placeholder="Bebby Kings"
          />
        </Grid>

        <Grid item xs={12}>
          <Input
            label="Age"
            name="age"
            type="text"
            register={register("age")}
            placeholder="33"
          />
        </Grid>

        <Grid item xs={12}>
          <CustomSelect
            label="Gender"
            name="gender"
            options={["Male", "Female"]}
            register={register("gender")}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            label="Allergies"
            name="allergies"
            type="text"
            register={register("allergies")}
          />
        </Grid>

        <Grid item xs={12}>
          <Input
            label="Co-morbidities"
            name="coMorbidities"
            type="text"
            register={register("coMorbidities")}
          />
        </Grid>

        <Grid item xs={12}>
          <Input
            label="Disabilities"
            name="disabilities"
            type="text"
            register={register("disabilities")}
          />
        </Grid>

        <Grid item xs={12}>
          <Input
            label="Occupation"
            name="occupation"
            type="text"
            register={register("occupation")}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
