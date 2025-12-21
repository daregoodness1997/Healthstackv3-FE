import { useState, useContext, useEffect, useCallback } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { UserContext, ObjectContext } from "../../../../context";
import AddCircleOutlineOutlined from "@mui/icons-material/AddCircleOutlineOutlined";
import { DeleteOutline } from "@mui/icons-material";
import GlobalCustomButton from "../../../../components/buttons/CustomButton";
import CustomTable from "../../../../components/customtable";
import CustomConfirmationDialog from "../../../../components/confirm-dialog/confirm-dialog";
import FilterMenu from "../../../../components/utilities/FilterMenu";
import { TableMenu } from "../../../../ui/styled/global";
import { PageWrapper } from "../../../app/styles";
import client from "../../../../feathers";
import { toast } from "react-toastify";
import { List, ListItem } from "@mui/material";

const InvoiceList = ({ showCreateView, showDetailView, isTab }) => {
  // const { register, handleSubmit, watch, errors } = useForm();

  const dealServer = client.service("deal");
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  // eslint-disable-next-line
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    message: "",
    type: "",
    action: null,
  });

  const getInvoicesForPage = useCallback(async () => {
    try {
      setLoading(true);
      const facId = user.currentEmployee.facilityDetail._id;
      const employeeId = user.currentEmployee.userId;

    const isAdmin =
      user?.currentEmployee?.roles?.includes("Admin") &&
      user?.currentEmployee?.roles?.includes("CRM Authorization");

    let query = {
      facilityId: facId,
      $sort: {
        createdAt: -1,
      },
      $or: [
        {
          createdby: employeeId,
        },
      ],
      $limit: limit,
      $skip: (page - 1) * limit,
    };

    if (!isAdmin) {
      query.$or = [
        {
          createdby: employeeId,
        },
      ];
    }

    const res =
       await dealServer.find({
            query });

      if (!res || !res.data) {
        throw new Error("Invalid response from server");
      }

      const deals = res.data;

      const promises = deals.map(async (deal) => deal.invoices || []);
      const invoices = await Promise.all(promises);

      setInvoices(invoices.flat());
      setTotal(invoices.flat().length);
    } catch (error) {
      // console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  }, [limit, page]);

  useEffect(() => {
    if (isTab) {
      const currentDeal = state.DealModule.selectedDeal;
      // setDeal(currentDeal.dealinfo);
      setInvoices(currentDeal.invoices|| []);
    } else {
      getInvoicesForPage();
    }

    const handleServerEvent = () => getInvoicesForPage();

    dealServer.on("created", handleServerEvent);
    dealServer.on("updated", handleServerEvent);
    dealServer.on("patched", handleServerEvent);
    dealServer.on("removed", handleServerEvent);

    return () => {
      dealServer.off("created", handleServerEvent);
      dealServer.off("updated", handleServerEvent);
      dealServer.off("patched", handleServerEvent);
      dealServer.off("removed", handleServerEvent);
    };
  }, [getInvoicesForPage,state.DealModule.selectedDeal,isTab]);

  const handleRow = async (data) => {
    if (isTab) {
      setState((prev) => ({
        ...prev,
        InvoiceModule: { ...prev.InvoiceModule, selectedInvoice: data },
      }));
      showDetailView();
    } else {
      const id = data.dealId;
      await dealServer
        .get(id)
        .then((resp) => {
          setState((prev) => ({
            ...prev,
            DealModule: { ...prev.DealModule, selectedDeal: resp },
            InvoiceModule: { ...prev.InvoiceModule, selectedInvoice: data },
          }));
          showDetailView();
        })
        .catch((err) => {
          toast.error("An error occured trying to view details of invoice");
          // console.log(err);
        });
      //console.log("is page");
    }
  };

  const handleSearch = () => {};

  // const returnCell = (status) => {
  //   switch (status.toLowerCase()) {
  //     case "active":
  //       return <span style={{ color: "#17935C" }}>{status}</span>;

  //     case "inactive":
  //       return <span style={{ color: "#0364FF" }}>{status}</span>;

  //     default:
  //       break;
  //   }
  // };

  const handleDeleteTariff = async (tariff) => {
    //showActionLoader();
    const deldeal = await dealServer.find({
      query: {
        "invoices._id": tariff._id,
      },
    });
    //console.log(deldeal)
    //console.log(tariff._id)

    let delInvoice = deldeal.data[0];
    const newInvoices = delInvoice.invoices.filter(
      (item) => item._id !== tariff._id
    );
    //delete delInvoice.invoices
    //console.log(delInvoice._id, newInvoices)

    await dealServer
      .patch(delInvoice._id, { invoices: newInvoices })
      .then((res) => {
        hideActionLoader();
        cancelConfirmDialog();
        toast.success("You've succesfully deleted an invoicce");
        //console.log(res)
      })
      .catch((error) => {
        hideActionLoader();
        cancelConfirmDialog();
        toast.error(`Failed to delete Invoice - ${error}`);
      });
  };

  const confirmDeleteTariff = (tariff) => {
    setConfirmDialog({
      open: true,
      message: `You're about to delete an invoice`,
      type: "danger",
      action: () => handleDeleteTariff(tariff),
    });
  };

  const cancelConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      message: "",
      type: "",
      action: null,
    });
  };

  const InvoiceSchema = [
    {
      name: "S/N",
      key: "sn",
      description: "SN",
      selector: (row, i) => i + 1,
      sortable: true,
      inputType: "HIDDEN",
      width: "50px",
    },
    {
      name: "Name",
      key: "name",
      description: "Enter name of Company",
      selector: (row) => row.customerName,
      sortable: true,
      required: true,
      inputType: "HIDDEN",
      style: {
        textTransform: "capitalize",
      },
    },
    {
      name: "Invoice No",
      key: "invoice_no",
      description: "Enter Telestaff name",
      selector: (row) => row.invoice_number,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Payment Mode",
      key: "payment_type",
      description: "Enter Telestaff name",
      selector: (row) => row.payment_mode,
      sortable: true,
      required: true,
      inputType: "TEXT",
      style: {
        textTransform: "capitalize",
      },
    },
    {
      name: "Payment Option",
      key: "payment_option",
      description: "Enter name of Disease",
      selector: (row, i) => row.payment_option,
      sortable: true,
      required: true,
      inputType: "DATE",
      style: {
        textTransform: "capitalize",
      },
    },
    {
      name: "Category",
      key: "subscription_category",
      description: "Enter Telestaff name",
      selector: (row) => row.subscription_category,
      sortable: true,
      required: true,
      inputType: "TEXT",
      style: {
        textTransform: "capitalize",
      },
    },

    {
      name: "Plans",
      key: "plan",
      description: "Enter bills",
      selector: (row) => (
        <List
          sx={{
            listStyleType: "disc",
            pl: 2,
            "& .MuiListItem-root": {
              display: "list-item",
            },
          }}
        >
          {row.plans.map((item) => (
            <ListItem
              key={item._id}
              sx={{
                margin: 0,
              }}
            >
              {item.type}
            </ListItem>
          ))}
        </List>
      ),
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
     {
      name: "Amount",
      key: "amount",
      description: "Enter name of Disease",
      selector: (row, i) => row.total_amount ? Number(row.total_amount).toFixed(2) : "0.00",
      sortable: true,
      required: true,
      inputType: "DATE",
    }, 

    {
      name: "Status",
      key: "status",
      description: "Enter bills",
      selector: "status",
      cell: (row) => (row.status ? row.status : "----------"),
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Delete",
      center: true,
      key: "delete",
      /* omit: provider, */
      description: "Delete row",
      selector: (row, index) => (
        <IconButton
          sx={{ color: "red" }}
          onClick={() => confirmDeleteTariff(row)}
        >
          <DeleteOutline fontSize="small" />
        </IconButton>
      ),
      sortable: true,
      required: true,
      inputType: "NUMBER",
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
      <div className="level">
        <PageWrapper
          style={{ flexDirection: "column", padding: "0.6rem 1rem" }}
        >
          <CustomConfirmationDialog
            open={confirmDialog.open}
            message={confirmDialog.message}
            type={confirmDialog.type}
            confirmationAction={confirmDialog.action}
            cancelAction={cancelConfirmDialog}
          />
          <TableMenu>
            <div style={{ display: "flex", alignItems: "center" }}>
              {handleSearch && (
                <div className="inner-table">
                  <FilterMenu onSearch={handleSearch} />
                </div>
              )}
              <h2 style={{ margin: "0 10px", fontSize: "0.95rem" }}>Invoice</h2>
            </div>

            {isTab && (
              <GlobalCustomButton onClick={showCreateView}>
                <AddCircleOutlineOutlined
                  fontSize="small"
                  sx={{ marginRight: "5px" }}
                />
                Create Invoice
              </GlobalCustomButton>
            )}
          </TableMenu>
          
            <CustomTable
              title={""}
              columns={InvoiceSchema}
              data={invoices}
              pointerOnHover
              highlightOnHover
              striped
              onRowClicked={handleRow}
              progressPending={loading}
              onChangeRowsPerPage={onTableChangeRowsPerPage}
              onChangePage={onTablePageChange}
              pagination
              paginationServer
              paginationTotalRows={total}
            />
        </PageWrapper>
      </div>
    </>
  );
};

export default InvoiceList;
