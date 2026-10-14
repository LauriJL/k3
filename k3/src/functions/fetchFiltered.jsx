//Firebase
import {
  getDatabase,
  ref,
  get,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";

const FetchFiltered = async (cat, setItems, year) => {
  const db = getDatabase();
  const itemsRef = ref(db, `menot/${year}`);
  const filteredQuery = query(
    itemsRef,
    orderByChild("maksuluokka"),
    equalTo(cat),
  );
  try {
    // Using `get()` for one-time read
    const snapshot = await get(filteredQuery);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const filteredData = Object.keys(data)
        .reverse()
        .map((key) => ({
          id: key,
          ...data[key],
        }));
      setItems(filteredData);
    } else {
      setItems([]);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default FetchFiltered;
