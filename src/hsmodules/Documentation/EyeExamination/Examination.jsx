import React from "react";
import { Box, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import Input from "../../../components/inputs/basic/Input";
import { FormsHeaderText } from "../../../components/texts";
import GlobalCustomButton from "../../../components/buttons/CustomButton";

const ExaminationForm = ({ handleNext, register }) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormsHeaderText text="Biomicroscopic / Slit Lamp" />
        </Grid>
        {[
          "Adnexa",
          "Lids",
          "Tear/Break",
          "Conjunctiva",
          "Cornea",
          "Ant. Chamber",
          "Depth",
          "Cells",
          "Flare",
          "Iris",
          "Colour",
          "Angles",
          "Pupil",
          "Lens",
          "Clarity",
          "Ant Caps",
          "Post Caps",
        ].map((field, index) => (
          <>
            <Grid item xs={6} sm={3} key={index}>
              <Input
                label={`${field} OD`}
                name={`${field.toLowerCase().replace(/ /g, "")}OD`}
                register={register(
                  `${field.toLowerCase().replace(/ /g, "")}OD`
                )}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Input
                label={`${field} OS`}
                name={`${field.toLowerCase().replace(/ /g, "")}OS`}
                register={register(
                  `${field.toLowerCase().replace(/ /g, "")}OS`
                )}
              />
            </Grid>
          </>
        ))}

        <Grid item xs={12}>
          <FormsHeaderText text="Ophthalmoscopy / Fundus" />
        </Grid>
        {[
          "Optic Disc",
          "Size",
          "Ratio",
          "Appearance",
          "Nerve Fiber",
          "Retina",
          "Macula",
          "Post Retina",
          "Vessels",
          "Periphery",
          "Vitreous",
        ].map((field) => (
          <>
            <Grid item xs={6} sm={3}>
              <Input
                label={`${field} OD`}
                name={`${field.toLowerCase().replace(/ /g, "")}OD`}
                register={register(
                  `${field.toLowerCase().replace(/ /g, "")}OD`
                )}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Input
                label={`${field} OS`}
                name={`${field.toLowerCase().replace(/ /g, "")}OS`}
                register={register(
                  `${field.toLowerCase().replace(/ /g, "")}OS`
                )}
              />
            </Grid>
          </>
        ))}

        <Grid item xs={12}>
          <FormsHeaderText text="Refraction" />
        </Grid>
        {[
          "Sphere",
          "Cyl",
          "Axis",
          "Add",
          "H-Prism",
          "H-Base",
          "V-Prism",
          "V-Base",
          "VC",
          "BCVA",
        ].map((field) => (
          <>
            <Grid item xs={6} sm={3}>
              <Input
                label={`${field} OD`}
                name={`${field.toLowerCase().replace(/ /g, "")}OD`}
                register={register(
                  `${field.toLowerCase().replace(/ /g, "")}OD`
                )}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Input
                label={`${field} OS`}
                name={`${field.toLowerCase().replace(/ /g, "")}OS`}
                register={register(
                  `${field.toLowerCase().replace(/ /g, "")}OS`
                )}
              />
            </Grid>
          </>
        ))}

        {/* Phorias Section */}
        <Grid item xs={12}>
          <FormsHeaderText text="Phorias" />
        </Grid>
        {["Horizontal", "Vertical", "Base", "Ref Eye"].map((field) => (
          <Grid item xs={6} sm={3}>
            <Input
              label={field}
              name={field.toLowerCase().replace(/ /g, "")}
              register={register(field.toLowerCase().replace(/ /g, ""))}
            />
          </Grid>
        ))}
        <Grid item xs={6} sm={3}>
          <Input label="Dist At" name="distAt" register={register("distAt")} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Input label="Near At" name="nearAt" register={register("nearAt")} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Input label="Method" name="method" register={register("method")} />
        </Grid>
      </Grid>

      {/* <Box sx={{ mt: 3 }}>
        <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
          Submit Examination
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

export default ExaminationForm;
