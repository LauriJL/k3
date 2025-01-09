//FIrebase
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
} from "firebase/database";

const FetchFiltered = (cat) => {
  const db = getDatabase();
  const itemsRef = ref(db, "menot");
  const filteredQuery = query(
    itemsRef,
    orderByChild("maksuluokka"),
    equalTo(cat)
  );
  onValue(filteredQuery, (snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot);
      const filteredData = snapshot.val();
      console.log(filteredData);
    } else {
      console.log("No matching records found");
    }
  });
};

export default FetchFiltered;
