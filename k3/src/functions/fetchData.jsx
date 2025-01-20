// Firebase
import { getDatabase, ref, onValue } from "firebase/database";

const FetchData = (setItems, year) => {
  const db = getDatabase();
  const dbRef = ref(db, "menot/" + year); // Reference to data
  onValue(dbRef, (snapshot) => {
    console.log(dbRef.toString());
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
};
export default FetchData;
