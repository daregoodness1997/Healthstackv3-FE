import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Box } from "@mui/material";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
  LineElement,
  PointElement
);

const GrowthAnalysisChart = () => {
  const chartData = {
    labels: [
      "Blocked tubes",
      "Hormonal Imbalance",
      "Fibriods",
      "Unknown",
      "Others",
    ],
    datasets: [
      {
        label: "Diagnoses",
        data: [30, 20, 10, 30, 20],
        backgroundColor: [
          "#31572c",
          "#c1121f",
          "#bde0fe",
          "#0364FF",
          "#DD1FD5",
        ],
        borderColor: ["#31572c", "#c1121f", "#bde0fe", "#0364FF", "#DD1FD5"],
        cutout: "50%",
        spacing: 5,
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
      <Doughnut
        data={chartData}
        options={{
          responsive: true,

          maintainAspectRatio: true,
          cutout: 100,
          plugins: {
            legend: {
              display: true,
            },
          },
        }}
      />
    </Box>
  );
};

export default GrowthAnalysisChart;
