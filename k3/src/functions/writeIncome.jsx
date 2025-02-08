// React
import { ref, set, push } from "firebase/database"; // Import database functions
// Firebase
import { mydatabase } from "../firebase/firebase_config"; // Firebase database

export const writeIncomeData = (
  year,
  incomeId,
  maksaja,
  summa,
  maksupvm,
  tuloluokka,
  huom
) => {
  // Create a reference to the path where data is saved
  const incomeRef = ref(mydatabase, "tulot/" + year);

  // Use 'push()' to generate a unique ID and create a reference for income entry
  const newincomeRef = push(incomeRef);

  // 'set' writes multiple values to this reference
  set(newincomeRef, {
    maksaja: maksaja,
    summa: summa,
    maksupvm: maksupvm,
    tuloluokka: tuloluokka,
    huom: huom,
  })
    .then(() => {
      console.log("Tulo lisätty!");
    })
    .catch((error) => {
      console.error("Tulon lisääminen ei onnistunut:", error);
    });
};
