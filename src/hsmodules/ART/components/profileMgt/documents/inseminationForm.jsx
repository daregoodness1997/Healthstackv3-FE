import Grid from "@mui/material/Grid";
import React, { useContext, useState, useEffect } from "react";
import CustomSelect from "../../../../../components/inputs/basic/Select";
import { useForm } from "react-hook-form";
import { Box, Stack } from "@mui/material";
import { FormsHeaderText } from "../../../../../components/texts";
import GlobalCustomButton from "../../../../../components/buttons/CustomButton";
import StimulationDays from "./stimulationDays";
import Input from "../../../../../components/inputs/basic/Input";
import { FormControlLabel } from "@mui/material";
import Textarea from "../../../../../components/inputs/basic/Textarea";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { ObjectContext, UserContext } from "../../../../../context";
import client from "../../../../../feathers";
import { toast } from "react-toastify";

const InseminationForm = () => {
  const [docStatus, setDocStatus] = useState("Draft");
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const ARTClinicalDocumentServ = client.service("clinicaldocument");
  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;
  const [follicleStimulationData, setFollicleStimulationData] = useState([]);

  const { control, register, handleSubmit, setValue, reset, watch } = useForm();

  const stimulationData = watch("stimulationData");

  const handleChangeStatus = (e) => {
    // setValue('documentStatus', e.target.value);
    setDocStatus(e.target.value);
  };

  const schema = [
    { name: "Start Date", selector: (row) => row.startDate, sortable: true },
    { name: "End Date", selector: (row) => row.endDate, sortable: true },
    { name: "Time", selector: (row) => row.time, sortable: true },
    { name: "Clomid", selector: (row) => row.clomid, sortable: true },
    { name: "FSH", selector: (row) => row.fsh, sortable: true },
    { name: "HCG", selector: (row) => row.hcg, sortable: true },
    {
      name: "Follicles, Right",
      selector: (row) => row.folliclesRight,
      sortable: true,
    },
    {
      name: "Follicles, Left",
      selector: (row) => row.folliclesLeft,
      sortable: true,
    },
    { name: "Added by", selector: (row) => row.addedBy, sortable: true },
  ];

  const inputFields = [
    { name: "startDate", label: "Start Date", type: "date" },
    { name: "endDate", label: "End Date", type: "date" },
    { name: "time", label: "Time", type: "time" },
    { name: "clomid", label: "Clomid", type: "text" },
    { name: "fsh", label: "FSH", type: "text" },
    { name: "hcg", label: "HCG", type: "text" },
    { name: "addedBy", label: "Added by", type: "text" },
  ];

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
      documentname: "Intrauterine Insemination",
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
        toast.success("Intrauterine Insemination updated successfully");
      } else {
        await ARTClinicalDocumentServ.create(document);
        toast.success("Intrauterine Insemination created successfully");
      }
      closeForm();
    } catch (err) {
      toast.error("Error submitting Intrauterine Insemination: " + err);
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
    setFollicleStimulationData(draftDoc?.documentdetail?.stimulationData);
    return () => {
      draftDoc = {};
    };
  }, [draftDoc, follicleStimulationData]);

  const handleDataUpdate = (newData) => {
    setFollicleStimulationData(newData);
    setValue("stimulationData", newData);
  };

  return (
    <Box>
      <Stack paddingBlock={2}>
        <FormsHeaderText text="Intrauterine Insemination (IUI) Form" />
      </Stack>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CustomSelect
            control={control}
            name="sperm_source"
            label="Sperm Source"
            options={["Husband", "Donor"]}
          />
        </Grid>
      </Grid>
      <Box mt={2}>
        <Input
          register={register("last_menses")}
          name="last_menses"
          label="Last Menses"
          type="date"
        />
      </Box>
      <StimulationDays
        schema={schema}
        initialData={stimulationData || follicleStimulationData}
        onDataUpdate={handleDataUpdate}
        inputFields={inputFields}
        showHeader={false}
      />
      <Grid container spacing={2} paddingBlock={2}>
        <Grid item xs={12} sm={6}>
          <Input register={register("score")} label="Score" type="text" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input register={register("donated")} label="Donated" type="text" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("plan_for_treatment")}
            label="Plan for Treatment"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("outcome_of_treatment")}
            name="outcome_of_treatment"
            label="Outcome of Treatment"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Textarea
            register={register("additional_information")}
            label="Additional Information"
            rows={4}
            type="text"
          />
        </Grid>
        <Box m={4}>
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
      </Grid>
      <Box mt={1}>
        <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
          Submit IUI Form
        </GlobalCustomButton>
      </Box>
    </Box>
  );
};

export default InseminationForm;
