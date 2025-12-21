/* eslint-disable */
import React from "react";
import { Box, Grid } from "@mui/material";
import RadiologyOrdersList from "./RadiologyRequest/RadiologyOrderList";
import RadiologyOrdersCreate from "./RadiologyRequest/RadiologyOrderCreate";

export default function RadiologyOrders() {
  return (
    <Box
      sx={{
        width: "90vw",
        maxHeight: "80vh",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <RadiologyOrdersList />
        </Grid>
        <Grid item xs={6}>
          <RadiologyOrdersCreate />
        </Grid>
      </Grid>
    </Box>
  );
}
