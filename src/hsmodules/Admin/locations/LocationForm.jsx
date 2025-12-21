import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast} from "react-toastify";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import Input from "../../../components/inputs/basic/Input";
import CustomSelect from "../../../components/inputs/basic/Select";
import { UserContext } from "../../../context";
import { yupResolver } from "@hookform/resolvers/yup";
import { locationTypeOptions } from "../../../dummy-data";
import client from "../../../feathers";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { BottomWrapper } from "../../app/styles";
import { createLocationSchema } from "../schema";
import ModalBox from "../../../components/modal";

export const LocationForm = ({ open, setOpen }) => {
  const LocationServ = client.service("location");
  const [branch, setBranch] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  // eslint-disable-next-line
  const location = {};
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
    LocationServ.on("created", (obj) => getBranch());
    LocationServ.on("updated", (obj) => getBranch());
    LocationServ.on("patched", (obj) => getBranch());
    LocationServ.on("removed", (obj) => getBranch());
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(createLocationSchema),

    defaultValues: {
      name: location.name,
      locationType: location.locationType,
      facility: user.currentEmployee.facilityDetail._id,
    },
  });

  const submit = async (data, e) => {
    setLoading(true);
    e.preventDefault();
    await LocationServ.create(data)
      .then((res) => {
        toast.success(`Location successfully created`);
        reset();
        setLoading(false);
        setOpen(false);
      })
      .catch((err) => {
        toast.error(`Sorry, You weren't able to create a location. ${err}`);
        setLoading(false);
      });
    setLoading(false);
  };

  return (
    <ModalBox open={open} onClose={setOpen} header="Create Location">
      <form>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input
            label="Name of Location"
            register={register("name")}
            errorText={errors?.name?.message}
            sx={{ marginBottom: "2rem" }}
          />
          <CustomSelect
            label="Choose Location Type"
            name="locationType"
            options={locationTypeOptions}
            register={register("locationType")}
            sx={{ marginBottom: "2rem" }}
          />
          <CustomSelect
            label="Choose Branch"
            name="branch"
            options={branch}
            register={register("branch")}
            sx={{ marginBottom: "2rem" }}
          />
        </div>
        <BottomWrapper>
          <GlobalCustomButton type="submit" onClick={handleSubmit(submit)} loading={loading}>
            <ControlPointIcon fontSize="small" sx={{ marginRight: "5px" }} />
            Create Location
          </GlobalCustomButton>
        </BottomWrapper>
      </form>
    </ModalBox>
  );
};
