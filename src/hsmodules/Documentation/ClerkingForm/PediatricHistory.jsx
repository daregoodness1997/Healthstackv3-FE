import { Box, Grid } from "@mui/material";
import React from "react";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import Textarea from "../../../components/inputs/basic/Textarea";
import { FormsHeaderText } from "../../../components/texts";
import Input from "../../../components/inputs/basic/Input";

const PediatricHistory = ({ handleNext, register }) => {
  return (
    <div className="card-content vscrollable">
      <Box>
        <Grid item lg={12} md={12} sm={12}>
          <Box mb={1} sx={{ height: "40px" }}>
            <FormsHeaderText text="11. For Pediatric Patients" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Pregnancy History")}
                type="text"
                label="Pregnancy: Duration of pregnancy, whether it was supervised or not?(i.e any ANC), any ante-partum events, results of routine serological tests in ante-partum period, vaccinations and medications taken, any herbal drug intake"
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Birth History")}
                type="text"
                label="Birth hx: Mode of delivery, indications(if operative or instrumental delivery), place of delivery, any post-partum complication(s), birth weight, immediate cry(if no, explore) "
              />
            </Grid>
          </Grid>

          <Box mt={1}>
            <FormsHeaderText color="black" text="immunization history" />
          </Box>
          <Grid spacing={1} item md={4} sm={4} xs={6}>
            <Textarea
              register={register("Immunization History")}
              type="text"
              label=" Confirm if vaccinations are up to date (request to see immunization card if available, observe BCG scar)"
            />
          </Grid>

          <Box mt={1}>
            <FormsHeaderText color="black" text="Nutritional History" />
          </Box>
          <Grid spacing={1} item md={4} sm={4} xs={6}>
            <Textarea
              register={register("Nutritional History")}
              type="text"
              label=" Explore mode of feeding in the first six months and beyond"
            />
          </Grid>

          <Box mt={1}>
            <FormsHeaderText color="black" text="Developmental History" />
          </Box>
          <Grid spacing={1} item md={4} sm={4} xs={6}>
            <Textarea
              register={register("Developmental History")}
              type="text"
              label=" Explore milestones- Age at which patient attained neck control (4 to 6week s),  sitting unsupported (6 to 9months), crawling(9 to 10months), walking ( by 18months), present school performance."
            />
          </Grid>

          <Grid mt={1} spacing={1} item md={4} sm={4} xs={6}>
            <Textarea
              register={register("Pubertal development")}
              type="text"
              label=" Pubertal development: age of onset, explore delays if any  "
            />
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

export default PediatricHistory;
