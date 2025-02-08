// React
import { createContext, useState, useEffect } from "react";
// Firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";
// Components
import NavBar from "../components/navbar";

export const Context = createContext();

// Access authentication state throughout app. Used with protectedRoute component.
export function AuthProvider({ children }) {
  const auth = getAuth();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);
      if (currentUser) {
        setUser(currentUser);
        setUserName(currentUser.email);
      } else {
        setUser(null);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [auth]);

  const values = {
    user,
    setUser,
    userName,
    setUserName,
  };

  return (
    <>
      <Context.Provider value={values}>
        {!loading && (
          <>
            <NavBar />
            {children}
          </>
        )}
      </Context.Provider>
    </>
  );
}
