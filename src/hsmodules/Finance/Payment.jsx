/* eslint-disable */
import React, { useState, useContext, useEffect, useRef } from "react";
import client from "../../feathers";
//import {useNavigate} from 'react-router-dom'
import { UserContext, ObjectContext } from "../../context";
import { format } from "date-fns";
import PaymentCreate from "./PaymentCreate";
import PaymentsIcon from "@mui/icons-material/Payments";
import DeleteIcon from "@mui/icons-material/Delete";
import { TableMenu } from "../../ui/styled/global";
import FilterMenu from "../../components/utilities/FilterMenu";
import CustomTable from "../../components/customtable";
import ModalBox from "../../components/modal";
import "react-datepicker/dist/react-datepicker.css";
import { Box, Typography } from "@mui/material";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import PaymentCreatePage from "./PaymentCreatePage";
import { FormsHeaderText } from "../../components/texts";
import { ReceiptOutlined } from "@mui/icons-material";
import PaymentInvoice from "./PaymentInvoice";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import { toast } from "react-toastify";
import { useCallback } from "react";

/* import {ProductCreate} from './Products' */

//const searchfacility={};

// Demo styles, see 'Styles' section below for some notes on use.

//import BillPrescriptionCreate from './BillPrescriptionCreate';

export default function FinancePayment() {
  //const {state}=useContext(ObjectContext) //,setState

  const [selectedProductEntry, setSelectedProductEntry] = useState();
  //const [showState,setShowState]=useState() //create|modify|detail
  const [error, setError] = useState(false);

  const [success, setSuccess] = useState(false);

  const [message, setMessage] = useState("");
  const BillServ = client.service("bills");
  //const navigate=useNavigate()
  // const {user,setUser} = useContext(UserContext)
  const [facilities, setFacilities] = useState([]);

  const [selectedOrders, setSelectedOrders] = useState([]); //

  const { state, setState } = useContext(ObjectContext);

  const { user, setUser } = useContext(UserContext);
  const [openModal, setOpenModal] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("lists");

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <section className="section remPadTop">
      {currentScreen === "lists" && (
        <BillingList
          openModal={handleOpenModal}
          showCreateScreen={() => setCurrentScreen("create")}
        />
      )}

      {currentScreen === "create" && (
        <PaymentCreatePage handleGoBack={() => setCurrentScreen("lists")} />
      )}

      <ModalBox open={openModal} onClose={handleCloseModal}>
        <Box sx={{ width: "800px" }}>
          <PaymentCreate closeModal={handleCloseModal} />
        </Box>
      </ModalBox>
    </section>
  );
}

export function BillingList({ showCreateScreen }) {
  const BillServ = client.service("bills");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const locationServ = client.service("location");
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const { state, setState } = useContext(ObjectContext);
  const { user } = useContext(UserContext);
  // const [selectedFinance, setSelectedFinance] = useState("");
  const [oldClient, setOldClient] = useState("");
  const [clientBills, setClientBills] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [branch, setBranch] = useState("");
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [deleteOrder, setDeleteOrder] = useState(null);
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);

  const handleSelectedClient = async (Client) => {
    const newClientModule = {
      selectedClient: Client,
      show: "detail",
    };
    await setState((prevstate) => ({
      ...prevstate,
      ClientModule: newClientModule,
    }));
    // console.log(Client);
  };

  const handlePay = async (client, i) => {
    setOldClient(client.clientname);
    let newClient = client.clientname;
    if (oldClient !== newClient) {
      selectedOrders.forEach((el) => (el.checked = ""));
      setSelectedOrders([]);
      setState((prev) => ({
        ...prev,
        financeModule: {
          ...prev.financeModule,
          selectedBills: [],
        },
      }));
      // console.log("Paynow", client);
    }

    // //console.log(e.target.checked)

    await handleSelectedClient(client.bills[0].order[0].participantInfo.client);
    //handleMedicationRow(order)/

    await client.bills.forEach((bill) => {
      // console.log(bill, "bill");
      bill.order.forEach((order) => {
        let medication = order;
        medication.show = "none";
        medication.checked = true;
        medication.proposedpayment = {
          balance: 0,
          paidup:
            medication.paymentInfo.paidup + medication.paymentInfo.balance,
          amount: medication.paymentInfo.balance,
        };

        // setSelectedFinance(order);

        const newProductEntryModule = {
          selectedFinance: order,
          show: "detail",
          state: true,
          selectedBills: [],
        };

        setState((prevstate) => ({
          ...prevstate,
          financeModule: {
            ...newProductEntryModule,
            selectedBills: prevstate.financeModule.selectedBills.concat(order),
          },
        }));

        setSelectedOrders((prevstate) => prevstate.concat(order));
      });
    });

    showCreateScreen();

    //openModal();
  };

  const handleChoseClient = async (client, e, order) => {
    setOldClient(client.clientname);

    order.checked = e.target.checked;
    await handleSelectedClient(order.participantInfo.client);
    //handleMedicationRow(order)
    // await setSelectedFinance(order);

    const newProductEntryModule = {
      ...state.financeModule,
      selectedFinance: order,
      show: "detail",
      state: e.target.checked,
    };

    await setState((prevstate) => ({
      ...prevstate,
      financeModule: newProductEntryModule,
    }));

    //set of checked items
    if (e.target.checked) {
      let medication = order;
      medication.show = "none";
      medication.proposedpayment = {
        balance: 0,
        paidup: medication.paymentInfo.paidup + medication.paymentInfo.balance,
        amount: medication.paymentInfo.balance,
      };

      await setState((prev) => ({
        ...prev,
        financeModule: {
          ...prev.financeModule,
          selectedBills: prev.financeModule.selectedBills.concat(medication),
        },
      }));
      setSelectedOrders((prevstate) => prevstate.concat(medication));
    } else {
      await setState((prev) => ({
        ...prev,
        financeModule: {
          ...prev.financeModule,
          selectedBills: prev.financeModule.selectedBills.filter(
            (el) => el._id !== order._id
          ),
        },
      }));

      setSelectedOrders((prevstate) =>
        prevstate.filter((el) => el._id !== order._id)
      );
    }

    // //console.log(selectedOrders)
  };

  const handleSearch = (val) => {
    let query = {
      "participantInfo.paymentmode.detail.principalName": {
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
      }, //set to not equal to "fully paid" // need to set this finally
      $limit: 10,
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
        setFacilities(res.groupedOrder);
      })
      .catch((err) => {
        return err;
      });
  };

  const getFacilities = async () => {
    // //console.log("here b4 server")
    setLoading(true);
    const findProductEntry = await BillServ.find({
      query: {
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
      },
    });
     console.log(findProductEntry);
    setFacilities(findProductEntry.groupedOrder);
    setLoading(false);
  };

  console.log(facilities, "hello");

  const findbranch = async () => {
    if (!!state.employeeLocation.locationId) {
      await locationServ
        .get(state.employeeLocation.locationId)
        .then((resp) => {
          setBranch(resp.branch);
          // console.log(resp.branch);
        })
        .catch((err) => err);
    }
  };
  useEffect(() => {
    findbranch();
  }, [state.employeeLocation]);

  useEffect(() => {
    getFacilities();
  }, [branch]);

  const onRowClicked = async (client, e) => {
    // console.log("table 1", client);
    if (selectedClient && selectedClient.client_id === client.client_id)
      return setSelectedClient(null);

    setSelectedClient(client);

    setOldClient(client.clientname);
    let newClient = client.clientname;

    if (oldClient !== newClient) {
      selectedOrders.forEach((el) => (el.checked = ""));
      setSelectedOrders([]);
      setState((prev) => ({
        ...prev,
        financeModule: {
          ...prev.financeModule,
          selectedBills: [],
        },
      }));
    }

    const clientOrders = client.bills.map((data) => {
      const allOrders = [];

      data.order.map((order) => {
        const orderData = {
          date: order.createdAt,
          status: order.billing_status,
          description: order.serviceInfo.name,
          category: data.catName,
          amount:
            order.billing_status === "Unpaid"
              ? order.serviceInfo.amount
              : order.paymentInfo.balance,
          order: order,
        };

        allOrders.push(orderData);
      });
      return allOrders;
    });

    setClientBills(clientOrders.flat(1));
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

  //1.consider using props for global data
  useEffect(() => {
    //console.log("started")
    findbranch();
    getFacilities();
    BillServ.on("created", (obj) => getFacilities());
    BillServ.on("updated", (obj) => getFacilities());
    BillServ.on("patched", (obj) => getFacilities());
    BillServ.on("removed", (obj) => getFacilities());
    return () => {};
  }, []);

  useEffect(() => {
    if (state.financeModule.show === "create") {
      selectedOrders.forEach((el) => (el.checked = ""));
      setSelectedOrders([]);
    }
    return () => {};
  }, [state.financeModule.show, selectedOrders]);

  useEffect(() => {
    const productItem = selectedOrders;
    setTotalAmount(0);
    productItem.forEach((el) => {
      if (el.show === "none") {
        if (el.billing_status === "Unpaid") {
          setTotalAmount(
            (prevtotal) => Number(prevtotal) + Number(el.serviceInfo.amount)
          );
        } else {
          setTotalAmount(
            (prevtotal) => Number(prevtotal) + Number(el.paymentInfo.balance)
          );
        }
      }
      if (el.show === "flex") {
        setTotalAmount((prevtotal) => Number(prevtotal) + Number(el.partPay));
      }

      //
    });
  }, [selectedOrders]);

  const handleConfirmDelete = (data) => {
    setDeleteOrder(data);
    setConfirmationDialog(true);
  };

  const closeConfirmationDialog = () => {
    setDeleteOrder(null);
    setConfirmationDialog(false);
  };

  const financePlaymentListSchema = [
    {
      name: "S/N",
      width: "60px",
      headerStyle: (selector, id) => {
        return { textAlign: "center" }; // removed partial line here
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
      selector: (row) => (
        <Typography
          sx={{ fontSize: "0.75rem", whiteSpace: "normal" }}
          data-tag="allowRowEvents"
        >
          {row.clientname}
        </Typography>
      ),
      sortable: true,
      required: true,
      inputType: "TEXT",
      width: "120px",
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
      width: "120px",
    },
    {
      name: "Categories Total",
      key: "bills",
      description: "Enter Category Total",
      selector: (row) => {
        const bills = row.bills;
        return (
          <>
            {bills.map((category, i) => (
              <Typography
                sx={{ fontSize: "0.75rem", whiteSpace: "normal" }}
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
      name: "Action",
      key: "bills",
      description: "Enter Grand Total",
      selector: (row) => (
        <GlobalCustomButton
          onClick={() => {
            handlePay(row);
          }}
        >
          <PaymentsIcon sx={{ marginRight: "3px" }} fontSize="small" />
          Pay
        </GlobalCustomButton>
      ),
      sortable: true,
      required: true,
      inputType: "BUTTON",
      width: "100px",
    },
  ];

  const selectedClientSchema = [
    {
      name: "S/N",
      width: "70px",
      key: "sn",
      description: "Enter name of Disease",
      selector: (row) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            //name={order._id}
            style={{ marginRight: "3px" }}
            onChange={(e) => handleChoseClient(selectedClient, e, row.order)}
            checked={row.order.checked}
          />
          {row.sn}
        </div>
      ),
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
      selector: (row) => (
        <Typography
          sx={{ fontSize: "0.75rem", whiteSpace: "normal" }}
          data-tag="allowRowEvents"
        >
          {row.description}
        </Typography>
      ),
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
          flex: "1",
          height: "100%",
        }}
      >
        <ModalBox
          open={invoiceModal}
          onClose={() => setInvoiceModal(false)}
          header={`Invoice Detail`}
        >
          <PaymentInvoice
            clientId={selectedClient?.client_id}
            bills={clientBills}
            clientAmount={selectedClient?.clientAmount}
          />
        </ModalBox>

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
                fontSize: "0.9rem",
                marginRight: "7px",
              }}
            >
              Unpaid Invoices/Bills
            </h2>

            {selectedClient && (
              <FormsHeaderText text={`- ${selectedClient.clientname}`} />
            )}
          </div>

          {selectedOrders.length > 0 && (
            <h2 style={{ marginLeft: "10px", fontSize: "0.9rem" }}>
              Amount Due : <span>&#8358;</span>
              {totalAmount}
            </h2>
          )}

          <Box sx={{ display: "flex" }} gap={1.5}>
            {selectedClient && (
              <GlobalCustomButton
                onClick={() => setInvoiceModal(true)}
                color="info"
              >
                <ReceiptOutlined sx={{ marginRight: "5px" }} fontSize="small" />
                Invoice
              </GlobalCustomButton>
            )}

            {selectedOrders.length > 0 && (
              <GlobalCustomButton onClick={showCreateScreen}>
                <PaymentsIcon sx={{ marginRight: "5px" }} fontSize="small" />
                Make Payment
              </GlobalCustomButton>
            )}
          </Box>
        </TableMenu>

        <div
          className="columns"
          style={{
            display: "flex",
            width: "100%",
            //flex: "1",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              height: "calc(100vh - 170px)",
              transition: "width 0.5s ease-in",
              width: selectedClient ? "49.5%" : "100%",
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
                  height: "calc(100vh - 170px)",
                  width: "49.5%",
                  transition: "width 0.5s ease-in",
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
                  progressPending={false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
