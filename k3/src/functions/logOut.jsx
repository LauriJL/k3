// Firebase
import { getAuth, signOut } from "firebase/auth";

const HandleLogout = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Redirect to login or homepage after logout
      window.location.href = "/";
    })
    .catch((error) => {
      console.error("Error during logout:", error);
    });
};

export default HandleLogout;
