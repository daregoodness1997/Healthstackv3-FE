/* eslint-disable */
import React, { useState, useContext, useEffect, useMemo } from "react";
import client from "../../../feathers";
import { UserContext, ObjectContext } from "../../../context";
import { toast } from "react-toastify";
import { Box, Typography } from "@mui/material";
import ModalBox from "../../../components/modal";
import FilterMenu from "../../../components/utilities/FilterMenu";
import CustomTable from "../../../components/customtable";
import { TableMenu } from "../../../ui/styled/global";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import moment from "moment";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CustomConfirmationDialog from "../../../components/confirm-dialog/confirm-dialog";
import RefInput from "../../../components/inputs/basic/Input/ref-input";
import { DrugAdminHistory } from "./DrugAdminHistory";

export function DrugAdminList({ standalone }) {
  const [error, setError] = useState(false);

  const [success, setSuccess] = useState(false);
  const [hxModal, setHxModal] = useState(false);
  const [currentMed, setCurrentMed] = useState(false);

  const [message, setMessage] = useState("");
  const OrderServ = client.service("order");
  //const history = useHistory()
  // const {user,setUser} = useContext(UserContext)
  const [facilities, setFacilities] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(); //

  const { state, setState } = useContext(ObjectContext);

  const [confirmationDialog, setConfirmationDialog] = useState({
    message: "",
    open: false,
    action: null,
    type: "",
  });

  const { user, setUser } = useContext(UserContext);

  const refs = useMemo(
    () => facilities.map(() => React.createRef()),
    [facilities]
  );
  const [selectedRow, setSelectedRow] = useState({
    row: null,
    index: null,
  });
  const ClientServ = client.service("clinicaldocument");

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

  const handleHistory = async (medication, i) => {
    setHxModal(true);
    setCurrentMed(medication);
  };

  const handlecloseModal1 = async () => {
    setHxModal(false);
  };

  const handleAdminister = (medication, i) => {
    // let confirm = window.confirm(
    //   `You are about to administer a dose of ${medication.order} for ${
    //     state.ClientModule.selectedClient.firstname +
    //     " " +
    //     state.ClientModule.selectedClient.middlename +
    //     " " +
    //     state.ClientModule.selectedClient.lastname
    //   } ?`
    // );
    // if (confirm) {
    //update the medication

    medication.treatment_status = "Active";

    const treatment_action = {
      actorname: user.firstname + " " + user.lastname,
      actorId: user._id,
      order_id: medication._id,
      action: "Administered",
      comments: refs[i].current.value,
      createdat: new Date().toLocaleString(),
      description:
        "Administered current dose of " +
        medication.order +
        " " +
        user.firstname +
        " " +
        user.lastname +
        " @ " +
        new Date().toLocaleString(),
    };

    medication.treatment_action = [
      treatment_action,
      ...medication.treatment_action,
    ];
    const treatment_doc = {
      Description:
        "Administered current dose of " +
        medication.order +
        " " +
        user.firstname +
        " " +
        user.lastname +
        " @ " +
        new Date().toLocaleString(),
      Comments: refs[i].current.value,
    };
    let productItem = treatment_doc;
    let document = {};
    // data.createdby=user._id
    // console.log(data);
    document.order = medication;
    document.update = treatment_action;
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    document.documentdetail = productItem;

    document.documentname = "Drug Administration"; //state.DocumentClassModule.selectedDocumentClass.name
    // document.documentClassId=state.DocumentClassModule.selectedDocumentClass._id
    document.location =
      state.employeeLocation.locationName +
      " " +
      state.employeeLocation.locationType;
    document.locationId = state.employeeLocation.locationId;
    document.client = state.ClientModule.selectedClient._id;
    document.clientname =
      state.ClientModule.selectedClient.firstname +
      " " +
      state.ClientModule.selectedClient.middlename +
      " " +
      state.ClientModule.selectedClient.lastname;
    document.clientobj = state.ClientModule.selectedClient;
    document.createdBy = user._id;
    document.createdByname = user.firstname + " " + user.lastname;
    document.status = "completed";

    document.geolocation = {
      type: "Point",
      coordinates: [state.coordinates.latitude, state.coordinates.longitude],
    };

    //return console.log(document);

    ClientServ.create(document)
      .then((res) => {
        //console.log(JSON.stringify(res))
        // e.target.reset();
        /*  setMessage("Created Client successfully") */
        setSuccess(true);
        toast.success("Drug administered succesfully");
        setSuccess(false);
        refs[i].current.value = "";
        // setProductItem([])
      })
      .catch((err) => {
        toast.error("Error In Drugs Adminstration " + err);
      });
    // }
  };

  const handleDelete = (doc) => {
    // console.log(doc)
    let confirm = window.confirm(
      `You are about to delete the prescription: ${doc.order}?`
    );
    if (confirm) {
      OrderServ.remove(doc._id)
        .then((res) => {
          toast({
            message: "Prescription deleted succesfully",
            type: "is-success",
            dismissible: true,
            pauseOnHover: true,
          });
          setSuccess(false);
        })
        .catch((err) => {
          toast({
            message: "Error deleting Prescription" + err,
            type: "is-danger",
            dismissible: true,
            pauseOnHover: true,
          });
        });
    }
  };

  const handleDiscontinue = (medication, i) => {
    // let confirm = window.confirm(
    //   `You are about to discontinue this medication ${medication.order} for ${
    //     state.ClientModule.selectedClient.firstname +
    //     " " +
    //     state.ClientModule.selectedClient.middlename +
    //     " " +
    //     state.ClientModule.selectedClient.lastname
    //   } ?`
    // );
    // if (confirm) {
    medication.treatment_status = "Cancelled";

    const treatment_action = {
      actorname: user.firstname + " " + user.lastname,
      actorId: user._id,
      order_id: medication._id,
      action: "Discountinued",
      comments: refs[i].current.value,
      createdat: new Date().toLocaleString(),
      description:
        "Discontinued " +
        medication.order +
        " for " +
        user.firstname +
        " " +
        user.lastname +
        " @ " +
        new Date().toLocaleString(),
    };

    medication.treatment_action = [
      treatment_action,
      ...medication.treatment_action,
    ];
    const treatment_doc = {
      Description:
        "Discontinued  " +
        medication.order +
        " for " +
        user.firstname +
        " " +
        user.lastname +
        " @ " +
        new Date().toLocaleString(),
      Comments: refs[i].current.value,
    };
    let productItem = treatment_doc;
    let document = {};
    // data.createdby=user._id
    // console.log(data);
    document.order = medication;
    document.update = treatment_action;
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    document.documentdetail = productItem;

    document.documentname = "Drug Administration"; //state.DocumentClassModule.selectedDocumentClass.name
    // document.documentClassId=state.DocumentClassModule.selectedDocumentClass._id
    document.location =
      state.employeeLocation.locationName +
      " " +
      state.employeeLocation.locationType;
    document.locationId = state.employeeLocation.locationId;
    document.client = state.ClientModule.selectedClient._id;
    document.clientname =
      state.ClientModule.selectedClient.firstname +
      " " +
      state.ClientModule.selectedClient.middlename +
      " " +
      state.ClientModule.selectedClient.lastname;
    document.clientobj = state.ClientModule.selectedClient;
    document.createdBy = user._id;
    document.createdByname = user.firstname + " " + user.lastname;
    document.status = "completed";
    document.geolocation = {
      type: "Point",
      coordinates: [state.coordinates.latitude, state.coordinates.longitude],
    };

    //return console.log(document);

    ClientServ.create(document)
      .then((res) => {
        //console.log(JSON.stringify(res))
        // e.target.reset();
        /*  setMessage("Created Client successfully") */
        setSuccess(true);
        toast.success("Drug Discontinued succesfully");
        setSuccess(false);
        refs[i].current.value = "";
        // setProductItem([])
      })
      .catch((err) => {
        toast.error("Error In Discontinuation of Drug " + err);
      });
    //}
  };

  const handleDrop = (medication, i) => {
    // let confirm = window.confirm(
    //   `You are about to drop this medication ${medication.order} for ${
    //     state.ClientModule.selectedClient.firstname +
    //     " " +
    //     state.ClientModule.selectedClient.middlename +
    //     " " +
    //     state.ClientModule.selectedClient.lastname
    //   } ?`
    // );
    // if (confirm) {
    medication.treatment_status = "Aborted";
    medication.drop = true;

    const treatment_action = {
      actorname: user.firstname + " " + user.lastname,
      actorId: user._id,
      order_id: medication._id,
      action: "Aborted",
      comments: refs[i].current.value,
      createdat: new Date().toLocaleString(),
      description:
        "Dropped " +
        medication.order +
        " for " +
        user.firstname +
        " " +
        user.lastname +
        " @ " +
        new Date().toLocaleString(),
    };

    medication.treatment_action = [
      treatment_action,
      ...medication.treatment_action,
    ];
    const treatment_doc = {
      Description:
        "Dropped  " +
        medication.order +
        " for " +
        user.firstname +
        " " +
        user.lastname +
        " @ " +
        new Date().toLocaleString(),
      Comments: refs[i].current.value,
    };
    let productItem = treatment_doc;
    let document = {};
    // data.createdby=user._id
    // console.log(data);
    document.order = medication;
    document.update = treatment_action;
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    document.documentdetail = productItem;

    document.documentname = "Drug Administration"; //state.DocumentClassModule.selectedDocumentClass.name
    // document.documentClassId=state.DocumentClassModule.selectedDocumentClass._id
    document.location =
      state.employeeLocation.locationName +
      " " +
      state.employeeLocation.locationType;
    document.locationId = state.employeeLocation.locationId;
    document.client = state.ClientModule.selectedClient._id;
    document.clientname =
      state.ClientModule.selectedClient.firstname +
      " " +
      state.ClientModule.selectedClient.middlename +
      " " +
      state.ClientModule.selectedClient.lastname;
    document.clientobj = state.ClientModule.selectedClient;
    document.createdBy = user._id;
    document.createdByname = user.firstname + " " + user.lastname;
    document.status = "completed";
    document.geolocation = {
      type: "Point",
      coordinates: [state.coordinates.latitude, state.coordinates.longitude],
    };

    //return console.log(document);

    ClientServ.create(document)
      .then((res) => {
        //console.log(JSON.stringify(res))
        // e.target.reset();
        /*  setMessage("Created Client successfully") */
        setSuccess(true);
        toast.success("Drug administered succesfully");
        setSuccess(false);
        refs[i].current.value = "";
        // setProductItem([])
      })
      .catch((err) => {
        toast.error("Error In Drugs Adminstration " + err);
      });
    //}
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
        order_category: "Prescription",
        // storeId:state.StoreModule.selectedStore._id,
        //facility:user.currentEmployee.facilityDetail._id || "",
        clientId: state.ClientModule.selectedClient._id,
        $limit: 10,
        $sort: {
          treatment_status: 1,
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
        order_category: "Prescription",
        //destination: user.currentEmployee.facilityDetail._id,

        //storeId:state.StoreModule.selectedStore._id,
        clientId: state.ClientModule.selectedClient._id,
        drop: false,
        $limit: 200,
        $sort: {
          treatment_status: 1,
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event, row, index) => {
    setAnchorEl(event.currentTarget);

    setSelectedRow(() => ({
      row: row,
      index: index,
    }));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConfirmAdminister = () => {
    setConfirmationDialog((prev) => ({
      ...prev,
      open: true,
      message: `You are about to administer a dose of ${
        selectedRow.row.order
      } for ${
        state.ClientModule.selectedClient.firstname +
        " " +
        state.ClientModule.selectedClient.middlename +
        " " +
        state.ClientModule.selectedClient.lastname
      } ?`,

      action: handleAdminister,
      type: "update",
    }));
  };

  const handleConfirmDiscontinue = () => {
    setConfirmationDialog((prev) => ({
      ...prev,
      open: true,
      message: `You are about to discontinue this medication ${
        selectedRow.row.order
      } for ${
        state.ClientModule.selectedClient.firstname +
        " " +
        state.ClientModule.selectedClient.middlename +
        " " +
        state.ClientModule.selectedClient.lastname
      } ?`,

      action: handleDiscontinue,
      type: "update",
    }));
  };

  const handleConfirmDrop = () => {
    setConfirmationDialog((prev) => ({
      ...prev,
      open: true,
      message: `You are about to drop this medication ${
        selectedRow.row.order
      } for ${
        state.ClientModule.selectedClient.firstname +
        " " +
        state.ClientModule.selectedClient.middlename +
        " " +
        state.ClientModule.selectedClient.lastname
      } ?`,

      action: handleDrop,
      type: "danger",
    }));
  };

  const handleCloseConfirmDialog = () => {
    setConfirmationDialog((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const drugAdminColumns = [
    {
      name: "S/N",
      key: "_id",
      selector: (row, i) => i + 1,
      description: "Enter name of band",
      sortable: true,
      inputType: "HIDDEN",
      width: "50px",
    },
    {
      name: "Date",
      key: "treatment_action",
      description: "Enter name of band",
      selector: (row) => {
        return moment(row?.treatment_action[0]?.createdat).format("L");
      },
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "100px",
    },

    {
      name: "Medication",
      key: "order",
      description: "Enter name of Facility",
      selector: (row) => row.order,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Instructions",
      key: "instruction",
      selector: (row) => row.instruction,
      description: "Enter name of band",
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "Status",
      key: "treatment_status",
      description: "Enter name of band",
      selector: (row) => row.treatment_status,
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "100px",
    },
    {
      name: "Last Administered",
      key: "facility",
      description: "Enter name of Facility",
      selector: (row) =>
        row.treatment_action[0]?.createdat && (
          <>{moment(row?.treatment_action[0]?.createdat).format("L")}</>
        ),
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "100px",
    },
    {
      name: "Latest Comments",
      key: "treatment_action",
      selector: (row) => row.treatment_action[0]?.comments,
      description: "Enter name of band",
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "Administered By",
      key: "name",
      description: "Enter name of band",
      selector: (row) => row.treatment_action[0]?.actorname,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "New Comment",
      key: "facility",
      description: "Enter name of Facility",
      selector: (row, i) => (
        <Box sx={{ width: "200px" }}>
          <RefInput
            sx={{ width: "100%" }}
            type="text"
            name={i}
            inputRef={refs[i]}
            placeholder="write here...."
          />
        </Box>
      ),
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "220px",
      center: true,
    },
    {
      name: "Actions",
      key: "facility",
      description: "Enter name of Facility",
      selector: "treatment_status",
      cell: (row, i) => (
        <div>
          <GlobalCustomButton onClick={(event) => handleClick(event, row, i)}>
            Actions
            <ArrowDropDownIcon fontSize="small" sx={{ marginLeft: "2px" }} />
          </GlobalCustomButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              sx={
                row.treatment_status === "Cancelled"
                  ? {
                      backgroundColor: "#e76f51",
                      pointerEvents: "none",
                      "&:hover": {
                        backgroundColor: "#e76f51",
                      },
                    }
                  : {}
              }
              onClick={() => {
                if (row.treatment_status === "Cancelled") return handleClose();

                handleConfirmAdminister();
                //handleAdminister(selectedRow.row, selectedRow.index);
                handleClose();
              }}
            >
              Administer
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleHistory(selectedRow.row, selectedRow.index);
                handleClose();
              }}
            >
              History
            </MenuItem>

            <MenuItem
              sx={
                row.treatment_status === "Cancelled"
                  ? {
                      backgroundColor: "#e76f51",
                      pointerEvents: "none",
                      "&:hover": {
                        backgroundColor: "#e76f51",
                      },
                    }
                  : {}
              }
              onClick={() => {
                if (row.treatment_status === "Cancelled") return handleClose();

                handleConfirmDiscontinue();
                handleClose();
              }}
            >
              Discountinue
            </MenuItem>

            <MenuItem
              sx={
                row.treatment_status === "Cancelled"
                  ? {
                      backgroundColor: "#e76f51",
                      pointerEvents: "none",
                      "&:hover": {
                        backgroundColor: "#e76f51",
                      },
                    }
                  : {}
              }
              onClick={() => {
                if (row.treatment_status === "Cancelled") return handleClose();

                handleConfirmDrop();
                handleClose();
              }}
            >
              Drop
            </MenuItem>
          </Menu>
        </div>
      ),
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "120px",
      center: true,
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.treatment_status === "Cancelled",
      style: {
        backgroundColor: "#fed9b7",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];

  return (
    <>
      <Box
        sx={{
          width: "90vw",
          maxHeight: "80vh",
        }}
      >
        <CustomConfirmationDialog
          open={confirmationDialog.open}
          message={confirmationDialog.message}
          confirmationAction={() =>
            confirmationDialog.action(selectedRow.row, selectedRow.index)
          }
          cancelAction={handleCloseConfirmDialog}
          type={confirmationDialog.type}
        />
        <TableMenu>
          <div style={{ display: "flex", alignItems: "center" }}>
            {handleSearch && (
              <div className="inner-table">
                <FilterMenu onSearch={handleSearch} />
              </div>
            )}
            <h2 style={{ marginLeft: "10px", fontSize: "0.8rem" }}>
              List of Prescriptions
            </h2>
          </div>

          {!standalone && (
            <GlobalCustomButton onClick={handleCreateNew}>
              <AddCircleOutline fontSize="small" sx={{ marginRight: "5px" }} />
              Add
            </GlobalCustomButton>
          )}
        </TableMenu>

        <Box>
          <CustomTable
            title={""}
            columns={drugAdminColumns}
            data={facilities}
            pointerOnHover
            highlightOnHover
            striped
            onRowClicked={handleRow}
            progressPending={false}
            CustomEmptyData={
              <Typography sx={{ fontSize: "0.85rem" }}>
                No Presciptions found......
              </Typography>
            }
            conditionalRowStyles={conditionalRowStyles}
          />
        </Box>
      </Box>

      <ModalBox
        open={hxModal}
        onClose={handlecloseModal1}
        header="Drug Admin History"
      >
        <DrugAdminHistory currentMed={currentMed} />
      </ModalBox>
    </>
  );
}
