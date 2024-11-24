import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "./authContext";

// THis component checks if the user is authenticated before rendering a particular route.
export function ProtectedRoute({ children }) {
  const { user } = useContext(Context);

  if (!user) {
    return <Navigate to="/" replace />;
  } else {
    return children;
  }
}
