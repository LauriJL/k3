// Firebase
import { getDatabase, ref, onValue } from "firebase/database";

const FetchData = async (setItems, cat, year) => {
  const db = getDatabase();
  const dbRef = ref(db, cat + "/" + year); // Reference to data
  try {
    await onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data)
          .reverse()
          .map((key) => ({
            id: key,
            ...data[key],
          }));
        setItems(formattedData);
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
export default FetchData;
