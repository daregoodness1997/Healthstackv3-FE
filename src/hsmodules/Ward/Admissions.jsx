/* eslint-disable */
import React, { useState, useContext, useEffect, useRef } from 'react';
import client from '../../feathers';

//import {useNavigate} from 'react-router-dom'
import { UserContext, ObjectContext } from '../../context';

import { format, formatDistanceToNowStrict } from 'date-fns';
import AdmissionCreate from './AdmissionCreate';
import PatientProfile from '../Client/PatientProfile';
import { PageWrapper } from '../../ui/styled/styles';
import { TableMenu } from '../../ui/styled/global';
import FilterMenu from '../../components/utilities/FilterMenu';

import CustomTable from '../../components/customtable';
import { WardAppointmentSchema } from './schema';
import ModalBox from '../../components/modal';


import { Box, Grid } from '@mui/material';

/* import {ProductCreate} from './Products' */
 
//const searchfacility={};

export default function Admission() {
  //const {state}=useContext(ObjectContext) //,setState
   
  const [selectedProductEntry, setSelectedProductEntry] = useState();
  //const [showState,setShowState]=useState() //create|modify|detail
  const [error, setError] = useState(false);
   
  const [success, setSuccess] = useState(false);
   
  const [message, setMessage] = useState('');
  const OrderServ = client.service('order');
  //const navigate=useNavigate()
  // const {user,setUser} = useContext(UserContext)
  const [facilities, setFacilities] = useState([]);
   
  const [selectedDispense, setSelectedDispense] = useState(); //
   
  const { state, setState } = useContext(ObjectContext);
   
  const { user, setUser } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);

  /*  useEffect(() => {
        const updatedOne= state.currentClients.filter(el=>(JSON.stringify(el.client_id)===JSON.stringify(state.DispenseModule.selectedDispense.client_id)))
        console.log("udatedone", updatedOne)
        console.log("state", state.currentClients)
        handleRow(updatedOne)
         return () => {
             
         }
     }, []) */
 
  return (
    <section className="section remPadTop">
      <AdmissionList showModal={showModal} setShowModal={setShowModal} />
      {showModal && (
        <ModalBox
          open={state.AdmissionModule.show === 'detail'}
          header
          onClose={() => {
            setShowModal(false),
              setState((prevstate) => ({
                ...prevstate,
                AdmissionModule: {
                  selectedAdmission: {},
                  show: 'list',
                },
              }));
          }}
        >
          <Grid container>
            <Grid item xs={12}></Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <PatientProfile />
            </Grid>
            <Grid item xs={6}>
              <AdmissionCreate />
            </Grid>
          </Grid>
        </ModalBox>
      )}
    </section>
  );
}

export function AdmissionList({ showModal, setShowModal }) {
  // const { register, handleSubmit, watch, errors } = useForm();
   
  const [error, setError] = useState(false);
   
  const [success, setSuccess] = useState(false);
   
  const [message, setMessage] = useState('');
  const OrderServ = client.service('order');
  //const navigate=useNavigate()
  // const {user,setUser} = useContext(UserContext)
  const [facilities, setFacilities] = useState([]);
   
  const [selectedDispense, setSelectedDispense] = useState(); //
   
  const { state, setState } = useContext(ObjectContext);
   
  const { user, setUser } = useContext(UserContext);
  const [selectedMedication, setSelectedMedication] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSelectedClient = async (Client) => {
    // await setSelectedClient(Client)
    const newClientModule = {
      selectedClient: Client,
      show: 'detail',
    };
    await setState((prevstate) => ({
      ...prevstate,
      ClientModule: newClientModule,
    }));
  };

  const handleMedicationRow = async (ProductEntry) => {
    setShowModal(true);

    //handle selected single order
    //console.log("b4",state)

    //console.log("handlerow",ProductEntry)
    await handleSelectedClient(ProductEntry.client);

    await setSelectedMedication(ProductEntry);

    const newProductEntryModule = {
      selectedAdmission: ProductEntry,
      show: 'detail',
    };
    await setState((prevstate) => ({
      ...prevstate,
      AdmissionModule: newProductEntryModule,
    }));
    //console.log(state)
    // ProductEntry.show=!ProductEntry.show
  };

  const handleCreateNew = async () => {
    const newProductEntryModule = {
      selectedDispense: {},
      show: 'create',
    };
    await setState((prevstate) => ({
      ...prevstate,
      DispenseModule: newProductEntryModule,
    }));
    //console.log(state)
  };

  const handleSearch = async (val) => {
    const field = 'name';
    console.log(val);
    OrderServ.find({
      query: {
        $or: [
          {
            order: {
              $regex: val,
              $options: 'i',
            },
          },
          {
            order_status: {
              $regex: val,
              $options: 'i',
            },
          },
          {
            clientname: {
              $regex: val,
              $options: 'i',
            },
          },
        ],
        order_category: 'Admission Order',
        fulfilled: 'False',
        destination: user.currentEmployee.facilityDetail._id,
        destination_location: state.WardModule.selectedWard._id,
        order_status: 'Pending',
        // storeId:state.StoreModule.selectedStore._id,
        //facility:user.currentEmployee.facilityDetail._id || "",
        $limit: 50,
        $sort: {
          createdAt: -1,
        },
      },
    })
      .then(async (res) => {
        console.log(res);
        setFacilities(res.groupedOrder);
        // await setState((prevstate)=>({...prevstate, currentClients:res.groupedOrder}))
        setMessage(' ProductEntry  fetched successfully');
        setSuccess(true);
      })
      .catch((err) => {
        // console.log(err)
        setMessage(
          'Error fetching ProductEntry, probable network issues ' + err
        );
        setError(true);
      });
  };

  const getFacilities = async () => {
    console.log("destination", state.WardModule?.selectedWard._id)
    if (state.WardModule?.selectedWard._id=== undefined) {
      return
    }
    const findProductEntry = await OrderServ.find({
      query: {
        order_category: 'Admission Order',
        fulfilled: 'False',
        destination: user.currentEmployee.facilityDetail._id,
        destination_location: state.WardModule?.selectedWard._id,
        order_status: 'Pending', 
        $limit: 100,
        $sort: {
          createdAt: -1,
        },
      },
    });

    console.log('updatedorder', findProductEntry.data);
    await setFacilities(findProductEntry.data);
    await setState((prevstate) => ({
      ...prevstate,
      currentClients: findProductEntry.data,
    }));
  };

  //1.consider using props for global data
  useEffect(() => {
    // console.log("started")
    getFacilities();
    OrderServ.on('created', (obj) => getFacilities());
    OrderServ.on('updated', (obj) => getFacilities());
    OrderServ.on('patched', (obj) => getFacilities());
    OrderServ.on('removed', (obj) => getFacilities());
    return () => {};
  }, []);

  const handleRow = async (ProductEntry) => {
    setShowModal(true);
    await setSelectedDispense(ProductEntry);

    const newProductEntryModule = {
      selectedDispense: ProductEntry,
      show: 'detail',
    };
    await setState((prevstate) => ({
      ...prevstate,
      DispenseModule: newProductEntryModule,
    }));
    //console.log(state)
  };

  useEffect(() => {
    getFacilities();

    return () => {};
  }, [state.WardModule.selectedWard]);

  return (
    <>
      {user ? (
        <>
          <div className="level">
            <PageWrapper
              style={{ flexDirection: 'column', padding: '0.6rem 1rem' }}
            >
              <TableMenu>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {handleSearch && (
                    <div className="inner-table">
                      <FilterMenu onSearch={handleSearch} />
                    </div>
                  )}
                  <h2
                    style={{
                      marginLeft: '10px',
                      fontSize: '0.95rem',
                      width: '300px',
                    }}
                  >
                    Pending Admissions
                  </h2>
                </div>
              </TableMenu>
              <div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
                <CustomTable
                  title={''}
                  columns={WardAppointmentSchema}
                  data={facilities}
                  pointerOnHover
                  highlightOnHover
                  striped
                  onRowClicked={handleMedicationRow}
                  progressPending={loading}
                />
              </div>
            </PageWrapper>
          </div>
        </>
      ) : (
        <div>loading</div>
      )}

      {/* <div className="level">
        <div className="level-left">
          <div className="level-item">
            <div className="field">
              <p className="control has-icons-left  ">
                <DebounceInput
                  className="input is-small "
                  type="text"
                  placeholder="Search Tests"
                  minLength={3}
                  debounceTimeout={400}
                  onChange={e => handleSearch(e.target.value)}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-search"></i>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="level-item">
          {" "}
          <span className="is-size-6 has-text-weight-medium">
            Pending Admissions{" "}
          </span>
        </div>
        <div className="level-right">
                       <div className="level-item"> 
                            <div nclassName="level-item"><div className="button is-success is-small" onClick={handleCreateNew}>New</div></div>
                        </div> 
                    </div>
      </div>
      <div className=" pullup">
        <div className=" is-fullwidth vscrollable pr-1">
          <table className="table is-striped  is-hoverable is-fullwidth is-scrollable mr-2">
            <thead>
              <tr>
                <th>
                  <abbr title="Serial No">S/No</abbr>
                </th>
                <th>
                  <abbr title="Date">Date</abbr>
                </th>
                <th>
                  <abbr title="Name">Name</abbr>
                </th>
                <th>
                  <abbr title="Order">Admission Order</abbr>
                </th>
                <th>Fulfilled</th>
                <th>
                  <abbr title="Status">Status</abbr>
                </th>
                <th>
                  <abbr title="Requesting Physician">Requesting Physician</abbr>
                </th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((order, i) => (
                <tr
                  key={order._id}
                  onClick={() => handleMedicationRow(order)}
                  className={
                    order._id === (selectedMedication?._id || null)
                      ? "is-selected"
                      : ""
                  }
                >
                  <th>{i + 1}</th>
                  <td>
                    <span>{format(new Date(order.createdAt), "dd-MM-yy")}</span>
                  </td>{" "}
                  <th>
                    {order.client.firstname} {order.client.lastname}
                  </th>
                  <th>{order.order}</th>
                  <td>{order.fulfilled === "True" ? "Yes" : "No"}</td>
                  <td>{order.order_status}</td>
                  <td>{order.requestingdoctor_Name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </>
  );
}
