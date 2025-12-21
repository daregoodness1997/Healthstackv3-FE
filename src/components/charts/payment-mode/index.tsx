import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  scale: {
    ticks: {
      precision: 0,
    },
  },

  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
};

const DashboardPaymentModeChart = () => {
  const chartData = {
    labels: ["Cash", "HMO", "Company", "Family Plan"],
    datasets: [
      {
        data: [20, 100, 30, 60],
        backgroundColor: ["#06d6a0", "#ef476f", "#3a86ff", "#31572c"],
      },
    ],
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Bar options={options} data={chartData} />
    </Box>
  );
};

export default DashboardPaymentModeChart;
