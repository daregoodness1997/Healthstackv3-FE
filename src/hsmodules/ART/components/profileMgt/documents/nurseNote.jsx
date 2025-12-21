import React ,{useState, useContext} from "react"
import client from "../../../../../feathers";
import { ObjectContext, UserContext } from "../../../../../context";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
    IconButton,
    RadioGroup,
    Radio,
    FormControlLabel,
    Box
    
  } from "@mui/material";
import Textarea from "../../../../../components/inputs/basic/Textarea";
import Input from "../../../../../components/inputs/basic/Input";
import CloseIcon from "@mui/icons-material/Close";
import { FormsHeaderText } from "../../../../../components/texts";
import GlobalCustomButton from "../../../../../components/buttons/CustomButton";
import { toast } from "react-toastify";

export default function NurseNoteCreate() {
    const { register, handleSubmit, setValue, reset } = useForm(); 
    const  ARTClinicalDocumentServ = client.service("clinicaldocument");
    const { user } = useContext(UserContext); 
    const { state, setState, showActionLoader, hideActionLoader } = useContext(ObjectContext)
    const [docStatus, setDocStatus] = useState("Draft");
    // console.log(user,"user")
    let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  
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
  
    const closeEncounterRight = async () => {
      setState((prevstate) => ({
        ...prevstate,
        DocumentClassModule: {
          ...prevstate.DocumentClassModule,
          encounter_right: false,
        },
      }));
      reset()
    };
  
    const onSubmit = async (data) => {
        showActionLoader();
        let document = {
          documentdetail: data,
          documentname: "Nurse Note",
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
          toast.error("Documentation data missing, requires facility and creator details");
          hideActionLoader();
          return;
        }
    
        
        if (document.locationId === "") {
          delete document.locationId;
        }
    
        try {
          if (!!draftDoc && draftDoc.status === "Draft") {
            await ARTClinicalDocumentServ.patch(draftDoc._id, document);
            toast.success("Nurse Note updated successfully");
          } else {
            await ARTClinicalDocumentServ.create(document);
            toast.success("Nurse Note created successfully");
          }
          
          closeEncounterRight()
        } catch (err) {
          toast.error("Error submitting Nurse Note: " + err);
          
        } finally {
            hideActionLoader();
        }
      }
  
    const handleChangeStatus = async (e) => {
      setDocStatus(e.target.value);
    };
  
    
  
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
            <FormsHeaderText text={"Nurse Note"} />
  
            <IconButton onClick={closeEncounterRight}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <div className="card-content vscrollable remPad1">
            <form>
              <Box mb={1}>
                <Input register={register("title")} type="text" label="Title" />
              </Box>
              <Box>
                <Textarea
                  register={register("documentation")}
                  type="text"
                  label="Documentation"
                  placeholder="Write here......"
                />
              </Box>
             
              <Box>
              <RadioGroup
              row
              aria-label="document-status"
              name="status"
              value={docStatus}
              onChange={handleChangeStatus}
            >
              <FormControlLabel value="Draft" control={<Radio {...register("status")} />} label="Draft" />
              <FormControlLabel value="Final" control={<Radio {...register("status")} />} label="Final" />
            </RadioGroup>
          </Box>

              <Box
                spacing={1}
                sx={{
                  display: "flex",
                  gap: "2rem",
                }}
              >
                <GlobalCustomButton
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                >
                  Submit Nurse Note
                </GlobalCustomButton>
              </Box>
            </form>
          </div>
        </div>
      </>
    );
  }