import React from "react";
import { Box, Grid } from "@mui/material";
import Textarea from "../../../components/inputs/basic/Textarea";
import { FormsHeaderText } from "../../../components/texts";

const ManagementPlan = ({ handleNext, register }) => {
  return (
    <div className="card-content vscrollable">
      <Box>
        <Grid item lg={12} md={12} sm={12}>
          <Box>
            <FormsHeaderText
              color="black"
              textTransform="capitalize"
              text="STATE CARE PLAN (Explain findings to the patient) "
            />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea register={register("State Care plan")} type="text" />
            </Grid>
          </Grid>

          <Grid mt={1} container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Common agenda")}
                type="text"
                label={
                  "Define a common agenda between you and the patient (define specific targets and document them e.g target BP, HbA1C) especially for patients with chronic diseases"
                }
              />
            </Grid>
          </Grid>

          <Box mt={1}>
            <FormsHeaderText
              color="black"
              textTransform="capitalize"
              text="Investigations: these must be relevant to patient’s problems and cost-effective too"
            />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea register={register("Investigation")} type="text" />
            </Grid>
          </Grid>

          <Box mt={1}>
            <FormsHeaderText color="black" text="Treatment" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea register={register("Treatment")} type="text" />
            </Grid>
          </Grid>

          <Box mt={1}>
            <FormsHeaderText color="black" text="Remark" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea register={register("Remarks")} type="text" />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ManagementPlan;
