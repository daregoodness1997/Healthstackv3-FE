import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Drawer from "@mui/material/Drawer";
import React, { useState, useContext, useEffect } from "react";
import dayjs from "dayjs";

import client from "../../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../../context";
import { toast } from "bulma-toast";
import "react-datepicker/dist/react-datepicker.css";
import CustomTable from "../../../components/customtable";
import ModalBox from "../../../components/modal";
import { Grid, Box, Typography } from "@mui/material";

import Input from "../../../components/inputs/basic/Input/index";
import Textarea from "../../../components/inputs/basic/Textarea";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import { FormsHeaderText } from "../../../components/texts";

import PatientProfile from "../../Client/PatientProfile";
import CustomSelect from "../../../components/inputs/basic/Select";

import CustomConfirmationDialog from "../../../components/confirm-dialog/confirm-dialog";
import ReferralStatus from "./ReferralStatus";
import SelectedClientAppointment from "../../../components/appointment/components/SelectedClientAppointment";

export function NewReferralDetails({ handleGoBack, setSelectedReferral }) {
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [success1, setSuccess1] = useState(false);
  const [success2, setSuccess2] = useState(false);
  const [billingModal, setBillingModal] = useState(false);
  const [message, setMessage] = useState("");
  const [clientId, setClientId] = useState();
  const [clearClientSearch, setClearClientSearch] = useState(false);
  const [locationId, setLocationId] = useState();
  const [practionerId, setPractionerId] = useState();
  const [complaints, setComplaints] = useState([]);
  const [complaintModal, setComplaintModal] = useState(false);
  const [diagnosis, setDiagnosis] = useState([]);
  const [diagnosisModal, setDiagnosisModal] = useState(false);
  const ClientServ = client.service("appointments");
  const referralServer = client.service("referral");
  const [drugsInputType, setDrugsInputType] = useState("type");
  const [clinicFindInputType, setClinicFindInputType] = useState("type");
  const { user } = useContext(UserContext); //,setUser
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [admissonModal, setAdmissionModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [confirmationDiaglog, setConfirmationDialog] = useState({
    open: false,
    message: "",
    type: "",
    action: null,
  });
  const [chat, setChat] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [statusModal, setStatusModal] = useState(false);
  const [view, setView] = useState("details");

  const [appointment_status, setAppointment_status] = useState("");
  const [appointment_type, setAppointment_type] = useState("");

  const [chosen, setChosen] = useState();
  const [chosen1, setChosen1] = useState();
  const [chosen2, setChosen2] = useState();

  const employee = user.currentEmployee;
  const facility = employee.facilityDetail;
  const selectedReferral = state.ReferralModule.selectedReferral;
  const employeeloc = state.employeeLocation?.locationId;
  const destLocation = selectedReferral.dest_org_location?._id === employeeloc;
  const { control, handleSubmit, register, reset, watch, setValue } = useForm(
    {}
  );

  const handleChangeType = async (e) => {
    await setAppointment_type(e.target.value);
  };
  console.log(selectedReferral);
  const handleChangeStatus = async (e) => {
    await setAppointment_status(e.target.value);
  };

  // console.log("===>>>> SELECTE REFERRAL FROM REFERRAL DETAILS", {
  //   referral: selectedReferral,
  // });

  const getSearchfacility = (obj) => {
    setClientId(obj._id);
    setChosen(obj);
    //handleRow(obj)
    if (!obj) {
      //"clear stuff"
      setClientId();
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
    setCurrentUser(user);
    //console.log(currentUser)
    return () => {};
  }, [user]);

  //check user for facility or get list of facility
  useEffect(() => {
    //setFacility(user.activeClient.FacilityId)//
    if (!user.stacker) {
      /*    console.log(currentUser)
          setValue("facility", user.currentEmployee.facilityDetail._id,  {
              shouldValidate: true,
              shouldDirty: true
          })  */
    }
  });

  const onSubmit = (data, e) => {
    e.preventDefault();
    setMessage("");
    setError(false);
    setSuccess(false);
    //   setShowModal(false),
    setState((prevstate) => ({
      ...prevstate,
      AppointmentModule: {
        selectedAppointment: {},
        show: "list",
      },
    }));

    if (user.currentEmployee) {
      data.facility = user.currentEmployee.facilityDetail._id; // or from facility dropdown
    }
    data.locationId = locationId; //state.ClinicModule.selectedClinic._id
    data.practitionerId = practionerId;
    data.appointment_type = appointment_type;
    // data.appointment_reason=appointment_reason
    data.appointment_status = appointment_status;
    data.clientId = clientId;
    data.firstname = chosen.firstname;
    data.middlename = chosen.middlename;
    data.lastname = chosen.lastname;
    data.dob = chosen.dob;
    data.gender = chosen.gender;
    data.phone = chosen.phone;
    data.email = chosen.email;
    data.practitioner_name = chosen2.firstname + " " + chosen2.lastname;
    data.practitioner_profession = chosen2.profession;
    data.practitioner_department = chosen2.department;
    data.location_name = chosen1.name;
    data.location_type = chosen1.locationType;
    data.actions = [
      {
        action: appointment_status,
        actor: user.currentEmployee._id,
      },
    ];
    // console.log(data);

    ClientServ.create(data)
      .then((res) => {
        //console.log(JSON.stringify(res))
        e.target.reset();
        setAppointment_type("");
        setAppointment_status("");
        setClientId("");
        setLocationId("");
        /*  setMessage("Created Client successfully") */
        setSuccess(true);
        setSuccess1(true);
        setSuccess2(true);
        toast({
          message:
            "Appointment created succesfully, Kindly bill patient if required",
          type: "is-success",
          dismissible: true,
          pauseOnHover: true,
        });
        setSuccess(false);
        setSuccess1(false);
        setSuccess2(false);
        // showBilling()
      })
      .catch((err) => {
        toast({
          message: "Error creating Appointment " + err,
          type: "is-danger",
          dismissible: true,
          pauseOnHover: true,
        });
      });
  };

  useEffect(() => {
    const resetForm = {
      status: selectedReferral.status,
      reason_for_request: selectedReferral.referralReason,
      referral_type: selectedReferral.referral_type,
      referralNo: selectedReferral.referralNo,
      priority: selectedReferral.priority,
      patientstate: selectedReferral.patient_type,
      clinical_findings: selectedReferral.referralnote,
      investigations: selectedReferral.investigations,
      provisionalDiagnosis: selectedReferral.provisionalDiagnosis,
      dest_org_location: selectedReferral.dest_org_location.name,
      dest_org: selectedReferral.dest_org.facilityName,
      source_org: selectedReferral.source_org.facilityName,
      source_org_location: selectedReferral.source_org_location.locationName,

      // patientstate: selectedReferral.patientstate,
      // preauthtype: selectedPreAuth.preauthtype,
      // comments: selectedPreAuth.comments,
      // totalamount: selectedPreAuth.totalamount,
      // investigation: clinical_details.investigation || "",
      // drugs: clinical_details.drugs || "",
      // treatment: clinical_details.treatment || "",
      // clinical_findings: clinical_details.clinical_findings || "",
      // admission_date: clinical_details.admission_date || null,
      // discharged_date: clinical_details.discharged_date || null,

      // date: selectedPreAuth.createdAt,
      // provider_name: selectedPreAuth.provider.facilityName,
      // submitted_by: `${selectedPreAuth.submissionby?.firstname} ${selectedPreAuth.submissionby?.lastname}`,
    };
    reset(resetForm);
    // setServices(selectedPreAuth.services || []);
    // setDiagnosis(clinical_details.diagnosis || []);
    // setComplaints(clinical_details.complaints || []);
  }, [selectedReferral]);

  useEffect(() => {
    getSearchfacility(state.ClientModule.selectedClient);

    /* appointee=state.ClientModule.selectedClient 
          console.log(appointee.firstname) */
    return () => {};
  }, [state.ClientModule.selectedClient]);

  const patientState = watch("patientstate");

  // useEffect(() => {
  //   if (patientState === "outpatient") {
  //     setAppointmentModal(true);
  //   } else if (patientState === "inpatient") {
  //     setAdmissionModal(true);
  //   }
  // }, [patientState]);

  const updateReferral = async () => {
    const employee = user.currentEmployee;

    const statushx = {
      status: "Accepted",
      actor: `${employee.firstname} ${employee.lastname}`,
      Comments: "Appointment Set",
      action_time: new Date(),
    };

    const prevHistory = state.ReferralModule.selectedReferral.statusHx || [];
    const newStatushx = [statushx, ...prevHistory];

    await referralServer
      .patch(selectedReferral._id, {
        status: data.status,
        dest_org_acceptance: "Accepted",
        statusHx: newStatushx,
      })
      .then((res) => {
        hideActionLoader();
        toast.success("You've successfully updated Referral's status");
        console.log("===>>>> response ", { res });
        setState((prev) => ({
          ...prev,
          ReferralModule: {
            ...prev.ReferralModule,
            selectedReferral: res,
          },
        }));
        closeModal();
      })
      .catch((err) => {
        hideActionLoader();
        console.log(err);
        toast.error(`Failed to updated Referral's  Status ${err}`);
      });
  };

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

  const cancelConfirmDialog = () => {
    setConfirmationDialog({
      open: false,
      message: "",
      type: "",
      action: null,
    });
  };

  const statushxColumns = [
    {
      name: "SN",
      key: "sn",
      description: "sn",
      selector: (row, i) => i + 1,
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "50px",
    },
    {
      name: "Updated By",
      key: "sn",
      description: "Enter Date",
      selector: (row, i) => row?.actor,
      sortable: true,
      required: true,
      inputType: "TEXT",
      style: {
        textTransform: "capitalize",
      },
    },
    {
      name: "Updated At",
      key: "sn",
      description: "Enter Date",
      selector: (row, i) => dayjs(row.action_time).format("DD/MM/YYYY hh:mm A"),
      sortable: true,
      required: true,
      inputType: "TEXT",
      style: {
        textTransform: "capitalize",
      },
    },
    {
      name: "Status",
      key: "sn",
      description: "Enter Date",
      selector: (row, i) => row.status,
      sortable: true,
      required: true,
      inputType: "TEXT",
      style: {
        textTransform: "capitalize",
      },
    },
    {
      name: "Comment",
      key: "sn",
      description: "Enter Date",
      selector: (row, i) => row.Comments,
      sortable: true,
      required: true,
      inputType: "TEXT",
      style: {
        textTransform: "capitalize",
      },
    },
  ];

  return (
    <Box
      style={{
        margin: "0 auto",
        width: "98%",
        /* height: "calc(100vh - 90px)", */
        overflow: "scroll",
      }}
    >
      <CustomConfirmationDialog
        open={confirmationDiaglog.open}
        message={confirmationDiaglog.message}
        confirmationAction={confirmationDiaglog.action}
        type={confirmationDiaglog.type}
        cancelAction={cancelConfirmDialog}
      />

      <ModalBox
        open={statusModal}
        onClose={() => setStatusModal(false)}
        header="Update referral Status"
      >
        <ReferralStatus
          closeModal={() => setStatusModal(false)}
          selectedReferral={selectedReferral}
          setSelectedReferral={setSelectedReferral}
        />
      </ModalBox>
      <ModalBox
        open={appointmentModal}
        onClose={() => setAppointmentModal(false)}
        header="Set Appointment"
      >
        <SelectedClientAppointment
          closeModal={() => setAppointmentModal(false)}
          openBill={updateReferral}
          selectedReferral={selectedReferral}
          setSelectedReferral={setSelectedReferral}
        />
      </ModalBox>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          borderBottom: "1px solid #f8f8f8",
          backgroundColor: "#f8f8f8",
          position: "sticky",
          zIndex: 99,
          top: 0,
          left: 0,
        }}
        mb={2}
        p={2}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          gap={1}
        >
          {/*  <GlobalCustomButton onClick={handleGoBack}>
            <ArrowBackIcon sx={{ marginRight: "3px" }} fontSize="small" />
            Back
          </GlobalCustomButton>
 */}
          <Typography
            sx={{
              fontSize: "0.95rem",
              fontWeight: "600",
            }}
          >
            Referral Details
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          gap={1}
        >
          {/*  <GlobalCustomButton color="info" onClick={() => setView("details")}>
            <AddBoxIcon sx={{ marginRight: "3px" }} fontSize="small" />
            Details
          </GlobalCustomButton> */}

          {/* {!client_id && ( */}
          {/*   <GlobalCustomButton color="warning" onClick={() => setView("tasks")}>
            <AddBoxIcon sx={{ marginRight: "3px" }} fontSize="small" />
            Tasks
          </GlobalCustomButton> */}
          {/* // )
            } */}

          {/*  <GlobalCustomButton
            onClick={() => setChat(true)}
            sx={{
              backgroundColor: "#606c38",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#606c38",
              },
            }}
          >
            <AddBoxIcon sx={{ marginRight: "3px" }} fontSize="small" />
            Chat
          </GlobalCustomButton> */}

          {/* {!client_id && ( */}
          {destLocation && (
            <>
              <GlobalCustomButton
                color="success"
                onClick={() => setStatusModal(true)}
              >
                <AddBoxIcon sx={{ marginRight: "3px" }} fontSize="small" />
                Change Status
              </GlobalCustomButton>
              <GlobalCustomButton
                color="success"
                onClick={() => setAppointmentModal(true)}
              >
                <AddBoxIcon sx={{ marginRight: "3px" }} fontSize="small" />
                Set Appointment
              </GlobalCustomButton>
            </>
          )}
          {/* )
            } */}

          {/* <GlobalCustomButton color="info" onClick={() => setAssignModal(true)}>
            <AddBoxIcon sx={{marginRight: "3px"}} fontSize="small" />
            Assign Preauthorization
          </GlobalCustomButton> */}
        </Box>
      </Box>

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
            width: "25rem",
          }}
        >
          <PatientProfile />
        </Box>

        <Box
          sx={{
            width: "calc(100% - 26rem)",
          }}
        >
          {/*  {view === "tasks" && (
            <ReferralTask
              taskServer={referralServer}
              taskState={selectedReferral}
            />
          )} */}
          {view === "details" && (
            <>
              <Grid container spacing={2} mb={2}>
                {/* <Grid item lg={6} md={5}>
                  <ClientSearch
                    // clear={clearClientSearch}
                    // getSearchfacility={handleSelectClient}
                    // label="Search Beneficiary"

                    clear={clearClientSearch}
                    getSearchfacility={handleSelectClient}
                    id={selectedReferral.clientId}
                    disabled={true}
                  />
                </Grid> */}
                <Grid item lg={6} md={4} sm={4} xs={6}>
                  <Input
                    name="ReferringFacility"
                    label="Referring Facility"
                    register={register("ReferringFacility")}
                    defaultValue={selectedReferral.source_org?.facilityName}
                    disabled
                  />
                </Grid>
                <Grid item lg={6} md={4} sm={4} xs={6}>
                  <Input
                    name="dest_org_Name"
                    label="Destination Facility"
                    type="text"
                    register={register("dest_org")}
                    defaultValue={selectedReferral.dest_org?.facilityName}
                    disabled={true}
                  />
                </Grid>
                <Grid item lg={6} md={4} sm={4} xs={6}>
                  <Input
                    name="source_org_location"
                    label="Referring Location"
                    type="text"
                    register={register("source_org_location")}
                    defaultValue={
                      selectedReferral.source_org_location?.locationName
                    }
                    disabled
                  />
                </Grid>
                <Grid item lg={6} md={4} sm={4} xs={6}>
                  <Input
                    name="dest_org_Name"
                    label="Destination Location"
                    type="text"
                    register={register("dest_org_location")}
                    defaultValue={selectedReferral.dest_org_location?.name}
                    disabled
                  />
                </Grid>

                <Grid item lg={3} md={3.5}>
                  <CustomSelect
                    label="Priority"
                    required
                    control={control}
                    name="priority"
                    options={["Low", "Medium", "High", "Emergency"]}
                    defaultValue={selectedReferral.priority}
                    disabled={true}
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
                    defaultValue={selectedReferral.patient_type}
                    disabled={true}
                  />
                </Grid>
              </Grid>

              <Box mb={2}>
                <Grid container spacing={2} mb={2}>
                  <Grid item sm={4} xs={6} mt={2}>
                    <Input
                      name="status"
                      label="Referral Status"
                      type="text"
                      register={register("status")}
                      disabled
                    />
                  </Grid>
                  <Grid item sm={4} xs={6} mt={2}>
                    <Input
                      label="Referral NO"
                      name="referralNo"
                      type="text"
                      register={register("referralNo")}
                      disabled
                    />
                  </Grid>
                  {/*  <Grid item sm={4} xs={6} mt={2}>
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
                      disabled
                    />
                  </Grid> */}
                </Grid>
              </Box>

              <Box mb={2}>
                <Grid item xs={6}>
                  <Textarea
                    placeholder="Type your message here"
                    name="clinical_findings"
                    type="text"
                    register={register("clinical_findings")}
                    label="Clinical Findings"
                  />
                </Grid>

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
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <Textarea
                    placeholder="Type your message here"
                    name="reason"
                    type="text"
                    register={register("reason_for_request")}
                    label="Reason for Request"
                    disabled
                  />
                </Grid>
                <Box>
                  <FormsHeaderText text="Referral's Status History" />
                  <Box mt={1} mb={1}>
                    <CustomTable
                      title={""}
                      columns={statushxColumns}
                      data={selectedReferral.statusHx || []}
                      pointerOnHover
                      highlightOnHover
                      striped
                      //onRowClicked={handleRow}
                      CustomEmptyData="No Status History for this Preauthorization yet..."
                      progressPending={false}
                      //conditionalRowStyles={conditionalRowStyles}
                    />
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>

        <Drawer
          anchor="right"
          open={chat}
          onClose={() => setChat(false)}
          onOpen={() => setChat(true)}
        >
          <Box
            sx={{
              width: "500px",
              height: "100vh",
              overflowY: "hidden",
            }}
          >
            {chat && <ReferralChat closeChat={() => setChat(false)} />}
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
}
