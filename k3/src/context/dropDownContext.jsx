import React, { createContext, useState } from "react";

// Create the context
export const DropdownContext = createContext();

// Create a provider component
export const DropdownProvider = ({ children }) => {
  const [selectedValue, setSelectedValue] = useState("Default"); // Initial dropdown value

  const value = {
    selectedValue,
    setSelectedValue, // Expose the setter for updating from child components
  };

  return (
    <DropdownContext.Provider value={selectedValue}>
      {children}
    </DropdownContext.Provider>
  );
};
