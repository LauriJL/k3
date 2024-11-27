// React
import React, { useEffect, useState } from "react";
// Firebase
import { getDatabase, ref, onValue } from "firebase/database";
import { mydatabase } from "../firebase/firebase_config"; // Firebase database

const FetchPaginatedData = (setItems) => {
  const db = getDatabase();
  const dbRef = ref(db, "menot"); // Reference to data
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const formattedData = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setItems(formattedData);
    }
  });
};
export default FetchPaginatedData;
