import React, { useState, useContext, useEffect } from "react";
import client from "../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../context";
import { toast } from "react-toastify";
import {
  Button,
  Grid,
  IconButton,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";

import Input from "../../components/inputs/basic/Input";
import { FormsHeaderText } from "../../components/texts";
import CloseIcon from "@mui/icons-material/Close";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import Textarea from "../../components/inputs/basic/Textarea";
import { Box } from "@mui/system";
import RadioButton from "../../components/inputs/basic/Radio";

export function DentalClinic() {
  const { register, handleSubmit, setValue, reset, getValues } = useForm(); //, watch, errors, reset
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const ClientServ = client.service("clinicaldocument");
  const { user } = useContext(UserContext); //,setUser

  const [currentUser, setCurrentUser] = useState();
  const { state, setState } = useContext(ObjectContext);

  const [formData, setFormData] = useState({
    dentalLaboratory: "",
    dentalTherapist: "",
    orthodontist: "",
    medicine: "",
  });
  const [docStatus, setDocStatus] = useState("Draft");
  const [confirmationDiaglog, setConfirmationDialog] = useState(false);

  let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

  //console.log(formData);
  useEffect(() => {
    // setState((prevstate) => ({
    //   ...prevstate,
    //   DocumentClassModule: {
    //     ...prevstate.DocumentClassModule,
    //     encounter_right: true,
    //   },
    // }));

    if (!!draftDoc && draftDoc.status === "Draft") {
      //console.log(draftDoc.status);
      Object.entries(draftDoc.documentdetail).map(([keys, value], i) => {
        if (keys === "Referral To") {
          setFormData((prevState) => ({
            ...prevState,
            dentalLaboratory: value,
          }));
        }
        if (keys === "dentalTherapist") {
          setFormData((prevState) => ({
            ...prevState,
            dentalTherapist: value,
          }));
        }
        if (keys === "orthodontist") {
          setFormData((prevState) => ({
            ...prevState,
            orthodontist: value,
          }));
        }
        if (keys === "medicine") {
          setFormData((prevState) => ({
            ...prevState,
            medicine: value,
          }));
        }
        setValue(keys, value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      });
    }
    return () => {
      draftDoc = {};
    };
  }, [draftDoc]);

  useEffect(() => {
    setCurrentUser(user);
    return () => {};
  }, [user]);

  useEffect(() => {
    if (!user.stacker) {
    }
  });

  const onSubmit = (data, e) => {
    console.log("===>>>data before create", { data });
    e.preventDefault();
    setMessage("");
    setError(false);
    setSuccess(false);

    let document = {};
    //console.log(state);

    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }

    document.documentname = "Dental Clinic";
    document.documentType = "Dental Clinic";
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
      return;
    }

    if (!!draftDoc && draftDoc.status === "Draft") {
      const dataForFinal = {
        PC: data.pc,
        //RFA: data.rfa,
        HPC: data.hpc,
        PDH: data.pdh,
        PHM: data.phm,
        FSH: data.fsh,
        "Intra Oral": data.intraoral,
        "Extra Oral": data.extraoral,
        Investigation: data.investigation,
        "Xray Report": data.xrayReport,
        Diagnosis: data.diagnosis,
        "Management Plan": data.managementPlan,
        "Work done": data.workDone,
        // Treatment: data.treatment,
        "Referral To": formData.dentalLaboratory,
      };

      const dataForDraft = {
        ...data,
        "Referral To": formData.dentalLaboratory,
      };

      const updatedData =
        document.status === "Draft" ? dataForDraft : dataForFinal;

      document.documentdetail = updatedData;

      console.log(updatedData);

      ClientServ.patch(draftDoc._id, document)
        .then((res) => {
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });

          setDocStatus("Draft");
          setSuccess(true);
          toast.success("Documentation updated successfully");
          setSuccess(false);
          setConfirmationDialog(false);
          closeEncounterRight();
          return;
        })
        .catch((err) => {
          toast.error("Error updating Documentation: " + err);
          reset(data);
          setConfirmationDialog(false);
        });
    } else {
      const dataForFinal = {
        PC: data.pc,
        //RFA: data.rfa,
        HPC: data.hpc,
        PDH: data.pdh,
        PHM: data.phm,
        FSH: data.fsh,
        "Intra Oral": data.intraoral,
        "Extra Oral": data.extraoral,
        "Xray Report": data.xrayReport,
        Investigation: data.investigation,
        Diagnosis: data.diagnosis,
        "Management Plan": data.managementPlan,
        "Work done": data.workDone,
        //Treatment: data.treatment,
        "Referral To": formData.dentalLaboratory,
      };

      const dataForDraft = {
        ...data,
        "Referral To": formData.dentalLaboratory,
      };

      const updatedData =
        document.status === "Draft" ? dataForDraft : dataForFinal;

      document.documentdetail = updatedData;

      console.log(document);
      ClientServ.create(document)
        .then((res) => {
          console.log(res);
          console.log("Data not draft", { res, doc: document });
          Object.keys(data).forEach((key) => {
            data[key] = "";
          });

          setSuccess(true);
          toast.success("Dental Examination created successfully");
          setSuccess(false);
          reset(data);
          setConfirmationDialog(false);
          closeEncounterRight();
        })
        .catch((err) => {
          toast.error("Error creating Eye examination: " + err);
          setConfirmationDialog(false);
        });
    }
  };
  const closeEncounterRight = async () => {
    setState((prevstate) => ({
      ...prevstate,
      DocumentClassModule: {
        ...prevstate.DocumentClassModule,
        encounter_right: false,
      },
    }));
  };

  const handleSendTo = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      dentalLaboratory: event.target.value,
    }));
  };

  const handleChangeStatus = async (e) => {
    setDocStatus(e.target.value);
  };

  return (
    <>
      <div className="card">
        <CustomConfirmationDialog
          open={confirmationDiaglog}
          cancelAction={() => setConfirmationDialog(false)}
          confirmationAction={handleSubmit(onSubmit)}
          type="create"
          message={`You are about to save this Dental Clinic document?`}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          mb={1}
        >
          <FormsHeaderText text={"DENTAL CLINIC MAIN"} />

          <IconButton onClick={closeEncounterRight}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <div className="card-content vscrollable remPad1">
          <>
            <Typography
              style={{ marginTop: "20px", marginBottom: "20px" }}
              fontWeight="bold"
              color="primary"
              variant="body1"
            >
              Presenting Complains
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  Presenting Complain(PC)
                </Typography>
                <Box mb={1}>
                  {/* <Input
                    register={register("rfa")}
                    name="rfa"
                    type="text"
                    placeholder="Enter rfa"
                  /> */}
                  <Input
                    register={register("pc")}
                    name="pc"
                    type="text"
                    placeholder="Enter pc..."
                  />
                </Box>
                <Typography color="primary" variant="body2">
                  Past Dental History(PDH)
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("pdh")}
                    name="pdh"
                    type="text"
                    placeholder="Enter pdh..."
                  />
                </Box>
                <Typography color="primary" variant="body2">
                  Family and Social History(FSH)
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("fsh")}
                    name="fsh"
                    type="text"
                    placeholder="Enter fsh..."
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  History of Presenting Complaint(HPC)
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("hpc")}
                    name="hpc"
                    type="text"
                    placeholder="Enter hpc..."
                  />
                </Box>
                <Typography color="primary" variant="body2">
                  Past Medical History(PMH)
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("phm")}
                    name="phm"
                    type="text"
                    placeholder="Enter pmh..."
                  />
                </Box>
              </Grid>
            </Grid>
            <Typography
              style={{ marginTop: "20px", marginBottom: "20px" }}
              fontWeight="bold"
              color="primary"
              variant="body1"
            >
              Examination :
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  Intra-Oral
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("intraoral")}
                    name="intraoral"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography color="primary" variant="body2">
                  Extra-Oral
                </Typography>
                <Box mb={1}>
                  <Input
                    register={register("extraoral")}
                    name="extraoral"
                    type="text"
                    placeholder="Type here..."
                  />
                </Box>
              </Grid>
            </Grid>

            <Typography fontWeight="bold" color="primary" variant="body1">
              Investigation
            </Typography>
            <Box style={{ marginTop: "10px", marginBottom: "30px" }}>
              <Textarea
                color="primary"
                register={register("investigation")}
                name="investigation"
                type="text"
                placeholder="Type here...."
              />
            </Box>

            <Typography fontWeight="bold" color="primary" variant="body1">
              X-ray Report
            </Typography>
            <Box style={{ marginTop: "10px", marginBottom: "30px" }}>
              <Textarea
                color="primary"
                register={register("xrayReport")}
                name="xrayReport"
                type="text"
                placeholder="Type here...."
              />
            </Box>

            <Typography fontWeight="bold" color="primary" variant="body1">
              Diagnosis
            </Typography>
            <Box style={{ marginTop: "10px", marginBottom: "30px" }}>
              <Textarea
                color="primary"
                register={register("diagnosis")}
                name="diagnosis"
                type="text"
                placeholder="Type here...."
              />
            </Box>

            <Typography fontWeight="bold" color="primary" variant="body1">
              Management Plan
            </Typography>
            <Box style={{ marginTop: "10px", marginBottom: "30px" }}>
              <Textarea
                color="primary"
                register={register("managementPlan")}
                name="managementPlan"
                type="text"
                placeholder="Type here...."
              />
            </Box>
            <Typography fontWeight="bold" color="primary" variant="body1">
              Work done
            </Typography>
            <Box style={{ marginTop: "10px", marginBottom: "30px" }}>
              <Textarea
                color="primary"
                register={register("workDone")}
                name="workDone"
                type="text"
                placeholder="Type here...."
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ width: "100%", marginBottom: "20px" }}>
                <Typography
                  color="primary"
                  variant="body1"
                  fontWeight="bold"
                  style={{ marginTop: "10px" }}
                >
                  Referral To:
                </Typography>
              </Box>
              <Box sx={{ width: "40%", marginBottom: "20px" }}>
                <RadioGroup
                  name="dentalLaboratory"
                  value={formData.dentalLaboratory}
                  onChange={handleSendTo}
                >
                  <FormControlLabel
                    value="Dental Laboratory Unit"
                    control={<Radio />}
                    label="Dental Laboratory Unit"
                  />
                </RadioGroup>
              </Box>
              {/* <Box sx={{ width: "40%", marginBottom: "20px" }}>
                <RadioGroup
                  name="dentallaboratory"
                  value={formData.dentalLaboratory}
                  onChange={handleSendTo}
                >
                  <FormControlLabel
                    value="Dental Therapist"
                    control={<Radio />}
                    label="Dental Therapist"
                  />
                </RadioGroup>
              </Box> */}
              <Box sx={{ width: "40%", marginBottom: "20px" }}>
                <RadioGroup
                  name="dentallaboratory"
                  value={formData.dentalLaboratory}
                  onChange={handleSendTo}
                >
                  <FormControlLabel
                    value="Orthodontist Unit"
                    control={<Radio />}
                    label="Orthodontist Unit"
                  />
                </RadioGroup>
              </Box>
              <Box sx={{ width: "40%", marginBottom: "20px" }}>
                <RadioGroup
                  name="dentalLaboratory"
                  value={formData.dentalLaboratory}
                  onChange={handleSendTo}
                >
                  <FormControlLabel
                    value="Medicine Unit"
                    control={<Radio />}
                    label="Medicine Unit"
                  />
                </RadioGroup>
              </Box>

              <Box sx={{ width: "40%", marginBottom: "20px" }}>
                <RadioGroup
                  name="dentalLaboratory"
                  value={formData.dentalLaboratory}
                  onChange={handleSendTo}
                >
                  <FormControlLabel
                    value="Restorative Unit"
                    control={<Radio />}
                    label="Restorative Unit"
                  />
                </RadioGroup>
              </Box>
              <Box sx={{ width: "40%", marginBottom: "20px" }}>
                <RadioGroup
                  name="dentalLaboratory"
                  value={formData.dentalLaboratory}
                  onChange={handleSendTo}
                >
                  <FormControlLabel
                    value="Preventive Unit"
                    control={<Radio />}
                    label="Preventive Unit"
                  />
                </RadioGroup>
              </Box>
              <Box sx={{ width: "40%", marginBottom: "20px" }}>
                <RadioGroup
                  name="dentalLaboratory"
                  value={formData.dentalLaboratory}
                  onChange={handleSendTo}
                >
                  <FormControlLabel
                    value="Maxillofacial Unit"
                    control={<Radio />}
                    label="Maxillofacial Unit"
                  />
                </RadioGroup>
              </Box>
            </Box>
            <Box
              sx={{
                gap: "1rem",
              }}
            >
              <RadioButton
                onChange={handleChangeStatus}
                name="status"
                options={["Draft", "Final"]}
                value={docStatus}
              />
            </Box>
            <Box
              spacing={3}
              sx={{
                display: "flex",
                gap: "3rem",
              }}
            >
              <GlobalCustomButton
                color="secondary"
                type="submit"
                onClick={() => setConfirmationDialog(true)}
              >
                Submit Dental Clinic
              </GlobalCustomButton>
            </Box>
          </>
        </div>
      </div>
    </>
  );
}

// export function DentalClinic() {
//   const { register, handleSubmit, setValue, reset } = useForm();
//   const ClientServ = client.service("clinicaldocument");
//   const { user } = useContext(UserContext);
//   const { state, setState } = useContext(ObjectContext);

//   const [formData, setFormData] = useState({
//     dentalLaboratory: "",
//     dentalTherapist: "",
//     orthodontist: "",
//   });
//   const [docStatus, setDocStatus] = useState("Draft");
//   const [confirmationDiaglog, setConfirmationDialog] = useState(false);

//   let draftDoc = state.DocumentClassModule.selectedDocumentClass.document;

//   useEffect(() => {
//     if (!!draftDoc && draftDoc.status === "Draft") {
//       Object.entries(draftDoc.documentdetail).map(([keys, value], i) => {
//         if (keys === "Send To") {
//           setFormData((prevState) => ({
//             ...prevState,
//             dentalLaboratory: value,
//           }));
//         }
//         if (keys === "dentalTherapist") {
//           setFormData((prevState) => ({
//             ...prevState,
//             dentalTherapist: value,
//           }));
//         }
//         if (keys === "orthodontist") {
//           setFormData((prevState) => ({
//             ...prevState,
//             orthodontist: value,
//           }));
//         }

//         setValue(keys, value, {
//           shouldValidate: true,
//           shouldDirty: true,
//         });
//       });
//     }
//     return () => {
//       draftDoc = {};
//     };
//   }, [draftDoc]);

//   const onSubmit = (data, e) => {
//     e.preventDefault();
//     let document = {};

//     if (user.currentEmployee) {
//       document.facility = user.currentEmployee.facilityDetail._id;
//       document.facilityname = user.currentEmployee.facilityDetail.facilityName;
//     }

//     document.documentname = "Dental Clinic";
//     document.documentType = "Dental Clinic";
//     document.location =
//       state.employeeLocation.locationName +
//       " " +
//       state.employeeLocation.locationType;
//     document.locationId = state.employeeLocation.locationId;
//     document.client = state.ClientModule.selectedClient._id;
//     document.createdBy = user._id;
//     document.createdByname = user.firstname + " " + user.lastname;
//     document.status = docStatus === "Draft" ? "Draft" : "completed";

//     document.geolocation = {
//       type: "Point",
//       coordinates: [state.coordinates.latitude, state.coordinates.longitude],
//     };

//     if (
//       document.location === undefined ||
//       !document.createdByname ||
//       !document.facilityname
//     ) {
//       toast.error(
//         "Documentation data missing, requires location and facility details"
//       );
//       return;
//     }

//     if (!!draftDoc && draftDoc.status === "Draft") {
//       const dataForFinal = {
//         RFA: data.rfa,
//         HPC: data.hpc,
//         PDH: data.pdh,
//         PHM: data.phm,
//         "Intra Oral": data.intraoral,
//         "Extra Oral": data.extraoral,
//         Investigation: data.investigation,
//         Diagnosis: data.diagnosis,
//         "Management Plan": data.managementPlan,
//         Treatment: data.treatment,
//         "Send To": formData.dentalLaboratory,
//       };

//       const dataForDraft = {
//         ...data,
//         "Send To": formData.dentalLaboratory,
//       };

//       const updatedData =
//         document.status === "Draft" ? dataForDraft : dataForFinal;

//       document.documentdetail = updatedData;

//       ClientServ.patch(draftDoc._id, document)
//         .then(() => {
//           Object.keys(data).forEach((key) => {
//             data[key] = "";
//           });

//           setDocStatus("Draft");
//           toast.success("Documentation updated successfully");
//           setConfirmationDialog(false);
//           return;
//         })
//         .catch((err) => {
//           toast.error("Error updating Documentation: " + err);
//           reset(data);
//           setConfirmationDialog(false);
//         });
//     } else {
//       const dataForFinal = {
//         RFA: data.rfa,
//         HPC: data.hpc,
//         PDH: data.pdh,
//         PHM: data.phm,
//         "Intra Oral": data.intraoral,
//         "Extra Oral": data.extraoral,
//         Investigation: data.investigation,
//         Diagnosis: data.diagnosis,
//         "Management Plan": data.managementPlan,
//         Treatment: data.treatment,
//         "Send To": formData.dentalLaboratory,
//       };

//       const dataForDraft = {
//         ...data,
//         "Send To": formData.dentalLaboratory,
//       };

//       const updatedData =
//         document.status === "Draft" ? dataForDraft : dataForFinal;

//       document.documentdetail = updatedData;

//       ClientServ.create(document)
//         .then(() => {
//           Object.keys(data).forEach((key) => {
//             data[key] = "";
//           });
//           toast.success("Eye Examination created successfully");
//           reset(data);
//           setConfirmationDialog(false);
//         })
//         .catch((err) => {
//           toast.error("Error creating Eye examination: " + err);
//           setConfirmationDialog(false);
//         });
//     }
//   };
//   const closeEncounterRight = async () => {
//     setState((prevstate) => ({
//       ...prevstate,
//       DocumentClassModule: {
//         ...prevstate.DocumentClassModule,
//         encounter_right: false,
//       },
//     }));
//   };

//   const handleSendTo = (event) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       dentalLaboratory: event.target.value,
//     }));
//   };

//   const handleChangeStatus = async (e) => {
//     setDocStatus(e.target.value);
//   };

//   return (
//     <>
//       <div className="card ">
//         <CustomConfirmationDialog
//           open={confirmationDiaglog}
//           cancelAction={() => setConfirmationDialog(false)}
//           confirmationAction={handleSubmit(onSubmit)}
//           type="create"
//           message={`You are about to save this Dental Clinic document?`}
//         />
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//           mb={1}
//         >
//           <FormsHeaderText text={"DENTAL CLINIC MAIN"} />

//           <IconButton onClick={closeEncounterRight}>
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </Box>
//         <div className="card-content vscrollable remPad1">
//           <form>
//             <Typography
//               style={{ marginTop: "20px", marginBottom: "20px" }}
//               fontWeight="bold"
//               color="primary"
//               variant="body1"
//             >
//               Presenting Complains
//             </Typography>

//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <Typography color="primary" variant="body2">
//                   RFA
//                 </Typography>
//                 <Box mb={1}>
//                   <Input
//                     register={register("rfa")}
//                     name="rfa"
//                     type="text"
//                     placeholder="Enter rfa"
//                   />
//                 </Box>
//                 <Typography color="primary" variant="body2">
//                   HPC
//                 </Typography>
//                 <Box mb={1}>
//                   <Input
//                     register={register("hpc")}
//                     name="hpc"
//                     type="text"
//                     placeholder="Enter hpc"
//                   />
//                 </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography color="primary" variant="body2">
//                   PDH
//                 </Typography>
//                 <Box mb={1}>
//                   <Input
//                     register={register("pdh")}
//                     name="pdh"
//                     type="text"
//                     placeholder="Enter pdh"
//                   />
//                 </Box>
//                 <Typography color="primary" variant="body2">
//                   PMH
//                 </Typography>
//                 <Box mb={1}>
//                   <Input
//                     register={register("phm")}
//                     name="phm"
//                     type="text"
//                     placeholder="Enter pmh"
//                   />
//                 </Box>
//               </Grid>
//             </Grid>
//             <Typography
//               style={{ marginTop: "20px", marginBottom: "20px" }}
//               fontWeight="bold"
//               color="primary"
//               variant="body1"
//             >
//               Examination :
//             </Typography>

//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <Typography color="primary" variant="body2">
//                   Intra-Oral
//                 </Typography>
//                 <Box mb={1}>
//                   <Input
//                     register={register("intraoral")}
//                     name="intraoral"
//                     type="text"
//                     placeholder="Type here..."
//                   />
//                 </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography color="primary" variant="body2">
//                   Extra-Oral
//                 </Typography>
//                 <Box mb={1}>
//                   <Input
//                     register={register("extraoral")}
//                     name="extraoral"
//                     type="text"
//                     placeholder="Type here..."
//                   />
//                 </Box>
//               </Grid>
//             </Grid>

//             <Typography fontWeight="bold" color="primary" variant="body1">
//               Investigation
//             </Typography>
//             <Box style={{ marginTop: "10px", marginBottom: "30px" }}>
//               <Textarea
//                 color="primary"
//                 register={register("investigation")}
//                 name="investigation"
//                 type="text"
//                 placeholder="Type here...."
//               />
//             </Box>
//             <Typography fontWeight="bold" color="primary" variant="body1">
//               Diagnosis
//             </Typography>
//             <Box style={{ marginTop: "10px", marginBottom: "30px" }}>
//               <Textarea
//                 color="primary"
//                 register={register("diagnosis")}
//                 name="diagnosis"
//                 type="text"
//                 placeholder="Type here...."
//               />
//             </Box>

//             <Typography fontWeight="bold" color="primary" variant="body1">
//               Management Plan
//             </Typography>
//             <Box style={{ marginTop: "10px", marginBottom: "30px" }}>
//               <Textarea
//                 color="primary"
//                 register={register("managementPlan")}
//                 name="managementPlan"
//                 type="text"
//                 placeholder="Type here...."
//               />
//             </Box>
//             <Typography fontWeight="bold" color="primary" variant="body1">
//               Type of treatment done
//             </Typography>
//             <Box style={{ marginTop: "10px", marginBottom: "30px" }}>
//               <Textarea
//                 color="primary"
//                 register={register("treatment")}
//                 name="treatment"
//                 type="text"
//                 placeholder="Type here...."
//               />
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Box sx={{ width: "50%", marginBottom: "20px" }}>
//                 <Typography
//                   color="primary"
//                   variant="body1"
//                   fontWeight="bold"
//                   style={{ marginTop: "10px" }}
//                 >
//                   Send To:
//                 </Typography>
//               </Box>
//               <Box sx={{ width: "40%", marginBottom: "20px" }}>
//                 <RadioGroup
//                   name="dentalLaboratory"
//                   value={formData.dentalLaboratory}
//                   onChange={handleSendTo}
//                 >
//                   <FormControlLabel
//                     value="Dental Laboratory"
//                     control={<Radio />}
//                     label="Dental Laboratory"
//                   />
//                 </RadioGroup>
//               </Box>
//               <Box sx={{ width: "40%", marginBottom: "20px" }}>
//                 <RadioGroup
//                   name="dentallaboratory"
//                   value={formData.dentalLaboratory}
//                   onChange={handleSendTo}
//                 >
//                   <FormControlLabel
//                     value="Dental Therapist"
//                     control={<Radio />}
//                     label="Dental Therapist"
//                   />
//                 </RadioGroup>
//               </Box>
//               <Box sx={{ width: "40%", marginBottom: "20px" }}>
//                 <RadioGroup
//                   name="dentallaboratory"
//                   value={formData.dentalLaboratory}
//                   onChange={handleSendTo}
//                 >
//                   <FormControlLabel
//                     value="Orthodontist"
//                     control={<Radio />}
//                     label="Orthodontist"
//                   />
//                 </RadioGroup>
//               </Box>
//             </Box>
//             <Box
//               sx={{
//                 gap: "1rem",
//               }}
//             >
//               <RadioButton
//                 onChange={handleChangeStatus}
//                 name="status"
//                 options={["Draft", "Final"]}
//                 value={docStatus}
//               />
//             </Box>
//             <Box
//               spacing={3}
//               sx={{
//                 display: "flex",
//                 gap: "3rem",
//               }}
//             >
//               <GlobalCustomButton
//                 color="secondary"
//                 type="submit"
//                 onClick={() => setConfirmationDialog(true)}
//               >
//                 Submit Dental Clinic
//               </GlobalCustomButton>
//             </Box>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }
