//Firebase
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
} from "firebase/database";

const FetchFiltered = async (cat, setItems, year) => {
  const db = getDatabase();
  const itemsRef = ref(db, "menot/" + year);
  const filteredQuery = query(
    itemsRef,
    orderByChild("maksuluokka"),
    equalTo(cat)
  );
  try {
    await onValue(filteredQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const filteredData = Object.keys(data)
          .reverse()
          .map((key) => ({
            id: key,
            ...data[key],
          }));
        setItems(filteredData);
      } else {
        console.log("No matching records found");
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default FetchFiltered;
