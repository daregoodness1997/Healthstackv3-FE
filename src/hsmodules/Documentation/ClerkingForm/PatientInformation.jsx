import { Box, Grid } from "@mui/material";
import React, { useState, useContext } from "react";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import Textarea from "../../../components/inputs/basic/Textarea";
import { FormsHeaderText } from "../../../components/texts";
import Input from "../../../components/inputs/basic/Input";
import { UserContext, ObjectContext } from "../../../context";
import { ClientSearch } from "../../helpers/ClientSearch";
import { format, formatDistanceToNowStrict } from "date-fns";

const PatientInformation = ({ handleNext, register }) => {
  const { state, setState, hideActionLoader, showActionLoader } =
    useContext(ObjectContext);

  const { firstname, lastname, middlename, dob, mrn, maritalstatus, gender } =
    state.ClientModule.selectedClient;

  console.log(
    firstname,
    lastname,
    middlename,
    //new Date(dob),
    format(new Date(dob), "dd-MM-yyyy"),
    mrn,
    maritalstatus,
    gender
  );

  return (
    <div className="card-content vscrollable">
      <Box>
        <Grid item lg={12} md={12} sm={12}>
          <Box mb={1} sx={{ height: "40px" }}>
            <FormsHeaderText text="1. Bio Data" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={4} sm={4} xs={6}>
              <Input
                register={register("Patient", {
                  value: `${firstname} ${middlename} ${lastname}`,
                })}
                value={`${firstname} ${middlename} ${lastname}`}
                type="text"
                label=" Patient"
                onBlur={(e) => {
                  console.log(e);
                }}
                disabled
              />
            </Grid>

            <Grid item md={4} sm={4} xs={6}>
              <Input
                register={register("Date of Birth", {
                  value: format(new Date(dob), "dd-MM-yyyy"),
                })}
                type="text"
                label="D.O.B"
                value={format(new Date(dob), "dd-MM-yyyy")}
                disabled
              />
            </Grid>

            <Grid item md={4} sm={4} xs={6}>
              <Input
                register={register("Patient Number", {
                  value: mrn,
                })}
                value={mrn}
                type="text"
                label="Patient Number"
                disabled
              />
            </Grid>

            <Grid item md={4} sm={4} xs={6}>
              <Input
                register={register("Hospital/Treatment Center")}
                type="text"
                label="Centre"
              />
            </Grid>
            <Grid item md={4} sm={4} xs={6}>
              <Input
                value={gender}
                register={register("Gender", {
                  value: gender,
                })}
                type="text"
                label="Gender"
                disabled
              />
            </Grid>
            <Grid item md={4} sm={4} xs={6}>
              <Input
                register={register("Marital Status", {
                  value: maritalstatus,
                })}
                type="text"
                label="Marital Status"
                value={maritalstatus}
                disabled
              />
            </Grid>
          </Grid>
          <Box mb={2}>
            <FormsHeaderText
              textTransform="Capitalize"
              color="black"
              fontWeight="500"
              text="For children, indicate the informant’s relationship with the patient and also indicate use of interpreter if applicable"
            />
          </Box>
          <Grid spacing={1} item md={4} sm={4} xs={6}>
            <Input
              register={register("Relationship to child")}
              type="text"
              label="Relationship to child"
            />
          </Grid>
          <Grid mt={1} item md={4} sm={4} xs={6}>
            <Input
              register={register("Use of Interpreter")}
              type="text"
              label="Use of Interpreter"
            />
          </Grid>
        </Grid>

        {/* PC */}
        <Grid item lg={12} md={12} sm={12}>
          <Box mt={2} sx={{ height: "40px" }}>
            <FormsHeaderText text="2. Presenting  complaint/reason for visit" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Presenting complaint")}
                type="text"
              />
            </Grid>
          </Grid>
        </Grid>

        {/*History of Pc  */}

        <Grid item lg={12} md={12} sm={12}>
          <Box mt={1} sx={{ height: "40px" }}>
            <FormsHeaderText text="3. History of Presenting complaint/reason for visit" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("History of Presenting complaint")}
                type="text"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Review */}

        <Grid item lg={12} md={12} sm={12}>
          <Box mt={1} sx={{ height: "40px" }}>
            <FormsHeaderText text="4. Review of Relevant systems" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea register={register("Review of Systems")} type="text" />
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

export default PatientInformation;
