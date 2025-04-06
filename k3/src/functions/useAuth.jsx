import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Updates UI when user logs in/out
      console.log("User state changed:", currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return user;
};

export default useAuth;
