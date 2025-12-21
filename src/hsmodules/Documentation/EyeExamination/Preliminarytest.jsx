import React from "react";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import { FormsHeaderText } from "../../../components/texts";
import Input from "../../../components/inputs/basic/Input";
import { Grid, Box, FormControlLabel, Checkbox } from "@mui/material";
import { Controller } from "react-hook-form";

const PreliminaryTestForm = ({ handleNext, register, control }) => {
  return (
    <>
      <Box mb={3}>
        <Box mb={2}>
          <FormsHeaderText text="Visual Acuity Unaided" />
          <Grid container spacing={2}>
            {/* Header Row */}
            <Grid item xs={2}></Grid>
            {["OD", "OS", "OU", "Dist"].map((eye) => (
              <Grid item xs={2.5} key={`unaided-header-${eye}`}>
                <FormsHeaderText text={eye} />
              </Grid>
            ))}

            {["Fear", "Near", "P/N"].map((type) => (
              <React.Fragment key={`unaided-${type}`}>
                <Grid item xs={2}>
                  <FormsHeaderText text={type} />
                </Grid>
                {["OD", "OS", "OU", "Dist"].map((eye) => (
                  <Grid item xs={2.5} key={`unaided-${type}-${eye}`}>
                    <Input
                      label=""
                      name={`visualAcuity.unaided.${type.toLowerCase()}.${eye.toLowerCase()}`}
                      register={register(
                        `visualAcuity.unaided.${type.toLowerCase()}.${eye.toLowerCase()}`
                      )}
                    />
                  </Grid>
                ))}
              </React.Fragment>
            ))}
          </Grid>
        </Box>
        <Box>
          <FormsHeaderText text="Visual Acuity Aided" />
          <Grid container spacing={2}>
            {/* Header Row */}
            <Grid item xs={2}></Grid>
            {["OD", "OS", "OU"].map((eye) => (
              <Grid item xs={3} key={`aided-header-${eye}`}>
                <FormsHeaderText text={eye} />
              </Grid>
            ))}
            {["Fear", "Near", "P/N"].map((type) => (
              <React.Fragment key={`aided-${type}`}>
                <Grid item xs={2}>
                  <FormsHeaderText text={type} />
                </Grid>
                {["OD", "OS", "OU"].map((eye) => (
                  <Grid item xs={3} key={`aided-${type}-${eye}`}>
                    <Input
                      label=""
                      name={`visualAcuity.aided.${type.toLowerCase()}.${eye.toLowerCase()}`}
                      register={register(
                        `visualAcuity.aided.${type.toLowerCase()}.${eye.toLowerCase()}`
                      )}
                    />
                  </Grid>
                ))}
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      </Box>

      <Box mb={3}>
        <FormsHeaderText text="Counting Fingers & Light Perception" />
        <Grid container spacing={2}>
          {[
            "Counting Fingers",
            "Hand Movement",
            "Light Perception",
            "Light Projection",
            "No Light Perception",
          ].map((label) => (
            <React.Fragment key={label}>
              {["OD", "OS"].map((eye) => (
                <Grid item xs={6} sm={4} key={`${label}-${eye}`}>
                  <FormControlLabel
                    control={
                      <Controller
                        name={`${label.replace(/\s/g, "").toLowerCase()}.${eye.toLowerCase()}`}
                        control={control}
                        render={({ field }) => <Checkbox {...field} />}
                      />
                    }
                    label={`${label} (${eye})`}
                  />
                </Grid>
              ))}
            </React.Fragment>
          ))}
        </Grid>
      </Box>

      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          {/* Header Row */}
          <Grid item xs={3}></Grid>
          <Grid item xs={4.5}>
            <FormsHeaderText
              text="OD"
              sx={{ textAlign: "center", fontWeight: "bold", color: "#000" }}
            />
          </Grid>
          <Grid item xs={4.5}>
            <FormsHeaderText
              text="OS"
              sx={{ textAlign: "center", fontWeight: "bold", color: "#000" }}
            />
          </Grid>

          {/* Pachymetry Row */}
          <Grid item xs={3}>
            <FormsHeaderText text="Pachymetry" sx={{ color: "#000" }} />
          </Grid>
          <Grid item xs={4.5}>
            <Box pb="12px">
              <Input
                // label=""
                type="text"
                name="pachymetry.od"
                {...register("pachymetry.od")}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "20px",
                    paddingBottom: "25px",
                  },
                }}
              />
            </Box>
            <Input
              type="date"
              name="pachymetry.od.date"
              register={register("pachymetry.od.date")}
            />
          </Grid>
          <Grid item xs={4.5}>
            <Box pb="12px">
              <Input
                // label=""
                type="text"
                name="pachymetry.os"
                {...register("pachymetry.os")}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "20px",
                    padding: "2px 5px",
                  },
                }}
              />
            </Box>
            <Input
              type="date"
              name="pachymetry.os.date"
              register={register("pachymetry.os.date")}
              sx={{
                "& .MuiInputBase-input": { height: "20px", padding: "2px 5px" },
              }}
            />
          </Grid>

          {/* Tonometry Row */}
          <Grid item xs={3}>
            <FormsHeaderText text="Tonometry" sx={{ color: "#000" }} />
          </Grid>
          <Grid item xs={4.5}>
            <Box pb="12px">
              <Input
                label=""
                type="text"
                name="tonometry.od"
                register={register("tonometry.od")}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "20px",
                    padding: "2px 5px",
                  },
                }}
              />
            </Box>
            <Input
              label="Method/Time"
              type="text"
              name="tonometry.methodTime"
              register={register("tonometry.methodTime")}
              placeholder="2:12:50 PM"
              sx={{
                "& .MuiInputBase-input": { height: "20px", padding: "2px 5px" },
              }}
            />
          </Grid>
          <Grid item xs={4.5}>
            <Input
              label=""
              type="text"
              name="tonometry.os"
              register={register("tonometry.os")}
              sx={{
                "& .MuiInputBase-input": { height: "20px", padding: "2px 5px" },
              }}
            />
          </Grid>

          {/* Glaucoma Flowsheet Row */}
          <Grid item xs={3}>
            <FormsHeaderText text="Glaucoma Flowsheet" sx={{ color: "#000" }} />
          </Grid>
          <Grid item xs={4.5}>
            <Box pb="12px">
              <Input
                label="Visual Field"
                name="glaucoma.visualField.od"
                register={register("glaucoma.visualField.od")}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "20px",
                    padding: "2px 5px",
                  },
                }}
              />
            </Box>
            <Box pb="12px">
              <Input
                label="Cup/Disk Ratio"
                name="glaucoma.cupDiskRatio.od"
                register={register("glaucoma.cupDiskRatio.od")}
                sx={{
                  "& .MuiInputBase-input": {
                    height: "20px",
                    padding: "2px 5px",
                  },
                }}
              />
            </Box>
            <Input
              label="IOP mm/Hg"
              name="glaucoma.iop.od"
              register={register("glaucoma.iop.od")}
              sx={{
                "& .MuiInputBase-input": { height: "20px", padding: "2px 5px" },
              }}
            />
          </Grid>
          <Grid item xs={4.5}>
            <Input
              label="Visual Field"
              name="glaucoma.visualField.os"
              register={register("glaucoma.visualField.os")}
              sx={{
                "& .MuiInputBase-input": { height: "20px", padding: "2px 5px" },
              }}
            />
            <Input
              label="Cup/Disk Ratio"
              name="glaucoma.cupDiskRatio.os"
              register={register("glaucoma.cupDiskRatio.os")}
              sx={{
                "& .MuiInputBase-input": { height: "20px", padding: "2px 5px" },
              }}
            />
            <Input
              label="IOP mm/Hg"
              name="glaucoma.iop.os"
              register={register("glaucoma.iop.os")}
              sx={{
                "& .MuiInputBase-input": { height: "20px", padding: "2px 5px" },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box mb={3}>
        <FormsHeaderText text="Pupillary Distance" />
        <Grid container spacing={2}>
          <Grid item xs={2}></Grid>
          {["OD", "OS", "OU"].map((eye) => (
            <Grid item xs={3} key={`pupillary-header-${eye}`}>
              <FormsHeaderText text={eye} />
            </Grid>
          ))}

          {["Far", "Near"].map((distance) => (
            <React.Fragment key={distance}>
              <Grid item xs={2}>
                <FormsHeaderText text={distance} />
              </Grid>
              {["OD", "OS", "OU"].map((eye) => (
                <Grid item xs={3} key={`${distance}-${eye}`}>
                  <Input
                    label=""
                    name={`pupillaryDistance.${distance.toLowerCase()}.${eye.toLowerCase()}`}
                    register={register(
                      `pupillaryDistance.${distance.toLowerCase()}.${eye.toLowerCase()}`
                    )}
                  />
                </Grid>
              ))}
            </React.Fragment>
          ))}
          <Grid item xs={4}>
            <FormsHeaderText text="Fields: Full" />
          </Grid>
          <Grid item xs={4}>
            <Input
              label=""
              name="fieldsFullLeft"
              register={register("fieldsFullLeft")}
            />
          </Grid>
          <Grid item xs={4}>
            <Input
              label=""
              name="fieldsFullRight"
              register={register("fieldsFullRight")}
            />
          </Grid>

          <Grid item xs={4}>
            <FormsHeaderText text="Fields: Restricted" />
          </Grid>
          <Grid item xs={4}>
            <Input
              label=""
              name="fieldsRestrictedLeft"
              register={register("fieldsRestrictedLeft")}
            />
          </Grid>
          <Grid item xs={4}>
            <Input
              label=""
              name="fieldsRestrictedRight"
              register={register("fieldsRestrictedRight")}
            />
          </Grid>
          <Grid item xs={4}>
            <FormsHeaderText text="Distance (Reading)" />
          </Grid>
          <Grid item xs={3}>
            <Input
              label=""
              name="distanceReading"
              register={register("distanceReading")}
            />
          </Grid>
          <Grid item xs={2}>
            <FormsHeaderText text="Eye Colour" />
          </Grid>
          <Grid item xs={3}>
            <Input label="" name="eyeColour" register={register("eyeColour")} />
          </Grid>
          <Grid item xs={4}>
            <FormsHeaderText text="Distance (Work)" />
          </Grid>
          <Grid item xs={3}>
            <Input
              label=""
              name="distanceWork"
              register={register("distanceWork")}
            />
          </Grid>
          <Grid item xs={2}>
            <FormsHeaderText text="Hyper Eye" />
          </Grid>
          <Grid item xs={3}>
            <Input label="" name="hyperEye" register={register("hyperEye")} />
          </Grid>
          <Grid item xs={2}>
            <FormsHeaderText text="NPC" />
          </Grid>
          <Grid item xs={3}>
            <Input label="" name="npc" register={register("npc")} />
          </Grid>
          <Grid item xs={2}>
            <FormsHeaderText text="Stereops" />
          </Grid>
          <Grid item xs={3}>
            <Input label="" name="stereops" register={register("stereops")} />
          </Grid>
        </Grid>
      </Box>
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

export default PreliminaryTestForm;
