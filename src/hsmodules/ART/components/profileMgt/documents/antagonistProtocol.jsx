import React, { useContext, useState, useEffect } from "react";
// import CustomSelect from "../../../../../components/inputs/basic/Select";
import { useForm } from "react-hook-form";
import { FormsHeaderText } from "../../../../../components/texts";
import GlobalCustomButton from "../../../../../components/buttons/CustomButton";
import { useFieldArray } from "react-hook-form";
import StimulationDays from "./stimulationDays";
import Input from "../../../../../components/inputs/basic/Input";
import { Box, Grid } from "@mui/material";
import ProtocolForm from "./protocolForm";
import { ObjectContext, UserContext } from "../../../../../context";
import { toast } from "react-toastify";
import client from "../../../../../feathers";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AntagonistProtocol = () => {
  const [docStatus, setDocStatus] = useState("Draft");
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const ARTClinicalDocumentServ = client.service("clinicaldocument");
  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;
  const [follicleStimulationData, setFollicleStimulationData] = useState([]);

  const { control, register, handleSubmit, setValue, reset, watch } = useForm();

  const stimulationData = watch("stimulationData");

  const {
    fields: medicationFields,
    append: appendMedication,
    remove: removeMedication,
  } = useFieldArray({
    control,
    name: "medications",
  });

  const {
    fields: allergyFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control,
    name: "allergies",
  });

  const {
    fields: follicleFields,
    append: appendFollicle,
    remove: removeFollicle,
  } = useFieldArray({
    control,
    name: "follicles",
  });

  const {
    fields: oocyteFields,
    append: appendOocyte,
    remove: removeOocyte,
  } = useFieldArray({
    control,
    name: "oocytes",
  });

  const {
    fields: embryoFields,
    append: appendEmbryo,
    remove: removeEmbryo,
  } = useFieldArray({
    control,
    name: "embryos",
  });

  const {
    fields: transferredFields,
    append: appendTransferred,
    remove: removeTransferred,
  } = useFieldArray({
    control,
    name: "transferred",
  });

  const handleChangeStatus = (e) => {
    // setValue('documentStatus', e.target.value);
    setDocStatus(e.target.value);
  };

  const handleAddItem = (item) => {
    switch (item) {
      case "Medication":
        appendMedication({ value: "" });
        break;
      case "Allergies":
        appendAllergy({ value: "" });
        break;
      case "Follicle":
        appendFollicle({ value: "" });
        break;
      case "Oocyte":
        appendOocyte({ value: "" });
        break;
      case "Embryo":
        appendEmbryo({ value: "" });
        break;
      case "Transferred":
        appendTransferred({ value: "" });
        break;
    }
  };

  const handleRemoveItem = (item, index) => {
    switch (item) {
      case "Medication":
        removeMedication(index);
        break;
      case "Allergies":
        removeAllergy(index);
        break;
      case "Follicle":
        removeFollicle(index);
        break;
      case "Oocyte":
        removeOocyte(index);
        break;
      case "Embryo":
        removeEmbryo(index);
        break;
      case "Transferred":
        removeTransferred(index);
        break;
    }
  };

  const schema = [
    { name: "Start Date", selector: (row) => row.startDate, sortable: true },
    { name: "End Date", selector: (row) => row.endDate, sortable: true },
    { name: "Time", selector: (row) => row.time, sortable: true },
    {
      name: "GON-F/PUREGON HMG",
      selector: (row) => row.gonFPuregonHmg,
      sortable: true,
    },
    { name: "CETROTIDE", selector: (row) => row.cetrotide, sortable: true },
    { name: "HCG", selector: (row) => row.hcg, sortable: true },
  ];

  const inputFields = [
    { name: "startDate", label: "Start Date", type: "date" },
    { name: "endDate", label: "End Date", type: "date" },
    { name: "time", label: "Time", type: "time" },
    { name: "gonFPuregonHmg", label: "GON-F/PUREGON HMG", type: "text" },
    { name: "cetrotide", label: "CETROTIDE", type: "text" },
    { name: "hcg", label: "HCG", type: "text" },
    { name: "folliclesRight", label: "Follicles, Right", type: "text" },
    { name: "folliclesLeft", label: "Follicles, Left", type: "text" },
  ];

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
      documentname: "Antagonist Protocol",
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          my: 4,
        }}
      >
        <FormsHeaderText text="Antagonist Protocol" />

        <IconButton onClick={closeForm}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("treatment_form")}
            name="treatment_form"
            label="Treatment Form"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("indication_male")}
            name="indication_male"
            label="Indication Male"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("registration")}
            name="registration"
            label="Registration"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("indication_female")}
            name="indication_female"
            label="Indication Female"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("treatment_cycle")}
            name="treatment_cycle"
            label="Treatment Cycle"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            register={register("transfer_cycle")}
            name="transfer_cycle"
            label="Transfer Cycle"
            type="text"
          />
        </Grid>
      </Grid>
      <Box mt={2}>
        <Input
          register={register("last_menses")}
          name="last_menses"
          label="Last Menses"
          type="text"
        />
      </Box>

      <StimulationDays
        schema={schema}
        initialData={stimulationData || follicleStimulationData}
        onDataUpdate={handleDataUpdate}
        inputFields={inputFields}
      />

      <ProtocolForm
        control={control}
        register={register}
        medicationFields={medicationFields}
        allergyFields={allergyFields}
        follicleFields={follicleFields}
        oocyteFields={oocyteFields}
        embryoFields={embryoFields}
        transferredFields={transferredFields}
        handleAddItem={handleAddItem}
        handleRemoveItem={handleRemoveItem}
        docStatus={docStatus}
        handleChangeStatus={handleChangeStatus}
        showMedication
        showAllergies
        showFollicle
        showOocyte
        showEmbryo
        showTransferred
        showAdditionalFields
      />
      <Box mt={1}>
        <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
          Submit Antagonist Protocol
        </GlobalCustomButton>
      </Box>
    </Box>
  );
};

export default AntagonistProtocol;
