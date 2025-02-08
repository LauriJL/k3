import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Tooltip, Legend, ArcElement);

export const PieChart = ({ data }) => {
  const fakeData = {
    labels: ["Jätehuolto", "Vesi", "Palvelumaksut", "Vakuutus"],
    datasets: [
      {
        label: "Yhteensä",
        data: [99.56, 273.88, 9.74, 688.07],
        backgroundColor: [
          "rgba(22, 80, 53, 0.2)",
          "rgba(16, 68, 224, 0.2)",
          "rgba(198, 28, 93, 0.2)",
          "rgba(216, 231, 12, 0.2)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const options = {};
  return <Pie data={fakeData} />;
};
