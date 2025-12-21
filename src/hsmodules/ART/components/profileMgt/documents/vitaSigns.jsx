import { useForm } from "react-hook-form";
import { useState, useContext, useEffect } from "react";
import { Box, Grid, IconButton } from "@mui/material";
import { ObjectContext, UserContext } from "../../../../../context";
import { toast } from "react-toastify";
import client  from "../../../../../feathers";
import RadioButton from "../../../../../components/inputs/basic/Radio";
import Input from "../../../../../components/inputs/basic/Input";
import { FormsHeaderText } from "../../../../../components/texts";
import CloseIcon from "@mui/icons-material/Close";
import GlobalCustomButton from "../../../../../components/buttons/CustomButton";

export default function VitalSignForm() {
    const { register, handleSubmit, setValue, reset } = useForm();
    const [docStatus, setDocStatus] = useState("Draft");
    
    const { user } = useContext(UserContext);
    const { state, setState, showActionLoader, hideActionLoader } = useContext(ObjectContext);
    
    const ClientServ = client.service("clinicaldocument");
    
    let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;
    
    useEffect(() => {
      if (draftDoc?.status === "Draft") {
        Object.entries(draftDoc.documentdetail).forEach(([key, value]) => 
          setValue(key, value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        );
      }
      
      return () => {
        draftDoc = {};
      };
    }, [draftDoc]);

    function processFormData(data) {
        if (data.Height && data.Weight) {
            const bmi = Number(data.Weight) / Number(data.Height) ** 2;
            data.BMI = bmi;
            data.BMI_Status = bmi >= 30 ? "Obese" : bmi >= 25 ? "Overweight" : bmi >= 18.5 ? "Normal Weight" : "Underweight";
        }
        return data;
    }

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
      reset()
    };
    
    const onSubmit = async (formData) => {
        showActionLoader();
        try {
            const document = {
                documentdetail: processFormData(formData),
                documentname: "Vital Sign",
                documentClassId: state.DocumentClassModule.selectedDocumentClass._id,
                location: `${state.employeeLocation.locationName} ${state.employeeLocation.locationType}`,
                // locationId: state.employeeLocation.locationId,
                familyprofileId: state.ARTModule.selectedFamilyProfile._id,
                clientName: state.ARTModule.selectedFamilyProfile.name,
                client: state.ARTModule.selectedFamilyProfile._id,
                createdBy: user._id,
                createdByname: `${user.firstname} ${user.lastname}`,
                status: docStatus === "Draft" ? "Draft" : "completed",
                geolocation: {
                    type: "Point",
                    coordinates: [state.coordinates.latitude, state.coordinates.longitude],
                },
                facility: user.currentEmployee.facilityDetail._id,
                facilityname: user.currentEmployee.facilityDetail.facilityName,
            };
            
            if (state.employeeLocation.locationId) {
                locationId = state.employeeLocation.locationId;
            }
            
            if (!document.location || !document.createdByname || !document.facilityname) {
                toast.error("Documentation data missing, requires location and facility details");
                return;
            }
            
            if (draftDoc?.status === "Draft") {
                await ClientServ.patch(draftDoc._id, document);
            } else {
                await ClientServ.create(document);
            }
            
            Object.keys(formData).forEach(key => formData[key] = null);
            setDocStatus("Draft");
            reset(formData);
            toast.success(`Documentation ${draftDoc ? 'updated' : 'created'} successfully`);
            
            closeForm();
        } catch (err) {
            toast.error(`Error ${draftDoc ? 'updating' : 'creating'} Documentation ${err}`);
        } finally {
            hideActionLoader();
        }
    };
    
    const handleChangeStatus = (e) => setDocStatus(e.target.value);
    
   

   

    return (
      <>
        <div className="card ">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            mb={1}
          >
            <FormsHeaderText
              text={"Vital Signs"}
            />
  
            <IconButton onClick={closeForm}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <div className="card-content vscrollable">
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Input
                    register={register("Temperature")}
                    type="text"
                    label="Temperature"
                  />
                </Grid>
  
                <Grid item xs={12}>
                  <Input register={register("Pulse")} type="text" label="Pulse" />
                </Grid>
  
                <Grid item xs={12}>
                  <Input
                    register={register("Respiratory_rate")}
                    type="text"
                    label="Respiratory rate"
                  />
                </Grid>
  
                <Grid item xs={12}>
                  <Input
                    register={register("Random_glucose")}
                    name="text"
                    type="text"
                    label="Blood Glucose"
                  />
                </Grid>
  
                <Grid item xs={12}>
                  <Input
                    register={register("Systolic_BP")}
                    type="text"
                    label="Systolic_BP"
                  />
                </Grid>
  
                <Grid item xs={12}>
                  <Input
                    register={register("Diastolic_BP")}
                    type="text"
                    label="Diastolic_BP"
                  />
                </Grid>
  
                <Grid item xs={12}>
                  <Input register={register("SPO2")} type="text" label="SPO2" />
                </Grid>
  
                <Grid item xs={12}>
                  <Input register={register("Pain")} type="text" label="Pain" />
                </Grid>
  
                <Grid item xs={12}>
                  <Input
                    register={register("Height")}
                    type="number"
                    label="Height(m)"
                  />
                </Grid>
  
                <Grid item xs={12}>
                  <Input
                    register={register("Weight")}
                    type="number"
                    label="Weight(Kg)"
                  />
                </Grid>
              </Grid>
  
              <Box>
                <RadioButton
                  onChange={handleChangeStatus}
                  name="status"
                  options={["Draft", "Final"]}
                  value={docStatus}
                />
              </Box>
  
              <Box
                spacing={1}
                sx={{
                  display: "flex",
                  gap: "2rem",
                }}
              >
                <GlobalCustomButton
                  color="secondary"
                  variant="contained"
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                >
                  Submit Vital Signs
                </GlobalCustomButton>
  
                {/* <GlobalCustomButton variant="outlined">Cancel</GlobalCustomButton> */}
              </Box>
            </form>
          </div>
        </div>
      </>
    );
  }