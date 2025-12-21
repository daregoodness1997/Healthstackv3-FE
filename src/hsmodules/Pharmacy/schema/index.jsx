import { Typography, IconButton } from "@mui/material";
import styled from "styled-components";
import { format } from "date-fns";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";

export const InventoryStoreSchema = [
  {
    name: "S/N",
    key: "_id",
    description: "",
    selector: (row) => row.sn,
    sortable: true,
    required: true,
    inputType: "HIDDEN",
    width: "50px",
  },
  {
    name: "product",
    key: "product",
    description: "Enter product",
    //selector: row => row.name,
    selector: (row) => (
      <Typography
        sx={{ fontSize: "0.69rem", whiteSpace: "normal", color: "#000000" }}
        data-tag="allowRowEvents"
      >
        {row.name}
      </Typography>
    ),
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Quantity",
    key: "quantity",
    description: "Enter quantity",
    selector: (row) => row.quantity,

    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Base Unit",
    key: "baseunit",
    description: "Enter baseUnit",
    selector: (row) => row.baseunit,
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Stock Value",
    key: "stockvalue",
    description: "Enter Stock value",
    selector: (row) => row.stockvalue, //"stockvalue",
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Cost Price",
    key: "costprice",
    description: "Enter cost price",
    selector: (row) => row.costprice,
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Sell Price",
    key: "sellingprice",
    description: "Enter Selling Price",
    selector: (row) => row.sellingprice,
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Reorder level",
    key: "reorder_level",
    description: "Enter Re-order Level",
    selector: (row) => (row.reorder_level ? row.reorder_level : "Unspecified"),
    sortable: true,
    required: true,
    inputType: "TEXT",
    center: true,
  },
  {
    name: "Expiry",
    key: "Expiry",
    description: "Enter Expiry",
    selector: (row) =>
      row.expiry ? (
        <div
          style={{
            color: "red",
            //fontSize: "1.3rem",
            fontWeight: "700",
          }}
        >
          Expired
        </div>
      ) : (
        ""
      ),
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
];

export const ExpiredInventoryStoreSchema = [
  {
    name: "S/N",
    key: "_id",
    description: "",
    selector: (row) => row.sn,
    sortable: true,
    required: true,
    inputType: "HIDDEN",
    width: "50px",
  },
  {
    name: "Product",
    key: "product",
    description: "Enter product",
    //selector: row => row.name,
    selector: (row) => (
      <Typography
        sx={{ fontSize: "0.69rem", whiteSpace: "normal", color: "#000000" }}
        data-tag="allowRowEvents"
      >
        {row.name}
      </Typography>
    ),
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Quantity",
    key: "quantity",
    description: "Enter quantity",
    selector: (row) => row.quantity,

    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Batch No",
    key: "batchNo",
    description: "Enter batch no",
    selector: (row) => row.batchNo,
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
  {
    name: "Expiry Date",
    key: "stockvalue",
    description: "Enter Stock value",
    //selector: (row) => row.stockvalue, //"stockvalue",
    selector: (row) =>
      row.expiryDate
        ? format(new Date(row.expiryDate), "dd-MM-yy")
        : "--------",
    sortable: true,
    required: true,
    inputType: "TEXT",
  },

  {
    name: "Status",
    key: "Expiry",
    description: "Enter Expiry",
    selector: (row) =>
      row.status === "Expired" ? (
        <div
          style={{
            color: "red",
            //fontSize: "1.3rem",
            fontWeight: "700",
          }}
        >
          Expired
        </div>
      ) : (
        <div
          style={{
            color: "green",
            //fontSize: "1.3rem",
            fontWeight: "700",
          }}
        >
          Near Expiration
        </div>
      ),
    sortable: true,
    required: true,
    inputType: "TEXT",
    // cell: row => (
    //   <StyledCell className={getCssClass(row.expiry)}>{row.expiry}</StyledCell>
    // ),
  },

  {
    name: "Actions",
    key: "costprice",
    width: "70px",
    description: "costprice",
    selector: (row, i) => (
      <IconButton
        size="small"
        //onClick={() => removeEntity(row, i)}
      >
        <BorderColorOutlinedIcon fontSize="small" />
      </IconButton>
    ),
    sortable: true,
    required: true,
    inputType: "TEXT",
  },
];
