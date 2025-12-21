import { Box, Grid } from "@mui/material";
import React from "react";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import Textarea from "../../../components/inputs/basic/Textarea";
import { FormsHeaderText } from "../../../components/texts";
import Input from "../../../components/inputs/basic/Input";

const MedicalHistory = ({ handleNext, register }) => {
  return (
    <div className="card-content vscrollable">
      <Box>
        <Grid item lg={12} md={12} sm={12}>
          <Box mb={1} sx={{ height: "40px" }}>
            <FormsHeaderText text="5.Drug and Allergy History" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Input
                register={register("Use of Unrelated Drugs")}
                type="text"
                label="Use of other drugs unrelated to presenting complaints"
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Input
                register={register("Use of suppliments")}
                type="text"
                label="Use of Suppliments"
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Input
                register={register("Use of Complimentory Medicine")}
                type="text"
                label="Use of other Complimentary Medicine"
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("History of Allergies")}
                type="text"
                label={"History of Allergies"}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* PC */}
        <Grid item lg={12} md={12} sm={12}>
          <Box mt={2} sx={{ height: "40px" }}>
            <FormsHeaderText text="6. past medical history" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Past Medical History")}
                type="text"
              />
            </Grid>
          </Grid>
        </Grid>

        {/*History of Pc  */}

        <Grid item lg={12} md={12} sm={12}>
          <Box mt={1} sx={{ height: "40px" }}>
            <FormsHeaderText text="7. Gynaecologic and obstetric history" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={6} sm={6} xs={6}>
              <Input
                register={register("Menarche")}
                type="text"
                label="Menarche"
              />
            </Grid>
            <Grid item md={6} sm={6} xs={6}>
              <Input
                register={register("Last Mentrual Period")}
                type="date"
                label="Last Mentrual Period"
              />
            </Grid>
            <Grid item md={6} sm={6} xs={6}>
              <Input
                register={register("Coitarche (with Tarc)")}
                type="text"
                label="Coitarche (with Tarc)"
              />
            </Grid>
            <Grid item md={6} sm={6} xs={6}>
              <Input register={register("Parity")} type="text" label="Parity" />
            </Grid>
            <Grid my={0.5} item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Mode of Delivery")}
                type="text"
                label="Describe Mode of Delivery and complication if any:"
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Hx of Dysmenorrhea/Menorrhagia")}
                type="text"
                label="History of Dysmenorrhea and Menorrhagia:"
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Contraceptive use")}
                type="text"
                label="Contraceptive use:"
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("OnG Examination")}
                type="text"
                label="Breast self examination, pap smear, HPV vaccine, Mammogram(depending on age):"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Review */}

        <Grid item lg={12} md={12} sm={12}>
          <Box mt={1} sx={{ height: "40px" }}>
            <FormsHeaderText text="8. Travel History" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Travel History")}
                type="text"
                label={
                  "Any recent travel (local or foreign) and length of stay and activities carried out there Any illness or treatment while at place of destination? Any prophylaxis or immunizations prior to the trip?"
                }
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Immunization */}

        <Grid item lg={12} md={12} sm={12}>
          <Box mt={1} sx={{ height: "40px" }}>
            <FormsHeaderText text="9. Immunization" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Vaccination History")}
                type="text"
                label={"History of Vaccination"}
              />
            </Grid>
          </Grid>
        </Grid>

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
      </Box>
    </div>
  );
};

export default MedicalHistory;
