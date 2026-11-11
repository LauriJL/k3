//Firebase
import { getDatabase, ref, get, query } from "firebase/database";
// const upcomingInvoices = data.filter((item) => item.maksupvm.length === 0);

const FetchUnpaid = async (setItems, year) => {
  const db = getDatabase();
  const itemsRef = ref(db, `menot/${year}`);
  const filteredQuery = query(itemsRef);
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
      const upcomingInvoices = filteredData.filter(
        (item) => item.maksupvm.length === 0,
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
