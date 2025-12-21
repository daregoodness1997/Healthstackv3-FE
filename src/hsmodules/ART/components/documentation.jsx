import React, { useState } from "react";
import { Box, Menu, MenuItem } from "@mui/material";
import Input from "../../../components/inputs/basic/Input";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import VideoConference from "../../utils/VideoConference";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChooseDocument from "./profileMgt/chooseDocument";

export default function Documentation() {
  const [showActions, setShowActions] = useState(null);
  const [activateCall, setActivateCall] = useState(false);
  const [showChooseDocument, setShowChooseDocument] = useState(false);

  const open = Boolean(showActions);

  const handleShowActions = () => {
    setShowActions(null);
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

  const actionsList = [
    {
      title: "Charts",
    },
    {
      title: "Radiology Request",
    },
    {
      title: "Laboratory Request",
    },
    {
      title: "Prescription Request",
    },
    {
      title: "Theatre Request",
    },
    {
      title: "End Encounter",
    },
    {
      title: "Upload New Document",
    },
  ];

  const handleSearch = (value) => {
    console.log(value);
  };

  return (
    <div>
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
          item
          sx={{
            width: "calc(100% - 350px - 180px)",
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
              aria-controls={showActions ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={showActions ? "true" : undefined}
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
                  // onClick={action.action}
                  sx={{ fontSize: "0.8rem" }}
                >
                  {action.title}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </Box>
      </Box>
    </div>
  );
}
