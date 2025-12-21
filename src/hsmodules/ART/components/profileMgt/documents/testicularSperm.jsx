import React, { useState, useContext, useEffect } from "react";
import CustomSelect from "../../../../../components/inputs/basic/Select";
import { useForm } from "react-hook-form";
import { FormsHeaderText } from "../../../../../components/texts";
import GlobalCustomButton from "../../../../../components/buttons/CustomButton";
import Input from "../../../../../components/inputs/basic/Input";
import {
  Box,
  Stack,
  Grid,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";

import { UserContext, ObjectContext } from "../../../../../context";
import { toast } from "react-toastify";
import client from "../../../../../feathers";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RadioButton from "../../../../../components/inputs/basic/Radio";
import Textarea from "../../../../../components/inputs/basic/Textarea";
import { generateRandomString } from "../../../../helpers/generateString";

function TesticularSperm() {
  const [docStatus, setDocStatus] = useState("Draft");
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const ARTClinicalDocumentServ = client.service("clinicaldocument");
  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;
  const { register, handleSubmit, watch, setValue } = useForm();

  const watchIndication = watch("indication");

  const handleChangeStatus = (e) => {
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
      documentname: "Testicular Sperm",
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
        toast.success("Testicular Sperm updated successfully");
      } else {
        await ARTClinicalDocumentServ.create(document);
        toast.success("Testicular Sperm created successfully");
      }
      closeForm();
    } catch (err) {
      toast.error("Error submitting Testicular Sperm: " + err);
    } finally {
      hideActionLoader();
    }
  };

  useEffect(() => {
    setValue("file_no", generateRandomString(12));
  }, []);

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
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          my: 4,
        }}
      >
        <FormsHeaderText text="TESTICULAR SPERM ASPIRATION FORM" />

        <IconButton onClick={closeForm}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("name")}
            name="name"
            label="Name"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("file_no")}
            name="file_no"
            label="File Number"
            type="text"
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("age")}
            name="age"
            label="Age"
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
      <Grid item xs={12} mt={2}>
        <FormsHeaderText text="NATURE OF TESA:" />
        <RadioButton
          name="nature_of_tesa"
          options={["Diagnostic", "Treatment"]}
          register={register("nature_of_tesa")}
        />
      </Grid>
      <Grid item xs={12}>
        <FormsHeaderText text="INDICATION:" />
        <RadioButton
          name="indication"
          options={["Azoospermia", "Erectile Dysfunction", "Others"]}
          register={register("indication")}
        />
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormsHeaderText text="INDICATION:" />
          <RadioButton
            name="indication"
            options={["Azoospermia", "Erectile Dysfunction", "Others"]}
            register={register("indication")}
          />
        </Grid>
        {watchIndication === "Others" && (
          <Grid item xs={12} sm={6}>
            <Input
              register={register("otherIndication")}
              name="otherIndication"
              label="Other Indication"
              type="text"
            />
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <FormsHeaderText text="TESTIS EXAMINED:" />
        <RadioButton
          name="testisExamined"
          options={["Right", "Left"]}
          register={register("testisExamined")}
        />
      </Grid>

      <Grid item xs={12} sm={12}>
        <FormsHeaderText text="FINDINGS:" />
        <Textarea
          register={register("findings")}
          name="findings"
          rows={4}
          type="text"
        />
      </Grid>
      <Grid item xs={12}>
        <FormsHeaderText text="RECOMMENDATION:" />
        <RadioButton
          name="recommendation"
          options={["D/S", "D/S WITH TESA SPERM", "TESA SAMPLE ONLY"]}
          register={register("recommendation")}
        />
      </Grid>
      <Box>
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
          Submit Testicular Sperm
        </GlobalCustomButton>
      </Box>
    </Box>
  );
}

export default TesticularSperm;
