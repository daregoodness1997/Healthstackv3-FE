import React from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Stack,
  Grid,
} from "@mui/material";
import GlobalCustomButton from "../../../../components/buttons/CustomButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import Input from "../../../../components/inputs/basic/Input";
import FemaleHistory from "./FemaleHistory";
import MaleHistory from "./MaleHistory";
import ArtDocumentation from "../art-documentation";
import { useForm } from "react-hook-form";
import client from "../../../../feathers";
import { useContext } from "react";
import { ObjectContext, UserContext } from "../../../../context";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import EmployeeSearch from "../../../helpers/EmployeeSearch";

export default function ProfileManagementDetail({
  handleGoBack,
  showAppointment,
  showFemaleModal,
  showMaleModal,
  profileLabId,
}) {
  const [currentView, setCurrentView] = React.useState("detail");

  const handleSetCurrentView = (view) => {
    setCurrentView(view);
  };

  const [femaleProfile, setFemaleProfile] = useState(null);
  const [maleProfile, setMaleProfile] = useState(null);

  const familyProfileServ = client.service("familyprofile");
  const { state } =
    useContext(ObjectContext);
  const { user } = useContext(UserContext);

  const getFamilyProfile = async () => {
    const facId = user.currentEmployee.facilityDetail._id;
    const profileId = state.ARTModule.selectedFamilyProfile._id;

    let query = {
      facilityId: facId,
      _id: profileId || profileLabId,
    };

    const res = await familyProfileServ.find({ query });

    if (res.data.length > 0) {
      setMaleProfile(res.data[0].maleClient);
      setFemaleProfile(res.data[0].femaleClient);
    }
  };

  useEffect(() => {
    getFamilyProfile();

    familyProfileServ.on("created", (obj) => getFamilyProfile());
    familyProfileServ.on("updated", (obj) => getFamilyProfile());
    familyProfileServ.on("patched", (obj) => getFamilyProfile());
    familyProfileServ.on("removed", (obj) => getFamilyProfile());
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "90vh",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          borderBottom: "1px solid #f8f8f8",
          backgroundColor: "#f8f8f8",
          position: "sticky",
          zIndex: 99,
          top: 0,
          left: 0,
          width: "100%",
        }}
        mb={2}
        p={2}
        pb={1}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          gap={1}
        >
          <GlobalCustomButton onClick={handleGoBack}>
            <ArrowBackIcon sx={{ marginRight: "3px" }} fontSize="small" />
            Back
          </GlobalCustomButton>

          {currentView === "detail" && (
            <Typography
              sx={{
                fontSize: "0.82rem",
                fontWeight: "600",
              }}
            >
              Profile Management Details
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "calc(100% - 250px)",
            flexWrap: "wrap",
          }}
          mb={2}
          gap={1}
        >
          <GlobalCustomButton
            color="secondary"
            onClick={() => handleSetCurrentView("detail")}
            sx={
              currentView === "detail"
                ? {
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                    },
                  }
                : {}
            }
          >
            Detail
          </GlobalCustomButton>
          <GlobalCustomButton
            color="info"
            onClick={showAppointment}
            sx={
              currentView === "appointments"
                ? {
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                    },
                  }
                : {}
            }
          >
            Appointments
          </GlobalCustomButton>

          <GlobalCustomButton
            color="success"
            onClick={() => handleSetCurrentView("documentation")}
            sx={
              currentView === "documentation"
                ? {
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                    },
                  }
                : {}
            }
          >
            Documentation
          </GlobalCustomButton>

          <GlobalCustomButton
            onClick={() => handleSetCurrentView("female")}
            sx={
              currentView === "female"
                ? {
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                    },
                  }
                : {}
            }
          >
            Female History
          </GlobalCustomButton>

          <GlobalCustomButton
            onClick={() => handleSetCurrentView("male")}
            sx={
              currentView === "male"
                ? {
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                    },
                  }
                : {}
            }
          >
            Male History
          </GlobalCustomButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          width: "100%",
          gap: "10px",
          py: "6px",
          px: "15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "40%",
          }}
        >
          <UserProfileCard
            name={femaleProfile?.name || "N/A"}
            age={femaleProfile?.age || "N/A"}
            gender={femaleProfile?.gender || "N/A"}
            onClick={showFemaleModal}
            allergies={femaleProfile?.allergies || "N/A"}
            comorbidities={femaleProfile?.coMorbidities || "N/A"}
            disabilities={femaleProfile?.disabilities || "N/A"}
            occupation={femaleProfile?.occupation || "N/A"}
          />

          <UserProfileCard
            name={maleProfile?.name || "N/A"}
            age={maleProfile?.age || "N/A"}
            gender={maleProfile?.gender || "N/A"}
            onClick={showMaleModal}
            allergies={maleProfile?.allergies || "N/A"}
            comorbidities={maleProfile?.coMorbidities || "N/A"}
            disabilities={maleProfile?.disabilities || "N/A"}
            occupation={maleProfile?.occupation || "N/A"}
          />
        </Box>

        <Box
          item
          sx={{
            width: "100%",
            overflowX: "hidden",
          }}
        >
          {currentView === "detail" && <EditProfileManagement />}
          {currentView === "documentation" && <ArtDocumentation />}
          {currentView === "female" && (
            <div>
              <FemaleHistory />
            </div>
          )}
          {currentView === "male" && (
            <div>
              <MaleHistory />
            </div>
          )}
        </Box>
      </Box>
    </Box>
  );
}

const UserProfileCard = ({
  name,
  age,
  gender,
  avatarSrc,
  allergies,
  comorbidities,
  disabilities,
  occupation,
  onClick,
}) => {
  return (
    <Card
      sx={{
        width: "280px",
        height: "320px",
        mb: 3,
        backgroundColor: "#F8F8F8",
        cursor: "pointer",
      }}
      variant="outlined"
      onClick={onClick}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={avatarSrc || null}
            sx={{ width: 88, height: 84 }}
            variant="circle"
          />
          <Box>
            <Typography variant="h6" component="div" fontWeight="bold">
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {age} , {gender}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 4 }} />
        <Box>
          <Typography variant="body2" fontWeight="bold">
            Specific instructions:
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Typography variant="body2">Allergies:</Typography>
            <Typography variant="body2">{allergies}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Typography variant="body2">Co-morbidities:</Typography>
            <Typography variant="body2">{comorbidities}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Typography variant="body2">Disabilities:</Typography>
            <Typography variant="body2">{disabilities}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Typography variant="body2">Occupation:</Typography>
            <Typography variant="body2">{occupation}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

function EditProfileManagement() {
  const [editMode, setEditMode] = useState(false);
  const familyProfileServ = client.service("familyprofile");
  const { user } = useContext(UserContext);
  const { state, setState, showActionLoader, hideActionLoader } =
    useContext(ObjectContext);
  const [practitioner, setPractitioner] = useState(null);

  const documentId = state.ARTModule.selectedFamilyProfile._id;
  const familyProfileStateData = state.ARTModule.selectedFamilyProfile || [];
  const practitionerData =
    state.ARTModule.selectedFamilyProfile.practitioner || "";

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: familyProfileStateData.name,
      file_number: familyProfileStateData.file_number,
      yearTtc: familyProfileStateData.yearTtc,
      email: familyProfileStateData.email,
      marriedHowLong: familyProfileStateData.marriedHowLong,
      contactPhoneNumber: familyProfileStateData.contactPhoneNumber,
      practitioner: familyProfileStateData.practitioner,
      createdby: user.currentEmployee.userId,
    },
  });

  useEffect(() => {
    const familyProfileState = state.ARTModule.selectedFamilyProfile;
    reset(familyProfileState && Array.isArray(familyProfileState));
  }, [reset, state.ARTModule.selectedFamilyProfile]);

  const handleGetSearchPractitioner = (practitioner) => {
    setPractitioner(practitioner);
  };

  const onSubmit = async (data) => {
    showActionLoader();
    const profileData = {
      ...familyProfileStateData,
      facilityId: user.currentEmployee.facilityDetail._id,
      name: data.name,
      yearTtc: data.yearTtc,
      email: data.email,
      marriedHowLong: data.marriedHowLong,
      contactPhoneNumber: data.contactPhoneNumber,
      practitioner: practitioner
        ? `${practitioner?.firstname} ${practitioner?.lastname}`
        : practitionerData,
      createdby: user.currentEmployee.userId,
    };
    try {
      await familyProfileServ.patch(documentId, profileData);
      toast.success("Profile updated successfully");
      // console.log(familyProfileServ);
    } catch (err) {
      toast.error("Error submitting Profile: " + err);
      // console.log(err);
    } finally {
      hideActionLoader();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        {editMode ? (
          <>
            <GlobalCustomButton type="submit" onClick={handleSubmit(onSubmit)}>
              <ControlPointIcon fontSize="small" sx={{ marginRight: "5px" }} />
              Update New Profile
            </GlobalCustomButton>
            <GlobalCustomButton
              color="error"
              onClick={() => setEditMode(false)}
            >
              Cancel Edit
            </GlobalCustomButton>
          </>
        ) : (
          <GlobalCustomButton type="submit" onClick={handleEdit}>
            <EditIcon fontSize="small" sx={{ marginRight: "5px" }} />
            Edit New Profile
          </GlobalCustomButton>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Input
            label="File Number"
            name="file_number"
            register={register("file_number")}
            disabled={true}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            label="Profile Name"
            name="name"
            type="text"
            register={register("name")}
            disabled={!editMode}
          />
        </Grid>

        <Grid item xs={12}>
          <Input
            label="Years TTC"
            name="yearTtc"
            type="number"
            register={register("yearTtc")}
            disabled={!editMode}
          />
        </Grid>

        <Grid item xs={12}>
          <Input
            label="Email"
            name="email"
            type="email"
            register={register("email")}
            disabled={!editMode}
          />
        </Grid>

        <Grid item xs={12}>
          <Input
            label="Phone Number"
            name="contactPhoneNumber"
            type="tel"
            register={register("contactPhoneNumber")}
            disabled={!editMode}
          />
        </Grid>
        <Grid item xs={12}>
          {!editMode ? (
            <Input
              label="Practitioner"
              type="text"
              disabled={!editMode}
              register={register("practitioner")}
            />
          ) : (
            <EmployeeSearch
              label="Practitioner"
              getSearchfacility={handleGetSearchPractitioner}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Input
            label="How long have your been married?"
            name="marriedHowLong"
            type="number"
            register={register("marriedHowLong")}
            disabled={!editMode}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
