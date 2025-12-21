import React from "react";
import { Typography } from "@mui/material";

interface componentProps {
  text: string | number;
  color?: string;
  fontWeight?: string;
  textTransform?: string;
}

const FormsHeaderText = ({
  text,
  color = "#0064CC",
  fontWeight,
  textTransform,
}: componentProps) => {
  return (
    <Typography
      sx={{
        color: color,
        textTransform: textTransform ? textTransform : "uppercase",
        fontWeight: fontWeight ? fontWeight : "800",
        fontSize: "0.80rem !important",
        lineHeight: "28px",
        //marginBottom: "10px",
      }}
    >
      {text}
    </Typography>
  );
};

export default FormsHeaderText;
