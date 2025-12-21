/* eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import client from "../../../feathers";
import { useForm } from "react-hook-form";
import { UserContext, ObjectContext } from "../../../context";
import FacilityPopup from "../../helpers/FacilityPopup";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CustomTable from "../../../components/customtable";
import Input from "../../../components/inputs/basic/Input";
import ModalBox from "../../../components/modal";
import { FormsHeaderText } from "../../../components/texts";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import ProductSearchHelper from "../../helpers/ProductSearch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import ServiceSearch from "../../helpers/ServiceSearch";
import { generateRandomString } from "../../helpers/generateString";

export default function RadiologyOrdersCreate() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const [facility, setFacility] = useState();
  const ProductEntryServ = client.service("productentry");
  //const navigate=useNavigate()
  const { user } = useContext(UserContext); //,setUser

  const [currentUser, setCurrentUser] = useState();
  const [type, setType] = useState("Purchase Invoice");
  const [documentNo, setDocumentNo] = useState("");
  const [totalamount, setTotalamount] = useState("");
  const [productId, setProductId] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [destinationModal, setDestinationModal] = useState(false);
  const [test, setTest] = useState();
  const [instruction, setInstruction] = useState("");
  const [productItem, setProductItem] = useState([]);
  const { state } = useContext(ObjectContext);
  const ClientServ = client.service("clinicaldocument");
  const [hidePanel, setHidePanel] = useState(false);
  const { register, handleSubmit, setValue, reset, errors } = useForm();

  const [productEntry, setProductEntry] = useState({
    productitems: [],
    date,
    documentNo,
    type,
    totalamount,
    source,
  });

  const handlecloseModal = () => {
    setDestinationModal(false);
    //handleSearch(val)
  };
  const productItemI = {
    /*   productId,
        name, */
    test,
    destination,
    instruction,
    destinationId,
  };
  // consider batchformat{batchno,expirydate,qtty,baseunit}
  //consider baseunoit conversions
  const getSearchfacility = (obj) => {
    if (!obj) {
      //"clear stuff"
      setInstruction("");
      setTest("");
    }
    setInstruction(obj.instruction);
    setTest(obj.test);
  };

  useEffect(() => {
    setCurrentUser(user);

    return () => {};
  }, [user]);

  useEffect(() => {
    setDestination(state.DestinationModule.selectedDestination.facilityName);
    setDestinationId(state.DestinationModule.selectedDestination._id);
    return () => {};
  }, [state.DestinationModule.selectedDestination]);

  const handleChangeType = async (e) => {
    await setType(e.target.value);
  };
  const handleClickProd = async () => {
    console.log(productItemI);
    await setSuccess(false);
    if (!(productItemI.test && productItemI.test.length > 0)) {
      toast.error("Test can not be empty ");
      return;
    }
    await setProductItem((prevProd) => [productItemI, ...prevProd]);
    setHidePanel(false);
    setName("");
    setTest("");
    setInstruction("");
    setDestination(user.currentEmployee.facilityDetail.facilityName);
    setDestinationId(user.currentEmployee.facilityDetail._id);
    // setDestination("")
    await setSuccess(true);
    const newfacilityModule = {
      selectedDestination: user.currentEmployee.facilityDetail,
      show: "list",
    };
    await setState((prevstate) => ({
      ...prevstate,
      DestinationModule: newfacilityModule,
    }));
  };

  const handleChangeDestination = () => {
    setDestinationModal(true);
  };

  const onSubmit = () => {
    //data,e
    // e.preventDefault();
    setMessage("");
    setError(false);
    setSuccess(false);
    //write document
    let document = {};

    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    document.documentdetail = productItem;

    document.documentname = "Radiology Orders"; //state.DocumentClassModule.selectedDocumentClass.name
    // document.documentClassId=state.DocumentClassModule.selectedDocumentClass._id
    document.location =
      state.employeeLocation.locationName +
      " " +
      state.employeeLocation.locationType;
    document.locationId = state.employeeLocation.locationId;
    document.client = state.ClientModule.selectedClient._id;
    document.clientname =
      state.ClientModule.selectedClient.firstname +
      " " +
      state.ClientModule.selectedClient.middlename +
      " " +
      state.ClientModule.selectedClient.lastname;
    document.clientobj = state.ClientModule.selectedClient;
    document.createdBy = user._id;
    document.createdByname = user.firstname + " " + user.lastname;
    document.status = "completed";

    ClientServ.create(document)
      .then((res) => {
        setSuccess(true);
        toast("Radiology Order created succesfully");
        setDestination(user.currentEmployee.facilityDetail.facilityName);
        setDestinationId(user.currentEmployee.facilityDetail._id);
        setSuccess(false);
        setProductItem([]);
      })
      .catch((err) => {
        toast.error(`Error creating Radiology Orders ${err}`);
      });
  };

  useEffect(() => {
    setDestination(user.currentEmployee.facilityDetail.facilityName);
    setDestinationId(user.currentEmployee.facilityDetail._id);
    return () => {};
  }, []);

  const handleRemoveProd = (prod) => {
    setProductItem((prev) => prev.filter((item) => item._id !== prod._id));
  };

  const productItemSchema = [
    {
      name: "S/N",
      key: "_id",
      selector: (row) => row.sn,
      description: "Enter",
      sortable: true,
      inputType: "HIDDEN",
      width: "60px",
    },
    {
      name: "Test",
      key: "test",
      description: "Enter Test name",
      selector: (row) => row.test,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Instruction",
      key: "action",
      description: "Enter Action",
      selector: (row) => (row.instruction ? row.instruction : "-------"),
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Destination",
      key: "destination",
      description: "Enter Destination",
      selector: (row) => row.destination,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Action",
      key: "destination",
      description: "Enter Destination",
      selector: (row, i) => (
        <DeleteOutlineIcon
          sx={{ color: "red" }}
          fontSize="small"
          onClick={() => handleRemoveProd(row)}
        />
      ),
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
  ];

  return (
    <>
      <Box container>
        <Box
          container
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          mb={1.5}
        >
          <FormsHeaderText text="Create Radiology Order" />

          <GlobalCustomButton
            onClick={() => {
              handleClickProd();
              () => setHidePanel(true);
            }}
          >
            <AddCircleOutline fontSize="small" sx={{ marginRight: "5px" }} />
            Add
          </GlobalCustomButton>
        </Box>

        <Box
          sx={{ display: "flex", flexDirection: "column" }}
          gap={1.5}
          mb={1.5}
        >
          <Box>
            <ProductSearchHelper
              getSearchfacility={getSearchfacility}
              clear={success}
              hidePanel={hidePanel}
            />
            {/* INVISIBLE INPUT THAT HOLDS THE VALUE FOR TESTHELPERSEARCH */}
            <input
              className="input is-small"
              {...register("test", { required: true })}
              value={test}
              name="test"
              type="text"
              onChange={(e) => setTest(e.target.value)}
              placeholder="test"
              style={{ display: "none" }}
            />
          </Box>

          <Box>
            <Input
              value={instruction}
              type="text"
              onChange={(e) => setInstruction(e.target.value)}
              label="Instructions/Note"
              name="instruction"
              disabled={!(productItemI.test && productItemI.test.length > 0)}
            />
          </Box>
          <Box
            container
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              item
              sx={{
                width: "calc(100% - 100px)",
              }}
            >
              <Input
                value={
                  destination ===
                  user.currentEmployee.facilityDetail.facilityName
                    ? "In-house"
                    : destination
                }
                disabled={true}
                type="text"
                onChange={(e) => setDestination(e.target.value)}
                label="Destination Radiology"
                name="destination"
              />
            </Box>

            <Box item>
              <GlobalCustomButton onClick={handleChangeDestination}>
                Change
              </GlobalCustomButton>
            </Box>
          </Box>
        </Box>

        <Box>
          {productItem.length > 0 && (
            <Box mb={1.5}>
              <CustomTable
                title={"Lab Orders"}
                columns={productItemSchema}
                data={productItem}
                pointerOnHover
                highlightOnHover
                striped
                //onRowClicked={handleRow}
                progressPending={false}
                //selectableRowsComponent={Checkbox}
              />
            </Box>
          )}

          {productItem.length > 0 && (
            <Box
              container
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <GlobalCustomButton onClick={onSubmit}>
                Complete
              </GlobalCustomButton>
            </Box>
          )}
        </Box>
      </Box>

      <ModalBox
        open={destinationModal}
        onClose={handlecloseModal}
        header="Choose Destination"
      >
        <FacilityPopup
          facilityType="Laboratory"
          closeModal={handlecloseModal}
        />
      </ModalBox>
    </>
  );
}
