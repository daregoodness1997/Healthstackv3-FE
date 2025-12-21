import React, { useState } from "react";
import ModalBox from "../../../../components/modal";
import CustomTable from "../../../../components/customtable";
import { TableMenu } from "../../../../ui/styled/global";
import { Box } from "@mui/material";
import FilterMenu from "../../../../components/utilities/FilterMenu";
import { Drawer } from "@mui/material";
import AgonistProtocol from "./documents/agonistProtocol";
import AntagonistProtocol from "./documents/antagonistProtocol";
import RecipientTreatmentForm from "./documents/recipientTreatmentForm";
import InseminationForm from "./documents/inseminationForm";
import LaboratoryTreatment from "./documents/laboratoryTreatment";
import AspirationNotice from "./documents/aspirationNotice";
import Sonohysterogram from "./documents/sonohysterogram";
import TreatmentSummary from "./documents/treatmentSummary";
import VitalSignForm from "./documents/vitaSigns";
import CounsellorNoteCreate from "./documents/counsellorNote";
import DoctorNoteCreate from "./documents/doctorNote";
import NurseNoteCreate from "./documents/nurseNote";
import TesticularSperm from "./documents/testicularSperm";
import PreTreatmentAssessmentForm from "./documents/preTreatmentAssessment";
import ReviewOfResultsCreate from "./documents/reviewResults";
import ExaminationAndTransvaginalScan from "./documents/examinationAndTranvaginal";
import RoutineScanAndExamination from "./documents/routineScan";
import SpecialNeed from "./documents/specialNeed";
import EndometrialScratching from "./documents/endometrialScratching";

export default function ChooseDocument({ open, onClose }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const data = [
    {
      name: "Agonist Protocol",
      component: <AgonistProtocol />,
    },
    {
      name: "Antagonist Protocol",
      component: <AntagonistProtocol />,
    },
    {
      name: "Recipient treatment Form",
      component: <RecipientTreatmentForm />,
    },
    {
      name: "Intrauterine Insemination (IUI) Form",
      component: <InseminationForm />,
    },
    {
      name: "Aspiration Notice",
      component: <AspirationNotice />,
    },
    {
      name: "Laboratory Treatment",
      component: <LaboratoryTreatment />,
    },
    {
      name: "Sonohysterogram",
      component: <Sonohysterogram />,
    },
    {
      name: "Treatment Summary",
      component: <TreatmentSummary />,
    },
    {
      name: "Vital Signs",
      component: <VitalSignForm />,
    },
    {
      name: "Doctor Note",
      component: <DoctorNoteCreate />,
    },
    {
      name: "Nurse Note",
      component: <NurseNoteCreate />,
    },
    {
      name: "Counsellor Note",
      component: <CounsellorNoteCreate />,
    },
    {
      name: "Testicular Sperm",
      component: <TesticularSperm />,
    },
    {
      name: "PreTreatment Assessment",
      component: <PreTreatmentAssessmentForm />,
    },
    {
      name: "Review Of Results And IVF Discussion",
      component: <ReviewOfResultsCreate />,
    },
    {
      name: "Examination And Transvaginal Scan",
      component: <ExaminationAndTransvaginalScan />,
    },
    {
      name: "Routine Scan And Examination",
      component: <RoutineScanAndExamination />,
    },
    {
      name: "Special Need",
      component: <SpecialNeed />,
    },
    {
      name: "Endometrial Scratching",
      component: <EndometrialScratching />,
    },
  ];

  const columns = [
    {
      name: "S/N",
      key: "sn",
      selector: (row, i) => i + 1,
      sortable: true,
      width: "50px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
  ];

  const handleSearch = (value) => {
    console.log(value);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setDrawerOpen(true);
    onClose();
  };

  const renderDrawerContent = () => (
    <Box sx={{ padding: 2 }}>{selectedRow && selectedRow.component}</Box>
  );

  return (
    <>
      <ModalBox open={open} onClose={onClose} header="Choose Document">
        <Box
          sx={{
            maxHeight: "80vh",
            maxWidth: "600px",
          }}
        >
          <TableMenu>
            <div style={{ display: "flex", alignItems: "center" }}>
              {handleSearch && (
                <div className="inner-table">
                  <FilterMenu onSearch={(e) => handleSearch(e.target.value)} />
                </div>
              )}
            </div>
          </TableMenu>

          <CustomTable
            title={""}
            columns={columns}
            data={data}
            pointerOnHover
            highlightOnHover
            striped
            onRowClicked={handleRowClick}
            progressPending={false}
          />
        </Box>
      </ModalBox>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: "50%",
            maxWidth: "500px",
          },
        }}
      >
        {renderDrawerContent()}
      </Drawer>
    </>
  );
}
