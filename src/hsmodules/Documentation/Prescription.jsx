/* eslint-disable */
import React from "react";
import { Box, Grid } from "@mui/material";
import PrescriptionList from "./Prescription/PrescriptionList";
import PrescriptionCreate from "./Prescription/PrescriptionCreate";

export default function Prescription() {
  return (
    <Box
      sx={{
        width: "90vw",
        maxHeight: "80vh",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <PrescriptionList />
        </Grid>
        <Grid item xs={6}>
          <PrescriptionCreate />
        </Grid>
      </Grid>
    </Box>
  );
}
