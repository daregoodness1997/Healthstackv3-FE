/* eslint-disable */
import React, { useState, useContext, useEffect, useRef } from "react";
import client from "../../feathers";
import { DebounceInput } from "react-debounce-input";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import useSound from "use-sound";
import notificationSound from "../../components/notifications/assets/notification_sound.mp3";
//import {useNavigate} from 'react-router-dom'
import { UserContext, ObjectContext } from "../../context";
import { toast } from "bulma-toast";
import { format, formatDistanceToNowStrict } from "date-fns";
//import ReportCreate from "./ReportCreate";
//import PatientProfile from "../Client/PatientProfile";
import LaboratoryReportForm from "../clientForm/forms/laboratoryReportForm";
import { PageWrapper } from "../../ui/styled/styles";
import { TableMenu } from "../../ui/styled/global";
import FilterMenu from "../../components/utilities/FilterMenu";
//import Button from "../../components/buttons/Button";
import CustomTable from "../../components/customtable";
import ModalBox from "../../components/modal";
/* import {ProductCreate} from './Products' */

//const searchfacility={};

// Demo styles, see 'Styles' section below for some notes on use.

//import BillPrescriptionCreate from './BillPrescriptionCreate';

export default function LabReport() {
  //const {state}=useContext(ObjectContext) //,setState

  const [selectedProductEntry, setSelectedProductEntry] = useState();
  const [showState, setShowState] = useState(); /* create|modify|detail */
  const [error, setError] = useState(false);

  const [success, setSuccess] = useState(false);

  const [message, setMessage] = useState("");
  const BillServ = client.service("bills");
  //const navigate=useNavigate()
  // const {user,setUser} = useContext(UserContext)
  const [facilities, setFacilities] = useState([]);

  const [selectedOrders, setSelectedOrders] = useState([]);

  const { state, setState } = useContext(ObjectContext);

  //const { user, setUser } = useContext(UserContext);

  const [reportFormModal, setReportFormModal] = useState(false);

  return (
    <section className="section remPadTop">
      {/*  <div className="level">
            <div className="level-item"> <span className="is-size-6 has-text-weight-medium">ProductEntry  Module</span></div>
            </div> */}

      <LabOrderList openReportFormModal={setReportFormModal} />

      {reportFormModal && (
        <ModalBox
          open={state.financeModule.show === "detail"}
          header
          onClose={() => setReportFormModal(false)}
          width={"100%"}
        >
          <LaboratoryReportForm />
        </ModalBox>
      )}

      {/* {state.financeModule.show === "detail" && <LaboratoryReportForm />} */}
      {/*   {(state.financeModule.show ==='detail')&& <LabNoteCreate /> } */}

      {/*  <div className="column is-3 "> <LabNoteCreate /> <ReportCreate />
                
                {(state.financeModule.show ==='detail')&&<PatientProfile />}
                </div> */}
    </section>
  );
}

export function LabOrderList({ openReportFormModal }) {
  // const { register, handleSubmit, watch, errors } = useForm();

  // const [error, setError] = useState(false);

  // const [success, setSuccess] = useState(false);

  // const [message, setMessage] = useState("");
  const BillServ = client.service("bills");
  //const navigate=useNavigate()
  // const {user,setUser} = useContext(UserContext)
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);

  // const [selectedDispense, setSelectedDispense] = useState(); //
  const [selectedOrders, setSelectedOrders] = useState([]);

  const { state, setState } = useContext(ObjectContext);

  const { user } = useContext(UserContext);

  // Sound notification setup
  const [play] = useSound(notificationSound);
  const previousResultsRef = useRef([]);
  const [selectedFinance, setSelectedFinance] = useState("");
  // const [expanded, setExpanded] = useState("");
  const [oldClient, setOldClient] = useState("");

  const handleSelectedClient = async (Client) => {
    // await setSelectedClient(Client)
    const newClientModule = {
      selectedClient: Client,
      show: "detail",
    };
    await setState((prevstate) => ({
      ...prevstate,
      ClientModule: newClientModule,
    }));
  };

  // const handleChoseClient = async (client, e, order) => {
  //   setOldClient(client.clientname);
  //   let newClient = client.clientname;
  //   if (oldClient !== newClient) {
  //     //alert("New Client Onboard")
  //     //remove all checked clientsly
  //     selectedOrders.forEach((el) => (el.checked = ""));
  //     setSelectedOrders([]);
  //   }

  //   // console.log(e.target.checked)
  //   order.checked = e.target.checked;
  //   await handleSelectedClient(order.participantInfo.client);
  //   //handleMedicationRow(order)
  //   await setSelectedFinance(order);
  //   const newProductEntryModule = {
  //     selectedFinance: order,
  //     show: "detail",
  //     state: e.target.checked,
  //   };
  //   await setState((prevstate) => ({
  //     ...prevstate,
  //     financeModule: newProductEntryModule,
  //   }));

  //   //set of checked items
  //   if (e.target.checked) {
  //     setSelectedOrders((prevstate) => prevstate.concat(order));
  //   } else {
  //     setSelectedOrders((prevstate) =>
  //       prevstate.filter((el) => el._id !== order._id)
  //     );
  //   }

  //   // console.log(selectedOrders)
  // };

  const handleMedicationRow = async (order) => {

    await handleSelectedClient(order.orderInfo.orderObj.client);

    setSelectedFinance(order);
    // grab report
    // if draft show create/modify
    //if final: show final
    // console.log(order);
    const newProductEntryModule = {
      selectedFinance: order,
      show: "detail",
      report_status: order.report_status,
    };
    await setState((prevstate) => ({
      ...prevstate,
      financeModule: newProductEntryModule,
    }));
    openReportFormModal(true);
  };

  const handleSearch = async (val) => {
    // console.log("===>>> value", { val });
    if (val.length < 3 && val.trim() === "") return;
    const findProductEntry = await BillServ.find({
      query: {
        $and: [
          {
            $or: [
              {
                "orderInfo.orderObj.order_category": "Lab Order",
              },
              {
                "orderInfo.orderObj.order_category": "Laboratory",
              },
            ],
          },
          {
            $or: [
              {
                "orderInfo.orderObj.clientname": {
                  $regex: val,
                  $options: "i",
                },
              },
              {
                "orderInfo.orderObj.order": {
                  $regex: val,
                  $options: "i",
                },
              },
              {
                billing_status: {
                  $regex: val,
                  $options: "i",
                },
              },
              {
                report_status: {
                  $regex: val,
                  $options: "i",
                },
              },
            ],
          },
        ],
        "participantInfo.billingFacility":
          user?.currentEmployee?.facilityDetail?._id,
        $limit: 100,
        $sort: {
          createdAt: -1,
        },
      },
    });

    // console.log("lab bills search", findProductEntry.data);
    await setFacilities(findProductEntry.data);
  };
  const getFacilities = async () => {
    setLoading(true);

    const findProductEntry = await BillServ.find({
      query: {
        $or: [
          {
            "orderInfo.orderObj.order_category": "Lab Order",
          },
          {
            "orderInfo.orderObj.order_category": "Laboratory",
          },
        ],
        "participantInfo.billingFacility":
          user?.currentEmployee?.facilityDetail?._id,
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 2)),
        },
        noAgg: true,

        //'orderInfo.orderObj.order_category':"Lab Order",
        // billing_status:"Unpaid",  //need to set this finally
        //storeId:state.StoreModule.selectedStore._id,
        //clientId:state.ClientModule.selectedClient._id,
        /*  $select:['report_status',], */
        $limit: 50,
        $sort: {
          createdAt: -1,
        },
      },
    });

    setLoading(false);
    // console.log("lab bills", findProductEntry);
    setFacilities(findProductEntry.data);
    //  await setState((prevstate)=>({...prevstate, currentClients:findProductEntry.groupedOrder}))
  };
  // console.log(facilities, "fac";
  useEffect(() => {
    // console.log("started")
    getFacilities();

    // Play sound only when doctor creates new lab request
    BillServ.on("created", (obj) => {
      getFacilities();

      // Check if creator is a doctor before playing sound
      if (obj.createdByInfo?.profession === "Doctor" ||
        obj.createdByInfo?.role === "Doctor" ||
        obj.createdBy?.profession === "Doctor") {
        play();
        // toast.success("New lab request created by doctor!");
      }
    });

    BillServ.on("updated", (obj) => getFacilities());
    BillServ.on("patched", (obj) => getFacilities());
    BillServ.on("removed", (obj) => getFacilities());
    return () => { };
  }, []);

  useEffect(() => {
    return () => { };
  }, [selectedOrders]);

  useEffect(() => {
    if (state.financeModule.show === "create") {
      selectedOrders.forEach((el) => (el.checked = ""));
      setSelectedOrders([]);
    }
    return () => { };
  }, [state.financeModule.show]);

  // Detect new lab results and play notification sound
  useEffect(() => {
    // Skip on initial load (when previousResultsRef is empty)
    if (previousResultsRef.current.length === 0 && facilities.length > 0) {
      previousResultsRef.current = facilities;
      return;
    }

    // Check for new results or status changes from Pending to Draft/Final
    if (facilities.length > 0 && previousResultsRef.current.length > 0) {
      const newOrUpdatedResults = facilities.filter((currentResult) => {
        const previousResult = previousResultsRef.current.find(
          (prev) => prev._id === currentResult._id
        );

        // New result that wasn't pending
        if (!previousResult && currentResult.report_status !== "Pending") {
          return true;
        }

        // Existing result that changed from Pending to Draft/Final
        if (
          previousResult &&
          previousResult.report_status === "Pending" &&
          (currentResult.report_status === "Draft" ||
            currentResult.report_status === "Final")
        ) {
          return true;
        }

        return false;
      });

      // Play sound if there are new/updated results
      if (newOrUpdatedResults.length > 0) {
        play();
      }

      // Update the ref with current results
      previousResultsRef.current = facilities;
    }
  }, [facilities, play]);

  // ######### DEFINE FUNCTIONS AND SCHEMA HERE
  // const handleCreate = async () => {
  //   const newProductEntryModule = {
  //     selectedDispense: {},
  //     show: "create",
  //   };
  //   await setState((prevstate) => ({
  //     ...prevstate,
  //     DispenseModule: newProductEntryModule,
  //   }));

  //   await openReportFormModal(true);
  // };

  const labReportSchema = [
    {
      name: "S/No",
      key: "sn",
      description: "Enter serial number",
      selector: (row) => row?.sn,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "Date",
      key: "createdAt",
      description: "Enter date",
      selector: (row) =>
        row?.createdAt
          ? format(new Date(row?.createdAt), "dd/MM/yyyy HH:mm")
          : "",
      sortable: true,
      required: true,
      inputType: "TEXT",
      validator: yup.string().required("Enter today's date"),
    },
    {
      name: "Client",
      key: "client",
      description: "Enter client name",
      selector: (row) => {
        return row?.orderInfo?.orderObj.clientname;
      },
      sortable: true,
      required: true,
      inputType: "TEXT",
      validator: yup.string().required("Enter client's name"),
    },
    {
      name: "Test",
      key: "description",
      description: "Enter test result details",
      selector: (row) => row?.serviceInfo?.name,
      sortable: true,
      required: true,
      inputType: "TEXT",
      validator: yup.string().required("Enter details of lab results"),
    },
    {
      name: "Amount",
      key: "amount",
      description: "Enter amount",
      selector: (row) => row?.serviceInfo?.price,
      sortable: true,
      required: true,
      inputType: "TEXT",
      validator: yup.string().required("Enter amount"),
    },
    {
      name: "Billing Status",
      key: "billing_status",
      description: "Enter Payment Status",
      selector: (row) => row?.billing_status,
      sortable: true,
      required: true,
      inputType: "TEXT",
      validator: yup.string().required("Enter client payment status"),
    },
    {
      name: "Report Status",
      key: "report_status",
      description: "Select facility",
      selector: (row) => row?.report_status,
      sortable: true,
      required: true,
      inputType: "TEXT",
      validator: yup.string().required("Enter Client Result Status"),
    },
  ];

  return (
    <>
      <PageWrapper style={{ flexDirection: "column", padding: "0.6rem 1rem" }}>
        <TableMenu>
          <div style={{ display: "flex", alignItems: "center" }}>
            {handleSearch && (
              <div className="inner-table">
                <FilterMenu onSearch={handleSearch} />
              </div>
            )}
            <h2 style={{ marginLeft: "10px", fontSize: "0.95rem" }}>
              Lab Result
            </h2>
          </div>

          {/* {handleCreate && (
            <Button
              style={{ fontSize: '14px', fontWeight: '600' }}
              label="Add new "
              onClick={handleCreate}
            />
          )} */}
        </TableMenu>

        <div style={{ width: "100%", height: "600px", overflow: "auto" }}>
          <CustomTable
            title={""}
            columns={labReportSchema}
            data={facilities}
            pointerOnHover
            highlightOnHover
            striped
            onRowClicked={handleMedicationRow}
            progressPending={loading}
          />
        </div>
      </PageWrapper>
    </>
  );
}

export function LabNoteCreate() {
  const { register, handleSubmit, setValue } = useForm(); //, watch, errors, reset
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  // const [facility, setFacility] = useState();
  //const ClientServ=client.service('labresults')
  //const navigate=useNavigate()
  const { user } = useContext(UserContext); //,setUser

  const [currentUser, setCurrentUser] = useState();
  const { state, setState } = useContext(ObjectContext);
  const [reportStatus, setReportStatus] = useState("Draft");
  const ClientServ = client.service("labresults");
  const order = state.financeModule.selectedFinance;
  const bill_report_status = state.financeModule.report_status;

  // const getSearchfacility = (obj) => {
  //   setValue("facility", obj._id, {
  //     shouldValidate: true,
  //     shouldDirty: true,
  //   });
  // };

  useEffect(() => {
    setCurrentUser(user);
    //console.log(currentUser)
    return () => { };
  }, [user]);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setMessage("");
    setError(false);
    setSuccess(false);
    let document = {};
    // data.createdby=user._id
    //  console.log(data);
    if (user.currentEmployee) {
      document.facility = user.currentEmployee.facilityDetail._id;
      document.facilityname = user.currentEmployee.facilityDetail.facilityName; // or from facility dropdown
    }
    document.documentdetail = data;
    document.documentname = `${order.serviceInfo.name} Result`;
    // document.documentClassId=state.DocumentClassModule.selectedDocumentClass._id
    document.location =
      state.employeeLocation.locationName +
      " " +
      state.employeeLocation.locationType;
    document.locationId = state.employeeLocation.locationId;
    document.client = order.orderInfo.orderObj.clientId;
    document.createdBy = user._id;
    document.createdByname = user.firstname + " " + user.lastname;
    document.status = reportStatus;
    document.billId = order._id;
    //  console.log(document)
    //  console.log(order)

    if (
      document.location === undefined ||
      !document.createdByname ||
      !document.facilityname
    ) {
      toast({
        message:
          " Documentation data missing, requires location and facility details",
        type: "is-danger",
        dismissible: true,
        pauseOnHover: true,
      });
      return;
    }

    if (bill_report_status === "Pending") {
      ClientServ.create(document)
        .then((res) => {
          e.target.reset();

          setSuccess(true);
          toast({
            message: "Lab Result created succesfully",
            type: "is-success",
            dismissible: true,
            pauseOnHover: true,
          });
          setSuccess(false);
        })
        .catch((err) => {
          toast({
            message: "Error creating Lab Result " + err,
            type: "is-danger",
            dismissible: true,
            pauseOnHover: true,
          });
        });
    }

    if (bill_report_status === "Draft") {
      ClientServ.patch(order.resultDetail._id, document)
        .then((res) => {
          e.target.reset();

          setSuccess(true);
          toast({
            message: "Lab Result updated succesfully",
            type: "is-success",
            dismissible: true,
            pauseOnHover: true,
          });
          setSuccess(false);
        })
        .catch((err) => {
          toast({
            message: "Error updating Lab Result " + err,
            type: "is-danger",
            dismissible: true,
            pauseOnHover: true,
          });
        });
    }
    const newProductEntryModule = {
      selectedFinance: order,
      show: "show",
      // report_status:order.report_status
    };
    await setState((prevstate) => ({
      ...prevstate,
      financeModule: newProductEntryModule,
    }));
  };

  const handleChangePart = async (e) => {
    // console.log(e.target.value);
    setReportStatus(e.target.value);
  };

  useEffect(() => {
    if (!order.resultDetail?.documentdetail) {
      setValue("Finding", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("Recommendation", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      // setReportStatus(order.report_status)

      return;
    }
    if (order.report_status !== "Pending") {
      //console.log(order.resultDetail.documentdetail);

      setValue("Finding", order.resultDetail.documentdetail.Finding, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(
        "Recommendation",
        order.resultDetail.documentdetail.Recommendation,
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
      setReportStatus(order.report_status);
    }

    return () => { };
  }, [order]);

  return (
    <>
      <div className="card ">
        <div className="card-header">
          <p className="card-header-title">Lab Result</p>
        </div>
        <div className="card-content vscrollable remPad1">
          <label className="label is-size-7">
            Client: {order.orderInfo.orderObj.clientname}
          </label>
          <label className="label is-size-7">
            Test: {order.serviceInfo.name}
          </label>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field is-horizontal">
              <div className="field-body">
                <div className="field">
                  <p className="control has-icons-left has-icons-right">
                    <textarea
                      className="textarea is-small"
                      {...register("x")}
                      name="Finding"
                      type="text"
                      placeholder="Findings"
                      disabled={bill_report_status === "Final"}
                    />
                  </p>
                </div>
              </div>
            </div>
            <div className="field is-horizontal">
              <div className="field-body">
                <div className="field">
                  <div className="control has-icons-left has-icons-right">
                    <textarea
                      className="textarea is-small"
                      {...register("x")}
                      name="Recommendation"
                      type="text"
                      placeholder="Recommendation"
                      disabled={bill_report_status === "Final"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="field">
              <label className=" is-small">
                <input
                  type="radio"
                  name="status"
                  value="Draft"
                  checked={
                    reportStatus === "Draft" || reportStatus === "Pending"
                  }
                  onChange={(e) => {
                    handleChangePart(e);
                  }}
                  disabled={bill_report_status === "Final"}
                />
                <span> Draft</span>
              </label>{" "}
              <br />
              <label className=" is-small">
                <input
                  type="radio"
                  name="status"
                  value="Final"
                  checked={reportStatus === "Final"}
                  onChange={(e) => handleChangePart(e)}
                  disabled={bill_report_status === "Final"}
                />
                <span> Final </span>
              </label>
            </div>
            <div className="field  is-grouped mt-2">
              <p className="control">
                <button
                  type="submit"
                  className="button is-success is-small"
                  disabled={bill_report_status === "Final"}
                >
                  {bill_report_status === "Pending" ? "Save" : "Update"}
                </button>
              </p>
              {/*  <p className="control">
                    <button className="button is-warning is-small" onClick={(e)=>e.target.reset()}>
                        Cancel
                    </button>
                </p> */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
