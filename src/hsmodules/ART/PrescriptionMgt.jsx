import { useState } from "react";
import { PageWrapper } from "../../ui/styled/styles";
import { TableMenu } from "../../ui/styled/global";
import FilterMenu from "../../components/utilities/FilterMenu";
import CustomTable from "../../components/customtable";
import { format } from "date-fns";
import client from "../../feathers";
import { ObjectContext, UserContext } from "../../context";
import { useContext } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import ModalBox from "../../components/modal";
import UpdateLabRequestStatus from "./components/actions/updateStatus";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import dayjs from "dayjs";

export default function PrescriptionMgt() {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const OrderServ = client.service("order");
  const [facilities, setFacilities] = useState([]);
  const { user } = useContext(UserContext);
  const [updateModal, setUpdateModal] = useState(false);
  const { setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  const getFacilities = async () => {
    try {
      setLoading(true);
      const findProductEntry = await OrderServ.find({
        query: {
          order_category: "Prescription",
          destination: user.currentEmployee.facilityDetail._id,
          $sort: { createdAt: -1 },
          $limit: limit,
          $skip: (page - 1) * limit,
        },
      });
      setFacilities(findProductEntry.data);
      setTotal(findProductEntry.total);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      // Handle error appropriately (e.g., show a toast notification)
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = (data) => {
    setPrescriptionToDelete(data);
    setConfirmationDialog(true);
  };

  const closeConfirmationDialog = () => {
    setPrescriptionToDelete(null);
    setConfirmationDialog(false);
  };

  useEffect(() => {
    getFacilities();

    OrderServ.on("created", (obj) => getFacilities());
    OrderServ.on("updated", (obj) => getFacilities());
    OrderServ.on("patched", (obj) => getFacilities());
    OrderServ.on("removed", (obj) => getFacilities());
    return () => {};
  }, [limit, page]);

  console.log(facilities, "fac");

  const PrescriptionMgtSchema = [
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
      name: "Profile Name",
      key: "profile",
      description: "Enter name of patient",
      selector: (row) => row.clientname,
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
      key: "action",
      selector: (row) => row.action,
      cell: (row) => (
        <span onClick={() => handleConfirmDelete(row)}>
          <DeleteOutlineIcon
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

  const handleDelete = () => {
    showActionLoader();
    OrderServ.remove(prescriptionToDelete._id)
      .then(() => {
        hideActionLoader();
        toast.success(`Prescription request Deleted succesfully`);
        setConfirmationDialog(false);
      })
      .catch((err) => {
        hideActionLoader();
        toast.error("Error deleting Prescription request" + err);
      });
  };

  const handleRow = async (row) => {
    const newOrderModule = {
      selectedOrder: row,
    };
    await setState((prevstate) => ({
      ...prevstate,
      OrderModule: newOrderModule,
    }));
    setUpdateModal(true);
  };

  const handleHideUpdateModal = () => {
    setUpdateModal(false);
  };

  const handleSearch = (val) => {
    //console.log(val);
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
            clientname: {
              $regex: val,
              $options: "i",
            },
          },
          {
            requestingdoctor_Name: {
              $regex: val,
              $options: "i",
            },
          },
        ],
        destination: user.currentEmployee.facilityDetail._id,
        $limit: limit,
        $sort: {
          createdAt: -1,
        },
      },
    })
      .then((res) => {
        // console.log(res);
        setFacilities(res.data);
      })
      .catch((err) => {
        toast.error(`Something went wrong!!!! ${err}`);
        // console.log(err);
      });
  };

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <ModalBox
        open={updateModal}
        onClose={handleHideUpdateModal}
        header="Update status"
      >
        <UpdateLabRequestStatus closeModal={() => handleHideUpdateModal()} />
      </ModalBox>
      <div className="level">
        <PageWrapper
          style={{ flexDirection: "column", padding: "0.6rem 1rem" }}
        >
          <TableMenu>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              {handleSearch && (
                <div className="inner-table">
                  <FilterMenu onSearch={handleSearch} />
                </div>
              )}
              <h2
                style={{
                  margin: "0 10px",
                  fontSize: "0.95rem",
                }}
              >
                Prescription Management
              </h2>
            </div>
          </TableMenu>

          <div
            className="level"
            style={{
              overflow: "auto",
            }}
          >
            <CustomTable
              title={"Prescription Management List"}
              columns={PrescriptionMgtSchema}
              data={facilities}
              pointerOnHover
              highlightOnHover
              striped
              onChangeRowsPerPage={onTableChangeRowsPerPage}
              onChangePage={onTablePageChange}
              onRowClicked={handleRow}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={total}
            />
          </div>
        </PageWrapper>
      </div>
      <CustomConfirmationDialog
        open={confirmationDialog}
        confirmationAction={() => handleDelete(prescriptionToDelete)}
        cancelAction={closeConfirmationDialog}
        type="danger"
        message={`You are about to delete a prescription request: ${
          prescriptionToDelete?.name
        } created on ${dayjs(prescriptionToDelete?.createdAt).format("DD-MM-YYYY")}`}
      />
    </>
  );
}
