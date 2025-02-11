// React
import React, { useEffect, useState } from "react";
// Functions
import FetchBudgetData from "../functions/fetchBudgetData";
// Chart components
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

export const BarChart = ({ expenditureTotal, incomeTotal, diff }) => {
  const [incomeYr, setIncomeYr] = useState(0);
  const [expenditureYr, setExpenditureYr] = useState(0);

  //Fetch data
  useEffect(() => {
    FetchBudgetData(setIncomeYr, "budjetti/2025/tulot/");
    FetchBudgetData(setExpenditureYr, "budjetti/2025/menot/");
    // return () => mydatabase.ref("menot").off(); // Cleanup subscription
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const returnedData = {
    labels: ["Menoarvio", "Tuloarvio", "Menot", "Tulot", "Erotus"],
    datasets: [
      {
        label: "Yhteensä",
        data: [expenditureYr, incomeYr, expenditureTotal, incomeTotal, diff],
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
