// Firebase
import { getDatabase, ref, onValue } from "firebase/database";

const FetchBudgetData = (setData, cat) => {
  const db = getDatabase();
  const dbRef = ref(db, cat); // Reference to data
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    setData(data);
    return data;
  });
};
export default FetchBudgetData;
