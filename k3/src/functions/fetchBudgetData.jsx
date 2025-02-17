// Firebase
import { getDatabase, ref, onValue } from "firebase/database";

const FetchBudgetData = async (setData, cat) => {
  const db = getDatabase();
  const dbRef = ref(db, cat); // Reference to data
  try {
    await onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      setData(data);
      return data;
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
export default FetchBudgetData;
