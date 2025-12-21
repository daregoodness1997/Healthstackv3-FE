import { Box, FormControlLabel, Grid, Stack } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { FormsHeaderText } from "../../../../../components/texts";
import { useForm } from "react-hook-form";
import Input from "../../../../../components/inputs/basic/Input";
import Textarea from "../../../../../components/inputs/basic/Textarea";
import GlobalCustomButton from "../../../../../components/buttons/CustomButton";
import AddAspiration from "./AddAspiration";
import { ObjectContext, UserContext } from "../../../../../context";
import { Radio, RadioGroup } from "@mui/material";
import { toast } from "react-toastify";
import client from "../../../../../feathers";

export default function LaboratoryTreatment() {
  const [docStatus, setDocStatus] = useState("Draft");
  const [aspiration, setAspiration] = useState([]);
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const ARTClinicalDocumentServ = client.service("clinicaldocument");
  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  const { register, handleSubmit, setValue, reset, watch } = useForm();

  const aspirationData = watch("aspirationData");

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
      documentname: "Laboratory Treatment",
      documentClassId: state.DocumentClassModule.selectedDocumentClass._id,
      createdBy: user._id,
      createdByname: `${user.firstname} ${user.lastname}`,
      locationId: state.employeeLocation.locationId || "",
      location: `${state.employeeLocation.locationName} ${state.employeeLocation.locationType}`,
      facility: user.currentEmployee.facilityDetail._id,
      facilityname: user.currentEmployee.facilityDetail.facilityName,
      familyprofileId: state.ARTModule.selectedFamilyProfile._id,
      clientName: state.ARTModule.selectedFamilyProfile.name,
      client: state.ARTModule.selectedFamilyProfile._id,
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
        toast.success("Laboratory Treatment updated successfully");
      } else {
        await ARTClinicalDocumentServ.create(document);
        toast.success("Laboratory Treatment created successfully");
      }
      closeForm();
    } catch (err) {
      toast.error("Error submitting Laboratory Treatment: " + err);
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
    setAspiration(draftDoc?.documentdetail?.aspirationData);
    return () => {
      draftDoc = {};
    };
  }, [draftDoc, aspiration]);

  const schema = [
    {
      name: "Aspiration Date",
      selector: (row) => row.aspirationDate,
      sortable: true,
    },
    {
      name: "Aspiration Time",
      selector: (row) => row.aspirationTime,
      sortable: true,
    },
    {
      name: "Transfer Time",
      selector: (row) => row.transferTime,
      sortable: true,
    },
    {
      name: "Embryo Time Out",
      selector: (row) => row.embryoTimeOut,
      sortable: true,
    },
    {
      name: "Fertilization Rate",
      selector: (row) => row.fertilizationRate,
      sortable: true,
    },
    {
      name: "Cleavage %",
      selector: (row) => row.cleavagePercentage,
      sortable: true,
    },
    {
      name: "Blastocytes %",
      selector: (row) => row.blastocytesPercentage,
      sortable: true,
    },
    { name: "PT Date", selector: (row) => row.ptDate, sortable: true },
    { name: "PT Result", selector: (row) => row.ptResult, sortable: true },
    {
      name: "Transfer Comment",
      selector: (row) => row.transferComment,
      sortable: true,
    },
  ];

  const inputFields = [
    { name: "aspirationDate", label: "Aspiration Date", type: "date" },
    { name: "aspirationTime", label: "Aspiration Time", type: "time" },
    { name: "transferTime", label: "Transfer Time", type: "time" },
    { name: "embryoTimeOut", label: "Embryo Time Out", type: "time" },
    { name: "fertilizationRate", label: "Fertilization Rate", type: "text" },
    { name: "cleavagePercentage", label: "Cleavage %", type: "text" },
    { name: "blastocytesPercentage", label: "Blastocytes %", type: "text" },
    { name: "ptDate", label: "PT Date", type: "date" },
    { name: "ptResult", label: "PT Result", type: "text" },
    { name: "transferComment", label: "Transfer Comment", type: "text" },
  ];

  const handleDataUpdate = (newData) => {
    setAspiration(newData);
    setValue("aspirationData", newData);
  };

  return (
    <Box component="div">
      <Stack paddingBlock={2}>
        <FormsHeaderText text="Laboratory Treatment Form" />
      </Stack>

      <Box component={"div"}>
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
              register={register("date")}
              name="date"
              type="date"
              label="Date"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AddAspiration
              schema={schema}
              initialData={aspirationData || aspiration}
              onDataUpdate={handleDataUpdate}
              showHeader={true}
              inputFields={inputFields}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Textarea
              register={register("additional_information")}
              name="additional_information"
              label="Additional Information"
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
            Submit Laboratory Treatment
          </GlobalCustomButton>
        </Box>
      </Box>
    </Box>
  );
}
