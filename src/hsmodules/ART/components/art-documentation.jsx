import React, { useState, useRef, useContext, useEffect } from "react";
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Grid,
} from "@mui/material";
import client from "../../../feathers";
import Input from "../../../components/inputs/basic/Input";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import VideoConference from "../../utils/VideoConference";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChooseDocument from "./profileMgt/chooseDocument";
import ModalBox from "../../../components/modal";
import LaboratoryRequest from "./actions/laboratoryRequest";
import PrescriptionRequest from "./actions/prescriptionRequest";
import TemplateCreate from "../../CRM/components/templates/TemplateCreateForDocument";
import ProcedureRequest from "./actions/procedureRequest";
import EncounterRight from "../../Documentation/EncounterRight";
import { ObjectContext, UserContext } from "../../../context";
import { formatDistanceToNowStrict } from "date-fns";
import ReactToPrint from "react-to-print";
import { format } from "date-fns";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CustomConfirmationDialog from "../../../components/confirm-dialog/confirm-dialog";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  AgonistProtocolListDocument,
  AntagonistProtocolListDocument,
  FemaleHistoryListDocument,
  IntrauterineInseminationDocument,
  LaboratoryTreatmentDocument,
  LabOrdersDocument,
  PrescriptionDocument,
  RecipientTreatmentDocument,
  TheatreDocument,
  TreatmentSummaryDocument,
  BilledOrdersDocument,
} from "../../Documentation/documents/Documents";
import { ArrowDownward } from "@mui/icons-material";
import { ArrowRightIcon } from "@mui/x-date-pickers";
import { ArrowRight } from "@mui/icons-material";
import { ArrowRightOutlined } from "@mui/icons-material";
import { ArrowForward } from "@mui/icons-material";
import { ArrowUpward } from "@mui/icons-material";

export default function ArtDocumentation() {
  const [showActions, setShowActions] = useState(null);
  const [activateCall, setActivateCall] = useState(false);
  const [showChooseDocument, setShowChooseDocument] = useState(false);
  const [showLabRequestModal, setShowLabRequestModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState();
  const [showProcedureModal, setShowProcedureModal] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const ARTClinicalDocumentServ = client.service("clinicaldocument");
  const { user, setUser } = useContext(UserContext);
  const open = Boolean(showActions);
  const myRefs = useRef([]);

  const diagnosisTableColumns = [
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
      selector: (row, i) => row.diagnosis,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "ICD 11 Code",
      key: "sn",
      description: "SN",
      selector: (row) => row.Code,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "ICD11 Diagnosis",
      key: "sn",
      description: "SN",
      selector: (row) => row.Title,
      sortable: true,
      inputType: "HIDDEN",
    },
  ];

  const handleShowActions = (event) => {
    setShowActions(event.currentTarget);
  };

  const handleHideActions = () => {
    setShowActions(null);
  };

  const handleNewDocument = () => {
    setShowChooseDocument(true);
  };

  const handleCloseChooseDocument = () => {
    setShowChooseDocument(false);
  };

  const handleLabRequest = () => {
    setShowLabRequestModal(true);
  };

  const handlePrescriptionRequest = () => {
    setShowPrescriptionModal(true);
  };

  const handleProcedureRequest = () => {
    setShowProcedureModal(true);
  };

  const handleUploadDocument = () => {
    setUploadModal(true);
  };

  const actionsList = [
    {
      title: "Laboratory Request",
      action: handleLabRequest,
    },
    {
      title: "Procedure Request",
      action: handleProcedureRequest,
    },
    {
      title: "Prescription Request",
      action: handlePrescriptionRequest,
    },
    {
      title: "Upload New Document",
      action: handleUploadDocument,
    },
  ];

  const handleSearch = (val) => {
    const searchLimit = 20;
    const field = "documentname";
    ARTClinicalDocumentServ.find({
      query: {
        [field]: {
          $regex: val,
          $options: "i",
        },
        familyprofileId: state.ARTModule.selectedFamilyProfile._id,
        $limit: searchLimit,
        $sort: {
          name: 1,
        },
      },
    })
      .then((res) => {
        setFacilities(res.data);
      })
      .catch((err) => {
        return err;
      });
  };

  const getFacilities = async () => {
    if (user.currentEmployee) {
      const findClinic = await ARTClinicalDocumentServ.find({
        query: {
          client: state.ARTModule.selectedFamilyProfile._id,
          $limit: 10,
          $sort: {
            createdAt: -1,
          },
        },
      });
      setFacilities(findClinic.data);
    } else {
      if (user.stacker) {
        const findClinic = await ARTClinicalDocumentServ.find({
          query: {
            client: state.ARTModule.selectedFamilyProfile._id,
            $limit: 10,
            $sort: {
              createdAt: -1,
            },
          },
        });
        setFacilities(findClinic.data);
      }
    }
  };

  // console.log(facilities,"Facilities")

  useEffect(() => {
    getFacilities();
    getFacilities();
    ARTClinicalDocumentServ.on("created", () => getFacilities());
    ARTClinicalDocumentServ.on("updated", () => getFacilities());
    ARTClinicalDocumentServ.on("patched", () => getFacilities());
    ARTClinicalDocumentServ.on("removed", () => getFacilities());

    const newDocumentClassModule = {
      selectedDocumentClass: {},
      show: "list",
      encounter_right: false,
    };
    setState((prevstate) => ({
      ...prevstate,
      DocumentClassModule: newDocumentClassModule,
    }));
  }, []);

  const handleDelete = () => {
    showActionLoader();
    ARTClinicalDocumentServ.remove(docToDelete._id)
      .then(() => {
        hideActionLoader();
        toast.success(`${docToDelete?.documentname} Deleted succesfully`);
        setConfirmationDialog(false);
      })
      .catch((err) => {
        hideActionLoader();
        toast.error("Error deleting Adult Asthma Questionnaire " + err);
      });
  };

  const handleConfirmDelete = (doc) => {
    setDocToDelete(doc);
    setConfirmationDialog(true);
  };

  const closeConfirmationDialog = () => {
    setDocToDelete(null);
    setConfirmationDialog(false);
  };

  const handleRow = async (Clinic, i) => {
    if (Clinic.status === "completed" || Clinic.status === "Final") {
      setSelectedNote(Clinic);

      const newClinicModule = {
        selectedNote: Clinic,
        show: true,
      };
      await setState((prevstate) => ({
        ...prevstate,
        NoteModule: newClinicModule,
      }));
      const selectedFacilityId = Clinic._id;

      const newFacilities = facilities.map((facility) => {
        //CHECK IF CURRENT FACILITY IS SELECTED FACILITY
        if (facility._id === selectedFacilityId) {
          //IF CURRENT FACILITY IS CURRENTLY SELECTED, TOGGLE SHOW KEY

          return facility.show
            ? { ...facility, show: false }
            : { ...facility, show: true };

          //return ;
        } else {
          //IF CURRENT FACILITY IS NOT CURRENTLY SELECTED, RETURN FACILITY AS IT IS
          return facility;
        }
      });

      //SET OLD FACILITIES ARRAY TO NEW ONE WITH UPDATE SHOW STATE
      await setFacilities(newFacilities);
      // Clinic.show=!Clinic.show

      //
    } else {
      let documentobj = {};
      documentobj.name = Clinic?.documentname;
      documentobj.facility = Clinic?.facility;
      documentobj.document = Clinic;

      const newDocumentClassModule = {
        selectedDocumentClass: documentobj,
        show: "detail",
        encounter_right: true,
      };
      await setState((prevstate) => ({
        ...prevstate,
        DocumentClassModule: newDocumentClassModule,
      }));
    }
  };

  // useEffect(() => {
  //   handleRow(selectedClinic);
  // }, [selectedClinic]);

  const DocumentToRender = ({ Clinic, index }) => {
    switch (Clinic.documentname.toLowerCase()) {
      case "agonist protocol": {
        return Clinic.status.toLowerCase() !== "draft" ? (
          <AgonistProtocolListDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        ) : null;
      }

      case "antagonist protocol": {
        return Clinic.status.toLowerCase() !== "draft" ? (
          <AntagonistProtocolListDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        ) : null;
      }

      case "recipient treatment": {
        return Clinic.status.toLowerCase() !== "draft" ? (
          <RecipientTreatmentDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        ) : null;
      }
      case "intrauterine insemination": {
        return Clinic.status.toLowerCase() !== "draft" ? (
          <IntrauterineInseminationDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        ) : null;
      }
      case "laboratory treatment": {
        return Clinic.status.toLowerCase() !== "draft" ? (
          <LaboratoryTreatmentDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        ) : null;
      }
      case "treatment summary": {
        return Clinic.status.toLowerCase() !== "draft" ? (
          <TreatmentSummaryDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        ) : null;
      }
      case "prescription":
        return (
          <PrescriptionDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case "lab orders":
        return (
          <LabOrdersDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case "procedure":
        return (
          <LabOrdersDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case "female history":
        return (
          <FemaleHistoryListDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case "billed orders":
        return (
          <BilledOrdersDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
    }
  };

  return (
    <>
      <Box
        container
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        mb={2}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            item
            sx={{
              width: "calc(100% - 350px)",
              marginTop: "5px",
            }}
          >
            <Input
              label="Search Documentation"
              className="input is-small "
              type="text"
              minLength={3}
              debounceTimeout={400}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Box>

          <Box
            container
            sx={{
              width: "180px",
            }}
          >
            {activateCall && (
              <GlobalCustomButton
                sx={{
                  width: "100%",
                }}
                onClick={() => setActivateCall(false)}
                color="error"
              >
                End Teleconsultation
              </GlobalCustomButton>
            )}

            <VideoConference
              activateCall={activateCall}
              setActivateCall={setActivateCall}
            />
          </Box>

          <Box
            sx={{
              width: "180px",
            }}
          >
            <GlobalCustomButton
              color="secondary"
              sx={{
                width: "100%",
              }}
              onClick={handleNewDocument}
            >
              New Document
            </GlobalCustomButton>
            <ChooseDocument
              open={showChooseDocument}
              onClose={handleCloseChooseDocument}
            />
          </Box>

          <Box
            item
            sx={{
              width: "140px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                width: "100%",
              }}
            >
              <GlobalCustomButton
                onClick={handleShowActions}
                variant="contained"
                sx={{
                  width: "100%",
                }}
              >
                Actions <ExpandMoreIcon />
              </GlobalCustomButton>

              <Menu
                id="basic-menu"
                anchorEl={showActions}
                open={open}
                onClose={handleHideActions}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {actionsList.map((action, i) => (
                  <MenuItem
                    key={i}
                    onClick={action.action}
                    sx={{ fontSize: "0.8rem" }}
                  >
                    {action.title}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </Box>
        </Box>
        <CustomConfirmationDialog
          open={confirmationDialog}
          confirmationAction={() => handleDelete(docToDelete)}
          cancelAction={closeConfirmationDialog}
          type="danger"
          message={`You are about to delete a document: ${
            docToDelete?.documentname
          } created on ${dayjs(docToDelete?.createdAt).format("DD-MM-YYYY")} ?`}
        />
        <ModalBox
          width="50%"
          open={showLabRequestModal}
          onClose={() => setShowLabRequestModal(false)}
          header="Laboratory Request"
        >
          <LaboratoryRequest closeModal={() => setShowLabRequestModal(false)} />
        </ModalBox>
        <ModalBox
          width="50%"
          open={showPrescriptionModal}
          onClose={() => setShowPrescriptionModal(false)}
          header="Prescription Request"
        >
          <PrescriptionRequest
            closeModal={() => setShowPrescriptionModal(false)}
          />
        </ModalBox>
        <ModalBox
          width="50%"
          open={showProcedureModal}
          onClose={() => setShowProcedureModal(false)}
          header="Procedure Request"
        >
          <ProcedureRequest closeModal={() => setShowProcedureModal(false)} />
        </ModalBox>
        <ModalBox
          open={uploadModal}
          onClose={() => setUploadModal(false)}
          header="Upload New Document"
        >
          <TemplateCreate closeModal={() => setUploadModal(false)} />
        </ModalBox>
      </Box>
      <Box
        container
        spacing={1}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box
          item
          sx={{
            width: !state.DocumentClassModule.encounter_right ? "100%" : "90%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "calc(100vh - 230px)",
              overflowY: "scroll",
            }}
          >
            {facilities.map((Clinic, i) => (
              <React.Fragment key={Clinic._id}>
                <Box
                  mb={1}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    cursor: "pointer",
                    border: "1px solid rgba(235, 235, 235, 1)",
                    borderRadius: "5px",
                    height: "auto",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  }}
                  id={Clinic._id}
                >
                  <Box
                    container
                    sx={{
                      width: "100%",
                      minHeight: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#ffffff",
                      position: "relative",
                    }}
                  >
                    <Box
                      item
                      sx={{
                        borderRight: "1px solid rgba(235, 235, 235, 1)",
                        width: "150px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          color: "#000000",
                        }}
                      >
                        {formatDistanceToNowStrict(new Date(Clinic.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <span
                        style={{
                          color: "#2d2d2d",
                          fontSize: "0.7rem",
                          fontWeight: "400",
                        }}
                      >
                        {format(
                          new Date(Clinic.createdAt),
                          "dd-MM-yy HH:mm:ss"
                        )}
                      </span>

                      <span />
                    </Box>

                    <Box
                      item
                      sx={{
                        display: "flex",
                        width: "calc(100% - 200px)",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                      p={0.5}
                    >
                      <Typography
                        mr={0.5}
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: "400",
                          color: "#000000",
                        }}
                      >
                        {Clinic.documentname} by {Clinic.createdByname} at{" "}
                        {Clinic.location},{Clinic.facilityname} -{" "}
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: "400",
                            color: `${
                              Clinic.status === "completed" ? "green" : "orange"
                            }`,
                          }}
                        >
                          {Clinic.status}
                        </Typography>
                      </Typography>
                    </Box>

                    <Box
                      item
                      sx={{
                        width: "120px",
                        display: "flex",
                        gap: "4px",
                      }}
                    >
                      {Clinic.status === "completed" && !Clinic.show && (
                        <IconButton
                          sx={{
                            color: "#0364FF",
                          }}
                          onClick={() => handleRow(Clinic)}
                        >
                          <ArrowDownward fontSize="small" />
                        </IconButton>
                      )}

                      {Clinic.status === "completed" && Clinic.show && (
                        <IconButton
                          sx={{
                            color: "#0364FF",
                          }}
                          onClick={() => handleRow(Clinic)}
                        >
                          <ArrowUpward fontSize="small" />
                        </IconButton>
                      )}

                      {Clinic.status !== "completed" && (
                        <IconButton
                          sx={{
                            color: "#0364FF",
                          }}
                          onClick={() => handleRow(Clinic)}
                        >
                          <ArrowForward fontSize="small" />
                        </IconButton>
                      )}
                      <ReactToPrint
                        trigger={() => (
                          <IconButton
                            sx={{
                              color: "#0364FF",
                            }}
                          >
                            <PrintOutlinedIcon fontSize="small" />
                          </IconButton>
                        )}
                        content={() => myRefs.current[i]}
                      />

                      <IconButton
                        color="error"
                        onClick={() => handleConfirmDelete(Clinic)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
                <Collapse in={Clinic.show} sx={{ width: "100%" }}>
                  {Clinic.documentname !== "Prescription" &&
                  Clinic.documentname !== "Female History" &&
                  Clinic.documentname !== "Procedure" &&
                  Clinic.documentname !== "Lab Orders" &&
                  Clinic.documentname !== "Billed Orders" &&
                  Clinic.documentname !== "Agonist Protocol" &&
                  Clinic.documentname !== "Antagonist Protocol" &&
                  Clinic.documentname !== "Recipient Treatment" &&
                  Clinic.documentname !== "Intrauterine Insemination" &&
                  Clinic.documentname !== "Aspiration Notice" &&
                  Clinic.documentname !== "Laboratory Treatment" &&
                  Clinic.documentname !== "Treatment Summary" ? (
                    <Box>
                      <div className="field" ref={myRefs.current[i]}>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                          }}
                        >
                          <thead>
                            <tr>
                              <th
                                style={{
                                  backgroundColor: "#0E305D",
                                  color: "#ffffff",
                                  padding: "10px",
                                  textAlign: "left",
                                  fontSize: 14,
                                }}
                              >
                                Document Field
                              </th>
                              <th
                                style={{
                                  backgroundColor: "#0E305D",
                                  color: "#ffffff",
                                  padding: "10px",
                                  textAlign: "left",
                                  fontSize: 14,
                                }}
                              >
                                Field Values
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(Clinic.documentdetail).map(
                              ([keys, value], i) => {
                                if (
                                  value === "" ||
                                  value === undefined ||
                                  value === null ||
                                  keys === "DocumentUploadUrl"
                                ) {
                                  return null;
                                }
                                return (
                                  <tr key={i}>
                                    <td
                                      style={{
                                        border: "1px solid #e0e0e0",
                                        padding: "10px",
                                        fontSize: 14,
                                      }}
                                    >
                                      {keys}
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid #e0e0e0",
                                        padding: "10px",
                                        fontSize: 13,
                                      }}
                                    >
                                      {keys === "diagnosis" &&
                                      Array.isArray(value) ? (
                                        <Box>
                                          <CustomTable
                                            title={""}
                                            columns={diagnosisTableColumns}
                                            data={value}
                                            pointerOnHover
                                            highlightOnHover
                                            striped
                                            progressPending={false}
                                            CustomEmptyData={
                                              <Typography
                                                sx={{ fontSize: "0.8rem" }}
                                              >
                                                You've not added a Diagnosis
                                                yet...
                                              </Typography>
                                            }
                                          />
                                        </Box>
                                      ) : value instanceof Object ? (
                                        JSON.stringify(value)
                                      ) : keys !== "File" ? (
                                        value
                                      ) : (
                                        <a
                                          href={
                                            Clinic.documentdetail
                                              .DocumentUploadUrl
                                          }
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {value}
                                        </a>
                                      )}
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Box>
                  ) : null}
                  <DocumentToRender Clinic={Clinic} index={i} />
                </Collapse>
              </React.Fragment>
            ))}
          </Box>
        </Box>
        <Drawer
          anchor={"right"}
          open={state.DocumentClassModule.encounter_right}
          onClose={() => {
            setState((prev) => ({
              ...prev,
              DocumentClassModule: {
                ...prev.DocumentClassModule,
                encounter_right: false,
              },
            }));
          }}
        >
          <Box item sx={{ width: "650px" }}>
            <Box
              sx={{
                width: "100%",

                //border: "1px solid rgba(235, 235, 235, 1)",
                //maxHeight: "calc(100vh - 170px)",
                overflowY: "scroll",
                padding: "15px",
              }}
            >
              <EncounterRight client={selectedClient} />
            </Box>
          </Box>
        </Drawer>
      </Box>
    </>
  );
}
