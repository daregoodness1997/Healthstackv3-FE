import React, { useState, useContext, useEffect, useRef } from "react";
import client from "../../feathers";
import { UserContext, ObjectContext } from "../../context";
import { toast } from "bulma-toast";
import { formatDistanceToNowStrict } from "date-fns";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ModalBox from "./ui-components/modal";
import { useCallback } from "react";

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export function FamilyProfileSearch({
  getSearchFamilyProfile,
  clear,
  label,
  id,
  patient,
  isPhoneNumber=false
}) {
  const ClientServ = client.service("familyprofile");
  const [facilities, setFacilities] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

  const [simpa, setSimpa] = useState("");
  const [chosen, setChosen] = useState(false);
  const [count, setCount] = useState(0);
  const inputEl = useRef(null);
  const [val, setVal] = useState("");
  const { user } = useContext(UserContext);
  const { state } = useContext(ObjectContext);
  const [productModal, setProductModal] = useState(false);

  const dropDownRef = useRef(null);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const getData = setTimeout(() => {
      handleSearch(search);
    }, 1000);

    return () => clearTimeout(getData);
  }, [search]);

  const getInitial = useCallback(async (id) => {
    try {
      const resp = await ClientServ.get(id);
      handleRow(resp);
    } catch (err) {
      return err;
    }
  }, []);

  useEffect(() => {
    if (id) {
      getInitial(id);
    }
  }, [id, getInitial]);

  const handleRow = async (obj) => {
    await setChosen(true);
    getSearchFamilyProfile(obj);
    if(isPhoneNumber){
      await setSimpa(obj.contactPhoneNumber);
    }else {
      await setSimpa(obj.name);
    }
    
    setShowPanel(false);
    await setCount(2);
  };

  useEffect(() => {
    if (!patient) return;
    handleRow(patient);
  }, [patient]);

  const handleSearch = async (value) => {
    setVal(value);
    if (value === "") {
      setShowPanel(false);
      return;
    }

    const query = {
      $or: [
        {
          name: {
            $regex: value,
            $options: "i",
          },
        },
      ],
      facilityId: user.currentEmployee.facilityDetail._id,
      $limit: 10,
    };
    if (value.length >= 3) {
      ClientServ.find({ query })
        .then((res) => {
          setFacilities(res.data);
          setSearchMessage("Product fetched successfully");
          setShowPanel(true);
        })
        .catch((err) => {
          toast({
            message: "Error creating ProductEntry " + err,
            type: "is-danger",
            dismissible: true,
            pauseOnHover: true,
          });
        });
    } else {
      setShowPanel(false);
      await setFacilities([]);
    }
  };

  //   const handleAddproduct = () => {
  //     setProductModal(true);
  //   };

  const handlecloseModal = () => {
    setProductModal(false);
    handleSearch(val);
  };

  useEffect(() => {
    if (clear) {
      setSimpa("");
    }
    return () => {};
  }, [clear]);

  useOnClickOutside(dropDownRef, () => setShowPanel(false));

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <Autocomplete
        /*  disabled={disabled} */
        size="small"
        value={simpa}
        onChange={(event, newValue, reason) => {
          if (reason === "clear") {
            setSimpa("");
          } else {
            handleRow(newValue);
          }
        }}
        id="free-solo-dialog-demo"
        options={facilities}
        onInputChange={(e, value) => setSearch(value)}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          //   const age = option.dob? formatDistanceToNowStrict(new Date(option.dob)):""
          const label = `${option?.name}`;
          return label;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        noOptionsText={
          val === "" ? "Type something..." : `${val} was not found`
        }
        sx={{
          width: "100%",
        }}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label={label || "Search for Client"}
            /*   onChange={e => handleSearch(e.target.value)} */
            ref={inputEl}
            /*  sx={{
              fontSize: "0.75rem",
              backgroundColor: "#ffffff",
              "& .MuiInputBase-input": {
                height: "0.9rem",
                fontSize: "0.75rem",
              },

              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
              },
            }} */
            //disabled={disabled}
            InputLabelProps={{
              shrink: true,
              style: { color: "#2d2d2d" },
            }}
          />
        )}
      />

      <ModalBox open={productModal} onClose={handlecloseModal}>
        <div className={`modal ${productModal ? "is-active" : ""}`}>
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Choose Store</p>
              <button
                className="delete"
                aria-label="close"
                onClick={handlecloseModal}
              ></button>
            </header>
            <section className="modal-card-body"></section>
          </div>
        </div>
      </ModalBox>
    </div>
  );
}
