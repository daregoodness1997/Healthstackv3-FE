import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { FormsHeaderText } from "../../../../../components/texts";
import { useForm } from "react-hook-form";
import Input from "../../../../../components/inputs/basic/Input";
import Textarea from "../../../../../components/inputs/basic/Textarea";
import GlobalCustomButton from "../../../../../components/buttons/CustomButton";
import CustomSelect from "../../../../../components/inputs/basic/Select";
import AddInvestigation from "./AddInvestigation";
import AddDrug from "./AddDrug";
import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { UserContext, ObjectContext } from "../../../../../context";
import client from "../../../../../feathers";

const TreatmentSummary = () => {
  const [treatmentType, setTreatmentType] = useState("");
  const [docStatus, setDocStatus] = useState("Draft");
  const [investigation, setInvestigation] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const { register, handleSubmit, control, setValue, watch } = useForm();

  const drugData = watch("drugData");
  const investigationData = watch("investigationData");

  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const ARTClinicalDocumentServ = client.service("clinicaldocument");
  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  const handleChangeStatus = (e) => {
    setValue("documentStatus", e.target.value);
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
      documentname: "Treatment Summary",
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
        toast.success("Treatment Summary updated successfully");
      } else {
        await ARTClinicalDocumentServ.create(document);
        toast.success("Treatment Summary created successfully");
      }
      closeForm();
    } catch (err) {
      toast.error("Error submitting Treatment Summary: " + err);
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
      setInvestigation(draftDoc.documentdetail.investigationData || []);
      setDrugs(draftDoc.documentdetail.drugData || []);
    }
    return () => {
      draftDoc = {};
    };
  }, [draftDoc, investigation, drugs]);

  const investigationSchema = [
    { name: "SN", selector: (row) => row.sn, sortable: true },
    {
      name: "Investigation",
      selector: (row) => row.investigation,
      sortable: true,
    },
    { name: "Date", selector: (row) => row.date, sortable: true },
    { name: "Result", selector: (row) => row.result, sortable: true },
    {
      name: "Unit",
      selector: (row) => row.unit,
      sortable: true,
    },
    {
      name: "Transfer Comment",
      selector: (row) => row.transferComment,
      sortable: true,
    },
  ];

  const investigationInputFields = [
    { name: "investigation", label: "Investigation", type: "text" },
    { name: "date", label: "Date", type: "date" },
    { name: "result", label: "Result", type: "text" },
    { name: "unit", label: "Unit", type: "text" },
    { name: "transferComment", label: "Transfer Comment", type: "text" },
  ];

  const drugSchema = [
    { name: "SN", selector: (row) => row.sn, sortable: true },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
    },
    { name: "Drug Name", selector: (row) => row.drugName, sortable: true },
    { name: "Start Date", selector: (row) => row.startDate, sortable: true },
    { name: "No. of Days", selector: (row) => row.noOfDays, sortable: true },
    { name: "Dose", selector: (row) => row.dose, sortable: true },
    { name: "Total Dose", selector: (row) => row.totalDose, sortable: true },
  ];

  const drugInputFields = [
    { name: "type", label: "Type", type: "text" },
    { name: "drugName", label: "Drug Name", type: "text" },
    { name: "startDate", label: "Start Date", type: "date" },
    { name: "noOfDays", label: "No. of Days", type: "text" },
    { name: "dose", label: "Dose", type: "text" },
    { name: "totalDose", label: "Total Dose", type: "text" },
  ];

  const handleDataInvestigationUpdate = (newData) => {
    setInvestigation(newData);
    setValue("investigationData", newData);
  };

  const handleDataDrugUpdate = (newData) => {
    setDrugs(newData);
    setValue("drugData", newData);
  };

  return (
    <Box component="div">
      <Stack paddingBlock={2}>
        <FormsHeaderText text="Treatment Summary Form" />
      </Stack>

      <Box component={"div"}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <CustomSelect
              control={control}
              name="treatment_protocol_type"
              label="Treatment Protocol Type"
              options={["Own", "Donor"]}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("referring_doctor")}
              name="referring_doctor"
              label="Referring Doctor"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("consultant")}
              name="consultant"
              label="Consultant"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AddInvestigation
              schema={investigationSchema}
              initialData={investigationData || investigation}
              onDataInvestigationUpdate={handleDataInvestigationUpdate}
              inputFields={investigationInputFields}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("treatment_date")}
              name="treatment_date"
              label="Treatment Date"
              type="date"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("embryo_transfer_date")}
              name="embryo_transfer_date"
              label="Embryo Transfer Date"
              type="date"
            />
          </Grid>
          <Grid item xs={12}>
            <Textarea
              register={register("additional_treatment")}
              name="additional_treatment"
              label="Additional Treatment"
              type="text"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <FormLabel
                id="demo-radio-buttons-group-label"
                sx={{ fontSize: 12, color: "black" }}
              >
                Type of treatment
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                row
                defaultValue={treatmentType}
                name="radio-buttons-group"
                onChange={(e) => setTreatmentType(e.target.value)}
              >
                <FormControlLabel
                  value="ivf"
                  control={<Radio size="small" />}
                  label={
                    <Typography variant="body2" style={{ fontSize: 12 }}>
                      IVF
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="icsi"
                  control={<Radio size="small" />}
                  label={
                    <Typography variant="body2" style={{ fontSize: 12 }}>
                      ICSI
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="pisci"
                  control={<Radio size="small" />}
                  label={
                    <Typography variant="body2" style={{ fontSize: 12 }}>
                      PISCI
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="others"
                  control={<Radio size="small" />}
                  label={
                    <Typography variant="body2" style={{ fontSize: 12 }}>
                      Others
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("dr_in_charge_of_treatment")}
              name="dr_in_charge_of_treatment"
              label="Doctor in charge of treatment"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("drug_protocol")}
              name="drug_protocol"
              label="Drug Protocol"
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
          <Grid item xs={12} sm={12}>
            <AddDrug
              schema={drugSchema}
              initialData={drugData || drugs}
              onDataDrugUpdate={handleDataDrugUpdate}
              inputFields={drugInputFields}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Stack paddingBlock={2}>
              <FormsHeaderText text="Laboratory Details" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("egg_collection_date")}
              name="egg_collection_date"
              label="Egg Collection Date"
              type="date"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("no_of_eggs_collected")}
              name="no_of_eggs_collected"
              label="No of Eggs Collected"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("eggs_fertilized")}
              name="eggs_fertilized"
              label="Eggs Fertilized"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("embryos_transferred")}
              name="embryos_transferred"
              label="Embryos Transferred"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("eggs_discarded")}
              name="eggs_discarded"
              label="No of Eggs Discarded"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("embryos_stored")}
              name="embryos_stored"
              label="Embryos Stored"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("assisted_hatching")}
              name="assisted_hatching"
              label="Assisted Hatching"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("eggs_microinjected")}
              name="eggs_microinjected"
              label="Eggs Microinjected"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("metaphase_2_egg_collected")}
              name="metaphase_2_egg_collected"
              label="Metaphase 2 Eggs Collected"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("inseminated_with_partners_sperm")}
              name="inseminated_with_partners_sperm"
              label="Inseminated With Partners Sperm"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("inseminated_with_donor_sperm")}
              name="inseminated_with_donor_sperm"
              label="Inseminated With Donor Sperm"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Input
              register={register("complication")}
              name="complication"
              label="Complication"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Input
              register={register("outcome")}
              name="outcome"
              label="Outcome"
              type="text"
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
          <Grid item xs={12} sm={12}>
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
          </Grid>
        </Grid>
        <Box mt={1}>
          <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
            Submit Treatment Summary
          </GlobalCustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default TreatmentSummary;
