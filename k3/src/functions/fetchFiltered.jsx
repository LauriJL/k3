//Firebase
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
} from "firebase/database";

const FetchFiltered = (cat, setItems, year) => {
  const db = getDatabase();
  const itemsRef = ref(db, "menot/" + year);
  let itemsArray = [];
  const filteredQuery = query(
    itemsRef,
    orderByChild("maksuluokka"),
    equalTo(cat)
  );
  onValue(filteredQuery, (snapshot) => {
    if (snapshot.exists()) {
      const filteredData = snapshot.val();
      itemsArray = Object.values(filteredData);
      setItems(itemsArray);
    } else {
      console.log("No matching records found");
    }
  });
};

export default FetchFiltered;
