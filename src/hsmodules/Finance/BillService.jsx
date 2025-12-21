/* eslint-disable */
import React, { useState, useContext, useEffect, useRef } from "react";
import client from "../../feathers";
import { UserContext, ObjectContext } from "../../context";
import { format } from "date-fns";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { TableMenu } from "../../ui/styled/global";
import FilterMenu from "../../components/utilities/FilterMenu";
import CustomTable from "../../components/customtable";
import ModalBox from "../../components/modal";
import "react-datepicker/dist/react-datepicker.css";
import BillServiceCreate from "./BillServiceCreate";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import { FormsHeaderText } from "../../components/texts";
import { Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import { toast } from "react-toastify";
import { useCallback } from "react";

export default function PharmacyBillService() {
  const [createModal, setCreateModal] = useState(false);
  const handleOpenCreateModal = async () => {
    await setCreateModal(true);
  };

  const handleCloseCreateModal = async () => {
    await setCreateModal(false);
  };

  return (
    <section className="section remPadTop">
      <BillsList openCreateModal={handleOpenCreateModal} />

      <ModalBox
        open={createModal}
        onClose={handleCloseCreateModal}
        header="Create Bill Service"
      >
        <BillServiceCreate closeModal={handleCloseCreateModal} />
      </ModalBox>
    </section>
  );
}

export function BillsList({ openCreateModal }) {
  const [error, setError] = useState(false);

  const [success, setSuccess] = useState(false);

  const [message, setMessage] = useState("");
  const BillServ = client.service("bills");
  const locationServ = client.service("location");
  const [facilities, setFacilities] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const { state, setState } = useContext(ObjectContext);

  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientBills, setClientBills] = useState([]);
  //const [branch, setBranch] = useState("");
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [deleteOrder, setDeleteOrder] = useState(null);
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);

  const branchRef = useRef();

  // const handleSelectedClient = async (Client) => {
  //   // await setSelectedClient(Client)
  //   const newClientModule = {
  //     selectedClient: Client,
  //     show: "detail",
  //   };
  //   await setState((prevstate) => ({
  //     ...prevstate,
  //     ClientModule: newClientModule,
  //   }));
  // };

  const handleConfirmDelete = (data) => {
    setDeleteOrder(data);
    setConfirmationDialog(true);
  };

  const closeConfirmationDialog = () => {
    setDeleteOrder(null);
    setConfirmationDialog(false);
  };

  const handleDelete = useCallback(() => {
    showActionLoader();
    BillServ.remove(deleteOrder?.order?._id)
      .then(() => {
        hideActionLoader();
        toast.success("Order deleted successfully");
        setConfirmationDialog(false);
        setSelectedClient(null);
      })
      .catch((err) => {
        hideActionLoader();
        toast.error("Error deleting order: " + err.message);
        setConfirmationDialog(false);
      });
  }, [deleteOrder?.order?._id]);

  // const handleChoseClient = async (client, e, order) => {
  //   setOldClient(client.clientname);
  //   let newClient = client.clientname;
  //   if (oldClient !== newClient) {
  //     //alert("New Client Onboard")
  //     //remove all checked clientsly
  //     selectedOrders.forEach((el) => (el.checked = ""));
  //     setSelectedOrders([]);
  //   }

  //   // //console.log(e.target.checked)
  //   order.checked = e.target.checked;
  //   await handleSelectedClient(order.participantInfo.client);
  //   //handleMedicationRow(order)
  //   await setSelectedFinance(order);
  //   const newProductEntryModule = {
  //     selectedFinance: order,
  //     show: "detail",
  //     state: e.target.checked,
  //   };
  //   await setState((prevstate) => ({
  //     ...prevstate,
  //     financeModule: newProductEntryModule,
  //   }));

  //   //set of checked items
  //   if (e.target.checked) {
  //     await setSelectedOrders((prevstate) => prevstate.concat(order));
  //   } else {
  //     setSelectedOrders((prevstate) =>
  //       prevstate.filter((el) => el._id !== order._id)
  //     );
  //   }
  // };

  const handleCreateNew = async () => {
    const newProductEntryModule = {
      selectedDispense: {},
      show: "create",
    };
    await setState((prevstate) => ({
      ...prevstate,
      DispenseModule: newProductEntryModule,
    }));
    await openCreateModal(true);
  };
  // console.log(user);

  const handleSearch = (val) => {
    const field = "name";
    let branch = branchRef.current;
    let query = {
      "participantInfo.client.lastname": {
        $regex: val,
        $options: "i",
      },

      $or: [
        {
          "participantInfo.paymentmode.type": "Cash",
        },
        {
          "participantInfo.paymentmode.type": "Family Cover",
        },
      ],

      "participantInfo.billingFacility":
        user.currentEmployee.facilityDetail._id,
      billing_status: {
        $ne: "Fully Paid",
      },
      $limit: 30,
      $sort: {
        createdAt: -1,
      },
    };
    if (!!branch) {
      query["participantInfo.branch"] = branch;
    }
    BillServ.find({
      query: query,
    })
      .then((res) => {
        // //console.log(res)
        setFacilities(res.groupedOrder);
        setMessage(" ProductEntry  fetched successfully");
        setSuccess(true);
      })
      .catch((err) => {
        // //console.log(err)
        setMessage(
          "Error fetching ProductEntry, probable network issues " + err
        );
        setError(true);
      });
  };
  const getFacilities = async () => {
    // //console.log("here b4 server")
    setFacilities([]);
    let branch = branchRef.current;
    let query = {
      $or: [
        {
          "participantInfo.paymentmode.type": "Cash",
        },
        {
          "participantInfo.paymentmode.type": "Family Cover",
        },
      ],

      "participantInfo.billingFacility":
        user.currentEmployee.facilityDetail._id,
      billing_status: {
        $ne: "Fully Paid",
      },
      $limit: limit,
      $skip: (page - 1) * limit,
      $sort: {
        createdAt: -1,
      },
    };
    if (!!branch) {
      query["participantInfo.branch"] = branch;
    }
    const findProductEntry = await BillServ.find({
      query: query,
    });
    console.log(findProductEntry, "not group bills");
    setFacilities(findProductEntry.groupedOrder);
  };
  // console.log(facilities, "bills");
  const findbranch = async () => {
    if (!!state.employeeLocation.locationId) {
      const loc = await locationServ.get(state.employeeLocation.locationId);

      branchRef.current = loc.branch;
    }
    getFacilities();
  };
  useEffect(() => {
    findbranch();
  }, [state.employeeLocation]);

  /* useEffect(()=>{

  getFacilities();
},[branchRef.current])  */
  // console.log(facilities, "order");
  useEffect(() => {
    findbranch();

    BillServ.on("created", (obj) => getFacilities());
    BillServ.on("updated", (obj) => getFacilities());
    BillServ.on("patched", (obj) => getFacilities());
    BillServ.on("removed", (obj) => getFacilities());

    const newClient = {
      selectedClient: "",
      show: "create",
    };
    setState((prevstate) => ({ ...prevstate, ClientModule: newClient }));

    return () => {};
  }, []);

  // useEffect(() => {
  //   return () => {};
  // }, [selectedOrders]);

  useEffect(() => {
    if (state.financeModule.show === "create") {
      selectedOrders.forEach((el) => (el.checked = ""));
      setSelectedOrders([]);
    }
    return () => {};
  }, [state.financeModule.show]);

  const onRowClicked = async (Client) => {
    if (selectedClient && selectedClient.client_id === Client.client_id)
      return setSelectedClient(null);
    setSelectedClient(Client);

    const clientOrders = Client.bills.map((data) => {
      const allOrders = [];

      data.order.map((order) => {
        const orderData = {
          date: order.createdAt,
          status: order.billing_status,
          description: order.serviceInfo.name,
          category: data.catName,
          amount: data.catAmount,
          order: order,
          bills: [],
        };

        allOrders.push(orderData);
      });
      return allOrders;
    });
    setClientBills(clientOrders.flat(1));
  };

  const returnNumberOfBills = (bills) => {
    const billsLength = bills.reduce((accumulator, object) => {
      return accumulator + object.order.length;
    }, 0);

    return billsLength;
  };

  const financePlaymentListSchema = [
    {
      name: "S/N",
      width: "60px",
      headerStyle: (selector, id) => {
        return { textAlign: "center" };
      },

      key: "sn",
      description: "Enter name of Disease",
      selector: (row) => row.sn,
      sortable: true,
      required: true,
      inputType: "HIDDEN",
    },
    {
      name: "Name",
      //width: "200px",
      key: "clientname",
      description: "Enter Name",
      selector: (row) => row.clientname,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Categories Total",
      key: "bills",
      description: "Enter Category Total",
      selector: (row) => {
        const bills = row.bills;
        return (
          <>
            {/* {console.log(row)} */}
            {bills.map((category, i) => (
              <Typography
                sx={{ fontSize: "0.75rem" }}
                data-tag="allowRowEvents"
                key={i}
              >
                {category.catName} {category.catAmount.toFixed(2)}
              </Typography>
            ))}
          </>
        );
        //row.clientAmount.toFixed(2);
        // //console.log(bills);
        // bills.map((category, i) => {
        //   return category.catAmount.toFixed(2);
        // });
      },
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Grand Total",
      // width: "130px",
      key: "clientAmount",
      description: "Enter Grand Total",
      selector: (row) => row.clientAmount.toFixed(2),
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "150px",
    },
    {
      name: "No of Bills",
      key: "bills",
      description: "Enter Number of Bills",
      selector: (row) => returnNumberOfBills(row.bills),
      sortable: true,
      required: true,
      inputType: "BUTTON",
      center: true,
      width: "100px",
    },
  ];

  const selectedClientSchema = [
    {
      name: "S/NO",
      width: "70px",
      key: "sn",
      description: "Enter name of Disease",
      selector: (row) => row.sn,

      sortable: true,
      required: true,
      inputType: "HIDDEN",
    },
    {
      name: "Date",
      key: "date",
      description: "Enter Date",
      selector: (row) => format(new Date(row.date), "dd-MM-yy"),
      sortable: true,
      required: true,
      inputType: "DATE",
    },
    {
      name: "Category",
      key: "category",
      description: "Enter Category",
      selector: (row) => row.category,
      sortable: true,
      required: true,
      inputType: "SELECT",
    },
    {
      name: "Description",
      key: "description",
      description: "Enter Description",
      selector: (row) => row.description,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Status",
      key: "status",
      description: "Enter Status",
      selector: (row) => row.status,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Amount",
      key: "amount",
      description: "Enter Amount",
      selector: (row) => row.amount,
      sortable: true,
      required: true,
      inputType: "NUMBER",
    },
    {
      name: "Action",
      key: "action",
      selector: (row) => row.action,
      cell: (row) => (
        <span onClick={() => handleConfirmDelete(row)}>
          <DeleteIcon
            sx={{
              color: "#e57373",
              fontSize: "18px",
              ":hover": {
                color: "red",
              },
            }}
          />
        </span>
      ),
      sortable: false,
      width: "50px",
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.client_id === selectedClient?.client_id,
      style: {
        backgroundColor: "#4cc9f0",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <CustomConfirmationDialog
        open={confirmationDialog}
        confirmationAction={() => handleDelete()}
        cancelAction={closeConfirmationDialog}
        type="danger"
        message="Are you sure you want to delete this order?"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          width: "100%",
          flex: "1",
        }}
      >
        <TableMenu>
          <div style={{ display: "flex", alignItems: "center" }}>
            {handleSearch && (
              <div className="inner-table">
                <FilterMenu onSearch={handleSearch} />
              </div>
            )}
            <h2
              style={{
                marginLeft: "10px",
                fontSize: "0.95rem",
                marginRight: "10px",
              }}
            >
              Unpaid Bills{" "}
              {branchRef.current && ` :  ${branchRef.current} Branch`}
            </h2>

            {selectedClient && (
              <FormsHeaderText text={`- ${selectedClient?.clientname}`} />
            )}
          </div>

          {handleCreateNew && (
            <GlobalCustomButton onClick={handleCreateNew}>
              <AddCircleOutlineOutlinedIcon
                sx={{ marginRight: "5px" }}
                fontSize="small"
              />
              Add New
            </GlobalCustomButton>
          )}
        </TableMenu>
        <div
          //className="columns"
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              height: "calc(100vh - 70px)",
              transition: "width 0.5s ease-in",
              width: selectedClient ? "49%" : "100%",
              overflow: "auto",
            }}
          >
            <CustomTable
              title={""}
              columns={financePlaymentListSchema}
              data={facilities}
              pointerOnHover
              highlightOnHover
              striped
              pagination
              onChangeRowsPerPage={onTableChangeRowsPerPage}
              onChangePage={onTablePageChange}
              onRowClicked={(row) => onRowClicked(row)}
              progressPending={loading}
              conditionalRowStyles={conditionalRowStyles}
            />
          </div>

          {selectedClient && (
            <>
              <div
                style={{
                  height: "calc(100% - 70px)",
                  width: "49%",
                }}
              >
                <CustomTable
                  title={""}
                  columns={selectedClientSchema}
                  data={clientBills}
                  pointerOnHover
                  highlightOnHover
                  striped
                  //onRowClicked={row => onRowClicked(row)}
                  progressPending={loading}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
