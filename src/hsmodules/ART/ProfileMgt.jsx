/* eslint-disable */
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { PageWrapper } from "../../ui/styled/styles";
import { TableMenu } from "../../ui/styled/global";
import FilterMenu from "../../components/utilities/FilterMenu";
import CustomTable from "../../components/customtable";
import ModalBox from "../../components/modal";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { Box, IconButton } from "@mui/material";
import ProfileManagementDetail from "./components/profileMgt/profileDetails";
import CreateProfileManagement from "./components/profileMgt/createProfile";
import { ArtAppointment } from "./components/appointment";
import ProfileSpecification from "./components/profileMgt/addProfileSpecification";
import client from "../../feathers";
import { useContext } from "react";
import { ObjectContext, UserContext } from "../../context";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { DeleteOutline } from "@mui/icons-material";

export default function ProfileMgt() {
  const [createModal, setCreateModal] = useState(false);
  const [createAppointmentModal, setCreateAppointmentModal] = useState(false);
  const [currentView, setCurrentView] = useState("lists");
  const [maleProfileModal, setMaleProfileModal] = React.useState(false);
  const [femaleProfileModal, setFemaleProfileModal] = React.useState(false);

  const familyProfileServ = client.service("familyprofile");
  const { state, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  // const { user } = useContext(UserContext)
  const documentId = state.ARTModule.selectedFamilyProfile._id;
  const prevProfileState = state.ARTModule.selectedFamilyProfile || [];

  const onSubmitMale = async (data) => {
    showActionLoader();
    const profileData = {
      ...prevProfileState,
      maleClient: {
        name: data.name,
        age: data.age,
        gender: data.gender,
        allergies: data.allergies,
        coMorbidities: data.coMorbidities,
        disabilities: data.disabilities,
        occupation: data.occupation,
      },
    };
    try {
      await familyProfileServ.patch(documentId, profileData);
      toast.success("Male specificaion created successfully");
    } catch (err) {
      toast.error("Error submitting Male specificaion: " + err);
    } finally {
      hideActionLoader();
    }
  };

  const onSubmitFemale = async (data) => {
    showActionLoader();
    const profileData = {
      ...prevProfileState,
      femaleClient: {
        name: data.name,
        age: data.age,
        gender: data.gender,
        allergies: data.allergies,
        coMorbidities: data.coMorbidities,
        disabilities: data.disabilities,
        occupation: data.occupation,
      },
    };
    try {
      await familyProfileServ.patch(documentId, profileData);
      toast.success("Female specificaion created successfully");
    } catch (err) {
      toast.error("Error submitting Female specificaion: " + err);
    } finally {
      hideActionLoader();
    }
  };

  const handleGoBack = () => {
    setCurrentView("lists");
  };
  const handleCreateModal = () => {
    setCreateModal(true);
  };

  const handleHideCreateModal = () => {
    setCreateModal(false);
  };

  const handleHideAppointmentModal = () => {
    setCreateAppointmentModal(false);
  };

  const handleCloseMaleProfileModal = () => {
    setMaleProfileModal(false);
  };
  const handleCloseFemaleProfileModal = () => {
    setFemaleProfileModal(false);
  };

  return (
    <Box>
      {currentView === "lists" && (
        <ProfileMgtList
          showDetail={() => setCurrentView("detail")}
          showCreateModal={handleCreateModal}
        />
      )}

      {currentView === "detail" && (
        <ProfileManagementDetail
          showAppointment={() => setCreateAppointmentModal(true)}
          showFemaleModal={() => setFemaleProfileModal(true)}
          showMaleModal={() => setMaleProfileModal(true)}
          handleGoBack={handleGoBack}
        />
      )}
      <ModalBox
        open={createModal}
        onClose={handleHideCreateModal}
        header="Create New Profile"
      >
        <CreateProfileManagement
          open={createModal}
          setOpen={handleHideCreateModal}
          closeModal={() => handleHideCreateModal()}
        />
      </ModalBox>
      <ModalBox
        open={createAppointmentModal}
        onClose={handleHideAppointmentModal}
        header="Create Appointment"
      >
        <ArtAppointment
          open={createAppointmentModal}
          setOpen={handleHideAppointmentModal}
        />
      </ModalBox>
      <ModalBox
        open={femaleProfileModal}
        onClose={handleCloseFemaleProfileModal}
        header="Female Health Conditions"
        width="40%"
      >
        <ProfileSpecification onClick={onSubmitFemale} />
      </ModalBox>
      <ModalBox
        open={maleProfileModal}
        onClose={handleCloseMaleProfileModal}
        header="Male Health Conditions"
        width="40%"
      >
        <ProfileSpecification onClick={onSubmitMale} />
      </ModalBox>
    </Box>
  );
}

export function ProfileMgtList({ showCreateModal, showDetail }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [familyProfileData, setFamilyProfileData] = useState(10);
  const [loading, setLoading] = useState(false);
  const familyProfileServ = client.service("familyprofile");
  const { user } = useContext(UserContext);
  const { setState } = useContext(ObjectContext);

  const getFamilyProfile = async () => {
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

      const res = await familyProfileServ.find({ query });
      // console.log(res, "family profile data");

      setFamilyProfileData(res.data);
      setTotal(res.total || 0);
      setLoading(false);
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFamilyProfile();
    familyProfileServ.on("created", (obj) => getFamilyProfile());
    familyProfileServ.on("updated", (obj) => getFamilyProfile());
    familyProfileServ.on("patched", (obj) => getFamilyProfile());
    familyProfileServ.on("removed", (obj) => getFamilyProfile());
  }, [page, limit]);

  const handleCreateModal = () => {
    showCreateModal();
  };

  const handleRow = async (data) => {
    setState((prev) => ({
      ...prev,
      ARTModule: { ...prev.ARTModule, selectedFamilyProfile: data },
    }));
    showDetail();
  };

  const handleSearch = (val) => {
    familyProfileServ
      .find({
        query: {
          $or: [
            {
              file_number: {
                $regex: val,
                $options: "i",
              },
            },

            {
              name: {
                $regex: val,
                $options: "i",
              },
            },
            {
              practitioner: {
                $regex: val,
                $options: "i",
              },
            },
          ],
          facilityId: user.currentEmployee.facilityDetail._id,
          $limit: limit,
          $sort: {
            createdAt: -1,
          },
        },
      })
      .then((res) => {
        setFamilyProfileData(res.data);
      })
      .catch((err) => {
        toast.error(`Something went wrong!!!! ${err}`);
      });
  };

  const ProfileMgtSchema = [
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
      name: "Date",
      selector: (row) => `${dayjs(row.createdAt).format("DD/MM/YYYY")}`,
      sortable: false,
      width: "100px",
    },
    {
      name: "File Number",
      selector: (row) => row.file_number,
      sortable: false,
      width: "120px",
    },
    {
      name: "Profile Name",
      selector: (row) => row.name,
      sortable: false,
      width: "150px",
    },
    {
      name: "Years TTC",
      selector: (row) => row.yearTtc,
      sortable: false,
      width: "100px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: false,
      width: "200px",
    },
    {
      name: "Phone Number",
      selector: (row) => row.contactPhoneNumber,
      sortable: false,
      width: "180px",
    },
    {
      name: "Practitioner",
      selector: (row) => row.practitioner,
      sortable: false,
      width: "150px",
    },
    // {
    //   name: "Delete",
    //   center: true,
    //   key: "delete",
    //   description: "Delete row",
    //   selector: (row, index) => (
    //     <IconButton
    //       sx={{ color: "red" }}
    //       // onClick={() => confirmDeleteTariff(row)}
    //     >
    //       <DeleteOutline fontSize="small" />
    //     </IconButton>
    //   ),
    //   sortable: true,
    //   required: true,
    //   inputType: "NUMBER",
    // },
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
          <TableMenu>
            <div style={{ display: "flex", alignItems: "center" }}>
              {handleSearch && (
                <div className="inner-table">
                  <FilterMenu onSearch={handleSearch} />
                </div>
              )}
              <h2 style={{ margin: "0 10px", fontSize: "0.95rem" }}>
                Profile Management
              </h2>
            </div>

            <GlobalCustomButton onClick={handleCreateModal}>
              <AddCircleOutline fontSize="small" sx={{ marginRight: "5px" }} />
              Add new Profile
            </GlobalCustomButton>
          </TableMenu>

          <div
            className="level"
            style={{
              overflow: "auto",
            }}
          >
            <CustomTable
              title={"Profile Management List"}
              columns={ProfileMgtSchema}
              data={
                familyProfileData && Array.isArray(familyProfileData)
                  ? familyProfileData
                  : []
              }
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
    </>
  );
}
