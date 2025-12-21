import {useState, useEffect, useContext,useRef} from "react";
import {Grid} from "@mui/material";
import {Box} from "@mui/system";
import Input from "../../../../components/inputs/basic/Input";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import CustomSelect from "../../../../components/inputs/basic/Select";
import GlobalCustomButton from "../../../../components/buttons/CustomButton";
import {ObjectContext, UserContext} from "../../../../context";
import client from "../../../../feathers";
import {ListEmployee} from "./EmployeeList"

const SendPlanDetail = ({ closeModal }) => {
  const { state, showActionLoader, hideActionLoader } = useContext(ObjectContext);
  const smsServer = client.service("sendsms")
  const emailServer = client.service("email");
  const linkServer = client.service("employeelink");
  const facilityConfigServer = client.service("facility-config");
  const { user } = useContext(UserContext);
  const { register, control, reset } = useForm();
  const [edit, setEdit] = useState(false);

  const [config, setConfig] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [messageList, setMessageList] = useState([]);

  const emailRef = useRef("");
  const messRef = useRef("");

  const selectedemployee = async (data) => {
    setSelectedEmployees(data);
    
    if (data.length > 0) {
      const messages = await Promise.all(data.map(async (employee) => {
        const message = await showLink(employee);
        return { id: employee._id, message };
      }));
  
      setMessageList(messages);
    }
  };

  const plan = state.InvoiceModule.selectedPlan;
  const invoice = state.InvoiceModule.selectedInvoice;

  useEffect(() => {
    fetchConfig();
    reset(plan);
  }, []);

  const fetchConfig = async () => {
    try {
      const { data } = await facilityConfigServer.find({
        query: {
          organizationId: invoice.facility._id,
          $limit: 200,
          $sort: { createdAt: -1 },
        },
      });
      setConfig(data);
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  };

  const handleSafeLink = async () => {
    if (!selectedEmployees.length) {
      toast.error("Please select at least one employee.");
      return;
    }
  
    for (const employee of selectedEmployees) {
      try {
        const obj = {
          organizationId: user?.currentEmployee?.facilityDetail?._id,
          hmoId: invoice?.facilityId,
          invoiceId: invoice?._id,
          planId: plan?._id,
          employeeId: employee?._id,
          employee,
          organization: user?.currentEmployee?.facilityDetail,
          hmo: invoice?.facility,
          plan,
          createdBy: user?._id,
          createdByName: `${user?.currentEmployee?.firstname} ${user?.currentEmployee?.lastname}`,
        };
  
        
        if (!obj.organizationId || !obj.hmoId || !obj.invoiceId || !obj.planId || !obj.employeeId) {
          console.error("Error: Missing required fields", obj);
          toast.error("Missing required data to send the link.");
          continue;
        }
  
        const res = await linkServer.create(obj);
  
        if (!res || !res._id) {
          console.error("Error: linkId not found.");
          toast.error("Failed to generate link.");
          continue;
        }
  
        await sendNotification(employee, res._id, obj.hmo);
      } catch (error) {
        console.error("Error sending link:", error);
        toast.error(`Failed to send link: ${error.message}`);
      }
    }
  };
  
  const sendNotification = async (employee, linkId, hmo) => {
    if (!config.length) {
      toast.error("Email configuration missing! Set it in the Admin module.");
      return;
    }
  
    emailRef.current = config[0].emailConfig?.username || "";
    if (!emailRef.current) {
      toast.error("Email Configuration not set");
      return;
    }
  
    showActionLoader();
  
    try {
      const emailBody = `<p>Dear ${employee.lastname} ${employee.firstname},<br>
        Please follow this <a style="color:red;" href="https://citizen-healthstack.netlify.app/corporate-beneficiary-signup/${linkId}/">LINK</a> 
        to complete your registration with ${hmo.facilityName} HMO.<br> Thank you.<br> Management </p>`;
  
     
      setMessageList((prev) => [...prev, { id: employee._id, message: emailBody }]);
  
     
      await Promise.all([
        smsServer.create({
          type: "Policy",
          title: "Create Policy",
          message: `Dear ${employee.lastname} ${employee.firstname}, follow this link: https://citizen-healthstack.netlify.app/corporate-beneficiary-signup/${linkId}/`,
          receiver: employee.phone,
          facilityName: hmo.facilityName,
          facilityId: hmo._id,
        }),
        emailServer.create({
          organizationId: hmo._id,
          organizationName: hmo.facilityName,
          html: emailBody,
          text: emailBody,
          status: "pending",
          to: employee.email,
          from: emailRef.current,
          subject: "Register For Health Insurance",
        })
      ]);
  
      toast.success("SMS and Email sent successfully");
      closeModal();
    } catch (error) {
      console.error("Message send error:", error);
      toast.error(error.message.includes("sms") ? "Failed to send SMS" : "Failed to send Email");
    } finally {
      hideActionLoader();
    }
  };
  

  const showLink = async (el) => {
    try {
      const linkResponse = await linkServer.find({
        query: {
          employeeId: el._id,
          hmoId: state.InvoiceModule.selectedInvoice.facility._id,
          planId: state.InvoiceModule.selectedPlan._id,
        },
      });
   
      if (!linkResponse.data || linkResponse.data.length === 0) {
        toast.error("No link found for this employee.");
        return;
      }
  
      const linkId = linkResponse.data[0]._id;
      const hmo = state.InvoiceModule.selectedInvoice.facility;
  
      const emailBody = `<p>Dear ${el.lastname} ${el.firstname}, <br>Please follow this <a style="color:red;" href="https://citizen-healthstack.netlify.app/corporate-beneficiary-signup/${linkId}/">LINK</a> 
        to complete your registration as a beneficiary for your health insurance coverage with ${hmo.facilityName} HMO. <br> Thank you. <br>
        Management </p>`;
  
      messRef.current = emailBody;
      setEdit(prev=>!prev)
    } catch (error) {
      console.error("Error fetching link:", error);
      toast.error("Failed to retrieve the link.");
    }
  };
  

  return (
    <Box>
    
  {edit  && <Input  value={messRef.current} label="Email" type="text" disabled />
}


<Box mb={1.5} sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }} gap={1}>
  {selectedEmployees.length > 0 && (
    <GlobalCustomButton onClick={handleSafeLink}>
      Send Link Notification
    </GlobalCustomButton>
  )}
</Box>


      <Grid container spacing={1}>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <Input register={register("name", { required: true })} label="Plan" type="text" disabled />
        </Grid>
        <Grid item lg={3} md={3} sm={3} xs={6}>
          <CustomSelect label="Plan Type" options={["Family", "Individual"]} disabled control={control} name="type" />
        </Grid>
        <Grid item lg={3} md={3} sm={3} xs={6}>
          <Input register={register("heads", { required: true })} label="No of Heads" type="number" disabled />
        </Grid>
      </Grid>

      <ListEmployee selectedemployee={selectedemployee} limit={plan?.heads} showLink={showLink} />
    </Box>
  );
};

export default SendPlanDetail;