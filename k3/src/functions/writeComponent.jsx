// React
import { ref, set, push } from "firebase/database"; // Import database functions
// Firebase
import { mydatabase } from "../firebase/firebase_config"; // Firebase database

export const writeInvoiceData = (
  invoiceId,
  saaja,
  summa,
  erapvm,
  maksupvm,
  maksuluokka,
  huom
) => {
  // Create a reference to the path where data is saved
  const invoiceRef = ref(mydatabase, "menot");

  // Use 'push()' to generate a unique ID and create a reference for invoice
  const newinvoiceRef = push(invoiceRef);

  // 'set' writes multiple values to this reference
  set(newinvoiceRef, {
    saaja: saaja,
    summa: summa,
    erapvm: erapvm,
    maksupvm: maksupvm,
    maksuluokka: maksuluokka,
    huom: huom,
  })
    .then(() => {
      console.log("Lasku lisätty!");
    })
    .catch((error) => {
      console.error("Laskun lisääminen ei onnistunut:", error);
    });
};
