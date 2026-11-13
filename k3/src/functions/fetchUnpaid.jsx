//Firebase
import { getDatabase, ref, get, query } from "firebase/database";

const FetchUnpaid = async (setItems, year) => {
  if (!year) {
    setItems([]);
    return;
  }
  const db = getDatabase();
  const itemsRef = ref(db, `menot/${year}`);
  const filteredQuery = query(itemsRef);
  try {
    // Using `get()` for one-time read
    const snapshot = await get(filteredQuery);
    if (snapshot.exists()) {
      const data = snapshot.val();

      const filteredData = Object.keys(data)
        .sort((a, b) => new Date(data[a].erapvm) - new Date(data[b].erapvm)) // Sort by erapvm
        .map((key) => ({
          id: key,
          ...data[key],
        }));
      const upcomingInvoices = filteredData.filter(
        (item) => !item.maksupvm || item.maksupvm.length === 0,
      );
      setItems(upcomingInvoices);
    } else {
      setItems([]);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default FetchUnpaid;
