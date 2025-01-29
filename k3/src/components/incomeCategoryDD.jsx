// Firebase
import { mydatabase } from "../firebase/firebase_config"; // points to firebase database
import { getDatabase, ref, get } from "firebase/database"; // methods for Realtime database
// React
import React, { useState, useEffect } from "react";
// Bootstrap
import { Dropdown, DropdownButton } from "react-bootstrap";

const IncomeCategoryDropDown = ({ handleChange }) => {
  const [options, setOptions] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("Valitse");

  // Fetch data from Firebase when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const db = mydatabase;
      const dbRef = ref(db, "tuloluokat");
      const snapshot = await get(dbRef);
      try {
        const data = snapshot.val();
        if (data) {
          const formattedOptions = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setOptions(formattedOptions);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // Handle dropdown item click
  const handleSelect = (value, label) => {
    setSelectedLabel(value); // Update the selected label in the UI
    handleChange(value); // Notify parent component about the selected value
  };

  return (
    <DropdownButton id="dropdown-basic-button" title={selectedLabel}>
      {options.map((option) => (
        <Dropdown.Item
          key={option.id}
          onClick={() => handleSelect(option.name)}
        >
          {option.name}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export default IncomeCategoryDropDown;
