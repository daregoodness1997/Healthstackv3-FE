import {
  Box,
  Grid,
  IconButton,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { FormsHeaderText } from "../../../../../components/texts";
import Input from "../../../../../components/inputs/basic/Input";
import GlobalCustomButton from "../../../../../components/buttons/CustomButton";
import Textarea from "../../../../../components/inputs/basic/Textarea";
import { useState } from "react";
// import HormonalAssayForm from "./hom";
import { useEffect } from "react";
import { ObjectContext, UserContext } from "../../../../../context";
import { useContext } from "react";
import client from "../../../../../feathers";

const PreTreatmentAssessmentForm = () => {
  const [docStatus, setDocStatus] = useState("Draft");
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const ARTClinicalDocumentServ = client.service("clinicaldocument");
  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;
  const { control, register, handleSubmit, setValue, reset, watch } = useForm();

  const closeForm = async () => {
    let documentobj = {};
    documentobj.name = "";
    documentobj.facility = "";
    documentobj.document = "";
    const newDocumentClassModule = {
      selectedDocumentClass: documentobj,
      encounter_right: false,
      show: "detail",
    };
    await setState((prevstate) => ({
      ...prevstate,
      DocumentClassModule: newDocumentClassModule,
    }));
    reset();
  };

  const onSubmit = async (data) => {
    showActionLoader();
    let document = {
      documentdetail: data,
      documentname: "Pre Treatment Assessment",
      documentClassId: state.DocumentClassModule.selectedDocumentClass._id,
      createdBy: user._id,
      createdByname: `${user.firstname} ${user.lastname}`,
      locationId: state.employeeLocation.locationId || "",
      location: `${state.employeeLocation.locationName} ${state.employeeLocation.locationType}`,
      facility: user.currentEmployee.facilityDetail._id,
      facilityname: user.currentEmployee.facilityDetail.facilityName,
      familyprofileId: state.ARTModule.selectedFamilyProfile._id,
      client: state.ARTModule.selectedFamilyProfile._id,
      clientName: state.ARTModule.selectedFamilyProfile.name,
      status: docStatus === "Draft" ? "Draft" : "completed",
      geolocation: {
        type: "Point",
        coordinates: [state.coordinates.latitude, state.coordinates.longitude],
      },
    };

    if (!document.facilityname || !document.createdByname) {
      toast.error(
        "Documentation data missing, requires facility and creator details"
      );
      hideActionLoader();
      return;
    }

    if (document.locationId === "") {
      delete document.locationId;
    }

    try {
      if (!!draftDoc && draftDoc.status === "Draft") {
        await ARTClinicalDocumentServ.patch(draftDoc._id, document);
        toast.success("Antagonist Protocol updated successfully");
      } else {
        await ARTClinicalDocumentServ.create(document);
        toast.success("Antagonist Protocol created successfully");
      }
      // reset();
      closeForm();
    } catch (err) {
      toast.error("Error submitting Antagonist Protocol: " + err);
    } finally {
      hideActionLoader();
    }
  };

  useEffect(() => {
    if (!!draftDoc && draftDoc.status === "Draft") {
      Object.entries(draftDoc.documentdetail).map(([keys, value], i) =>
        setValue(keys, value, {
          shouldValidate: true,
          shouldDirty: true,
        })
      );
    }

    return () => {
      draftDoc = {};
    };
  }, [draftDoc]);

  const handleChangeStatus = (e) => {
    setDocStatus(e.target.value);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          my: 4,
        }}
      >
        <FormsHeaderText text="Pre-Treatment Assessment Form" />
        <IconButton>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Basic Information */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("wife")}
            name="wife"
            label="Wife's Name"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("lmp")}
            name="lmp"
            label="LMP"
            type="date"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("husband")}
            name="husband"
            label="Husband's Name"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("wife_age")}
            name="wife_age"
            label="Wife's Age"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("id_number")}
            name="id_number"
            label="ID Number"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("date")}
            name="date"
            label="Date"
            type="date"
          />
        </Grid>
      </Grid>

      {/* Seminal Fluid Analysis */}
      <Box mt={4}>
        <FormsHeaderText text="Seminal Fluid Analysis" />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("days_abstinence")}
              name="days_abstinence"
              label="Days of Abstinence"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("time_produced")}
              name="time_produced"
              label="Time Produced"
              type="time"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("time_examined")}
              name="time_examined"
              label="Time Examined"
              type="time"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("volume")}
              name="volume"
              label="Volume"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("liquefaction")}
              name="liquefaction"
              label="Liquefaction"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("color")}
              name="color"
              label="Color"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("consistency")}
              name="consistency"
              label="Consistency"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("sperm_concentration")}
              name="sperm_concentration"
              label="Sperm Concentration"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("motility_percentage")}
              name="motility_percentage"
              label="Motility Percentage"
              type="text"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Progressive Motility */}
      <Box mt={4}>
        <FormsHeaderText text="Progressive Motility" />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Input
              register={register("progressive_motility.fast")}
              name="progressive_motility.fast"
              label="Fast (%)"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Input
              register={register("progressive_motility.slow")}
              name="progressive_motility.slow"
              label="Slow (%)"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Input
              register={register("progressive_motility.no_movement")}
              name="progressive_motility.no_movement"
              label="No Movement (%)"
              type="text"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Cytology */}
      <Box mt={4}>
        <FormsHeaderText text="Cytology" />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("pus_cells")}
              name="pus_cells"
              label="Pus Cells"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("epithelial_cells")}
              name="epithelial_cells"
              label="Epithelial Cells"
              type="text"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Production Method */}
      <Box mt={4}>
        <FormsHeaderText text="Production Method" />
        <RadioGroup
          row
          name="production_method"
          {...register("production_method")}
        >
          <FormControlLabel
            value="masturbation"
            control={<Radio />}
            label="Masturbation"
          />
          <FormControlLabel value="coitus" control={<Radio />} label="Coitus" />
        </RadioGroup>
      </Box>

      {/* Indication */}
      <Box mt={4}>
        <FormsHeaderText text="Indication" />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("seminal_analysis")}
              name="seminal_analysis"
              label="Seminal Analysis"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("freezing")}
              name="freezing"
              label="Freezing"
              type="text"
            />
          </Grid>
        </Grid>
      </Box>
      <Grid item xs={12} sm={6} mt={3}>
        <Input
          register={register("ph_7.2")}
          name="ph_7.2"
          label="Ph.(7.2-80)"
          type="text"
        />
      </Grid>
      {/* Morphology */}
      <Box mt={4}>
        <FormsHeaderText text="Morphology" />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("vital_sperm")}
              name="vital_sperm"
              label="Vital Sperm (%)"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("mid_piece_defects")}
              name="mid_piece_defects"
              label="Mid Piece Defects (%)"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("tail_defects")}
              name="tail_defects"
              label="Tail Defects (%)"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("multiple_defects")}
              name="multiple_defects"
              label="Multiple Defects (%)"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("head_defects")}
              name="head_defects"
              label="Head Defects (%)"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("immature_forms")}
              name="immature_forms"
              label="Immature Forms (%)"
              type="text"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Serology */}
      <Box mt={4}>
        <FormsHeaderText text="Serology" />
        <Grid container spacing={3}>
          {/* Wife's Serology */}
          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <FormsHeaderText text="Wife" />
            </Box>
            <Grid container spacing={2}>
              {[
                ["HIV", "hiv"],
                ["VDRL", "vdrl"],
                ["HBsAg", "hbsag"],
                ["HCV", "hcv"],
                ["HBcAg/HBeAg", "hbcag_hbeag"],
                ["Chlamydia", "chlamydia"],
                ["Blood Group", "blood_group"],
                ["Genotype", "genotype"],
              ].map(([label, field]) => (
                <Grid item xs={12} key={field}>
                  <Input
                    register={register(`wife_serology.${field}`)}
                    name={`wife_serology.${field}`}
                    label={label}
                    type="text"
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Husband's Serology */}
          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <FormsHeaderText text="Husband" />
            </Box>
            <Grid container spacing={2}>
              {[
                ["HIV", "hiv"],
                ["VDRL", "vdrl"],
                ["HBsAg", "hbsag"],
                ["HCV", "hcv"],
                ["HBcAg/HBeAg", "hbcag_hbeag"],
                ["Chlamydia", "chlamydia"],
                ["Blood Group", "blood_group"],
                ["Genotype", "genotype"],
              ].map(([label, field]) => (
                <Grid item xs={12} key={field}>
                  <Input
                    register={register(`husband_serology.${field}`)}
                    name={`husband_serology.${field}`}
                    label={label}
                    type="text"
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Hormonal Assay */}
      <Box mt={4}>
        <FormsHeaderText text="Hormonal Assay" />
        <Grid container spacing={3}>
          {[
            ["AMH", "amh", "ng/ml"],
            ["Prolactin", "prolactin", "ng/ml"],
            ["Vitamin D", "vit_d", "ng/ml"],
            ["Progesterone", "progesterone", ""],
            ["Testosterone", "testosterone", ""],
            ["TSH", "tsh", "mIU/L"],
            ["T4", "t4", ""],
            ["T3", "t3", ""],
          ].map(([label, field, unit]) => (
            <Grid item xs={12} sm={6} key={field}>
              <Input
                register={register(`hormonal_assay.${field}`)}
                name={`hormonal_assay.${field}`}
                label={`${label}${unit ? ` (${unit})` : ""}`}
                type="text"
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Embryologist Comment */}
      <Grid item xs={12} sm={12} mt={4}>
        <Textarea
          register={register("embryologist_comment")}
          name="embryologist_comment"
          label="Embryologist Comment and Signature"
          multiline
          rows={4}
        />
      </Grid>
      <RadioGroup
        row
        aria-label="document-status"
        name="status"
        value={docStatus}
        onChange={handleChangeStatus}
      >
        <FormControlLabel
          value="Draft"
          control={<Radio {...register("status")} />}
          label="Draft"
        />
        <FormControlLabel
          value="Final"
          control={<Radio {...register("status")} />}
          label="Final"
        />
      </RadioGroup>
      <Box mt={2}>
        <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
          Submit Pre-Treatment Assessment
        </GlobalCustomButton>
      </Box>
    </Box>
  );
};

export default PreTreatmentAssessmentForm;
