/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import client from "../../../feathers";
import { UserContext } from "../../../context";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
import ProductSearchHelper from "../../helpers/ProductSearch";

export function InventoryCreate() {
  const { register, handleSubmit, setValue } = useForm();
  const InventoryServ = client.service("inventory");
  const { user } = useContext(UserContext);

  const getSearchfacility = (obj) => {
    setValue("facility", obj._id, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  //check user for facility or get list of facility
  useEffect(() => {
    if (!user.stacker) {
      //console.log(currentUser)
      setValue("facility", user.currentEmployee.facilityDetail._id, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  });

  const onSubmit = (data, e) => {
    e.preventDefault();
    if (user.currentEmployee) {
      data.facility = user.currentEmployee.facilityDetail._id;
    }
    InventoryServ.create(data)
      .then(() => {
        e.target.reset();
        toast({
          message: "Inventory created succesfully",
          type: "is-success",
          dismissible: true,
          pauseOnHover: true,
        });
      })
      .catch((err) => {
        toast({
          message: "Error creating Inventory " + err,
          type: "is-danger",
          dismissible: true,
          pauseOnHover: true,
        });
      });
  };

  return (
    <>
      <Box
        container
        sx={{
          width: "700px",
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        <Box></Box>
      </Box>
      <div className="card ">
        <div className="card-header">
          <p className="card-header-title">
            Create Inventory: Product Entry- Initialization, Purchase Invoice,
            Audit
          </p>
        </div>
        <div className="card-content vscrollable">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
              <div className="control">
                <div className="select is-small">
                  <select>
                    <option>Purchase Invoice </option>
                    <option>Initialization</option>
                    <option>Audit</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                {" "}
                {/* Audit/initialization/Purchase Invoice */}
                <input
                  className="input is-small"
                  {...register("x", { required: true })}
                  name="type"
                  type="text"
                  placeholder="Type of Product Entry"
                />
                <span className="icon is-small is-left">
                  <i className=" fas fa-user-md "></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left has-icons-right">
                <input
                  className="input is-small"
                  {...register("x", { required: true })}
                  name="supplier"
                  type="text"
                  placeholder="Supplier"
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-hospital"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left has-icons-right">
                <input
                  className="input is-small"
                  {...register("x", { required: true })}
                  name="date"
                  type="text"
                  placeholder="Date"
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-map-signs"></i>
                </span>
              </p>
            </div>

            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input is-small"
                  {...register("x", { required: true })}
                  name="totalamount"
                  type="text"
                  placeholder=" Total Amount"
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-phone-alt"></i>
                </span>
              </p>
            </div>

            {/* array of inventory items */}
            <p className="control">
              <button className="button is-info is-small  is-pulled-right">
                <span className="is-small"> +</span>
              </button>
            </p>
            <div
              className="field" /* style={ !user.stacker?{display:"none"}:{}} */
            >
              <ProductSearchHelper
                getSearchfacility={getSearchfacility}
                // clear={success}
              />
              <p
                className="control has-icons-left "
                style={{ display: "none" }}
              >
                <input
                  className="input is-small"
                  {...register("x", { required: true })}
                  /* add array no */ name="productId"
                  type="text"
                  placeholder="Product Id"
                />
                <span className="icon is-small is-left">
                  <i className="fas  fa-map-marker-alt"></i>
                </span>
              </p>
            </div>

            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input is-small"
                  {...register("x", { required: true })}
                  name="quantity"
                  type="text"
                  placeholder="Quantity"
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
              </p>
              <label className="label is-small">Base Unit</label>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input is-small"
                  {...register("x", { required: true })}
                  name="costprice"
                  type="text"
                  placeholder="Cost Price"
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
              </p>
            </div>

            <div className="field">
              <p className="control">
                <button className="button is-success is-small">Create</button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
