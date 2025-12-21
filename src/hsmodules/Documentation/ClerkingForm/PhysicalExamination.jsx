import { Box, Grid } from "@mui/material";
import React from "react";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import Textarea from "../../../components/inputs/basic/Textarea";
import { FormsHeaderText } from "../../../components/texts";
import Input from "../../../components/inputs/basic/Input";

const PhysicalExamination = ({ handleNext, register }) => {
  return (
    <div className="card-content vscrollable">
      <Box>
        <Grid item lg={12} md={12} sm={12}>
          <Box sx={{ height: "40px" }}>
            <FormsHeaderText text="12. General Examination" />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Generation Examination")}
                type="text"
                placeholder={
                  "Tanner staging for adolescents (use provided pictorial references) Know the various signs pertinent to each system..."
                }
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("General Examination(Respiratory) ")}
                type="text"
                placeholder={
                  "Look out for; physique, voice, breathlessness, digital clubbing, cyanosis or pallor, intercostal recession, use of accessory respiratory muscles, venous pulses, lymph nodes, spine, presence of a sputum jar..."
                }
                label={"Respiratory"}
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("General Examination(cardiovascular)")}
                type="text"
                placeholder={
                  " Check for pallor, cyanosis, digital clubbing, splinter haemorrhages, oedema..."
                }
                label={"Cardiovascular"}
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("General Examination(Abdominal)")}
                type="text"
                label={"Abdominal"}
              />
            </Grid>
          </Grid>
          <Box mb={2}>
            <FormsHeaderText
              textTransform="Capitalize"
              color="black"
              text="Note presence of stigmata of chronic liver disease or alcoholic liver disease e.g. jaundice, spider angioma, distended abdominal veins, palmar erythema, loss of thenar and hypothenar eminences, ascites, encephalopathy, asterixis, etc. "
            />
          </Box>

          <Box mb={2}>
            <FormsHeaderText color="black" text="systemic Examination" />
          </Box>
          <Grid spacing={1} item md={4} sm={4} xs={6}>
            <Textarea
              register={register("Systemic Examination")}
              placeholder={
                "Use the IPPA method always (inspection, palpation, percussion, auscultation) and be knowledgeable about what to expect in a normal individual so as to observe abnormalities accurately..."
              }
              type="text"
            />
          </Grid>

          <Box mt={1}>
            <FormsHeaderText color="black" text="Cardiovascular Examination" />
          </Box>
          <Grid spacing={1} item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Cardiovascular Examination")}
              label={"Pulse –rate, rhythm, volume, synchronicity"}
              type="text"
            />
          </Grid>
          <Grid mt={0.5} container spacing={1}>
            <Grid item md={6} sm={6} xs={6}>
              <Input
                register={register("Blood-Pressure")}
                type="text"
                label=" Blood Pressure"
              />
            </Grid>
            <Grid item md={6} sm={6} xs={6}>
              <Input
                register={register("Apex Beat")}
                type="text"
                label=" Apex Beat"
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Input
                register={register("Examination of precordium")}
                type="text"
                label="Examination of the precordium (inspection, palpation, percussion, auscultation)"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* PC */}
        <Grid item lg={12} md={12} sm={12}>
          <Box mt={2}>
            <FormsHeaderText text="13. Physical Examination" />
          </Box>
          <Box>
            <FormsHeaderText color="black" text="Respiratory Examination" />
          </Box>
          <Box>
            <FormsHeaderText
              textTransform="Capitalize"
              color="black"
              text="Inspection"
            />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Chest Appreance")}
                type="text"
                label={
                  "Chest appearance – shape and symmetry. Look out for scarification marks, scars, lumps or obvious swelling"
                }
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Chest Movement")}
                type="text"
                label={"Chest Movement"}
              />
            </Grid>
          </Grid>
          <Box>
            <FormsHeaderText
              textTransform="Capitalize"
              color="black"
              text="Palpation"
            />
          </Box>

          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Tracheal position")}
                type="text"
                label={
                  "Tracheal position – if deviated, check apex beat as well."
                }
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Chest Expansion")}
                type="text"
                label={"Evaluate Chest Expansion"}
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Chest wall tenderness")}
                type="text"
                label={"Check for chest wall tenderness"}
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Tactile fremitus")}
                type="text"
                label={"Tactile fremitus"}
              />
            </Grid>
          </Grid>

          <Box mt={1}>
            <FormsHeaderText
              //textTransform="Capitalize"
              color="black"
              text="Percussion of chest wall"
            />
          </Box>

          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Percussion of chest wall")}
                type="text"
              />
            </Grid>
          </Grid>

          <Box mt={1}>
            <FormsHeaderText
              textTransform="Capitalize"
              color="black"
              text="AUSCULTATION for breath sound quality, added sounds and vocal fremitus"
            />
          </Box>

          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea register={register("Auscultation")} type="text" />
            </Grid>
          </Grid>

          <Box mt={1}>
            <FormsHeaderText
              //textTransform="Capitalize"
              color="black"
              text="*NOTE THAT THE ANTERIOR AND POSTERIOR CHEST WALLS ARE DIFFERENT ENTITIES AND MUST BE EXAMINED SEPARATELY!"
            />
          </Box>

          <Box mt={1}>
            <FormsHeaderText
              //textTransform="Capitalize"
              color="black"
              text="Abdominal examination"
            />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Abdominal inspection")}
                label={"Inspection"}
                type="text"
                placeholder={
                  "observe shape, movement of abdominal wall with respiration, dilated veins, obvious swellings or pulsations, scars and scarification marks, visible peristalsis and pubic hair distribution..."
                }
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Abdominal palpation")}
                label={"Palpation"}
                type="text"
                placeholder={
                  "tenderness, liver, spleen or kidney(s) enlargement, other masses, rigidity, succession splash or fluid thrill, hernia orifices"
                }
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Abdominal Tenderness")}
                label={
                  "Ask for tenderness before palpating and approach the affected region last."
                }
                type="text"
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Light Abdominal palpation")}
                label={"Light palpation -for tenderness"}
                type="text"
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Deep Abdominal palpation")}
                label={
                  "Deep palpation – further elicit tenderness and/or lumps, check for organomegaly (Liver, spleen and kidneys)"
                }
                type="text"
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Abdominal Percussion")}
                label={"Percussion: Liver span, shifting dullness"}
                type="text"
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Abdominal Auscultation")}
                label={"Auscultation: bowel sounds, bruit"}
                type="text"
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Vaginal Examination")}
                label={"Vaginal examination if indicated"}
                type="text"
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Digital Rectal Examination")}
                label={"Digital Rectal Examination "}
                type="text"
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Textarea
                register={register("Urinalysis")}
                label={"Urinalysis as applicable"}
                type="text"
              />
            </Grid>
          </Grid>
          <Box>
            <FormsHeaderText color="black" text="CNS Examination" />
          </Box>

          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Higher cognitive functions")}
              label={
                "Higher cognitive functions: orientation, mood, thought, speech, short and long term memory, insight"
              }
              type="text"
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Conscious Level")}
              label={
                "Conscious level and cognitive function [determined during history taking]"
              }
              type="text"
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Glasgow coma scale")}
              label={
                "Conscious level assessed using Glasgow coma scale (GCS) Appearance, behavior, speech, concentration, memory"
              }
              type="text"
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Meningeal irritation ")}
              label={
                "Check for meningeal irritation – Brudzinski’s and Kernig’s signs"
              }
              type="text"
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Eye examination")}
              label={
                "Eye – acuity, visual fields, fundoscopy and pupillary reflexes"
              }
              type="text"
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Cranial nerve examination")}
              label={"Cranial nerve examination"}
              type="text"
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Motor system Examination")}
              label={
                "Motor system  - muscle tone, power, reflexes, coordination (finger-nose and heel-shin tests), involuntary movements"
              }
              type="text"
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Sensory system Examination")}
              label={
                "Sensory system – touch, pain, temperature, vibration sense, joint position sense and stereognosis"
              }
              type="text"
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Gait and stance test")}
              label={"Gait and Stance [Romberg’s test]"}
              type="text"
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("ANS Test")}
              label={
                "Autonomic nervous  system – check for absence of sweating, resting tachycardia, postural hypotension"
              }
              type="text"
            />
          </Grid>

          <Box>
            <FormsHeaderText color="black" text="Musculoskeletal System" />
          </Box>

          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Posture/Gait")}
              label={"Posture/Gait"}
              type="text"
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Spine examination")}
              label={"Spine examination"}
              type="text"
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Examination of extremities")}
              label={"Examination of extremities"}
              type="text"
            />
          </Grid>
          <Box>
            <FormsHeaderText
              textTransform="Capitalize"
              color="black"
              text="Examination of Joints In examining extremities and joints, general principles are;"
            />
          </Box>

          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Looks on Joints ")}
              label={"LOOK; for scars, swellings, rashes, muscle wasting."}
              type="text"
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Feels on Joints ")}
              label={"FEEL; for temperature, swellings, tenderness."}
              type="text"
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Moves on Joints ")}
              label={"MOVE; full range of movement "}
              placeholder={
                "active and passive, movement restriction – mild, moderate or severe?"
              }
              type="text"
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Functions on Joints ")}
              label={"FUNCTION – functional assessment of the joint."}
              type="text"
            />
          </Grid>

          <Box>
            <FormsHeaderText color="black" text="CLINICAL IMPRESSION" />
          </Box>

          <Grid item md={12} sm={12} xs={12}>
            <Textarea
              register={register("Clinical impression on Joints ")}
              label={"Report"}
              placeholder={
                " Functional assessment of the joint. HIGHLIGHT OF ISSUES (CONCERNING THE PATIENT AND HIS FAMILY)"
              }
              type="text"
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

export default PhysicalExamination;
