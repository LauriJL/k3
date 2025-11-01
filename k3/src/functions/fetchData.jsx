// Firebase, one-time data fetch utility
import { getDatabase, ref, get } from "firebase/database";

const FetchData = async (setItems, cat, year) => {
  if (!year) {
    setItems([]);
    return;
  }

  const db = getDatabase();
  const dbRef = ref(db, `${cat}/${year}`); // Reference to data

  try {
    const snapshot = await get(dbRef);
    const data = snapshot.val();
    if (data) {
      const formattedData = Object.keys(data)
        .reverse()
        .map((key) => ({ id: key, ...data[key] }));
      setItems(formattedData);
    } else {
      setItems([]);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    setItems([]);
  }
};
export default FetchData;
