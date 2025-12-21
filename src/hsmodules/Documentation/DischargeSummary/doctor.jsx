import React, { useState, useContext, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import Textarea from "../../../components/inputs/basic/Textarea";
import Input from "../../../components/inputs/basic/Input";
import EmployeeSearch from "../../helpers/EmployeeSearch";
import { UserContext, ObjectContext } from "../../../context";
import client from "../../../feathers";

const EmployeeServ = client.service("employee");
const Doctor = ({
  register,
  // nameOfDoctor,
  // setNameOfDoctor,
  //signatureUrl,
  setSignatureUrl,
}) => {
  const { user } = useContext(UserContext);
  const { state, setState, hideActionLoader, showActionLoader } =
    useContext(ObjectContext);

  const { firstname, lastname, signatureUrl } = user.currentEmployee;

  //console.log(user);

  useEffect(() => {
    //console.log(user);
    //const { fisignatureUrl } = user.currentEmployee;
    //setNameOfDoctor(`${firstname} ${lastname}`);
    setSignatureUrl(signatureUrl);
  }, [user]);

  // const handleEmployeeSearch = (data) => {
  //   console.log(data);
  //   const { firstname, lastname } = data;
  //   setNameOfDoctor(`Dr ${firstname} ${lastname}`);
  //   const userId = user.currentEmployee._id;
  //   EmployeeServ.get({
  //     _id: userId,
  //   })
  //     .then((res) => {
  //       console.log(res);
  //       setSignatureUrl(res?.signatureUrl);
  //       // setUserData(res);
  //       // hideActionLoader();
  //       //
  //     })
  //     .catch((err) => {
  //       hideActionLoader();
  //       console.log(err);
  //     });
  // };

  //console.log(signatureUrl);

  return (
    <>
      <Grid item md={12} sm={12} xs={12}>
        <Textarea
          register={register("Condition on discharge")}
          type="text"
          label="Condition on discharge"
        />
      </Grid>

      <Grid item md={4} sm={4} xs={6}>
        {/* <EmployeeSearch
          register={register("Name of Doctor", {
            value: nameOfDoctor,
          })}
          //register={register("Name of Doctor")}
          value={nameOfDoctor}
          label={"Name of Doctor"}
          getSearchfacility={handleEmployeeSearch}
        /> */}
        <Input
          register={register("Name of Doctor", {
            value: `${firstname} ${lastname}`,
          })}
          value={`${firstname} ${lastname}`}
          //register={register("Name of Doctor")}
          type={"text"}
          disabled
          label={"Name of Doctor"}
        />
      </Grid>

      <Grid item md={4} sm={4} xs={6}>
        <div
          style={{
            borderBottom: "1px solid #BBBBBB",
          }}
        >
          {signatureUrl !== "" && signatureUrl !== undefined ? (
            <img
              src={signatureUrl}
              alt=""
              style={{
                textAlign: "center",
                width: "60px",
                height: "30px",
                margin: "0px 60px",
              }}
            />
          ) : (
            <div
              style={{
                textAlign: "center",
                fontSize: "20px",
                color: "grey",
                height: "35px",
              }}
            >
              No signature..
            </div>
          )}
        </div>
      </Grid>

      <Grid item md={4} sm={4} xs={6}>
        <Input
          register={register("Date")}
          //value={mrn}
          type="date"
          label="Date"
        />
      </Grid>
    </>
  );
};

export default Doctor;
