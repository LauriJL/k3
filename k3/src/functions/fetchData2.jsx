// Firebase
import { getDatabase, ref, onValue } from "firebase/database";
import calculateCategorySums from "../functions/categorySums";

const FetchData2 = (setItems) => {
  const db = getDatabase();
  const dbRef = ref(db, "menot"); // Reference to data
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const formattedData = Object.keys(data)
        .reverse()
        .map((key) => ({
          id: key,
          ...data[key],
        }));
      setItems(formattedData);
      calculateCategorySums(formattedData);
    }
  });
};
export default FetchData2;
