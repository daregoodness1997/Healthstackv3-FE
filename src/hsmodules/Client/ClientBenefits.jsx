import React, {useState, useContext, useEffect, useRef} from "react";
import "./styles/index.scss";
import { Space, Typography } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import CustomTable from "../../components/customtable";
import { FormsHeaderText } from "../../components/texts";
import { ObjectContext } from "../../context";
import client from "../../feathers";
import { productItemSchema } from "./schema";

export default function ClientBenefits({closeModal}) {
    const HealthPlanServ = client.service("healthplan");
    const { state } = useContext(ObjectContext);
    const [benefits, setBenefits] = useState();
    const [selectedPlan, setSelectedPlan] = useState();
    const plan=state.PolicyModule.selectedPolicy.plan

      const getFacilities = async () => {    
        try {
          const healthPlan = await HealthPlanServ.get(plan._id);
          setSelectedPlan(healthPlan);
          setBenefits(healthPlan.benefits);
        } catch (error) {
          return error
        }
      };
      
      useEffect(() => {
        getFacilities();
        return () => {
          setSelectedPlan(null);
          setBenefits(null);
        };
      }, [plan._id]);
    


    return (
     <>
      <div
        className="card"
        style={{
            height: "88vh",
            overflowY: "scroll",
            width: "98%",
            margin: "0 auto",
        }}
          >

        <div
          style={{
            width: "100%",
            height: "auto",
            overflow: "auto",
            marginTop: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <FormsHeaderText text={`${selectedPlan?.organizationName} ${selectedPlan?.planName} Plan Benefits List`} />
         <p>Family Limit:{selectedPlan?.familyLimit}</p>
         <p>Individual Limit:{selectedPlan?.individualLimit}</p>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "auto",
            }}
          >
            <CustomTable
              tableData={""}
              columns={productItemSchema}
              data={benefits}
              pointerOnHover
              highlightOnHover
              striped
            />
          </Box>
        </div>
      </div>
    </> 
  
     );
}
