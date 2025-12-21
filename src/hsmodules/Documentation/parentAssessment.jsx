import React, { useState } from "react";
import {
  Grid,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Input from "../../components/inputs/basic/Input";
import CustomSelect from "../../components/inputs/basic/Select";
import { FormsHeaderText } from "../../components/texts";
import Textarea from "../../components/inputs/basic/Textarea";
import FollowUpVisit from "./modal/addFollowUp";
import { useEffect } from "react";
import { ObjectContext, UserContext } from "../../context";
import { useContext } from "react";
import client from "../../feathers";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

const PregnancyAssessment = () => {
  const { register, control, handleSubmit, reset, setValue, watch } = useForm();
  const [docStatus, setDocStatus] = useState("Draft");
  const [followUpData, setFollowUpData] = useState([]);
  const ClientServ = client.service("clinicaldocument");
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);

  const followUpTableData = watch("followUpTableData");

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

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

  useEffect(() => {
    if (!!draftDoc && draftDoc.status === "Draft") {
      Object.entries(draftDoc.documentdetail).map(([keys, value], i) =>
        setValue(keys, value, {
          shouldValidate: true,
          shouldDirty: true,
        })
      );
    }
    if (!followUpData.length && draftDoc.documentdetail.followUpTableData) {
      setFollowUpData(draftDoc.documentdetail.followUpTableData);
    }
    return () => {
      draftDoc = {};
    };
  }, [draftDoc]);

  const handleDataUpdate = (newData) => {
    const updatedFollowUpData = [...followUpData, newData];
    setFollowUpData(updatedFollowUpData);
    setValue("followUpTableData", updatedFollowUpData);
  };

  const columns = [
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
      width: "100px",
    },
    {
      name: "Presentation",
      selector: (row) => row.presentation,
      sortable: true,
      width: "100px",
    },
    {
      name: "Relation to Brim",
      selector: (row) => row.relationToBrim,
      sortable: true,
      width: "150px",
    },
    {
      name: "Fetal Heart",
      selector: (row) => row.fetalHeart,
      sortable: true,
      width: "100px",
    },
    {
      name: "Urine",
      selector: (row) => row.urine,
      sortable: true,
      width: "100px",
    },
    {
      name: "B.P.",
      selector: (row) => row.bp,
      sortable: true,
      width: "100px",
    },
    {
      name: "Weight",
      selector: (row) => row.weight,
      sortable: true,
      width: "100px",
    },
    {
      name: "PCV",
      selector: (row) => row.pcv,
      sortable: true,
      width: "100px",
    },
    {
      name: "Oedema",
      selector: (row) => row.oedema,
      sortable: true,
      width: "100px",
    },
    {
      name: "Remark",
      selector: (row) => row.remark,
      sortable: false,
      width: "100px",
    },
    {
      name: "Return",
      selector: (row) => row.return,
      sortable: true,
      width: "100px",
    },
    {
      name: "Examiner's Initial",
      selector: (row) => row.examinerInitial,
      sortable: true,
      width: "150px",
    },
    {
      name: "L.M.P",
      selector: (row) => row.lmp,
      sortable: true,
      width: "100px",
    },
    {
      name: "Fundal Height",
      selector: (row) => row.fundal_height,
      sortable: true,
      width: "100px",
    },
    {
      name: "Scan",
      selector: (row) => row.scan,
      sortable: true,
      width: "100px",
    },
  ];

  const followUpVisitSchema = [
    { name: "date", label: "Date", type: "date", required: true },
    {
      name: "presentation",
      label: "Presentation",
      type: "text",
      required: true,
    },
    {
      name: "relationToBrim",
      label: "Relation of Presenting Part to Brim",
      type: "text",
      required: true,
    },
    { name: "fetalHeart", label: "Fetal Heart", type: "text", required: true },
    { name: "urine", label: "Urine", type: "text", required: true },
    { name: "bp", label: "B.P.", type: "text", required: true },
    { name: "weight", label: "Weight", type: "text", required: true },
    { name: "pcv", label: "PCV", type: "text", required: false },
    { name: "oedema", label: "Oedema", type: "text", required: false },
    { name: "remark", label: "Remark", type: "text", required: false },
    { name: "return", label: "Return", type: "text", required: false },
    {
      name: "examinerInitial",
      label: "Examiner's Initial",
      type: "text",
      required: true,
    },
  ];

  const handleChangeStatus = async (e) => {
    setDocStatus(e.target.value);
  };

  const onSubmit = async (data) => {
    showActionLoader();
    let document = {};
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName;
    }
    document.documentdetail = data;
    document.documentname = "Pregnancy Assessment";
    // document.documentType = "Pregnancy Assessment";
    document.location =
      state.employeeLocation.locationName +
      " " +
      state.employeeLocation.locationType;
    document.locationId = state.employeeLocation.locationId;
    document.client = state.ClientModule.selectedClient._id;
    document.createdBy = user._id;
    document.createdByname = user.firstname + " " + user.lastname;
    document.status = docStatus === "Draft" ? "Draft" : "completed";
    document.appointment_id = state.AppointmentModule.selectedAllAppointment?._id || null;
    document.geolocation = {
      type: "Point",
      coordinates: [state.coordinates.latitude, state.coordinates.longitude],
    };

    if (
      document.location === undefined ||
      !document.createdByname ||
      !document.facilityname
    ) {
      toast.error(
        "Documentation data missing, requires location and facility details"
      );
      hideActionLoader();
      return;
    }

    if (!!draftDoc && draftDoc.status === "Draft") {
      await ClientServ.patch(draftDoc._id, document)
        .then((res) => {
          toast.success("Pregnancy assessment document succesfully updated");
          reset(data);
        })
        .catch((err) => {
          toast.error("Error updating Documentation " + err);
        });
      hideActionLoader();
      closeForm();
    } else {
      await ClientServ.create(document)
        .then((res) => {
          toast.success("Pregnancy assessment created succesfully");
          reset(data);
          closeForm();
        })
        .catch((err) => {
          toast.error("Error creating pregnancy assessment " + err);
        });
      hideActionLoader();
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          my: 1,
        }}
      >
        <FormsHeaderText text="Pregnancy Assessment" />

        <IconButton onClick={closeForm}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Input
            label="Chest X-Ray"
            name="chestXRay"
            register={register("chestXRay")}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Blood Group"
            name="bloodGroup"
            register={register("bloodGroup")}
          />
        </Grid>
        <Grid item xs={6}>
          <Input label="VDRL" name="vdrl" register={register("vdrl")} />
        </Grid>
        <Grid item xs={6}>
          <Input label="HIV" name="hiv" register={register("hiv")} />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Hepatitis"
            name="hepatitis"
            register={register("hepatitis")}
          />
        </Grid>
      </Grid>
      <FollowUpVisit
        schema={columns}
        initialData={followUpTableData || followUpData}
        onDataUpdate={handleDataUpdate}
        inputFields={followUpVisitSchema}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormsHeaderText text="Pelvic Assessment" />
        </Grid>

        <Grid item xs={6}>
          <Input label="Made By" name="madeBy" register={register("madeBy")} />
        </Grid>
        <Grid item xs={6}>
          <Input
            label="Date"
            name="assessmentDate"
            type="date"
            register={register("assessmentDate")}
          />
        </Grid>

        <Grid item xs={6}>
          <Input label="Inlet" name="inlet" register={register("inlet")} />
        </Grid>
        <Grid item xs={6}>
          <CustomSelect
            name="cavity"
            control={control}
            label="Cavity"
            options={[
              { value: "Normal", label: "Normal" },
              { value: "Abnormal", label: "Abnormal" },
            ]}
          />
        </Grid>

        <Grid item xs={6}>
          <Input
            label="X-Ray Pelvimetry"
            name="xRayPelvimetry"
            register={register("xRayPelvimetry")}
          />
        </Grid>

        <Grid item xs={6}>
          <Input label="Outlet" name="outlet" register={register("outlet")} />
        </Grid>

        <Grid item xs={6}>
          <CustomSelect
            name="outletCavity"
            control={control}
            label="Outlet Cavity"
            options={[
              { value: "Normal", label: "Normal" },
              { value: "Abnormal", label: "Abnormal" },
            ]}
          />
        </Grid>

        <Grid item xs={12}>
          <Textarea
            label="Additional Information"
            name="additionalInformation"
            register={register("additionalInformation")}
            multiline
            rows={3}
          />
        </Grid>
        <Box ml={2} mt={4}>
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

        <Grid item xs={12}>
          <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
            Submit Assessment
          </GlobalCustomButton>
        </Grid>
      </Grid>
    </>
  );
};

export default PregnancyAssessment;
