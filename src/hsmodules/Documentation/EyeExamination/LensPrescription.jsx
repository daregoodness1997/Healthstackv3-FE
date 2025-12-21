import React from "react";
import { Box, Grid } from "@mui/material";
import Input from "../../../components/inputs/basic/Input";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import Textarea from "../../../components/inputs/basic/Textarea";

const LensPrescription = ({ handleNext, register }) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Input
            label="Right Sphere"
            name="rightSphere"
            register={register("rightSphere")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            label="Left Sphere"
            name="leftSphere"
            register={register("leftSphere")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            label="Right Cyl"
            name="rightCyl"
            register={register("rightCyl")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            label="Left Cyl"
            name="leftCyl"
            register={register("leftCyl")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            label="Right Axis"
            name="rightAxis"
            register={register("rightAxis")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            label="Left Axis"
            name="leftAxis"
            register={register("leftAxis")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            label="Right Prism"
            name="rightPrism"
            register={register("rightPrism")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            label="Left Prism"
            name="leftPrism"
            register={register("leftPrism")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            label="Right VA"
            name="rightVA"
            register={register("rightVA")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input label="Left VA" name="leftVA" register={register("leftVA")} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Input
            label="Lens Tint"
            name="lensTint"
            register={register("lensTint")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            label="Lens Size"
            name="lensSize"
            register={register("lensSize")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            label="Lens Type"
            name="lensType"
            register={register("lensType")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            label="Segment Height"
            name="segmentHeight"
            register={register("segmentHeight")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input label="Temple" name="temple" register={register("temple")} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input label="Frame" name="frame" register={register("frame")} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input label="Colour" name="colour" register={register("colour")} />
        </Grid>
        <Grid item xs={12}>
          <Textarea
            label="Remarks"
            name="remarks"
            register={register("remarks")}
            multiline
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            label="Next Exam Date"
            name="nextExamDate"
            register={register("nextExamDate")}
            type="date"
          />
        </Grid>
      </Grid>

      {/* <Box sx={{ mt: 3 }}>
        <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
          Submit Prescription
        </GlobalCustomButton>
      </Box> */}

      <Box
        spacing={1}
        sx={{
          display: "flex",
          gap: "1rem",
          position: "right",
          alignContent: "center",
          justifySelf: "right",
        }}
      >
        <GlobalCustomButton
          sx={{ marginTop: "10px", textAlign: "right" }}
          type="button"
          onClick={handleNext}
        >
          Next
        </GlobalCustomButton>
      </Box>
    </>
  );
};

export default LensPrescription;
