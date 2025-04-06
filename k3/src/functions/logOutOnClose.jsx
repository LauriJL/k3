import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";

const LogoutOnClose = () => {
  useEffect(() => {
    const handleUnload = (event) => {
      if (
        window.performance.getEntriesByType("navigation")[0].type === "navigate"
      ) {
        // Page is being reloaded, don't log out
        return;
      }

      signOut(getAuth())
        .then(() => {
          console.log("User signed out on tab close.");
        })
        .catch((error) => {
          console.error("Error during logout:", error);
        });
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);
};

export default LogoutOnClose;
