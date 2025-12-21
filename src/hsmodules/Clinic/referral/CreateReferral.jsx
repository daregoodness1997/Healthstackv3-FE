import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddBoxIcon from "@mui/icons-material/AddBox";
import React, { useState, useContext, useEffect } from "react";
import client from "../../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../../context";
// import { toast } from "bulma-toast";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import CustomTable from "../../../components/customtable";
import ModalBox from "../../../components/modal";
import { Grid, Box, Typography } from "@mui/material";
import { ClientSearch } from "../../helpers/ClientSearch";
import Input from "../../../components/inputs/basic/Input/index";
import Textarea from "../../../components/inputs/basic/Textarea";
import GlobalCustomButton from "../../../components/buttons/CustomButton";

import { FacilitySearch } from "../../helpers/FacilitySearch";
import PatientProfile from "../../Client/PatientProfile";
import CustomSelect from "../../../components/inputs/basic/Select";
import TextAreaVoiceAndText from "../../../components/inputs/basic/Textarea/VoiceAndText";

import EmployeeSearch from "../../../hsmodules/helpers/EmployeeSearch";
import LocationSearch from "../../../hsmodules/helpers/LocationSearch";


export function ReferralCreate({ handleGoBack, client_id, showList }) {
  const { state, setState } = useContext(ObjectContext);
  const { register, handleSubmit, setValue, control, watch, reset } = useForm(); //, watch, errors, reset
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [success1, setSuccess1] = useState(false);
  const [success2, setSuccess2] = useState(false);
  const [message, setMessage] = useState("");
  const [clientId, setClientId] = useState();
  const [clearClientSearch, setClearClientSearch] = useState(false);
  const [locationId, setLocationId] = useState();
  const [practionerId, setPractionerId] = useState();
  const [complaints, setComplaints] = useState([]);
  const [complaintModal, setComplaintModal] = useState(false);
  const [diagnosis, setDiagnosis] = useState([]);
  const [diagnosisModal, setDiagnosisModal] = useState(false);
  const ClientServ = client.service("referral");
  const docServ = client.service("clinicaldocument");
  const [drugsInputType, setDrugsInputType] = useState("type");
  const [clinicFindInputType, setClinicFindInputType] = useState("type");
  const { user } = useContext(UserContext); //,setUser
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [admissonModal, setAdmissionModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const [currentUser, setCurrentUser] = useState();

  const [appointment_status, setAppointment_status] = useState("");
  const [appointment_type, setAppointment_type] = useState("");
  const [location, setLocation] = useState(null);
  const [dest, setDest] = useState(false);

  const [chosen, setChosen] = useState();
  const [chosen1, setChosen1] = useState();
  const [chosen2, setChosen2] = useState();

  const employee = user.currentEmployee;
  const facility = employee.facilityDetail;
  const client1 = state.ClientModule.selectedClient;
  console.log(state.employeeLocation)

  const handleChangeType = async (e) => {
    await setAppointment_type(e.target.value);
  };

  const handleChangeStatus = async (e) => {
    await setAppointment_status(e.target.value);
  };
  const handleGetLocation = (location) => {
    setLocation(location);
  };
  const getSearchfacility = (obj) => {
    // console.log("from chossen ", {
    //   chosen: obj,
    //   selected: state.ClientModule.selectedClient,
    // });
   
    setChosen(obj);
    //handleRow(obj)
    if (!obj) {
      //"clear stuff"
     
      setChosen();
    }

    /*  setValue("facility", obj._id,  {
              shouldValidate: true,
              shouldDirty: true
          }) */
  };

  const getSearchfacility1 = (obj) => {
    setLocationId(obj._id);
    setChosen1(obj);

    if (!obj) {
      //"clear stuff"
      setLocationId();
      setChosen1();
    }
  };

  const getSearchfacility2 = (obj) => {
    setPractionerId(obj._id);
    setChosen2(obj);

    if (!obj) {
      //"clear stuff"
      setPractionerId();
      setChosen2();
    }
  };

  useEffect(() => {
    setChosen1(facility)
    //console.log(currentUser)
    return () => {};
  }, []);


  const createDoc = (data, e) => {
 
 
    let document = {};
    let realdata={}
    realdata["Date"]= (new Date()).toDateString()
    realdata["Priority"]=data.priority
    realdata["Name"]=data.client.firstname +" "+ data.client.lastname
    realdata["Patient Type"]=data.patient_type
    realdata["Referring Facility"]=data.source_org?.facilityName
    realdata["From"]=data.source_org_location?.locationName
    realdata["To"]=data.dest_org_location?.name
    realdata["Clinical Findings"]=data.referralnote
    realdata["Provisional Diagnosis"]=data.provisionalDiagnosis
    realdata["Investiagation so Far"]=data.investigations
    realdata["Reason for Referral"]=data.reason_for_request
   
    realdata["By"]=data.createdBy

    
    
    // data.createdby=user._id
    //console.log(data);
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    document.documentdetail = realdata;
    document.documentname = "Referral"; //"Lab Result"
    document.documentType = "Referral Letter";
    // document.documentClassId=state.DocumentClassModule.selectedDocumentClass._id
    document.location =
      state.employeeLocation.locationName +
      " " +
      state.employeeLocation.locationType;
    document.locationId = state.employeeLocation.locationId;
    document.client = state.ClientModule.selectedClient._id;
    document.createdBy = user._id;
    document.createdByname = user.firstname + " " + user.lastname;
    document.status = "completed";

    document.geolocation = {
      type: "Point",
      coordinates: [state.coordinates.latitude, state.coordinates.longitude],
    };
    // console.log(document)??????????

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
    // let confirm = window.confirm(
    //   `You are about to save this document ${document.documentname} ?`
    // );
    // if (confirm) {
    
      docServ.create(document)
        .then((res) => {
         
        })
        .catch((err) => {
          toast.error("Error creating Referral letter " + err);
          //setConfirmDialog(false);
        });
    
    // }
  };


 
  const onSubmit = (data, e) => {
    // e.preventDefault();

    console.log(data)
    
    setMessage("");
    setError(false);
    setSuccess(false);
    setState((prevstate) => ({
      ...prevstate,
      ReferralModule: {
        selectedReferral: {},
        show: "list",
      },
    }));

    // console.log(" ====>>> data from referral submit", {
    //   data,
    //   chosen: chosen,
    // });
    if (!chosen1){
      setChosen1(facility)
    }
    if (user.currentEmployee) {
      data.facility = user.currentEmployee.facilityDetail; // or from facility dropdown
    }
    if (selectedAdmission !== null) {
      data.source_admissionId = selectedAdmission._id;
      data.source_admission = selectedAdmission;
    }

    if (selectedAppointment !== null) {
      data.source_appointmentId = selectedAppointment._id;
      data.source_appointment = selectedAppointment;
    }
    const actionHx = {
      action: "Created referral",
      actor:user.currentEmployee.firstname + " "+ user.currentEmployee.firstname ,
      action_time: new Date(),
    };
    let hx=[]

    data.createdby = user._id;
    data.clientId = state.ClientModule.selectedClient._id;
    data.client = state.ClientModule.selectedClient;
    data.referralnote = data.clinical_findings;
    data.actionHx =hx.push(actionHx);
    data.source_orgId = facility._id;
    data.source_org = facility;
    data.source_org_location = state.employeeLocation;
    data.dest_orgId = chosen1._id;
    data.dest_org = chosen1;
    data.dest_org_location=location
    data.referralReason = data.reason_for_request;
    data.createdById = employee._id;
    data.createdBy =user.currentEmployee.firstname + " "+ user.currentEmployee.firstname ;
    data.status = "Sent";
    const referralCode = Math.floor(
      Math.random() * (99999 - 10000 + 1) + 10000
    );
    data.referralNo = `${referralCode}BA`;
    data.patient_type = data.patientstate;
   console.log(data)
   

    ClientServ.create(data)
      .then((res) => {
        console.log("===>>>response", { res: res });
        reset({});
        createDoc(data)
        setAppointment_type("");
        setAppointment_status("");
        setClientId("");
        setLocationId("");
        /*  setMessage("Created Client successfully") */
        setSuccess(true);
        setSuccess1(true);
        setSuccess2(true);
        toast.success("Referral  created succesfully");
        setSuccess(false);
        setSuccess1(false);
        setSuccess2(false);
        showList();
        // showBilling()
      })
      .catch((err) => {
        console.log("===>>> Error response ", { err: err });
        toast.error(`Error creating Referral   ${err}`);
      });
  };

  useEffect(() => {
    console.log("from chossen useEffect ", {
      chosen: state.ClientModule,
      selectedClient: state.ClientModule.selectedClient,
    });
    getSearchfacility(state.ClientModule.selectedClient);

    /* appointee=state.ClientModule.selectedClient 
          console.log(appointee.firstname) */
    return () => {};
  }, [state.ClientModule.selectedClient]);

  const patientState = watch("patientstate");

 /*  useEffect(() => {
    if (patientState === "outpatient") {
      setAppointmentModal(true);
    } else if (patientState === "inpatient") {
      setAdmissionModal(true);
    }
  }, [patientState]); */

  const complaintSchema = [
    {
      name: "S/N",
      key: "sn",
      description: "SN",
      selector: (row) => row.sn,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "Complaint",
      key: "complaint",
      description: "Complaint",
      selector: (row) => row.complaint,
      sortable: true,
      inputType: "TEXT",
    },
    {
      name: "Duration",
      key: "duration",
      description: "Duration",
      selector: (row) => row.duration,
      sortable: true,
      inputType: "TEXT",
    },
  ];

  const diagnosisSchema = [
    {
      name: "S/N",
      key: "sn",
      description: "SN",
      selector: (row, i) => i + 1,
      sortable: true,
      inputType: "HIDDEN",
      width: "50px",
    },
    {
      name: "Type",
      key: "sn",
      description: "SN",
      selector: (row, i) => row.type,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "Diagnosis",
      key: "sn",
      description: "SN",
      selector: (row, i) => row.code,
      sortable: true,
      inputType: "HIDDEN",
    },
  ];

  const handleSelectClient = (client) => {
    setState((prev) => ({
      ...prev,
      ClientModule: {
        ...prev.ClientModule,
        selectedClient: client,
      },
    }));

    //
  };

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedAdmission(null);
    setAppointmentModal(false);
  };

  const handleSelectAdmission = (admission) => {
    setSelectedAdmission(admission);
    setSelectedAppointment(null);
    setAdmissionModal(false);
  };

  return (
    <Box
      style={{
        margin: "0 auto",
        width: "100%",
      /*   height: "calc(100vh - 90px)", */
        overflow: "scroll",
      }}
    >
      <ModalBox
        open={complaintModal}
        onClose={() => setComplaintModal(false)}
        header="Add Complaints"
      >
        <CreateComplaint
          closeModal={() => setComplaintModal(false)}
          setComplaints={setComplaints}
        />
      </ModalBox>

      <ModalBox
        open={diagnosisModal}
        onClose={() => setDiagnosisModal(false)}
        header="Add Diagnosis"
      >
        <CreateDiagnosis
          closeModal={() => setDiagnosisModal(false)}
          setDiagnosis={setDiagnosis}
        />
      </ModalBox>

     {/*  <ModalBox
        open={appointmentModal}
        onClose={() => setAppointmentModal(false)}
        header={`Appointments for ${state.ClientModule.selectedClient.firstname} ${state.ClientModule.selectedClient.lastname}`}
      >
        <SelectAppointment selectAppointment={handleSelectAppointment} />
      </ModalBox> */}

      {/* <ModalBox
        open={admissonModal}
        onClose={() => setAdmissionModal(false)}
        header={`Admission Orders for ${state.ClientModule.selectedClient.firstname} ${state.ClientModule.selectedClient.lastname}`}
      >
        <SelectAdmission selectAdmission={handleSelectAdmission} />
      </ModalBox> */}

     

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
        pr={2}
        pl={2}
      >
        <Box
          sx={{
            width: "30%" , //"25rem"
          }}
        >
          <PatientProfile />
        </Box>

        <Box
          sx={{
            width: "69%", //"calc(100% - 26rem)",
            margin:"1rem 0"
          }}
        >
          <Grid container spacing={2} mb={2}>
           {!client1&& <Grid item lg={6} md={5}>
              <ClientSearch
                clear={clearClientSearch}
                getSearchfacility={handleSelectClient}
                label="Search Beneficiary"
              />
            </Grid>}
            <Grid item xs={12} sm={4}>
              <Input
                name="ReferringFacility"
                label="Referring Facility"
                register={register("ReferringFacility")}
                defaultValue={facility.facilityName}
              />
            </Grid>
          { !dest && <Grid item xs={12} sm={4}>
              <Input
                name="destinationFacility"
                label="Destination Facility"
                register={register("destinationFacility")}
                defaultValue={facility.facilityName}
              />
            </Grid>}

           {dest && <Grid item lg={6} md={5} sm={6} xs={6}>
              <FacilitySearch
                getSearchfacility={getSearchfacility}
                clear={success}
                label="Destination Facility"
              />
            </Grid>}
            <Grid item lg={6} md={5} sm={6} xs={6}>
            <LocationSearch label="Destination Location" getSearchfacility={handleGetLocation} />
            </Grid>

            <Grid item lg={3} md={3} sm={3} xs={6}>
              <CustomSelect
                label="Priority"
                required
                control={control}
                name="priority"
                options={["Low", "Medium", "High", "Emergency"]}
              />
            </Grid>

            <Grid item lg={3} md={3.5}>
              <CustomSelect
                label="Patient Type"
                required
                control={control}
                name="patientstate"
                options={[
                  {
                    label: "In Patient",
                    value: "inpatient",
                  },

                  {
                    label: "Out Patient",
                    value: "outpatient",
                  },
                ]}
              />
            </Grid>
          </Grid>

         {/*  {patientState === "inpatient" && (
            <Grid container spacing={2} mb={2}>
              <Grid item sm={6} xs={12}>
                <MuiCustomDatePicker
                  control={control}
                  name="admission_date"
                  label="Admission Date"
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <MuiCustomDatePicker
                  control={control}
                  name="discharged_date"
                  label="Discharged Date"
                />
              </Grid>
            </Grid>
          )}
 */}
          {/* <Box mb={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              mb={1.5}
            >
              <FormsHeaderText text="Complaints Data" />

              <GlobalCustomButton onClick={() => setComplaintModal(true)}>
                <AddBoxIcon sx={{ marginRight: "3px" }} fontSize="small" />
                New Complaint
              </GlobalCustomButton>
            </Box>

            <Box>
              <CustomTable
                title={""}
                columns={complaintSchema}
                data={complaints}
                pointerOnHover
                highlightOnHover
                striped
                progressPending={false}
                CustomEmptyData={
                  <Typography sx={{ fontSize: "0.8rem" }}>
                    You've not added a Complaint yet...
                  </Typography>
                }
              />
            </Box>
          </Box> */}

          <Box mb={2}>
            <TextAreaVoiceAndText
              label="Clinical Findings"
              type={clinicFindInputType}
              changeType={setClinicFindInputType}
              register={register("clinical_findings")}
              voiceOnChange={(value) => setValue("clinical_findings", value)}
            />
          </Box>

          <Box mb={2}>
            {/* <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              mb={1.5}
            >
              <FormsHeaderText text="Diagnosis Data" />

              <GlobalCustomButton onClick={() => setDiagnosisModal(true)}>
                <AddBoxIcon sx={{ marginRight: "3px" }} fontSize="small" />
                New Diagnosis
              </GlobalCustomButton>
            </Box> */}

            {/* <Box>
              <CustomTable
                title={""}
                columns={diagnosisSchema}
                data={diagnosis}
                pointerOnHover
                highlightOnHover
                striped
                progressPending={false}
                CustomEmptyData={
                  <Typography sx={{ fontSize: "0.8rem" }}>
                    You've not added Diagnosis yet...
                  </Typography>
                }
              />
            </Box> */}
          </Box>
          {/* <Box mb={2}>
            <TextAreaVoiceAndText
              label="Drugs/Treatments"
              type={drugsInputType}
              changeType={setDrugsInputType}
              register={register("drugs")}
              voiceOnChange={(value) => setValue("drugs", value)}
            />
          </Box> */}
           <Grid item xs={6}>
            <Textarea
              placeholder="Type your message here"
              name="provisionalDiagnois"
              type="text"
              register={register("provisionalDiagnosis")}
              label="Provisional Diagnosis"
            />
            
          </Grid>
          <Grid item xs={6}>
            <Textarea
              placeholder="Type your message here"
              name="investigation"
              type="text"
              register={register("investigations")}
              label="Investigation so Far"
            />
            
          </Grid>
          <Grid item xs={6}>
            <Textarea
              placeholder="Type your message here"
              name="reason"
              type="text"
              register={register("reason_for_request")}
              label="Reason for Request"
            />

          </Grid>
          
          <GlobalCustomButton onClick={handleSubmit(onSubmit)}>
            <AddBoxIcon sx={{ marginRight: "3px" }} fontSize="small" />
            Create Referral
          </GlobalCustomButton>
          <Box mb={2}>
            <Grid container spacing={2} mb={2}>
              {/* <Grid item xs={6} mt={2}>
                <Input
                  name="physicianName"
                  label="Physician's Name"
                  type="text"
                  register={register("physician_Name")}
                />
              </Grid> */}
             {/*  <Grid item xs={6} mt={2}>
                <CustomSelect
                  label="Referral Type"
                  required
                  control={control} //clinical, diagnostic,business
                  name="referral_type"
                  options={[
                    {
                      label: "Clinical",
                      value: "clinical",
                    },

                    {
                      label: "Diagnostic",
                      value: "diagnostic",
                    },
                    {
                      label: "Business",
                      value: "business",
                    },
                  ]}
                />
              </Grid> */}
            </Grid>
          </Box>
        </Box>
      </Box>
      
    </Box>
  );
}
