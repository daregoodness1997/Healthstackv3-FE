import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Input from "../../../components/inputs/basic/Input";
import { ObjectContext, UserContext } from "../../../context";
import { yupResolver } from "@hookform/resolvers/yup";
import client from "../../../feathers";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import { Box } from "@mui/system";
import { GridBox } from "../../app/styles";
import PasswordInput from "../../../components/inputs/basic/Password";
import { createEmployeeSchema } from "../../GlobalAdmin/schema";

export const EmployeeForm = ({ open, setOpen }) => {
  const EmployeeServ = client.service("employee");
  const { user } = useContext(UserContext);
  const { showActionLoader, hideActionLoader } = useContext(ObjectContext);

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { isSubmitSuccessful, errors },
  } = useForm({
    resolver: yupResolver(createEmployeeSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const submit = async (data) => {
    showActionLoader();
    data.createdby = user._id;
    data.facility = user.currentEmployee.facility;
    data.imageurl = "";
    data.roles = ["Communication"];

    await EmployeeServ.create(data)
      .then((res) => {
        hideActionLoader();
        toast.success(`Employee successfully created`);
        setOpen(false);
        reset();
      })
      .catch((err) => {
        hideActionLoader();
        toast.error(`Sorry, You weren't able to create an Employee. ${err}`);
      });
  };

  useEffect(() => {
    clearErrors();
  }, []);

  return (
    <Box sx={{ width: "50vw" }}>

      <Box display="flex" justifyContent="flex-end">
        <GlobalCustomButton
          type="submit"
          //loading={loading}
          onClick={handleSubmit(submit)}
        >
          <ControlPointIcon fontSize="small" sx={{ marginRight: "5px" }} />
          Create New Employee
        </GlobalCustomButton>
      </Box>
      <form>
        <GridBox>
          <Input
            register={register("firstname")}
            name="firstname"
            type="text"
            label="First Name"
            errorText={errors?.firstname?.message}
            important
          />
          <Input
            register={register("lastname")}
            name="lastname"
            type="text"
            label="Last Name"
            errorText={errors?.lastname?.message}
            important
          />

          <Input
            register={register("position")}
            name="position"
            type="text"
            label="Position"
            important
            errorText={errors?.position?.message}
          />
        </GridBox>
        <GridBox>
          <Input
            register={register("profession")}
            name="profession"
            type="text"
            label="Profession"
            errorText={errors?.profession?.message}
            important
          />

          <Input
            register={register("phone")}
            name="phone"
            type="tel"
            label="Phone No"
            errorText={errors?.phone?.message}
            important
          />
          <Input
            register={register("email")}
            name="email"
            type="email"
            label="Email"
            errorText={errors?.email?.message}
            important
          />
        </GridBox>
        <GridBox>
          <Input
            register={register("department")}
            name="department"
            type="text"
            label="Department"
            errorText={errors?.department?.message}
            important
          />
          <Input
            register={register("deptunit")}
            name="deptunit"
            type="text"
            label="Department Unit"
            errorText={errors?.deptunit?.message}
          />
          <PasswordInput
            register={register("password")}
            type="text"
            label="Password"
            errorText={errors?.password?.message}
            autoComplete="new-password"
            important
          />
        </GridBox>
      </form>
    </Box>
  );
};
