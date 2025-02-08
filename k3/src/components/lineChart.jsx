import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LineChart = ({ data }) => {
  const fakeData = {
    labels: ["1", "2", "3", "4", "5", "6", "7"],
    datasets: [
      {
        label: "Menot",
        data: [12, 19, 3, 5, 2, 3, 6],
        borderColor: ["rgba(255, 99, 132, 1)"],
      },
    ],
  };
  const options = {};
  return <Line data={fakeData} />;
};
