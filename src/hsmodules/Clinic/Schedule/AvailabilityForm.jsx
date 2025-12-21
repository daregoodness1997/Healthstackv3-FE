import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { format } from "date-fns";
import Input from "../../../components/inputs/basic/Input";
import CustomSelect from "../../../components/inputs/basic/Select";
import EmployeeSearch from "../../helpers/EmployeeSearch";
import { useState } from "react";

const EmployeeAvailabilityForm = ({ onSubmit, defaultValues, closeModal }) => {
  const [staff, setStaff] = useState(null);

  const handleGetSearchStaff = (obj) => {
    setStaff(obj);
  };

  const {
    control,
    handleSubmit,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      name: "",
      status: "Active",
      day: { isOff: false, startTime: null, endTime: null },
    },
  });

  const onSubmitForm = (data) => {
    // console.log(data);
    const formattedData = {
      id: Date.now(),
      name: `${staff?.firstname} ${staff?.lastname}`,
      status: data.status,
      day: data.day,
    };
    onSubmit(formattedData);
    reset();
    closeModal();
  };

  const renderDayInputs = (day, label) => {
    const isOff = watch(`${day}.isOff`);

    return (
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Input
              name="day"
              label="Day"
              register={register("day")}
              type="date"
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name={`${day}.isOff`}
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label={field.value ? "Day Off" : "Available"}
                />
              )}
            />
          </Grid>

          {!isOff && (
            <>
              <Grid item xs={6}>
                <Input
                  name={`${day}.startTime`}
                  label="Start Time"
                  register={`${day}.startTime`}
                  type="time"
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  name={`${day}.endTime`}
                  label="End Time"
                  register={`${day}.endTime`}
                  type="time"
                />
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    );
  };

  return (
    <Box component="form" sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <EmployeeSearch
            getSearchfacility={handleGetSearchStaff}
            label="Employee Name"
          />
        </Grid>

        <Grid item xs={6}>
          <CustomSelect
            control={control}
            name="status"
            label="Status"
            options={["Active", "On Leave"]}
          />
        </Grid>

        {renderDayInputs()}

        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit(onSubmitForm)}
            >
              Submit
            </Button>
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={() => reset()}
            >
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeAvailabilityForm;
