import {
  Box,
  FormControlLabel,
  Grid,
  Stack,
  Radio,
  RadioGroup,
} from "@mui/material";
import CustomSelect from "../../../../../components/inputs/basic/Select";
import { useForm } from "react-hook-form";
import { FormsHeaderText } from "../../../../../components/texts";
import GlobalCustomButton from "../../../../../components/buttons/CustomButton";
import Input from "../../../../../components/inputs/basic/Input";
import Textarea from "../../../../../components/inputs/basic/Textarea";
import { useState, useContext, useEffect } from "react";
import { ObjectContext, UserContext } from "../../../../../context";
import client from "../../../../../feathers";
import { toast } from "react-toastify";

const AspirationNotice = () => {
  const [docStatus, setDocStatus] = useState("Draft");
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const ARTClinicalDocumentServ = client.service("clinicaldocument");
  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  const { control, register, handleSubmit, setValue, reset, watch } = useForm();

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
      documentname: "Aspiration Notice",
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
        toast.success("Aspiration Notice updated successfully");
      } else {
        await ARTClinicalDocumentServ.create(document);
        toast.success("Aspiration Notice created successfully");
      }
      closeForm();
    } catch (err) {
      toast.error("Error submitting Aspiration Notice: " + err);
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
        <FormsHeaderText text="Aspiration Notice Form" />
      </Stack>

      <Box component={"div"}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <CustomSelect
              control={control}
              name="egg_source"
              label="Egg Source"
              options={["Own", "Donor"]}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("no_of_follicles")}
              name="no_of_follicles"
              label="No of Follicles"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              register={register("plan_for_treatment")}
              name="plan_for_treatment"
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
              name="additional_information"
              label="Additional Information"
              type="text"
              rows={4}
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
            Submit Aspiration Notice
          </GlobalCustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AspirationNotice;
