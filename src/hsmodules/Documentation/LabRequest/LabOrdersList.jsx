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

export default function LabOrdersList({ standalone }) {
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
  };
  const handleDelete = (doc) => {
    let confirm = window.confirm(
      `You are about to delete a ${doc.order} lab order?`
    );
    if (confirm) {
      OrderServ.remove(doc._id)
        .then((res) => {
          toast({
            message: "Lab order deleted succesfully",
            type: "is-success",
            dismissible: true,
            pauseOnHover: true,
          });
          setSuccess(false);
        })
        .catch((err) => {
          toast({
            message: "Error deleting Lab order" + err,
            type: "is-danger",
            dismissible: true,
            pauseOnHover: true,
          });
        });
    }
  };
  const handleRow = async (ProductEntry) => {
    await setSelectedOrder(ProductEntry);

    const newProductEntryModule = {
      selectedOrder: ProductEntry,
      show: "detail",
    };
    await setState((prevstate) => ({
      ...prevstate,
      OrderModule: newProductEntryModule,
    }));
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
        order_category: "Lab Order",
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
        order_category: "Laboratory",//"Lab Orders",
        clientId: state.ClientModule.selectedClient._id,
        $limit: 20,
        $sort: {
          createdAt: -1,
        },
      },
    });
  //  console.log(findProductEntry.data)
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
    },
    {
      name: "Status",
      key: "action",
      description: "Enter Action",
      selector: (row) => row.order_status,
      sortable: true,
      required: true,
      inputType: "TEXT",
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
        <DeleteOutlineIcon fontSize="small" sx={{ color: "red" }} />
      ),
      sortable: true,
      required: true,
      inputType: "TEXT",
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
              List of Laboratory Orders
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
                No Laboratory Orders found......
              </Typography>
            }
            //selectableRowsComponent={Checkbox}
          />
        </div>
      </Box>
    </>
  );
}
