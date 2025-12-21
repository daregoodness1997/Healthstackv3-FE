/* eslint-disable */
import React from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Box, Grid, Typography } from "@mui/material";
import CustomTable from "../../../components/customtable";
import Input from "../../../components/inputs/basic/Input";
import { FormsHeaderText } from "../../../components/texts";
import moment from "moment";
import Textarea from "../../../components/inputs/basic/Textarea";
import dayjs from "dayjs";

export const DrugAdminHistory = ({ currentMed }) => {
  const historyColumns = [
    {
      name: "S/N",
      key: "sn",
      description: "SN",
      selector: (row) => row.sn,
      sortable: true,
      inputType: "HIDDEN",
      width: "50px",
    },

    {
      name: "Date/Time",
      key: "Date",
      description: "date",
      selector: (row) => dayjs(row?.createdAt).format("DD-MM-YYYY"),
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "100px",
    },

    {
      name: "Action",
      key: "action",
      description: "action",
      selector: (row) => row.action,
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "100px",
    },

    {
      name: "Comments",
      key: "comments",
      description: "comments",
      selector: (row) => row.comments,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Personel",
      key: "status",
      description: "status",
      selector: (row) => row.actorname,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
  ];

  return (
    <>
      <Box
        sx={{
          width: "800px",
          display: "flex",
          flexDirection: "column",
        }}
        gap={1.5}
      >
        <Box>
          <FormsHeaderText text={currentMed.order} />
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Input
              label="Ordered By"
              defaultValue={currentMed.requestingdoctor_Name}
              disabled={true}
            />
          </Grid>

          <Grid item xs={6}>
            <Input
              label="Time Ordered"
              defaultValue={`${formatDistanceToNowStrict(
                new Date(currentMed.createdAt),
                {
                  addSuffix: true,
                }
              )}-${moment(currentMed.createdAt).format("L")}`}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12}>
            <Textarea
              label="Intructions"
              defaultValue={currentMed.instruction}
              disabled={true}
            />
          </Grid>
        </Grid>

        {currentMed.hasOwnProperty("treatment_action") && (
          <Box>
            <CustomTable
              title={""}
              columns={historyColumns}
              data={currentMed.treatment_action}
              //onRowClicked={handleRow}
              pointerOnHover
              highlightOnHover
              striped
              CustomEmptyData={
                <Typography sx={{ fontSize: "0.8rem" }}>
                  No Drug Admin History listed......
                </Typography>
              }
            />
          </Box>
        )}
      </Box>
    </>
  );
};
