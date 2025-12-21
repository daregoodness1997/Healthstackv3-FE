/* eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import client from "../../../feathers";
import { UserContext, ObjectContext } from "../../../context";
import { toast } from "react-toastify";
import { format } from "date-fns";

import { Box, Typography } from "@mui/material";
import FilterMenu from "../../../components/utilities/FilterMenu";
import CustomTable from "../../../components/customtable";
import { TableMenu } from "../../../ui/styled/global";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function TheatreRequestList({ standalone }) {
  // const { register, handleSubmit, watch, errors } = useForm();

  const [error, setError] = useState(false);

  const [success, setSuccess] = useState(false);

  const [message, setMessage] = useState("");
  const OrderServ = client.service("order");
  //const navigate=useNavigate()
  // const {user,setUser} = useContext(UserContext)
  const [facilities, setFacilities] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(); //

  const { state, setState } = useContext(ObjectContext);

  const { user, setUser } = useContext(UserContext);

  const handleCreateNew = async () => {
    const newProductEntryModule = {
      selectedOrder: {},
      show: "create",
    };
    await setState((prevstate) => ({
      ...prevstate,
      OrderModule: newProductEntryModule,
    }));
    //console.log(state)
  };

  const handleDelete = (doc) => {
    // console.log(doc)
    let confirm = window.confirm(
      `You are about to delete the Theatre: ${doc.order}?`
    );
    if (confirm) {
      OrderServ.remove(doc._id)
        .then((res) => {
          toast({
            message: "Theatre deleted succesfully",
            type: "is-success",
            dismissible: true,
            pauseOnHover: true,
          });
          setSuccess(false);
        })
        .catch((err) => {
          toast({
            message: "Error deleting Theatre" + err,
            type: "is-danger",
            dismissible: true,
            pauseOnHover: true,
          });
        });
    }
  };

  const handleRow = async (ProductEntry) => {
    //console.log("b4",state)

    //console.log("handlerow",ProductEntry)
    if (!standalone) {
      await setSelectedOrder(ProductEntry);

      const newProductEntryModule = {
        selectedOrder: ProductEntry,
        show: "detail",
      };
      await setState((prevstate) => ({
        ...prevstate,
        OrderModule: newProductEntryModule,
      }));
      //console.log(state)
    }
  };

  const handleSearch = (val) => {
    const field = "name";

    OrderServ.find({
      query: {
        $or: [
          {
            order: {
              $regex: val,
              $options: "i",
            },
          },
          {
            order_status: {
              $regex: val,
              $options: "i",
            },
          },
        ],
        order_category: "Theatre Order",
        // storeId:state.StoreModule.selectedStore._id,
        //facility:user.currentEmployee.facilityDetail._id || "",
        $limit: 10,
        $sort: {
          createdAt: -1,
        },
      },
    })
      .then((res) => {
        setFacilities(res.data);
        setMessage(" ProductEntry  fetched successfully");
        setSuccess(true);
      })
      .catch((err) => {
        setMessage(
          "Error fetching ProductEntry, probable network issues " + err
        );
        setError(true);
      });
  };

  const getFacilities = async () => {
    const findProductEntry = await OrderServ.find({
      query: {
        order_category: "Theatre Order",

        clientId: state.ClientModule.selectedClient._id,
        $limit: 20,
        $sort: {
          createdAt: -1,
        },
      },
    });
    await setFacilities(findProductEntry.data);
  };

  useEffect(() => {
    getFacilities();

    OrderServ.on("created", (obj) => getFacilities());
    OrderServ.on("updated", (obj) => getFacilities());
    OrderServ.on("patched", (obj) => getFacilities());
    OrderServ.on("removed", (obj) => getFacilities());
    return () => {};
  }, []);

  const ordersListSchema = [
    {
      name: "S/N",
      key: "_id",
      selector: (row) => row.sn,
      description: "Enter name of band",
      sortable: true,
      inputType: "HIDDEN",
      width: "50px",
    },
    {
      name: "Date",
      key: "name",
      description: "Enter name of band",
      selector: (row) => format(new Date(row.createdAt), "dd-MM-yy"),
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "100px",
    },
    {
      name: "Test",
      key: "facility",
      description: "Enter name of Facility",
      selector: (row) => row.order,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Note",
      key: "action",
      description: "Enter Action",
      selector: (row) => (row.instruction ? row.instruction : "-----------"),
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Fulfilled",
      key: "facility",
      description: "Enter name of Facility",
      selector: (row) => (row.fulfilled === "true" ? "Yes" : "No"),
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "100px",
    },
    {
      name: "Status",
      key: "action",
      description: "Enter Action",
      selector: (row) => row.order_status,
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "100px",
    },
    {
      name: "Requesting Physician",
      key: "facility",
      description: "Enter name of Facility",
      selector: (row) => row.requestingdoctor_Name,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Action",
      key: "destination",
      description: "Enter Destination",
      selector: (row) => (
        <DeleteOutlineIcon
          sx={{ color: "red" }}
          fontSize="small"
          onClick={() => handleDelete(row)}
        />
      ),
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "80px",
    },
  ];

  return (
    <>
      <Box>
        <TableMenu>
          <div style={{ display: "flex", alignItems: "center" }}>
            {handleSearch && (
              <div className="inner-table">
                <FilterMenu onSearch={handleSearch} />
              </div>
            )}
            <h2 style={{ marginLeft: "10px", fontSize: "0.8rem" }}>
              List of Theatre Orders
            </h2>
          </div>

          {!standalone && (
            <GlobalCustomButton onClick={handleCreateNew}>
              <AddCircleOutline fontSize="small" sx={{ marginRight: "5px" }} />
              Add
            </GlobalCustomButton>
          )}
        </TableMenu>

        <div style={{ width: "100%", overflowY: "scroll" }}>
          <CustomTable
            title={""}
            columns={ordersListSchema}
            data={facilities}
            pointerOnHover
            highlightOnHover
            striped
            onRowClicked={handleRow}
            progressPending={false}
            CustomEmptyData={
              <Typography sx={{ fontSize: "0.85rem" }}>
                No Theatre Order found......
              </Typography>
            }
          />
        </div>
      </Box>
    </>
  );
}
