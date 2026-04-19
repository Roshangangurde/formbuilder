import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  // Prevent flicker while auth state initializes
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  // Allow if user OR token exists
  if (user || token) {
    return <Outlet />;
  }

  return (
    <Navigate
      to="/login"
      replace
      state={{ from: location }}
    />
  );
};

export default ProtectedRoute;