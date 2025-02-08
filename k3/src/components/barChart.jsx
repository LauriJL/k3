import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = ({ data }) => {
  const options = {
    responsive: true,
    tile: {
      display: true,
      text: "Menot ja tulot",
    },
  };
  const returnedData = {
    labels: ["Menoarvio", "Tuloarvio", "Menot", "Tulot", "Erotus"],
    datasets: [
      {
        label: "Yhteensä",
        data: [6050.0, 6231.0, 1071.25, 981, -90.25],
        backgroundColor: [
          "rgba(228, 8, 34, 0.2)",
          "rgba(80, 36, 212, 0.2)",
          "rgba(99, 255, 109, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(242, 38, 19, 0.2);",
        ],
        borderColor: ["rgb(5, 6, 7)"],
        borderWidth: 1,
      },
    ],
  };
  return <Bar data={returnedData} options={options} />;
};
