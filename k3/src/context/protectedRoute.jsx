import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "./authContext";

export function ProtectedRoute({ children }) {
  const { user } = useContext(Context);

  if (!user) {
    return <Navigate to="/" replace />;
  } else {
    return children;
  }
}
