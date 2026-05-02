import { Navigate } from "react-router-dom";

export default function ProtectedAdmin({ children }) {

  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}