// Firebase
import { getDatabase, ref, get } from "firebase/database";

const FetchBudgetData = async (setData, cat) => {
  const db = getDatabase();
  const dbRef = ref(db, cat);

  try {
    // Using `get()` for one-time read
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      setData(data);
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default FetchBudgetData;
