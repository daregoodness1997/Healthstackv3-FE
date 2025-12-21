import { useContext, useEffect, useState } from "react";
import { TableMenu } from "../../ui/styled/global";
import FilterMenu from "../../components/utilities/FilterMenu";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { PageWrapper } from "../../ui/styled/styles";
import CreateCareTeam from "./components/careTeam/CreateCareTeam";
import ModalBox from "../../components/modal";
import CustomTable from "../../components/customtable";
import EditCareTeam from "./components/careTeam/EditCareTeam";
import client from "../../feathers";
import { ObjectContext, UserContext } from "../../context";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomConfirmationDialog from "../../components/confirm-dialog/confirm-dialog";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const CareTeam = () => {
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [careTeamData, setCareTeamData] = useState(null);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState(null);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  const { showActionLoader, setState, hideActionLoader } =
    useContext(ObjectContext);
  const careTeamServ = client.service("careteam");
  const { user } = useContext(UserContext);

  const handleCreateModal = () => {
    setCreateModal(true);
  };

  const handleHideCreateModal = () => {
    setCreateModal(false);
  };

  const handleEditModal = (data) => {
    setState((prev) => ({
      ...prev,
      ARTModule: { ...prev.ARTModule, selectedCareTeam: data },
    }));
    setData(data);
    setEditModal(true);
  };

  const handleHideEditModal = () => {
    setEditModal(false);
  };

  const TeamSchema = [
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
      name: "Team Name",
      key: "name",
      selector: (row) => row.name,
      sortable: false,
      width: "200px",
    },
    {
      name: "Lead Practitioner",
      key: "leadPractitioner",
      selector: (row) => row.leadPractitioner,
      sortable: false,
      width: "200px",
    },
    {
      name: "Start Date",
      key: "startDate",
      selector: (row) => row.startDate,
      sortable: false,
      width: "150px",
    },
    // {
    //     name: 'No. In Team',
    //     key: 'noInTeam',
    //     selector: row => row.noInTeam,
    //     sortable: false,
    //     width: '150px',
    // },
    {
      name: "Status",
      key: "status",
      selector: (row) => row.status,
      sortable: false,
      width: "150px",
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

  const handleConfirmDelete = (team) => {
    setTeamToDelete(team);
    setConfirmationDialog(true);
  };

  const closeConfirmationDialog = () => {
    setTeamToDelete(null);
    setConfirmationDialog(false);
  };

  const getCareTeamData = async () => {
    setLoading(true);

    try {
      const facId = user.currentEmployee.facilityDetail._id;

      let query = {
        facilityId: facId,
        $sort: {
          createdAt: -1,
        },
        $limit: limit,
        $skip: (page - 1) * limit,
      };

      const res = await careTeamServ.find(query);
      // console.log(res)
      setCareTeamData(res.data);
      setTotal(res.total || 0);
    } catch (error) {
      // console.error("Error fetching care team data:", error);
    } finally {
      setLoading(false);
    }
  };

  
  const handleSearch = (val) => {
    // console.log(val)
    careTeamServ
      .find({
        query: {
          $or: [
            {
              name: {
                $regex: val,
                $options: "i",
              },
            },

            {
              leadPractitioner: {
                $regex: val,
                $options: "i",
              },
            },
          ],
          facilityId: user.currentEmployee.facilityDetail._id,
          $limit: limit,
        },
      })
      .then((res) => {
        // console.log(res);
        setCareTeamData(res.data);
      })
      .catch((err) => {
        toast.error(`Something went wrong!!!! ${err}`);
        // console.log(err);
      });
  };

  // console.log(careTeamData,"team care")

  const handleDelete = () => {
    showActionLoader();
    careTeamServ
      .remove(teamToDelete._id)
      .then(() => {
        hideActionLoader();
        toast.success(`$Care team Deleted succesfully`);
        setConfirmationDialog(false);
      })
      .catch((err) => {
        hideActionLoader();
        toast.error("Error deleting task " + err);
      });
  };

  useEffect(() => {
    getCareTeamData();

    careTeamServ.on("created", (obj) => getCareTeamData());
    careTeamServ.on("updated", (obj) => getCareTeamData());
    careTeamServ.on("patched", (obj) => getCareTeamData());
    careTeamServ.on("removed", (obj) => getCareTeamData());
  }, [limit, page]);

  const onTableChangeRowsPerPage = (size) => {
    setLimit(size);
    setPage(1);
  };

  const onTablePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <PageWrapper style={{ flexDirection: "column", padding: "0.6rem 1rem" }}>
        <TableMenu>
          <div style={{ display: "flex", alignItems: "center" }}>
            {handleSearch && (
              <div className="inner-table">
                <FilterMenu onSearch={handleSearch} />
              </div>
            )}
            <h2 style={{ margin: "0 10px", fontSize: "0.95rem" }}>Care Team</h2>
          </div>

          <GlobalCustomButton onClick={handleCreateModal}>
            <AddCircleOutline fontSize="small" sx={{ marginRight: "5px" }} />
            Create Care Team
          </GlobalCustomButton>
        </TableMenu>
        <ModalBox
          open={createModal}
          onClose={handleHideCreateModal}
          header="Create Care Team"
        >
          <CreateCareTeam onClose={handleHideCreateModal} />
        </ModalBox>

        <div
          className="level"
          style={{
            overflow: "auto",
          }}
        >
          <CustomTable
            title={"Tasks"}
            columns={TeamSchema}
            data={
              careTeamData && Array.isArray(careTeamData) ? careTeamData : []
            }
            pointerOnHover
            highlightOnHover
            striped
            onChangeRowsPerPage={onTableChangeRowsPerPage}
            onChangePage={onTablePageChange}
            onRowClicked={(data) => {
              handleEditModal(data);
            }}
            pagination
            progressPending={loading}
            paginationServer
            paginationTotalRows={total}
          />
        </div>
        <CustomConfirmationDialog
          open={confirmationDialog}
          confirmationAction={() => handleDelete(teamToDelete)}
          cancelAction={closeConfirmationDialog}
          type="danger"
          message={`You are about to delete a team: ${
            teamToDelete?.name
          } created on ${dayjs(teamToDelete?.createdAt).format("DD-MM-YYYY")}`}
        />
        <ModalBox
          open={editModal}
          onClose={handleHideEditModal}
          header="Modify Care Team"
          data={data}
        >
          <EditCareTeam data={data} onClose={handleHideEditModal} />
        </ModalBox>
      </PageWrapper>
    </div>
  );
};

export default CareTeam;
