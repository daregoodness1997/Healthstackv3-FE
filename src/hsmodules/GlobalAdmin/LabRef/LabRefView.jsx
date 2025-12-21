import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Input from "../../../components/inputs/basic/Input";
import { UserContext, ObjectContext } from "../../../context";
import { Box, Grid } from "@mui/material";
import client from "../../../feathers";
import { yupResolver } from "@hookform/resolvers/yup";
import { LocationDetailSchema, createLocationSchema } from "../schema";
import CustomSelect from "../../../components/inputs/basic/Select";
import CustomTable from "../../../components/customtable";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalBox from "../../../components/modal";
import CustomConfirmationDialog from "../../../components/confirm-dialog/confirm-dialog";

const LabRefView = ({ open, setOpen, location }) => {
  const LocationServ = client.service("location");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const result = localStorage.getItem("user");
  const [openLoc, setOpenLoc] = useState(false);
  const [openSubLoc, setOpenSubLoc] = useState(false);
  const sublocationTypeOptions = ["Bed", "Unit"];
  const [typeLocation, setTypeLocation] = useState("");
  const [typeName, setTypeName] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmDialog2, setConfirmDialog2] = useState(false);
  const [sublocationData, setSubLocationData] = useState([]);
  const [locationType, setLocationType] = useState(location.locationType);
  const [locationName, setLocationName] = useState(location.name);
  const [locationBranch, setLocationBranch] = useState(location.branch); 
  const [branch, setBranch] = useState([]);

 
  const { state, setState } = useContext(ObjectContext);
  const { user } = useContext(UserContext);
  const data = JSON.parse(result);
  const locationDetails = state.LocationModule.selectedLocation;

  const locationTypeOptions = [
    "Front Desk",
    "Clinic",
    "Ward",
    "Store",
    "Laboratory",
    "Finance",
    "Theatre",
    "Pharmacy",
    "Radiology",
    "Managed Care",
    "Branch",
  ];

  const handleCloseModal = () => {
    setOpenLoc(false);
  };

  const handleClose = () => {
    setOpenSubLoc(false);
  };
  const {
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(createLocationSchema),

    defaultValues: {
      name: location.name,
      locationType: location.locationType,
      branch: location.branch,
      facility: data.currentEmployee.facility,
    },
  });

  const getBranch = async () => {
    await LocationServ.find({
      query: {
        facility: user.currentEmployee.facilityDetail._id,
        locationType: "Branch",
      },
    })
      .then((resp) => {
        setBranch(resp.data);
      })
      .catch((err) => {
        return err;
      });
  };
  useEffect(() => {
    getBranch();

    reset({
      name: location.name,
      branch: location.branch,
      bandType: location.locationType,
      facility: data.currentEmployee.facility,
    });
  }, []);

  const existingSublocation = location?.sublocations?.filter(
    (items) => items.typeName === typeName
  );

  const onSubmit = (e) => {
    if (typeLocation === "" && typeName === "") {
      alert("Kindly enter missing data ");
    }

    if (!location.sublocations) {
      location.sublocations = [];
    }

    if (existingSublocation.length > 0) {
      toast.warning("Name already choosen");
      return;
    }

    let data = {
      type: typeLocation,
      typeName: typeName,
    };

    location.sublocations.push(data);
    reset();
  };

  const handleRowClick = (sublocation) => {
    setSubLocationData(sublocation);
    setOpenSubLoc(true);
  };

  const submit = async () => {
    setLoading(true);
    const data = {};
    data.name = locationName;
    data.branch = locationBranch;
    data.locationType = locationType;
    data.sublocations = locationDetails.sublocations;
    setSuccess(false);
    await LocationServ.patch(locationDetails._id, data)
      .then((res) => {
        toast.success(`Location successfully updated`);
        setLoading(false);
        setOpen(false);
      })
      .catch((err) => {
        toast.error(`Sorry, You weren't able to update a location. ${err}`);
        setLoading(false);
      });

    setLoading(false);
  };

  const deleteLocation = async () => {
    const dleteId = locationDetails._id;
    LocationServ.remove(dleteId)
      .then((res) => {
        toast.success(`Location successfully deleted!`);
        setOpen(false);
        setConfirmDialog(false);
      })
      .catch((err) => {
        toast.error(`Sorry, Unable to delete location. ${err}`);
      });
  };

  const deleteSublocation = () => {
    setOpenSubLoc(true);
    const prevSublocation = locationDetails.sublocations || [];

    const newSublocation = prevSublocation.filter(
      (data) => data?._id !== sublocationData._id
    );

    const newLocation = {
      ...locationDetails,
      sublocations: newSublocation,
    };

    LocationServ.patch(locationDetails._id, newLocation)
      .then((res) => {
        setState((prev) => ({
          ...prev,
          LocationModule: { ...prev.ServicesModule, selectedLocation: res },
        }));
        toast.success(`Sublocation successfully deleted!`);
        setOpenSubLoc(false);
        setConfirmDialog2(false);
      })
      .catch((err) => {
        setOpenSubLoc(false);
        toast.error(`Sorry, Unable to delete sublocation. ${err}`);
      });
  };

  return (
    <Box>
      <CustomConfirmationDialog
        open={confirmDialog}
        cancelAction={() => setConfirmDialog(false)}
        confirmationAction={deleteLocation}
        type="danger"
        message="Are you sure you want to delete this data?"
      />
      <CustomConfirmationDialog
        open={confirmDialog2}
        cancelAction={() => setConfirmDialog2(false)}
        confirmationAction={deleteSublocation}
        type="danger"
        message="Are you sure you want to delete this data?"
      />
      <ModalBox
        open={openSubLoc}
        header="Sub Location Details"
        onClose={handleClose}
        width="60%"
      >
        <Box display="flex" justifyContent="flex-end" py="1rem">
          <GlobalCustomButton
            onClick={() => setConfirmDialog2(true)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
            Delete
          </GlobalCustomButton>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomSelect
              label="Choose Sub-location Type"
              name="typeLocation"
              defaultValue={sublocationData?.type}
              options={sublocationTypeOptions}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              name="typeName"
              label="Name of sub location"
              defaultValue={sublocationData?.typeName}
            />
          </Grid>
        </Grid>
      </ModalBox>
      <ModalBox
        open={openLoc}
        header="Add Sub Location"
        onClose={handleCloseModal}
        width="60%"
      >
        <Box display="flex" justifyContent="flex-end" py="1rem">
          <GlobalCustomButton onClick={() => onSubmit()}>
            Add
          </GlobalCustomButton>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomSelect
              label="Choose Sub-location Type"
              name="typeLocation"
              value={typeLocation}
              options={sublocationTypeOptions}
              onChange={(e) => setTypeLocation(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              name="typeName"
              label="Name of sub location"
              onChange={(e) => setTypeName(e.target.value)}
              value={typeName}
            />
          </Grid>
        </Grid>
      </ModalBox>
      <Box display="flex" justifyContent="flex-end" gap="1rem" my="2rem">
        <GlobalCustomButton
          onClick={() => setConfirmDialog(true)}
          color="error"
        >
          <DeleteIcon fontSize="small" sx={{ marginRight: "5px" }} />
          Delete
        </GlobalCustomButton>

        {!editing ? (
          <GlobalCustomButton
            onClick={() => {
              setEditing(!editing);
            }}
          >
            <CreateIcon fontSize="small" sx={{ marginRight: "5px" }} />
            Edit
          </GlobalCustomButton>
        ) : (
          <GlobalCustomButton
            onClick={submit}
            color="success"
            text="Update"
            type="submit"
            loading={loading}
          />
        )}
      </Box>
      <Grid container spacing={2}>
          

        {!editing ? (
          <Grid item xs={6}>
            <Input
              label="Name"
              register={register("name")}
              defaultValue={location?.name}
              disabled={!editing}
            />
          </Grid>
        ) : (
          <Grid item xs={6}>
            <Input
              name="name"
              label="Name"
              type="text"
              onChange={(e) => setLocationName(e.target.value)}
              defaultValue={`${locationName}`}
            />
          </Grid>
        )}
        {!editing ? (
          <Grid item xs={6}>
            <Input
              label="Location Type"
              register={register("locationType")}
              defaultValue={location?.locationType}
              disabled={!editing}
            />
          </Grid>
        ) : (
          <Grid item xs={6}>
            <div className="field">
              <div className="control">
                <CustomSelect
                  label="Choose Location Type "
                  name="type"
                  options={locationTypeOptions}
                  onChange={(e) => setLocationType(e.target.value)}
                  defaultValue={`${locationType}`}
                />
              </div>
            </div>
          </Grid>
        )}
        {!editing ? (
          <Grid item xs={6}>
            <Input
              label="Location Branch"
              register={register("branch")}
              disabled={!editing}
            />
          </Grid>
        ) : (
          <Grid item xs={6}>
            <div className="field">
              <div className="control">

                <CustomSelect
                  label="Choose Branch "
                  name="type"
                  options={branch}
                  onChange={(e) => setLocationBranch(e.target.value)}
                />
              </div>
            </div>
          </Grid>
        )}
      </Grid>
      {!editing ? null : (
        <Box pt="1.4rem">
          {location?.locationType === "Ward" && (
            <Box>
              <Box display="flex" justifyContent="flex-end" py="1rem">
                <GlobalCustomButton
                  color="warning"
                  onClick={() => setOpenLoc(true)}
                >
                  Add SubLocation
                </GlobalCustomButton>
              </Box>
              <CustomTable
                title={""}
                columns={LocationDetailSchema}
                data={location.sublocations}
                pointerOnHover
                highlightOnHover
                onRowClicked={(row) => handleRowClick(row)}
                striped
                progressPending={loading}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LabRefView;
