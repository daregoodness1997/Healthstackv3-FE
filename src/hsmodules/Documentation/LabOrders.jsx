/* eslint-disable */
import React from "react";
import { Box, Grid } from "@mui/material";
import LabOrdersCreate from "./LabRequest/LabOrdersCreate";
import LabOrdersList from "./LabRequest/LabOrdersList";

export default function LabOrders() {
  return (
    <Box
      sx={{
        width: "90vw",
        maxHeight: "80vh",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <LabOrdersList />
        </Grid>
        <Grid item xs={6}>
          <LabOrdersCreate />
        </Grid>
      </Grid>
    </Box>
  );
}
