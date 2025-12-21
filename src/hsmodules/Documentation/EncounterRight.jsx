/* eslint-disable */
import React, { useContext } from 'react';

import AsthmaIntake from './AsthmaIntake';
//import PulmonologyIntake from './Pulmonology'
import NewPatientConsult from './NewPatientConsult';
import PreventiveCare from './PreventiveCare';
import MedicalScreeningForm from './PhysiotherapyScreening';
import ProgressNote from './ProgressNote';
import MedicationList from './MedicationList';
import Clerking from './Clerking';
import AdmissionConsentForm from '../clientForm/forms/admissionConsentForm';
import BinCard from '../clientForm/forms/binCard';
import DailyShiftHandoverNote from '../clientForm/forms/dailyShiftHandoverNote';
import DamaForm from '../clientForm/forms/damaForm';
import DietOrder from '../clientForm/forms/dietOrder';
//import DischargeSummary from '../clientForm/forms/dischargeSummary'
import ECGForm from '../clientForm/forms/ecgForm';
import EmergencyForm from '../clientForm/forms/emergencyForm';
import GreenDiagnosticCentre from '../clientForm/forms/greenDiagnosticCentre';
import MedicalBillingSheet from '../clientForm/forms/medicalBillingSheet';
import LaboratoryReportForm from '../clientForm/forms/laboratoryReportFormOld';
import MedicalSickLeave from '../clientForm/forms/medicalSickLeave';
import OutpatientBillingSheet from '../clientForm/forms/outpatientBillingSheet';
import OutpatientRegistrationForm from '../clientForm/forms/outpatientRegistrationForm';
import PatientAppointmentCard from '../clientForm/forms/patientAppointmentCard';
import PaymentVoucher from '../clientForm/forms/paymentVoucher';
import RadiologyRequestForm from '../clientForm/forms/radiologyRequestForm';
import Receipt from '../clientForm/forms/receipt';
import ReferralFormForConsultation from '../clientForm/forms/referralFormForConsultation';
import VitalSignsFlowSheet from '../clientForm/forms/vitalSignsFlowSheet';
import VitalSignsRecord from '../clientForm/forms/vitalSignsRecord';
import DentalLab from './DentalLab';
import PhysiotherapyHistory from './PhysiotherapyHistory';
import SurgicalBookletConsentForm from '../clientForm/forms/surgicalBookletConsentForm';
import AgonistProtocol from '../ART/components/profileMgt/documents/agonistProtocol';
import AntagonistProtocol from '../ART/components/profileMgt/documents/antagonistProtocol';
import RecipientTreatmentForm from '../ART/components/profileMgt/documents/recipientTreatmentForm';
import InseminationForm from '../ART/components/profileMgt/documents/inseminationForm';
import Sonohysterogram from '../ART/components/profileMgt/documents/sonohysterogram';
import VitalSignForm from '../ART/components/profileMgt/documents/vitaSigns';
import CounsellorNoteCreate from '../ART/components/profileMgt/documents/counsellorNote';
import LaboratoryTreatment from '../ART/components/profileMgt/documents/laboratoryTreatment';
import AspirationNotice from '../ART/components/profileMgt/documents/aspirationNotice';
import TreatmentSummary from '../ART/components/profileMgt/documents/treatmentSummary';
import NurseNoteCreate from '../ART/components/profileMgt/documents/nurseNote';
import DoctorNoteCreate from '../ART/components/profileMgt/documents/doctorNote';
import TesticularSperm from '../ART/components/profileMgt/documents/testicularSperm';
import PreTreatmentAssessmentForm from '../ART/components/profileMgt/documents/preTreatmentAssessment';
import HeamodialysisNursingCarePlan from './Heamodialysis';
import ObstetricsAssessment from './Obstetrics Assessment';
import PregnancyAssessment from './parentAssessment';
import ReviewOfResultsCreate from '../ART/components/profileMgt/documents/reviewResults';
import RoutineScanAndExamination from '../ART/components/profileMgt/documents/routineScan';
import SpecialNeed from '../ART/components/profileMgt/documents/specialNeed';
import EndometrialScratching from '../ART/components/profileMgt/documents/endometrialScratching';
import ExaminationAndTransvaginalScan from '../ART/components/profileMgt/documents/examinationAndTranvaginal';
import SleepMedicineReferral from './SleepMedicineReferral';
import PediatricSleepStudyReferral from './PediatricSleepStudyReferral';
import EpworthSleepinessScale from './EpworthSleepinessScale';
import SleepStudyAuthorization from './SleepStudyAuthorization';
import PatientInstructionForSleepStudy from './PatientInstructionForSleepStudy';
import InsuranceDetails from './InsuranceDetails';
import PrivacyAndPolicy from './PrivacyAndPolicy';
import SleepHistoryAndIntake from './SleepHistoryAndIntake';
import FatigueSeverityScale from './FatigueSeverityScale';
import SleepQuestionnaire from './SleepQuestionniare';
import SleepQuestionnaireForSpouse from './SleepQuestionniareForSpouse';
import WeeklySleepLog from './WeeklySleepLog';
import VitalSignCreate from './VitalSignCreate';
import ClinicalNoteCreate from './ClicnicalNote';
import FearAvoidanceBeliefsQuestionnaireCreate from './ FearAvoidanceBeliefsQuestionnaireCreate';
import { BackPainQuestionnaireCreate } from './BackPainQuestionnaireCreate';
//import { EyeExamination } from './EyeExamination'
import { DentalClinic } from './DentalClinic';
import { OrthodonticAnalysis } from './OrthodonticAnalysis';
import { NursingNoteCreate } from './NursingNoteCreate';
import { DoctorsNoteCreate } from './DoctorsNoteCreate';
import { OperationNoteCreate } from './OperationNoteCreate';
import LabNoteCreate from './LabNoteCreate';
import { ObjectContext } from '../../context';
import NursesContinuationSheet from './NursesContinuationSheet';
import ClerkingForm from './ClerkingForm';
import DischargeSummary from './DischargeSummary';
//import DischargeSummary from "./DischargeSummary";
import MedicalExaminationForm from './MedicalExamination';
import SurgicalCasesPage from './Postop';
import ENT from './ENT';
import PediatricForm from './PediatricForm';
import PrimaryAssessmentOfPregnancyForm from './PregnancyAssessment';
import ObstetricsServices from './ObstetricsService';
import EyeExamination from './EyeExamination';
import DietaryRequestForm from './DietaryRequestForm';
import TheatreOperationListForm from './TheatreOperationList';
import CaesareanSectionForm from './CaesareanSection';
import OperationRegisterForm from './OperationRegister';
import NutritionAndDieteticsRequestForm from './Nutrition/index';
import PreventiveUnit from './Preventive unit';
import EyeDoctorsNote from './EyeDoctorsNote';
import EyeConsultation from './EyeConsultation';
import LensPrescription from './LensPrescription';
import VisualAcuity from './VisualAcuity';
import Pachymetry from './Pachymetry';
import VitalSignChart from '../clientForm/forms/vitalSignChart';
import LaboratoryObservationChart from '../clientForm/forms/laboratoryObservationChart';
import PressureAreasTreatmentChart from '../clientForm/forms/pressureAreasTreatmentChart';
import FluidIntakeOutput from '../clientForm/forms/fluidIntake';
import DialysisLogSheet from '../clientForm/forms/dialysisLogSheet';
import ContinuationSheet from '../clientForm/forms/continuationSheet';
import EchoCardioForm from './Echocardiogram';
import MedicalScreenForm from './MedicalScreenForm';
import QuickDashForm from './QuickDash';
import LEFSForm from './LEFSForm';
import ModifiedOswestryForm from './ModifiedOswestryForm';
import NeckDisabilityIndexForm from './NeckDisabilityIndexForm';
import NeuroPhysioAssessmentForm from './NeurologicalPhysiotherapyForm';
import FIMAssessmentForm from './FIMAssessmentForm';
import BergBalanceScaleForm from './BergBalanceScaleForm';
import OsteoporosisBoneHealth from './OsteoporosisBoneHealth';
import IntegratedBoneMgtInfo from './IntegratedBoneMgtInfo';

const SUBMIT_DOCUMENT_COMPONENTS = {
  'Laboratory Report Form': LaboratoryReportForm,
  'Green Diagnostic Center Request': GreenDiagnosticCentre,
  'Admission Consent Form': AdmissionConsentForm,
  'Bin Card': BinCard,
  'Outpatient Registration Form': OutpatientRegistrationForm,
  'Outpatient Billing Sheet': OutpatientBillingSheet,
  'Medical Sick Leave Form': MedicalSickLeave,
  'Daily Shift Handover Note': DailyShiftHandoverNote,
  'EchoCardio Form': EchoCardioForm,
  'Dama Form': DamaForm,
  'Inpatient Billing Sheet': MedicalBillingSheet,
  'Emergency Form': EmergencyForm,
  //"Discharge Summary": DischargeSummary,
  'Diet Order': DietOrder,
  'Ecg Form': ECGForm,
  'Vital Signs Flow Sheet': VitalSignsFlowSheet,
  'Referral Form For Consultation': ReferralFormForConsultation,
  Receipt: Receipt,
  'Radiology Request Form': RadiologyRequestForm,
  // 'Pressure Areas Treatment Chart': PressureAreasTreatmentChart,
  'Payment Voucher': PaymentVoucher,
  'Surgical Booklet Consent Form': SurgicalBookletConsentForm,
  'Vital Signs Record': VitalSignsRecord,
  'Patient Appointment Card': PatientAppointmentCard,
  'Dental Clinic': DentalClinic,
  'Orthodontic Analysis': OrthodonticAnalysis,
  'Anc Followup Form': PrimaryAssessmentOfPregnancyForm,
  'Nursing Processing': MedicalExaminationForm,
  'Anc Booking Form': ObstetricsServices,
  'Medical Screening': MedicalScreenForm,
  'QuickDash Outcome Measure': QuickDashForm,
  'Lower Extremity Functional Scale': LEFSForm,
  'Modified Oswestry': ModifiedOswestryForm,
  'Neck Disability Index': NeckDisabilityIndexForm,
  'Neurological Physiotherapy': NeuroPhysioAssessmentForm,
  'Functional Independence Measure': FIMAssessmentForm,
  'Berg Balance Scale': BergBalanceScaleForm,
  'Osteoporosis and Bone Health': OsteoporosisBoneHealth,
};


const DOCUMENT_COMPONENTS = {
  'Vital Signs': VitalSignCreate,
  'Vital Signs Chart': VitalSignChart,
  'Labour Observation Chart': LaboratoryObservationChart,
  'Pressure Areas Treatment Chart': PressureAreasTreatmentChart,
  'Fluid Intake And Output Chart': FluidIntakeOutput,
  'Dialysis Log Sheet': DialysisLogSheet,
  'Continuation Sheet': ContinuationSheet,
  'Vital Sign': VitalSignForm,
  'Agonist Protocol': AgonistProtocol,
  'Aspiration Notice': AspirationNotice,
  'Laboratory Treatment': LaboratoryTreatment,
  'Obstetrics Assessment': ObstetricsAssessment,
  Sonohysterogram: Sonohysterogram,
  'Caesarean Section': CaesareanSectionForm,
  'Treatment Summary': TreatmentSummary,
  'Theatre Operation List': TheatreOperationListForm,
  'Intrauterine Insemination': InseminationForm,
  'Antagonist Protocol': AntagonistProtocol,
  'Recipient Treatment': RecipientTreatmentForm,
  'Clinical Note': ClinicalNoteCreate,
  'Preventive Unit': PreventiveUnit,
  'Eye Doctor Note': EyeDoctorsNote,
  'Eye Consultation': EyeConsultation,
  'Lens Prescription': LensPrescription,
  'Visual Acuity': VisualAcuity,
  'Pachymetry/Pulpillary Distance': Pachymetry,
  'Ear,Nose & Throat': ENT,
  'Testicular Sperm': TesticularSperm,
  'Lab Result': LabNoteCreate,
  'Nurse Note': NurseNoteCreate,
  'Pre Treatment Assessment': PreTreatmentAssessmentForm,
  'Nursing Note': NursingNoteCreate,
  'Counsellor Note': CounsellorNoteCreate,
  'Doctors Note': DoctorNoteCreate,
  'Doctor Note': DoctorsNoteCreate,
  'Operation Note': OperationNoteCreate,
  'Pregnancy Assessment': PregnancyAssessment,
  'Operation Register': OperationRegisterForm,
  // Prescription: PrescriptionCreate,
  // "Diagnostic Request": LabrequestCreate,
  'Adult Asthma Questionnaire': AsthmaIntake,
  'Pediatric Form': PediatricForm,
  'New Patient Consultation Form': NewPatientConsult,
  'Progress Note': ProgressNote,
  'Medication List': MedicationList,
  'Nutrition And Dietetics Request Form': NutritionAndDieteticsRequestForm,
  Clerking: Clerking,
  'Clerking Form': ClerkingForm,
  'Discharge Summary': DischargeSummary,
  'Review Of Results': ReviewOfResultsCreate,
  'Examination And Transvaginal Scan': ExaminationAndTransvaginalScan,
  'Routine Scan And Examination': RoutineScanAndExamination,
  'Special Need': SpecialNeed,
  'Endometrial Scratching': EndometrialScratching,
  'Heamodialysis Nursing Care': HeamodialysisNursingCarePlan,
  'Sleep Medicine Referral Form': SleepMedicineReferral,
  'Pediatric Sleep Study Referral Form': PediatricSleepStudyReferral,
  'Epworth Sleepiness Scale': EpworthSleepinessScale,
  'Sleep Study Authorization Form': SleepStudyAuthorization,
  'Patient Instruction For Sleep Study': PatientInstructionForSleepStudy,
  'Insurance Details': InsuranceDetails,
  'Privacy and Policies': PrivacyAndPolicy,
  'Sleep History And Intake': SleepHistoryAndIntake,
  'Fatigue Severity Scale': FatigueSeverityScale,
  'Sleep Questionnaire': SleepQuestionnaire,
  'Sleep Questionnaire For Spouse': SleepQuestionnaireForSpouse,
  'Weekly Sleep Log': WeeklySleepLog,
  'Eye Examination': EyeExamination,
  'Preventive Care': PreventiveCare,
  'Dental Lab': DentalLab,
  'Surgical Cases': SurgicalCasesPage,
  'Nurses Continuation Sheet': NursesContinuationSheet,
  'Physiotherapy Medical Screening': MedicalScreeningForm,
  'Physiotherapy History & Interview Form': PhysiotherapyHistory,
  'Back Pain Questionnaire': BackPainQuestionnaireCreate,
  'Fear-Avoidance Beliefs Questionnaire (FABQ)':
    FearAvoidanceBeliefsQuestionnaireCreate,
  'Nutrition & Dietetics Form': DietaryRequestForm,
  'Integrated Bone Mgt (IBM) Info': IntegratedBoneMgtInfo,
};

export default function EncounterRight() {
  const { state } = useContext(ObjectContext);

  const submitDocument = (data) => {
    const geolocation = {
      type: 'Point',
      coordinates: [state.coordinates.latitude, state.coordinates.longitude],
    };
    // console.log({ ...data, geolocation: geolocation });

    toast.error('Sorry, form is currently under upgrade');
  };

  const selectedDocument = state.DocumentClassModule.selectedDocumentClass.name;

  if (
    state.DocumentClassModule.selectedDocumentClass.document?.documentType ===
    'Diagnostic Result'
  ) {
    return <LabNoteCreate />;
  }

  if (SUBMIT_DOCUMENT_COMPONENTS[selectedDocument]) {
    const Component = SUBMIT_DOCUMENT_COMPONENTS[selectedDocument];
    return <Component onSubmit={submitDocument} />;
  }

  if (DOCUMENT_COMPONENTS[selectedDocument]) {
    const Component = DOCUMENT_COMPONENTS[selectedDocument];
    return <Component />;
  }

  return null;
}


