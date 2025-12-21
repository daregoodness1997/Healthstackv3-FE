/* eslint-disable */
import React from "react";
import { Box, Grid } from "@mui/material";
import VaccinationCreate from "./Vaccination/VaccinationRequest"
import VaccinationList from "./Vaccination/VaccinationList";


export default function Vaccination() {
  return (
    <Box
      sx={{
        width: "90vw",
        maxHeight: "80vh",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <VaccinationList />
        </Grid>
        <Grid item xs={6}>
          <VaccinationCreate />
        </Grid>
      </Grid>
    </Box>
  );
}
