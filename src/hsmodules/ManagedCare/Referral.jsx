/* eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import client from "../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../context";
import { toast } from "bulma-toast";
import "react-datepicker/dist/react-datepicker.css";
import { GridBox } from "../app/styles";
import ModalBox from "../../components/modal";
import ModalHeader from "../Appointment/ui-components/Heading/modalHeader";
import {
  Radio,
  Grid,
  FormControlLabel,
  RadioGroup,
  Box,
  Badge,
  Drawer,
} from "@mui/material";
import { McText } from "./text";
import Input from "../../components/inputs/basic/Input/index";
import BasicDateTimePicker from "../../components/inputs/DateTime";
import CustomSelect from "../../components/inputs/basic/Select";
import Textarea from "../../components/inputs/basic/Textarea";
import { MdCancel, MdAddCircle } from "react-icons/md";
import PatientProfile from "../Client/PatientProfile";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import { FormsHeaderText } from "../../components/texts";
import ChatInterface from "../../components/chat/ChatInterface";
import CRMTasks from "../CRM/Tasks";
import { ReferralList } from "./components/referral/ReferralList";
import { ReferralCreate } from "./components/referral/CreateReferral";

import { NewReferralDetails } from "./components/referral/ReferralDetails";

export default function Referral({ client }) {
  const { state, setState } = useContext(ObjectContext);
  const [view, setView] = useState("list");
  const [showModal, setShowModal] = useState(0);
  const [selectedReferral, setSelectedReferral] = useState();

  const { client_id } = useParams();

  const handleGoBack = () => {
    setView("list");
    setState((prev) => ({
      ...prev,
      ClientModule: {
        ...prev.ClientModule,
        selectedClient: {},
      },
    }));
  };

  return (
    <Box>
      {view === "list" && (
        <ReferralList
          showCreate={() => setView("create")}
          showDetail={() => setView("detail")}
          setSelectedReferral={setSelectedReferral}
          client_id={client_id ? client_id : client}
        />
      )}

      {view === "create" && (
        <ReferralCreate
          handleGoBack={handleGoBack}
          client_id={client_id ? client_id : client}
          showList={() => setView("list")}
        />
      )}

      {view === "detail" && (
        <NewReferralDetails
          handleGoBack={handleGoBack}
          selectedReferralProp={selectedReferral}
          setSelectedReferral={setSelectedReferral}
        />
      )}

      {/* {showModal === 1 && (
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <PatientProfile />
          </Grid>
          <Grid item xs={9}>
            <ReferralCreate showModal={showModal} setShowModal={setShowModal} />
          </Grid>
        </Grid>
      )} */}
      {showModal === 2 && (
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <PatientProfile />
          </Grid>
          <Grid item xs={9}>
            <Details setShowModal={setShowModal} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export function Details({ showModal, setShowModal }) {
  const [deny, setDeny] = useState(false);
  const [approve, setApprove] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 90px)",
          overflow: "auto",
          paddingRight: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <FormsHeaderText text={"Referral Details - 13322BA"} />
          </Box>
          <Box sx={{ display: "flex", marginTop: "1rem" }}>
            <GlobalCustomButton
              text="Back"
              onClick={() => setShowModal(0)}
              color="warning"
              customStyles={{ marginRight: ".8rem" }}
            />
            <GlobalCustomButton
              onClick={() => setApprove(true)}
              text="Approve"
              color="success"
              customStyles={{ marginRight: ".8rem" }}
            />
            <GlobalCustomButton
              onClick={() => {}}
              text="On Hold"
              color="secondary"
              customStyles={{ marginRight: ".8rem" }}
            />
            <GlobalCustomButton
              onClick={() => setDeny(true)}
              text="Reject"
              color="error"
              customStyles={{ marginRight: ".8rem" }}
            />
            <GlobalCustomButton
              onClick={
                currentPage === 1
                  ? () => setCurrentPage(2)
                  : () => setCurrentPage(1)
              }
              text={currentPage === 1 ? "Task" : "Details"}
              variant="outlined"
              customStyles={{ marginRight: ".8rem" }}
            />
            <Badge
              badgeContent={4}
              color="success"
              sx={{ marginRight: "10px" }}
            >
              <GlobalCustomButton
                onClick={() => setOpenDrawer(true)}
                text="Chat"
                color="primary"
              />
            </Badge>
          </Box>
        </Box>
        {currentPage === 1 && (
          <div
            style={{
              marginTop: "10px",
              border: "1px solid #8F8F8F",
              padding: "1rem",
            }}
          >
            <p>Request Sent 08/05/2022 9:45pm</p>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <p>Beneficiary Name: John Doe </p>
              </Grid>
              <Grid item xs={6}>
                <p>Referring Facility Facility: Ogun State Clinic </p>
              </Grid>
              <Grid item xs={6}>
                <p>Destination Facility: Lagos State Clinic </p>
              </Grid>
              <Grid item xs={6}>
                <p>Health Plan: Former sector plan</p>
              </Grid>
              <Grid item xs={6}>
                <p>Date of Admission: 23/06/2022</p>
              </Grid>
              <Grid item xs={6}>
                <p>Date of Discharge: 23/06/2022</p>
              </Grid>
              <Grid item xs={6}>
                <p>Capitation: Filed</p>
              </Grid>
              <Grid item xs={6}>
                <p>Fee for Service: Applicable</p>
              </Grid>
            </Grid>
            <FormsHeaderText text={"Referral Code - 13322BA"} />
            <McText txt={"Clinical Information"} />
            <Grid container spacing={2} mb={1}>
              <Grid item xs={12}>
                <p style={{ fontWeight: "bold" }}>Presenting Complaints:</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt
                </p>
              </Grid>
            </Grid>

            <FormsHeaderText text={"Clinical Findings"} />
            <Grid container spacing={2} mb={1}>
              <Grid item xs={12}>
                <p style={{ fontWeight: "bold" }}>Provisional Diagonosis:</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt
                </p>

                <p style={{ fontWeight: "bold" }}>
                  Planned Procedures / Services Requiring Authorization:
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt
                </p>
                <p style={{ fontWeight: "bold" }}>
                  Planned Procedures / Services Requiring Authorization:
                </p>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p style={{ fontWeight: "bold" }}>Reason for Request:</p>
                <span
                  style={{
                    fontWeight: "bold",
                    backgroundColor: "#ECF3FF",
                    color: "#0364FF",
                    padding: ".3rem",
                    marginRight: "1rem",
                  }}
                >
                  Procedure
                </span>
                <span
                  style={{
                    fontWeight: "bold",
                    backgroundColor: "#ECF3FF",
                    color: "#0364FF",
                    padding: ".3rem",
                  }}
                >
                  Services
                </span>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p style={{ fontWeight: "bold" }}>Physician Name:</p>
                <p>Dr. John Doe</p>
                <p>Lagos State Hospital</p>
              </Grid>
            </Grid>
          </div>
        )}
        {currentPage === 2 && (
          <div style={{ marginTop: "1rem" }}>
            <CRMTasks />
          </div>
        )}
      </div>
      {approve && (
        <>
          <ModalBox open={approve} onClose={() => setApprove(false)}>
            <form>
              <ModalHeader text={`Approve Claim  13229-BA`} />
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                  <Textarea label={"Comment"} />
                </Grid>
                <Grid item xs={12}>
                  <GlobalCustomButton text={"Approve"} color="success" />
                </Grid>
              </Grid>
            </form>
          </ModalBox>
        </>
      )}
      {deny && (
        <>
          <ModalBox open={deny} onClose={() => setDeny(false)}>
            <form>
              <ModalHeader text={`Deny Claim  13229-BA`} />

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                  <Textarea label={"Comment"} />
                </Grid>
                <Grid item xs={12}>
                  <GlobalCustomButton text={"Reject"} color="error" />
                </Grid>
              </Grid>
            </form>
          </ModalBox>
        </>
      )}
      <Drawer
        open={openDrawer}
        sx={{
          width: "fit-content",
          // height: 'fit-content',
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "fit-content",
            // height: 'fit-content',
          },
        }}
        variant="persistent"
        anchor="right"
      >
        <Box
          sx={{
            width: "25vw",
            height: "100vh",
            overflowY: "hidden",
          }}
        >
          <ChatInterface closeChat={() => setOpenDrawer(false)} />
        </Box>
      </Drawer>
    </>
  );
}

export function ReferralModify({ showModal, setShowModal }) {
  const { state, setState } = useContext(ObjectContext);
  const { register, handleSubmit, setValue } = useForm(); //, watch, errors, reset
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [success1, setSuccess1] = useState(false);
  const [success2, setSuccess2] = useState(false);
  const [message, setMessage] = useState("");
  const [clientId, setClientId] = useState();
  const [locationId, setLocationId] = useState();
  const [practionerId, setPractionerId] = useState();
  const [type, setType] = useState();

  const [facility, setFacility] = useState();
  const ClientServ = client.service("appointments");
  //const navigate=useNavigate()
  const { user } = useContext(UserContext); //,setUser

  const [currentUser, setCurrentUser] = useState();
  const [selectedClient, setSelectedClient] = useState();
  const [selectedAppointment, setSelectedAppointment] = useState();
  // const [appointment_reason,setAppointment_reason]= useState()
  const [appointment_status, setAppointment_status] = useState("");
  const [appointment_type, setAppointment_type] = useState("");
  const [billingModal, setBillingModal] = useState(false);

  const [chosen, setChosen] = useState();
  const [chosen1, setChosen1] = useState();
  const [chosen2, setChosen2] = useState();
  const appClass = ["On-site", "Teleconsultation", "Home Visit"];

  let appointee; //  =state.ClientModule.selectedClient
  /*  const getSearchfacility=(obj)=>{
        setValue("facility", obj._id,  {
            shouldValidate: true,
            shouldDirty: true
        })
    } */
  const handleChangeType = async (e) => {
    await setAppointment_type(e.target.value);
  };

  const handleChangeStatus = async (e) => {
    await setAppointment_status(e.target.value);
  };

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
    setShowModal(false),
      setState((prevstate) => ({
        ...prevstate,
        AppointmentModule: {
          selectedAppointment: {},
          show: "list",
        },
      }));

    // data.createdby=user._id
    console.log(data);
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
    console.log(data);

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
    getSearchfacility(state.ClientModule.selectedClient);

    /* appointee=state.ClientModule.selectedClient 
        console.log(appointee.firstname) */
    return () => {};
  }, [state.ClientModule.selectedClient]);

  /*   const showBilling = () =>{
        setBillingModal(true)
       //history.push('/app/finance/billservice')
        }
        const  handlecloseModal1 = () =>{
            setBillingModal(false)
            }


            const handleRow= async(Client)=>{
              //  await setSelectedClient(Client)
                const    newClientModule={s
                    selectedClient:Client,
                    show :'detail'
                }
               await setState((prevstate)=>({...prevstate, ClientModule:newClientModule}))
            } */
  const CustomSelectData = [
    {
      label: "Today",
      value: "today",
    },
  ];

  return (
    <>
      <div
        className="card "
        style={{ height: "100%", width: "80vw", overflowX: "hidden" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <ModalHeader text={"Referral Modify"} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MdCancel
                onClick={() => {
                  setShowModal(false),
                    setState((prevstate) => ({
                      ...prevstate,
                      AppointmentModule: {
                        selectedAppointment: {},
                        show: "list",
                      },
                    }));
                }}
                style={{
                  fontSize: "2rem",
                  color: "crimson",
                  cursor: "pointer",
                  float: "right",
                }}
              />
            </Grid>
          </Grid>
          <GridBox>
            <Input
              name="healthCareProvider"
              label="Health Care Provider"
              type="text"
            />
            <Input name="preAuthId" label="Pre-auth ID" type="text" />

            <Input name="claimId" label="Claim ID" type="text" />
          </GridBox>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5rem",
              marginBottom: "0.6rem",
            }}
          >
            <BasicDateTimePicker name="dateOfRequest" label="Date of Request" />

            <div>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="emergency"
                name="emergency"
                sx={{
                  display: "flex !important",
                  justifyContent: "space-between !",
                  flexDirection: "row !important",
                }}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </div>
          </div>

          <div>
            <McText
              txt={"Clinical Information"}
              color={"#0064CC"}
              type={"p"}
              bold={"700"}
              size={"18px"}
            />
          </div>
          <GridBox>
            <button
              style={{
                float: "right",
                backgroundColor: "#ECF3FF",
                color: "#0064CC",
                border: "none",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              <MdAddCircle
                style={{
                  marginRight: "5px",
                }}
              />
              Add complaints
            </button>
            <CustomSelect
              name="complaints"
              label="Complaints"
              options={CustomSelectData}
            />

            <CustomSelect
              name="duration"
              label="Duration"
              options={CustomSelectData}
            />
          </GridBox>

          <Grid container spacing={2} my={2}>
            <Grid item xs={12} sm={12}>
              <McText
                txt={"Clinic Findings"}
                color={"#0064CC"}
                type={"p"}
                bold={"700"}
                size={"18px"}
              />
            </Grid>
          </Grid>

          <GridBox>
            <CustomSelect
              name="provisionalDiagnosis"
              label="Provisional Diagnosis"
              options={CustomSelectData}
            />

            <button
              style={{
                float: "left",
                backgroundColor: "#ECF3FF",
                color: "#0064CC",
                border: "none",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              <MdAddCircle
                style={{
                  marginRight: "5px",
                }}
              />
              Add Diagnosis
            </button>

            <CustomSelect
              name="plannedDiagnosis"
              label="Planned Procedure"
              options={CustomSelectData}
            />

            <button
              style={{
                float: "left",
                backgroundColor: "#ECF3FF",
                color: "#0064CC",
                border: "none",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              <MdAddCircle
                style={{
                  marginRight: "5px",
                }}
              />
              Add Procedure
            </button>

            <CustomSelect
              name="plannedService"
              label="Planned Service"
              options={CustomSelectData}
            />

            <button
              style={{
                float: "left",
                backgroundColor: "#ECF3FF",
                color: "#0064CC",
                border: "none",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              <MdAddCircle
                style={{
                  marginRight: "5px",
                }}
              />
              Add Service
            </button>
          </GridBox>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              marginBottom: "10px",
            }}
          >
            <Input name="physicianName" label="Physician' Name" type="text" />
            <Textarea
              placeholder="Type your message here"
              name="reason"
              type="text"
              label="Reason for Request"
            />
          </div>
          <GlobalCustomButton type="submit">Submit</GlobalCustomButton>
        </form>
      </div>
    </>
  );
}
