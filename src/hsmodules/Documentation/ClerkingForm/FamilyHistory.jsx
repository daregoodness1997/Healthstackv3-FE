import React from "react";
import { Box, Grid } from "@mui/material";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import Textarea from "../../../components/inputs/basic/Textarea";
import { FormsHeaderText } from "../../../components/texts";
import Input from "../../../components/inputs/basic/Input";

const FamilyHistory = ({ handleNext, register }) => {
  return (
    <div className="card-content vscrollable">
      <Box>
        <Grid item lg={12} md={12} sm={12}>
          <Box sx={{ height: "40px" }}>
            <FormsHeaderText text="10. Family and Social History" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={6} sm={6} xs={6}>
              <Input
                register={register("Family Type")}
                type="text"
                label={"Family Type"}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={6}>
              <Input
                register={register("Family Size")}
                type="text"
                label={"Family Size"}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Input
                register={register("Lifecycle Stage of Patient")}
                type="text"
                label={"Lifecycle Stage of the Patient"}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Input
                register={register("Living Environment")}
                type="text"
                label={"Living Environment"}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Family Function(Satisfied?)")}
                type="text"
                label={`Family Function 
(are you satisfied with the way you and your family members live with each other:`}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Family Circle (Closest?)")}
                type="text"
                label={`Family circle (Which family member do you feel closest to?)`}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Genogram(Source of health financing)")}
                type="text"
                label={`Genogram(as applicable) Source of healthcare financing(out of pocket, health insurance)`}
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Lifestyle")}
                type="text"
                label={`Lifestyle: alcohol intake (quantity, type, duration of intake), tobacco use (quantify-sticks per day, pack years), if patient has stopped any, explore why and when`}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Input
                register={register("Exercise")}
                type="text"
                label={`Exercise(Type, frequency)`}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Input
                register={register("Sexuality")}
                type="text"
                label={`Sexuality(with tact)`}
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Religion")}
                type="text"
                label={`Explore spirituality using HOPE tool (H- source of hope, O- Organized religion, P- Personal religious practicies, E-Effects) on care and end of life issues.`}
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Adolescent issue")}
                type="text"
                label={`Explore adolescent issues if applicable (illicit drug use, alcoholism, STIs and unwanted pregnancy, accident prevention). `}
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

export default FamilyHistory;
