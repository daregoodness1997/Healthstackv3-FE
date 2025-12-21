import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Box, Typography } from "@mui/material";
import DashboardCard from "../../../components/dashboardcard";
import ArtDiagnosesChart from "../../../components/charts/diagnoses";
import DashboardPaymentModeChart from "../../../components/charts/payment-mode";
// import DashboardPaymentModeChart from "../../../components/charts/payment-mode";

const ArtDashboard = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          flex: 1,
          padding: 4,
          height: "92vh",
          overflowY: "auto",
        }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { 
              xs: "1fr",
              sm: "repeat(2, 1fr)", 
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)" 
            },
            gap: { xs: 2, sm: 3 },
            width: "100%",
          }}>
          <DashboardCard
            bgColor="#023e8a"
            Icon={PeopleAltIcon}
            label="Patients"
            figure={10}
            loading={false}
          />

          <DashboardCard
            bgColor="#31572c"
            Icon={Diversity2Icon}
            label="Procedures"
            figure={5}
            loading={false}
          />

          <DashboardCard
            bgColor="#2a9d8f"
            Icon={CalendarMonthIcon}
            label="Appointments"
            figure={200}
            loading={false}
          />

          <DashboardCard
            bgColor="#e76f51"
            Icon={AccountBalanceWalletIcon}
            label="Payments"
            figure="NGN 100,000"
            loading={false}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            boxShadow: 2,
            borderRadius: "5px",
            height: "auto",
            width: "100%",
            gap: 3,
          }}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderRadius: "8px",
              bgcolor: "white",
              p: 4,
            }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "medium", color: "black" }}>
              Diagnoses
            </Typography>
            <Box sx={{ height: "250px", width: "100%" }}>
              <ArtDiagnosesChart />
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderRadius: "8px",
              bgcolor: "white",
              p: 4,
            }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "medium", color: "black" }}>
              Payment Modes
            </Typography>
            <Box sx={{ height: "250px", width: "100%" }}>
              <DashboardPaymentModeChart />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ArtDashboard;
