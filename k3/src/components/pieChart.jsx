import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Tooltip, Legend, ArcElement);

export const PieChart = (arr) => {
  let labels = [];
  let data = [];
  data = arr.arr.map((element) => parseFloat(element.summa));
  labels = arr.arr.map((element) => element.luokka);

  const returnedData = {
    labels: labels,
    datasets: [
      {
        label: "Yhteensä",
        data: data,
        backgroundColor: [
          "rgba(20, 205, 200, 0.8)",
          "rgba(255, 0, 0, 0.8)",
          "rgba(0, 0, 255, 0.8)",
          "rgba(0, 255, 0, 0.8)",
          "rgba(90, 34, 139, 0.8)",
          "rgba(255, 240, 0, 0.8)",
          "rgba(4, 59, 92, 0.8);",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const options = {};
  return <Pie data={returnedData} />;
};
