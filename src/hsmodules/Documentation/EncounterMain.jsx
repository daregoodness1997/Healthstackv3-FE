import React, { useState, useContext, useEffect, useRef, lazy } from 'react';
import client from '../../feathers';
import { DocumentClassList } from './DocumentClass';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/material/Menu';
import { ChartClassList } from './DocumentClass';
import { EndEncounterList } from './EndEncounter';
import { UserContext, ObjectContext } from '../../context';
import { toast } from 'react-toastify';
import { format, formatDistanceToNowStrict } from 'date-fns';
import VideoConference from '../utils/VideoConference';

import Prescription from './Prescription';
import LabOrders from './LabOrders';
import AdmitOrders from './AdmitOrders';
import DischargeOrders from './DischargeOrders';
import RadiologyOrders from './RadiologyOrders';

import ReactToPrint from 'react-to-print';
import { Box, Collapse, Grid, IconButton, Typography } from '@mui/material';
import Input from '../../components/inputs/basic/Input';
import MenuItem from '@mui/material/MenuItem';

import {
  AdmissionOrderDocument,
  AdultAthsmaQuestionaire,
  DischargeOrderComponent,
  LabOrdersDocument,
  MedicationListDocument,
  PediatricForm,
  PrescriptionDocument,
  RadiologyOrdersDocument,
  BilledOrdersDocument,
  TheatreDocument,
  LaboratoryResultDocument,
  PregnancyAssessmentDocument,
  ObstetricsAssessmentDocument,
  HeamodialysisNursingDocument,
  SleepMedicineReferralFormListDocument,
  PediatricSleepStudyReferralFormListDocument,
  EpworthSleepinessScaleDocument,
  SleepStudyAuthorizationDocument,
  PatientInstructionForSleepDocument,
  InsuranceDetailsDocument,
  PrivacyAndPolicyDocument,
  FatigueSeverityScaleDocument,
  SleepQuestionnaireDocument,
  WeeklySleepLogDocument,
  SleepHistoryAndIntakeDocument,
  SleepQuestionnaireForSpouseDocument,
  NursesContinuationSheetDocument,
  NutritionAndDieteticsRequestFormListDocument,
} from './documents/Documents';

import ModalBox from '../../components/modal';
import EncounterRight from './EncounterRight';
import { DoctorsNotePrintOut } from './print-outs/Print-Outs';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import DocumentationScheduleAppointment from './ScheduleAppointment';
import CustomConfirmationDialog from '../../components/confirm-dialog/confirm-dialog';
import dayjs from 'dayjs';
import TheatreRequest from './TheatreRequest';
import TemplateCreate from '../CRM/components/templates/TemplateCreateForDocument';
import CustomTable from '../../components/customtable';
import { ArrowDownward } from '@mui/icons-material';
import { ArrowUpward } from '@mui/icons-material';
import { ArrowForward } from '@mui/icons-material';
import FluidIntakeOutput from '../clientForm/forms/fluidIntake';
import DialysisLogSheet from '../clientForm/forms/dialysisLogSheet';
import ContinuationSheet from '../clientForm/forms/continuationSheet';
import LaboratoryObservationChart from '../clientForm/forms/laboratoryObservationChart';
import PressureAreasTreatmentChart from '../clientForm/forms/pressureAreasTreatmentChart';
import VitalSignChart from '../clientForm/forms/vitalSignChart';
// import VaccinationCreate from './Vaccination/VaccinationRequest'
import Vaccination from './Vaccination';
// import MorningAndEveningChart from '../clientForm/forms/morningAndEveningChart'

export default function EncounterMain({ nopresc, chosenClient }) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const ClinicServ = client.service('clinicaldocument');
  const [facilities, setFacilities] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState({});
  const [selectedNote, setSelectedNote] = useState();
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [showEncounterModal, setShowEncounterModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);
  const [showRadModal, setShowRadModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [showActions, setShowActions] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [activateCall, setActivateCall] = useState(false);
  const [showTheatreModal, setShowTheatreModal] = useState(false);
  const [showVaccinationModal, setShowVaccinationModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [page, setPage] = useState(0);
  const [encounterStarted, setEncounterStarted] = useState(false);
  const [encounterStartTime, setEncounterStartTime] = useState(null);
  const [encounterDuration, setEncounterDuration] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const myRefs = useRef([]);
  // const [isCollapsed, setIsCollapsed] = useState(false);
  const isPureLife = user.currentEmployee?.facilityDetail?.hasExternalLink;
  const selectClassName = state.DocumentClassModule.selectedDocumentClass.name;

  const DOCUMENT_COMPONENTS = {
    'Fluid Intake And Output Chart': FluidIntakeOutput,
    'Dialysis Log Sheet': DialysisLogSheet,
    'Continuation Sheet': ContinuationSheet,
    'Vital Signs Chart': VitalSignChart,
    'Labour Observation Chart': LaboratoryObservationChart,
    'Pressure Areas Treatment Chart': PressureAreasTreatmentChart,
    // 'Morning And Evening Chart': MorningAndEveningChart,
  };

  const open = Boolean(showActions);

  const handleShowActions = (event) => {
    setShowActions(event.currentTarget);
  };
  const handleHideActions = () => {
    setShowActions(null);
  };

  const handleNewDocument = async () => {
    setShowModal(true);
    handleHideActions();
  };

  const handleToggleEncounter = () => {
    if (!encounterStarted) {
      // Starting encounter
      const startTime = new Date();
      setEncounterStartTime(startTime);
      setEncounterStarted(true);
      setElapsedTime(0);
      toast.success(`Encounter started at ${format(startTime, 'HH:mm:ss')}`);
    } else {
      // Ending encounter
      const endTime = new Date();
      const durationMs = endTime - encounterStartTime;
      const durationMinutes = Math.floor(durationMs / 60000);
      const durationSeconds = Math.floor((durationMs % 60000) / 1000);

      setEncounterDuration(durationMs);
      setEncounterStarted(false);

      const durationText = durationMinutes > 0
        ? `${durationMinutes} minute${durationMinutes !== 1 ? 's' : ''} ${durationSeconds} second${durationSeconds !== 1 ? 's' : ''}`
        : `${durationSeconds} second${durationSeconds !== 1 ? 's' : ''}`;

      toast.info(`Encounter ended. Duration: ${durationText}`);

      // Log the encounter time for potential saving to database
      console.log('Encounter Details:', {
        startTime: encounterStartTime,
        endTime: endTime,
        durationMs: durationMs,
        durationMinutes: durationMinutes,
        durationSeconds: durationSeconds
      });

      setEncounterStartTime(null);
    }
  };

  const handleNewPrescription = async () => {
    setShowPrescriptionModal(true);
    handleHideActions();
  };

  const handleNewTheatre = async () => {
    setShowTheatreModal(true);
    handleHideActions();
  };

  const handleRow = async (Clinic, i) => {
    if (Clinic.status === 'completed' || Clinic.status === 'Final') {
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
      documentobj.name = Clinic.documentname;
      documentobj.facility = Clinic.facility;
      documentobj.document = Clinic;

      const newDocumentClassModule = {
        selectedDocumentClass: documentobj,
        show: 'detail',
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

  const handleSearch = (val) => {
    const field = 'documentname';
    // console.log(val);
    ClinicServ.find({
      query: {
        [field]: {
          $regex: val,
          $options: 'i',
        },
        client: state.ClientModule.selectedClient._id,
        $limit: 50,
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

  const getFacilities = async (page = 0) => {
    // console.log("client id",state.ClientModule.selectedClient._id)
    if (state.ClientModule.selectedClient._id === undefined) return;
    if (user.currentEmployee) {
      const findClinic = await ClinicServ.find({
        query: {
          client: state.ClientModule.selectedClient._id,
          facility: user.currentEmployee.facilityDetail._id,
          $limit: 40,
          /*  $skip:page*limit, */
          $sort: {
            createdAt: -1,
          },
        },
      });
      const total = findClinic.total;
      // console.log(findClinic.data)
      setFacilities(findClinic.data);
    } else {
      if (user.stacker) {
        const findClinic = await ClinicServ.find({
          query: {
            client: state.ClientModule.selectedClient._id,
            facility: user.currentEmployee.facilityDetail._id,
            $limit: 20,
            $sort: {
              createdAt: -1,
            },
          },
        });
        setFacilities(findClinic.data);
      }
    }
  };
  // console.dir(facilities, {deep:null},"Facilities")

  const handleLabOrders = async () => {
    setShowLabModal(true);
    handleHideActions();
  };
  const handleNewVaccination = async () => {
    setShowVaccinationModal(true);
    handleHideActions();
  };

  const handleCharts = async () => {
    // setCurrentView("charts");
    setShowChartModal(true);
    handleHideActions();
  };

  const handleRadOrders = async () => {
    setShowRadModal(true);
    handleHideActions();
  };

  const handleEndEncounter = async () => {
    setShowEncounterModal(true);
    handleHideActions();
  };

  const handleUploadDocument = async () => {
    setUploadModal(true);
    handleHideActions();
  };
  // console.log(facilities,"facilities")

  useEffect(() => {
    getFacilities();
    const newDocumentClassModule = {
      selectedDocumentClass: {},
      show: 'list',
      encounter_right: false,
    };
    setState((prevstate) => ({
      ...prevstate,
      DocumentClassModule: newDocumentClassModule,
    }));
    ClinicServ.on('created', (obj) => getFacilities(page));
    ClinicServ.on('updated', (obj) => getFacilities(page));
    ClinicServ.on('patched', (obj) => getFacilities(page));
    ClinicServ.on('removed', (obj) => getFacilities(page));

    return () => {
      ClinicServ.removeAllListeners('created');
      ClinicServ.removeAllListeners('updated');
      ClinicServ.removeAllListeners('patched');
      ClinicServ.removeAllListeners('removed');
      const newDocumentClassModule = {
        selectedDocumentClass: {},
        show: 'list',
        encounter_right: false,
      };
      setState((prevstate) => ({
        ...prevstate,
        DocumentClassModule: newDocumentClassModule,
      }));
    };
  }, []);

  useEffect(() => {
    getFacilities();
  }, [state.ClientModule.selectedClient._id]);

  // Timer effect to update elapsed time every second
  useEffect(() => {
    let interval;
    if (encounterStarted && encounterStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((new Date() - encounterStartTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [encounterStarted, encounterStartTime]);

  const handleDelete = () => {
    showActionLoader();
    ClinicServ.remove(docToDelete._id)
      .then(() => {
        hideActionLoader();
        toast.success(`${docToDelete?.documentname} Deleted succesfully`);
        setSuccess(false);
        setConfirmationDialog(false);
      })
      .catch((err) => {
        hideActionLoader();
        toast.error('Error deleting Adult Asthma Questionnaire ' + err);
      });
  };

  const handleConfirmDelete = (doc) => {
    if (!user?.currentEmployee?.roles?.includes('Delete Documents'))
      return toast.error("You don't have permission to delete Documents");

    setDocToDelete(doc);
    setConfirmationDialog(true);
  };

  const closeConfirmationDialog = () => {
    setDocToDelete(null);
    setConfirmationDialog(false);
  };

  const handleCancel = async () => {
    const newDocumentClassModule = {
      selectedEndEncounter: '',
      show: '',
      encounter_right: false,
    };
    await setState((prevstate) => ({
      ...prevstate,
      EndEncounterModule: newDocumentClassModule,
    }));
  };

  const DocumentToRender = ({ Clinic, index }) => {
    // console.log(Clinic, "document ");

    switch (Clinic.documentname?.toLowerCase()) {
      case 'admission order': {
        return Clinic.status?.toLowerCase() !== 'draft' ? (
          <AdmissionOrderDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        ) : null;
      }
      case 'discharge order': {
        return Clinic?.status?.toLowerCase() !== 'draft' ? (
          <DischargeOrderComponent
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        ) : null;
      }

      case 'medication list': {
        return Clinic?.status?.toLowerCase() !== 'draft' ? (
          <MedicationListDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        ) : null;
      }

      case 'pediatric pulmonology form': {
        return Clinic?.status?.toLowerCase() !== 'draft' ? (
          <PediatricPulmonologyForm
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        ) : null;
      }
      case 'pediatric form': {
        return Clinic?.status?.toLowerCase() !== 'draft' ? (
          <PediatricForm
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        ) : null;
      }

      case 'adult asthma questionnaire': {
        return Clinic?.status?.toLowerCase() !== 'draft' ? (
          <AdultAthsmaQuestionaire
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        ) : null;
      }

      case 'prescription':
        return (
          <PrescriptionDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );

      case 'theatre orders':
        return (
          <TheatreDocument
            key={index}
            Clinic={Clinic}
            ref={(el) => {
              if (el) {
                myRefs.current[index] = el;
              }
            }}
          />
        );
      case 'radiology orders':
        return (
          <RadiologyOrdersDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'lab orders':
        return (
          <LabOrdersDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'billed orders':
        return (
          <BilledOrdersDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'laboratory result':
        return (
          <LaboratoryResultDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'pregnancy assessment':
        return (
          <PregnancyAssessmentDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'obstetrics assessment':
        return (
          <ObstetricsAssessmentDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'heamodialysis nursing care':
        return (
          <HeamodialysisNursingDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'sleep medicine referral form':
        return (
          <SleepMedicineReferralFormListDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'pediatric sleep study referral form':
        return (
          <PediatricSleepStudyReferralFormListDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'epworth sleepiness scale':
        return (
          <EpworthSleepinessScaleDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'sleep study authorization form':
        return (
          <SleepStudyAuthorizationDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'patient instruction for sleep study':
        return (
          <PatientInstructionForSleepDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'insurance details':
        return (
          <InsuranceDetailsDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'privacy and policies':
        return (
          <PrivacyAndPolicyDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'fatigue severity scale':
        return (
          <FatigueSeverityScaleDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );

      case 'sleep questionnaire':
        return (
          <SleepQuestionnaireDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'sleep questionnaire for spouse':
        return (
          <SleepQuestionnaireForSpouseDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'weekly sleep log':
        return (
          <WeeklySleepLogDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );

      case 'sleep history and intake':
        return (
          <SleepHistoryAndIntakeDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );

      case 'nurses continuation sheet':
        return (
          <NursesContinuationSheetDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      case 'nutrition and dietetics request form':
        return (
          <NutritionAndDieteticsRequestFormListDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );
      default:
        return null;
    }
  };

  const DocumentTypeToRender = ({ Clinic, index }) => {
    switch (Clinic.documentType?.toLowerCase()) {
      case 'laboratory result':
        return (
          <LaboratoryResultDocument
            Clinic={Clinic}
            ref={(el) => (myRefs.current[index] = el)}
          />
        );

      default:
        return null;
    }
  };
  const actionsList = [
    {
      title: 'Charts',
      action: handleCharts,
      show: !nopresc,
    },
    {
      title: 'Radiology Request',
      action: handleRadOrders,
      show: !nopresc,
    },
    {
      title: 'Laboratory Request',
      action: handleLabOrders,
      show: !nopresc,
    },
    {
      title: 'Prescription Request',
      action: handleNewPrescription,
      show: !nopresc,
    },
    {
      title: 'Vaccination Request',
      action: handleNewVaccination,
      show: !nopresc && isPureLife,
    },
    {
      title: 'Theatre Request',
      action: handleNewTheatre,
      show: !nopresc,
    },
    {
      title: 'End Encounter',
      action: handleEndEncounter,
      show: !nopresc,
    },
    {
      title: 'Upload New Document',
      action: handleUploadDocument,
      show: !nopresc,
    },
  ];

  const diagnosisTableColumns = [
    {
      name: 'S/N',
      key: 'sn',
      description: 'SN',
      selector: (row, i) => i + 1,
      sortable: true,
      inputType: 'HIDDEN',
      width: '50px',
    },
    {
      name: 'Type',
      key: 'sn',
      description: 'SN',
      selector: (row, i) => row.type,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Diagnosis',
      key: 'sn',
      description: 'SN',
      selector: (row, i) => row.diagnosis,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'ICD 11 Code',
      key: 'sn',
      description: 'SN',
      selector: (row, i) => row.Code,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'ICD11 Diagnosis',
      key: 'sn',
      description: 'SN',
      selector: (row, i) => row.Title,
      sortable: true,
      inputType: 'HIDDEN',
    },
  ];

  const columnSchema = [
    {
      name: 'S/N',
      key: 'sn',
      description: 'SN',
      selector: (row, i) => i + 1,
      sortable: true,
      inputType: 'HIDDEN',
      width: '50px',
    },
    {
      name: 'Type',
      key: 'sn',
      description: 'SN',
      selector: (row, i) => row['Diagnosis type'],
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'Diagnosis',
      key: 'sn',
      description: 'SN',
      selector: (row, i) => row.Diagnosis,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'ICD 11 Code',
      key: 'sn',
      description: 'SN',
      selector: (row, i) => row.Code,
      sortable: true,
      inputType: 'HIDDEN',
    },
    {
      name: 'ICD11 Diagnosis',
      key: 'sn',
      description: 'SN',
      selector: (row, i) => row.Title,
      sortable: true,
      inputType: 'HIDDEN',
    },
  ];

  return (
    <>
      <Box
        container
        sx={{
          flexGrow: '1',
        }}
      >
        <ModalBox
          open={uploadModal}
          onClose={() => setUploadModal(false)}
          header="Upload New Document"
        >
          <TemplateCreate closeModal={() => setUploadModal(false)} />
        </ModalBox>

        <CustomConfirmationDialog
          open={confirmationDialog}
          confirmationAction={() => handleDelete(docToDelete)}
          cancelAction={closeConfirmationDialog}
          type="danger"
          message={`You are about to delete a document: ${docToDelete?.documentname
            } created on ${dayjs(docToDelete?.createdAt).format('DD-MM-YYYY')} ?`}
        />
        <Box
          container
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
          mb={2}
        >
          <Box
            sx={{
              flex: '1',
              minWidth: '200px',
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
            sx={{
              width: '130px',
              flexShrink: 0,
            }}
          >
            <GlobalCustomButton
              color={encounterStarted ? 'error' : 'warning'}
              sx={{
                width: '100%',
              }}
              onClick={handleToggleEncounter}
            >
              {encounterStarted
                ? `End Encounter (${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, '0')})`
                : 'Start Encounter'}
            </GlobalCustomButton>
          </Box>

          {!nopresc && (
            <Box
              sx={{
                width: '130px',
                flexShrink: 0,
              }}
            >
              {activateCall && (
                <GlobalCustomButton
                  sx={{
                    width: '100%',
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
          )}

          <Box
            sx={{
              width: '130px',
              flexShrink: 0,
            }}
          >
            <GlobalCustomButton
              color="secondary"
              sx={{
                width: '100%',
              }}
              onClick={handleNewDocument}
            >
              New Document
            </GlobalCustomButton>
          </Box>

          {!nopresc && (
            <Box
              sx={{
                width: '130px',
                flexShrink: 0,
              }}
            >
              <GlobalCustomButton
                onClick={handleShowActions}
                variant="contained"
                sx={{
                  width: '100%',
                }}
                aria-controls={showActions ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={showActions ? 'true' : undefined}
              >
                Actions <ExpandMoreIcon />
              </GlobalCustomButton>

              <Menu
                id="basic-menu"
                anchorEl={showActions}
                open={open}
                onClose={handleHideActions}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {actionsList.map((action, i) => {
                  if (action.show) {
                    return (
                      <MenuItem
                        key={i}
                        onClick={action.action}
                        sx={{ fontSize: '0.8rem' }}
                      >
                        {action.title}
                      </MenuItem>
                    );
                  }
                })}
              </Menu>
            </Box>
          )}
        </Box>

        <Box
          container
          spacing={1}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box
            item
            sx={{
              width: !state.DocumentClassModule.encounter_right
                ? '100%'
                : 'calc(100% - 465px)',
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                width: '100%',
                height: 'calc(100vh - 180px)',
                overflowY: 'scroll',
              }}
            >
              {facilities.map((Clinic, i) => (
                <>
                  <Box
                    mb={1}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flexGrow: 1,
                      width: '100%',
                      cursor: 'pointer',
                      border: '1px solid rgba(235, 235, 235, 1)',
                      borderRadius: '5px',
                      height: 'auto',
                      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                    }}
                    key={i}
                    id={i}
                  >
                    <Box
                      container
                      sx={{
                        width: '100%',
                        minHeight: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#ffffff',
                        position: 'relative',
                      }}
                    >
                      <Box
                        item
                        //xs={2}
                        sx={{
                          borderRight: '1px solid rgba(235, 235, 235, 1)',
                          width: '150px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                        onClick={() => setSelectedClinic(Clinic)}
                      >
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            //lineHeight: "19.12px",
                            color: '#000000',
                          }}
                        >
                          {formatDistanceToNowStrict(
                            new Date(Clinic.createdAt),
                            {
                              addSuffix: true,
                            },
                          )}
                        </span>
                        <span
                          style={{
                            color: '#2d2d2d',
                            fontSize: '0.7rem',
                            fontWeight: '400',
                            // lineHeight: "16.39px",
                          }}
                        >
                          {format(
                            new Date(Clinic.createdAt),
                            'dd-MM-yy HH:mm:ss',
                          )}
                        </span>

                        <span />
                      </Box>

                      <Box
                        item
                        sx={{
                          display: 'flex',
                          width: 'calc(100% - 230px)',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}
                        p={0.5}
                        onClick={() => setSelectedClinic(Clinic)}
                      >
                        <Typography
                          mr={0.5}
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: '400',
                            // lineHeight: "19.12px",
                            color: '#000000',
                          }}
                        >
                          {/* heree */}
                          {Clinic.documentname} by {Clinic.createdByname} at{' '}
                          {Clinic.location},{Clinic.facilityname} -{' '}
                          <Typography
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: '400',
                              color: `${Clinic.status === 'completed'
                                ? 'green'
                                : 'orange'
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
                          width: '120px',
                          display: 'flex',
                          gap: '4px',
                        }}
                      >
                        {Clinic.status === 'completed' && !Clinic.show && (
                          <IconButton
                            sx={{
                              color: '#0364FF',
                            }}
                            onClick={() => handleRow(Clinic)}
                          >
                            <ArrowDownward fontSize="small" />
                          </IconButton>
                        )}

                        {Clinic.status === 'completed' && Clinic.show && (
                          <IconButton
                            sx={{
                              color: '#0364FF',
                            }}
                            onClick={() => handleRow(Clinic)}
                          >
                            <ArrowUpward fontSize="small" />
                          </IconButton>
                        )}

                        {Clinic.status !== 'completed' && (
                          <IconButton
                            sx={{
                              color: '#0364FF',
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
                                color: '#0364FF',
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

                  <Collapse in={Clinic.show}>
                    {Clinic.documentname !== 'Prescription' &&
                      Clinic.documentname !== 'Billed Orders' &&
                      Clinic.documentname !== 'Theatre Orders' &&
                      Clinic.documentname !== 'Obstetrics Assessment' &&
                      Clinic.documentname !== 'Heamodialysis Nursing Care' &&
                      Clinic.documentname !== 'Lab Orders' &&
                      Clinic.documentname !== 'Pregnancy Assessment' &&
                      Clinic.documentname !== 'Radiology Orders' &&
                      Clinic.documentname !== 'Adult Asthma Questionnaire' &&
                      Clinic.documentname !== 'Medication List' &&
                      Clinic.documentname !== 'Admission Order' &&
                      Clinic.documentname !== 'Discharge Order' &&
                      Clinic.documentname !== 'Pediatric Form' &&
                      Clinic.documentname !== 'Sleep Medicine Referral Form' &&
                      Clinic.documentname !==
                      'Pediatric Sleep Study Referral Form' &&
                      Clinic.documentname !== 'Epworth Sleepiness Scale' &&
                      Clinic.documentname !==
                      'Sleep Study Authorization Form' &&
                      Clinic.documentname !==
                      'Patient Instruction For Sleep Study' &&
                      Clinic.documentname !== 'Fatigue Severity Scale' &&
                      Clinic.documentname !== 'Sleep Questionnaire' &&
                      Clinic.documentname !==
                      'Sleep Questionnaire For Spouse' &&
                      Clinic.documentname !== 'Insurance Details' &&
                      Clinic.documentname !== 'Epworth Sleepiness Scale' &&
                      Clinic.documentname !== //adjustment here
                      'New Patient Consultation Form' &&
                      Clinic.documentname !== 'Privacy and Policies' &&
                      Clinic.documentname !== 'Sleep History And Intake' &&
                      Clinic.documentname !== 'Weekly Sleep Log' &&
                      Clinic.documentname !== 'Nurses Continuation Sheet' &&
                      Clinic.documentname !==
                      'Nutrition And Dietetics Request Form' &&
                      Clinic.documentname !== 'EchoCardio Form' &&
                      Clinic.documentType !== 'Laboratory Result' &&
                      Clinic.status !== 'Draft' && (
                        <div>
                          <Box sx={{ display: 'none' }}>
                            <DoctorsNotePrintOut
                              ref={(el) => (myRefs.current[i] = el)}
                              data={Clinic.documentdetail}
                              Clinic={Clinic}
                            />
                          </Box>
                          {Array.isArray(Clinic.documentdetail) ? (
                            Object.entries(Clinic.documentdetail)?.map(
                              ([keys, value], i) => {
                                return (
                                  <>
                                    <Box
                                      sx={{
                                        height: 'auto',
                                        width: '100%',
                                      }}
                                      key={i}
                                    >
                                      <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                          <Box
                                            sx={{
                                              display: 'flex',
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                color: '#03045e',
                                                marginRight: '5px',
                                              }}
                                            >
                                              {keys}:
                                            </Typography>

                                            <Typography
                                              sx={{
                                                fontSize: '0.75rem',
                                                color: '#000000',
                                              }}
                                            >
                                              {value}
                                            </Typography>
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  </>
                                );
                              },
                            )
                          ) : (
                            <div className="field">
                              <table
                                style={{
                                  width: '100%',
                                  borderCollapse: 'collapse',
                                }}
                              >
                                <thead>
                                  <tr>
                                    <th
                                      style={{
                                        backgroundColor: '#0E305D',
                                        color: '#ffffff',
                                        padding: '10px',
                                        textAlign: 'left',
                                        fontSize: 14,
                                      }}
                                    >
                                      Document Field
                                    </th>
                                    <th
                                      style={{
                                        backgroundColor: ' #0E305D',
                                        color: '#ffffff',
                                        padding: '10px',
                                        textAlign: 'left',
                                        fontSize: 14,
                                      }}
                                    >
                                      Field Values
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Object.entries(Clinic.documentdetail)?.map(
                                    ([keys, value], i) => {
                                      if (
                                        value === '' ||
                                        value === undefined ||
                                        value === null ||
                                        keys === 'DocumentUploadUrl'
                                      ) {
                                        return null;
                                      }
                                      return (
                                        <tr key={i}>
                                          <td
                                            style={{
                                              border: '1px solid #e0e0e0',
                                              padding: '10px',
                                              fontSize: 14,
                                            }}
                                          >
                                            {keys}
                                          </td>
                                          <td
                                            style={{
                                              border: '1px solid #e0e0e0',
                                              padding: '10px',
                                              fontSize: 13,
                                            }}
                                          >
                                            {keys === 'diagnosis' ||
                                              (keys === 'Eye diagnosis' &&
                                                Array.isArray(value)) ? (
                                              <Box>
                                                <CustomTable
                                                  title={''}
                                                  columns={
                                                    keys === 'diagnosis'
                                                      ? diagnosisTableColumns
                                                      : columnSchema
                                                  }
                                                  data={
                                                    Array.isArray(value)
                                                      ? value
                                                      : []
                                                  }
                                                  pointerOnHover
                                                  highlightOnHover
                                                  striped
                                                  progressPending={false}
                                                  CustomEmptyData={
                                                    <Typography
                                                      sx={{
                                                        fontSize: '0.8rem',
                                                      }}
                                                    >
                                                      You've not added a
                                                      Diagnosis yet...
                                                    </Typography>
                                                  }
                                                />
                                              </Box>
                                            ) : // Render the regular value
                                              value instanceof Object ? (
                                                JSON.stringify(value)
                                              ) : keys !== 'File' ? (
                                                value
                                              ) : (
                                                <a
                                                  href={
                                                    Clinic.documentdetail
                                                      .DocumentUploadUrl
                                                  }
                                                  target="_blank"
                                                >
                                                  {value}
                                                </a>
                                              )}
                                          </td>
                                        </tr>
                                      );
                                    },
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}

                    {Clinic?.documentType ? (
                      <Box sx={{ p: 2, borderTop: "1px solid #efefef" }}>
                        <Typography sx={{ fontSize: "0.80rem", fontWeight: "700", color: "#0064CC", mb: 1 }}>
                          Patient ID: {state.ClientModule.selectedClient?.hs_id || "N/A"}
                        </Typography>
                        <DocumentTypeToRender Clinic={Clinic} index={i} />
                      </Box>
                    ) : (
                      <Box sx={{ p: 2, borderTop: "1px solid #efefef" }}>
                        <Typography sx={{ fontSize: "0.80rem", fontWeight: "700", color: "#0064CC", mb: 1 }}>
                          Patient ID: {state.ClientModule.selectedClient?.hs_id || "N/A"}
                        </Typography>
                        <DocumentToRender Clinic={Clinic} index={i} />
                      </Box>
                    )}
                  </Collapse>
                </>
              ))}
            </Box>
          </Box>
          <Drawer
            anchor={'right'}
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
            <Box item sx={{ width: '650px' }}>
              <Box
                sx={{
                  width: '100%',
                  overflowY: 'scroll',
                  padding: '15px',
                }}
              >
                <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: "700", color: "#0064CC" }}>
                    Patient ID: {state.ClientModule.selectedClient?.hs_id || "N/A"}
                  </Typography>
                </Box>
                <EncounterRight client={chosenClient} />
              </Box>
            </Box>
          </Drawer>
        </Box>

        <>
          <ModalBox
            open={showModal}
            onClose={() => setShowModal(false)}
            header="Choose Document Class"
          >
            <DocumentClassList
              standalone="true"
              closeModal={() => setShowModal(false)}
            />
          </ModalBox>

          <ModalBox
            open={showChartModal}
            onClose={() => setShowChartModal(false)}
            header="Choose Chart"
            width="100%"
          >
            <Grid container spacing={6}>
              <Grid item xs={4}>
                <ChartClassList
                  standalone="true"
                  closeModal={() => setShowChartModal(false)}
                />
              </Grid>
              <Grid item xs={8}>
                {DOCUMENT_COMPONENTS[selectClassName] ? (
                  React.createElement(DOCUMENT_COMPONENTS[selectClassName])
                ) : (
                  <div>No component available for the selected class</div>
                )}
              </Grid>
            </Grid>
          </ModalBox>

          <ModalBox
            open={showPrescriptionModal}
            onClose={() => setShowPrescriptionModal(false)}
            header="Prescription"
          >
            <Prescription standalone="true" />
          </ModalBox>

          <ModalBox
            open={showTheatreModal}
            onClose={() => setShowTheatreModal(false)}
            header="Theatre"
          >
            <TheatreRequest standalone="true" />
          </ModalBox>

          <ModalBox
            open={showVaccinationModal}
            onClose={() => setShowVaccinationModal(false)}
            header="Vaccination"
          >
            <Vaccination standalone={true} />
          </ModalBox>

          <ModalBox
            open={showLabModal}
            onClose={() => setShowLabModal(false)}
            header="Laboratory Orders"
          >
            <LabOrders
              standalone="true"
              closeModal={() => setShowLabModal(false)}
            />
          </ModalBox>

          <ModalBox
            open={showEncounterModal}
            onClose={() => setShowEncounterModal(false)}
            header="End Encounter"
          >
            <EndEncounterList
              standalone="true"
              closeModal={() => setShowEncounterModal(false)}
            />
          </ModalBox>

          <ModalBox
            open={
              state.EndEncounterModule.selectedEndEncounter === 'Admit to Ward'
            }
            onClose={() => handleCancel()}
            header="Admit Orders"
          >
            <section className="modal-card-body card-overflow">
              <AdmitOrders
                standalone="true"
                closeModal={() => handleCancel()}
              />
            </section>
          </ModalBox>

          <ModalBox
            open={state.EndEncounterModule.selectedEndEncounter === 'Discharge'}
            onClose={() => handleCancel()}
            header="Discharge Orders"
          >
            <DischargeOrders
              standalone="true"
              closeModal={() => handleCancel()}
            />
          </ModalBox>

          <ModalBox
            open={
              state.EndEncounterModule.selectedEndEncounter ===
              'Set Next Appointment'
            }
            onClose={() => handleCancel()}
            header="Set Next Appointment"
          >
            <DocumentationScheduleAppointment />
          </ModalBox>

          <ModalBox
            open={showRadModal}
            onClose={() => setShowRadModal(false)}
            header="Radiology Orders"
          >
            <RadiologyOrders
              standalone="true"
              closeModal={() => setShowRadModal(false)}
            />
          </ModalBox>
        </>
      </Box>
    </>
  );
}
