import React from "react";
import { Box, Typography, Paper, Grid, Chip } from "@mui/material";

const EmployeeAvailability = ({ data }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h6" gutterBottom>
            {data.name}
          </Typography>
          <Chip
            label={data.status}
            color={data.status === "Active" ? "success" : "warning"}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <Box display="flex" gridTemplateColumns="repeat(5, 1fr)" gap={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Monday
              </Typography>
              <Typography>{data.monday}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Tuesday
              </Typography>
              <Typography>{data.tuesday}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Wednesday
              </Typography>
              <Typography>{data.wednesday}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Thursday
              </Typography>
              <Typography>{data.thursday}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Friday
              </Typography>
              <Typography>{data.friday}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EmployeeAvailability;
