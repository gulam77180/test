import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}