import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  Stack,
  Checkbox,
} from "@mui/material";
import CustomSelect from "../../../../../components/inputs/basic/Select";
import { FormsHeaderText } from "../../../../../components/texts";
import { useForm } from "react-hook-form";
import Input from "../../../../../components/inputs/basic/Input";
import Textarea from "../../../../../components/inputs/basic/Textarea";
import GlobalCustomButton from "../../../../../components/buttons/CustomButton";
import { ObjectContext, UserContext } from "../../../../../context";
import client from "../../../../../feathers";
import { toast } from "react-toastify";

const Sonohysterogram = () => {
  const [docStatus, setDocStatus] = useState("Draft");
  const { register, handleSubmit, setValue, control, reset } = useForm();
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const ARTClinicalDocumentServ = client.service("clinicaldocument");
  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  const handleChangeStatus = (e) => {
    // setValue('documentStatus', e.target.value);
    setDocStatus(e.target.value);
  };

  const closeForm = async () => {
    let documentobj = {};
    documentobj.name = "";
    documentobj.facility = "";
    documentobj.document = "";
    const newDocumentClassModule = {
      selectedDocumentClass: documentobj,
      encounter_right: false,
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
      documentname: "Sonohysterogram",
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
        toast.success("Sonohysterogram updated successfully");
      } else {
        await ARTClinicalDocumentServ.create(document);
        toast.success("Sonohysterogram created successfully");
      }
      reset();
      closeForm();
    } catch (err) {
      toast.error("Error submitting Sonohysterogram: " + err);
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

  return (
    <Box component="div">
      <Stack paddingBlock={2}>
        <FormsHeaderText text="Sonohysterogram" />
      </Stack>

      <Box component={"div"}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormsHeaderText text="Vulva:" />
            <FormControlLabel
              control={<Checkbox {...register("vulva")} />}
              label="Normal"
            />
            <FormControlLabel
              control={<Checkbox {...register("vulva")} />}
              label="Abnormal"
            />
            <Textarea
              placeholder="Details..."
              name="vulvaDetails"
              register={register("vulvaDetails")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormsHeaderText text="Vagina:" />
            <FormControlLabel
              control={<Checkbox {...register("vagina")} />}
              label="Normal"
            />
            <FormControlLabel
              control={<Checkbox {...register("vagina")} />}
              label="Abnormal"
            />
            <Textarea
              placeholder="Details..."
              name="vaginaDetails"
              register={register("vaginaDetails")}
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormsHeaderText text="Cervix:" />
            <FormControlLabel
              control={<Checkbox {...register("cervix")} />}
              label="Normal"
            />
            <FormControlLabel
              control={<Checkbox {...register("cervix")} />}
              label="Abnormal"
            />
            <Textarea
              placeholder="Details..."
              name="cervixDetails"
              register={register("cervixDetails")}
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormsHeaderText text="Process of Cannulation:" />
            <FormControlLabel
              control={<Checkbox {...register("cannulation")} />}
              label="Easy"
            />
            <FormControlLabel
              control={<Checkbox {...register("cannulation")} />}
              label="Difficult"
            />
            <FormControlLabel
              control={<Checkbox {...register("cannulation")} />}
              label="Not possible"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Textarea
              register={register("depth_of_uterine_cavity")}
              name="depth_of_uterine_cavity"
              label="Depth of Uterine Cavity (CM)"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormsHeaderText text="Outline of Uterine Cavity:" />
            <FormControlLabel
              control={<Checkbox {...register("outline_uterine")} />}
              label="Regular"
            />
            <FormControlLabel
              control={<Checkbox {...register("outline_uterine")} />}
              label="Abnormal"
            />
            <Textarea
              placeholder="Details..."
              name="outlineDetails"
              register={register("outlineDetails")}
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormsHeaderText text="Distensibility of Uterine Cavity:" />
            <FormControlLabel
              control={<Checkbox {...register("distensibility")} />}
              label="Easy"
            />
            <FormControlLabel
              control={<Checkbox {...register("distensibility")} />}
              label="Poor"
            />
            <FormControlLabel
              control={<Checkbox {...register("distensibility")} />}
              label="No"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Textarea
              register={register("additional_information")}
              name="additional_information"
              label="Any other information"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormsHeaderText text="CONCLUSION:" />
            <FormControlLabel
              control={<Checkbox {...register("conclusion")} />}
              label="Normal study"
            />
            <FormControlLabel
              control={<Checkbox {...register("conclusion")} />}
              label="Abnormal study"
            />
            <FormControlLabel
              control={<Checkbox {...register("conclusion")} />}
              label="For hysteroscopy"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Input
              register={register("date")}
              type="date"
              name="date"
              label="DATE"
            />
          </Grid>
        </Grid>
        <Box m={2}>
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
        </Box>
        <Box mt={1}>
          <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
            Submit Sonohysterogram Form
          </GlobalCustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Sonohysterogram;
