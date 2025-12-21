import React, {useState, useContext, useEffect, useRef} from "react";
import client from "../../feathers";
import {UserContext, ObjectContext} from "../../context";
import "react-datepicker/dist/react-datepicker.css";
import {v4 as uuidv4} from "uuid";
import {toast} from "react-toastify";
import Chart from 'react-apexcharts';


import dayjs from "dayjs";

import FilterMenu from "../../components/utilities/FilterMenu";
import {PageWrapper} from "../../ui/styled/styles";
import {TableMenu} from "../../ui/styled/global";
import {Box, Typography} from "@mui/material";
import CustomTable from "../../components/customtable";
import {ClientMiniSchema} from "../Client/schema";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {TransactionsList} from "./Transactions";
import PaygDashboard from "../dashBoardUiComponent/@modules/PaygDashboard"

const Payg = () => {
  const [currentScreen, setCurrentScreen] = useState("lists");
 // console.log(currentScreen)
  return (
    <Box>
      {currentScreen === "lists" && (
       /*  <LoginList
          showTransactions={() => setCurrentScreen("transactions")}
        /> */
        <PaygDashboard />
      )}

     {/*  {currentScreen === "transactions" && (
        <TransactionClientAccount
          handleGoBack={() => setCurrentScreen("lists")}
        />
      )} */}
    </Box>
  );
};

export default Payg;

/* eslint-disable */

export function LoginList({showTransactions}) {
  // const { register, handleSubmit, watch, errors } = useForm();
   
  const [error, setError] = useState(false);
   
  const [success, setSuccess] = useState(false);
   
  const [message, setMessage] = useState("");
  const ClientServ = client.service("paygtransc");
  const analServ =client.service("loginanlytics")
  //const navigate=useNavigate()
  // const {user,setUser} = useContext(UserContext)
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
   
  const [selectedClient, setSelectedClient] = useState(); //
   
  const {state, setState} = useContext(ObjectContext);
   
  // const { user, setUser } = useContext(UserContext);

  const data = localStorage.getItem("user");
  const user = JSON.parse(data);

  // end
  const [loginData, setLoginData] = useState(null);
  const [currentView, setCurrentView] = useState("list");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState();
  const [open, setOpen] = useState(false);
  const [totalFacilities,  setTotalFacilities] = useState(0);

  const handleCreateNew = async () => {
    const newClientModule = {
      selectedClient: {},
      show: "create",
    };
    await setState(prevstate => ({
      ...prevstate,
      ClientModule: newClientModule,
    }));
    openCreateModal(true);
    //console.log(state)
  };

  const handleRow = async Client => {
    //return console.log(Client);
    await setSelectedClient(Client);

    const newInventoryModule = {
      client: Client,
      show: "detail",
    };
    await setState(prevstate => ({
      ...prevstate,
      SelectedClient: newInventoryModule,
    }));

    //await setOpen(true);
    showTransactions();
  };

  const handleSearch = val => {
     
    
    //console.log(val);
    ClientServ.find({
      query: {
        $or: [
          {
            'user.firstname': {
              $regex: val,
              $options: "i",
            },
          },
          {
            'user.lastname': {
              $regex: val,
              $options: "i",
            },
          },
          {
            'user.email': {
              $regex: val,
              $options: "i",
            },
          },
          {
           'user.phone': {
              $regex: val,
              $options: "i",
            },
          },
          {
            'facility.faciltyName': {
              $regex: val,
              $options: "i",
            },
          },
          {
            'facility.facilityCity': {
              $regex: val,
              $options: "i",
            },
          },
          {
            'facility.facilityType': {
              $regex: val,
              $options: "i",
            },
          },
         
        ],

        //"relatedfacilities.facility": user.currentEmployee.facilityDetail._id, // || "",
        //$limit: limit,
        $sort: {
          createdAt: -1,
        },
      },
    })
      .then(async res => {
        console.log(res);
        await setFacilities(res.data);
     

      await setTotal(res.total);
      const uniqueFacilitiesSet = new Set(res.data.map((item) => item.facility._id));
      const uniqueFacilitiesArray = Array.from(uniqueFacilitiesSet);
      setTotalFacilities(uniqueFacilitiesArray.length)
      })
      .catch(err => {
        console.log(err);
        toast.error("Error fetching Client, probable network issues " + err);
        setError(true);
      });
  };

  const getFacilities = async () => {
    
      const findClient = await ClientServ.find({
        query: {
          createdAt:{$gte:dayjs().startOf('day').toDate()},
          type:"login",
          $limit: 1000,
         // $skip: page * limit,
          $sort: {
            createdAt: -1,
          },
        },
      })
     /*  .then((resp)=>{
        console.log("resp recived")
      })
      .catch((err)=>{
        console.log(err)
      }); */
    
      await setFacilities(findClient.data);
     

      await setTotal(findClient.total);
      const uniqueFacilitiesSet = new Set(findClient.data.map((item) => item.facility._id));
      const uniqueFacilitiesArray = Array.from(uniqueFacilitiesSet);
      setTotalFacilities(uniqueFacilitiesArray.length)

      analServ.find(). then((resp)=>{
        console.log(resp)
        setLoginData(resp);
      })
      .catch((err)=>{
        console.log(err)
      })
      }
   

  useEffect(() => {
    if (user) {
      //getFacilities()
      rest();
    } else {
      /* const localUser= localStorage.getItem("user")
                    const user1=JSON.parse(localUser)
                    console.log(localUser)
                    console.log(user1)
                    fetchUser(user1)
                    console.log(user)
                    getFacilities(user) */
    }

    ClientServ.on("created", obj => rest());
    ClientServ.on("updated", obj => rest());
    ClientServ.on("patched", obj => rest());
    ClientServ.on("removed", obj => rest());

    return () => {};
     
  }, []);

  const rest = async () => {
    // console.log("starting rest")
    // await setRestful(true)
    await setPage(0);
    //await  setLimit(2)
    await setTotal(0);
    await setFacilities([]);
    await getFacilities();
    //await  setPage(0)
    //  await setRestful(false)
  };

  const facilitiesColumns = [
		{
			name: 'S/N',
			key: 'sn',
			description: 'SN',
			selector: (row, i) => i + 1,
			sortable: true,
			inputType: 'HIDDEN',
			width: '60px',
		},
		{
			name: 'Facility Name',
			key: 'sn',
			description: 'Enter name of Company',
			selector: row => (
				<Typography
					sx={{fontSize: '0.8rem', whiteSpace: 'normal'}}
					data-tag='allowRowEvents'>
					{row?.facility?.facilityName}
				</Typography>
			),
			sortable: true,
			required: true,
			inputType: 'HIDDEN',
			style: {
				color: '#1976d2',
				textTransform: 'capitalize',
			},
		},
		{
			name: 'Facility Location',
			key: 'sn',
			description: 'Enter name of Company',
			selector: row => (
				<Typography
					sx={{fontSize: '0.8rem', whiteSpace: 'normal'}}
					data-tag='allowRowEvents'>
					{row?.facility.facilityCity}
				</Typography>
			),
			sortable: true,
			required: true,
			inputType: 'HIDDEN',
			style: {
				textTransform: 'capitalize',
			},
		},
		{
			name: 'Date Created',
			key: 'phone',
			description: 'Enter name of Company',
			selector: row => dayjs(row.createdAt).format('DD/MM/YYYY'),
			sortable: true,
			required: true,
			inputType: 'HIDDEN',
			style: {
				textTransform: 'capitalize',
			},
		},
		{
			name: 'Organization Type',
			key: 'phone',
			description: 'Enter name of Company',
			selector: row => row?.facility?.facilityType,
			sortable: true,
			required: true,
			inputType: 'HIDDEN',
			style: {
				textTransform: 'capitalize',
			},
		},

		{
			name: 'User First Name',
			key: 'phone',
			description: 'Enter name of Company',
			selector: row => row?.user?.firstname,
			sortable: true,
			required: true,
			inputType: 'HIDDEN',
			style: {
				textTransform: 'capitalize',
			},
		},
		{
			name: 'User Last Name',
			key: 'sn',
			description: 'Enter name of Company',
			selector: row => (
				<Typography
					sx={{fontSize: '0.8rem', whiteSpace: 'normal'}}
					data-tag='allowRowEvents'>
					{row?.user?.lastname}
				</Typography>
			),
			sortable: true,
			required: true,
			inputType: 'HIDDEN',
			style: {
				textTransform: 'capitalize',
			},
		},

		/* {
			name: 'Email Address',
			key: 'sn',
			description: 'Enter name of Company',
			selector: row => (
				<Typography
					sx={{fontSize: '0.8rem', whiteSpace: 'normal'}}
					data-tag='allowRowEvents'>
					{row?.facilityEmail}
				</Typography>
			),
			sortable: true,
			required: true,
			inputType: 'HIDDEN',
			style: {
				textTransform: 'capitalize',
			},
		},
		{
			name: 'Status',
			key: 'phone',
			description: 'Enter name of Company',
			selector: row => (row?.active ? 'Active' : 'Inactive'),
			sortable: true,
			required: true,
			inputType: 'HIDDEN',
			style: {
				textTransform: 'capitalize',
			},
		},
		{
			name: 'Access Modality',
			key: 'phone',
			description: 'Enter name of Company',
			selector: row => row?.accessMode,
			sortable: true,
			required: true,
			inputType: 'HIDDEN',
			 style: {
				textTransform: 'capitalize',
			}, 
		},
		{
			name: 'Balance',
			key: 'phone',
			description: 'Enter name of Company',
			selector: row => row?.walletBalance,
			sortable: true,
			required: true,
			inputType: 'HIDDEN',
			/* style: {
				textTransform: 'capitalize',
			}, */
		/* }, */ 
	];

  const handleSetCurrentView = view => {
    setCurrentView(view);
  };

  const renderChart = () => {
    if (!loginData) return null;

    const options = {
      chart: {
        type: 'line',
      },
      xaxis: {
        categories: loginData.map(entry => entry.date),
      },
    };

    const series = [{
      name: 'Login Count',
      data: loginData.map(entry => entry.loginCount),
    },
    {
      name: 'Unique Organizations',
      data: loginData.map(entry => entry.uniqueOrganizationCount),
    },
     {
      name: 'Unique Users',
      data: loginData.map(entry => entry.uniqueUserCount),
    }, 
  
  ];

    return (
      <Chart options={options} series={series} type="line" height={350} />
    );
  };

  return (
    <>
      {user ? (
        <>
          <PageWrapper
            style={{
              flexDirection: "column",
              padding: "0.6rem 0.5rem",
              height: "100%",
            }}
          >
            <TableMenu>
              <div style={{display: "flex", alignItems: "center"}}>
                 {handleSearch && (
                  <div className="inner-table">
                    <FilterMenu onSearch={handleSearch} />
                  </div>
                )}

                <h2 style={{marginLeft: "10px", fontSize: "0.95rem"}}>
                  List of Logins Today ({total})  Number of Facilities:{totalFacilities}
                </h2>
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
            onClick={() => handleSetCurrentView("list")}
            sx={
              currentView === "list"
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
           Today's login List
          </GlobalCustomButton>

          <GlobalCustomButton
            onClick={() => handleSetCurrentView("90days")}
            sx={
              currentView === "90days"
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
            90 Day Trend
          </GlobalCustomButton>
          </Box>
              </div>
            </TableMenu>

          {currentView === "list" &&   <div
              style={{
                width: "100%",
                height: "calc(100vh - 200px)",
                overflow: "auto",
              }}
            >
              <CustomTable
                title={""}
                columns={facilitiesColumns}
                data={facilities}
                pointerOnHover
                highlightOnHover
                striped
               /*  onRowClicked={handleRow} */
                progressPending={loading}
              />
            </div>}
            {currentView === "90days" &&   <div
              style={{
                width: "100%",
                height: "calc(100vh - 200px)",
                overflow: "auto",
              }}
            >
            {renderChart()}
            
            </div>}
          
          

          </PageWrapper>
        </>
      ) : (
        <div>loading</div>
      )}
    </>
  );
}

