import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/ui/Loading";

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children;
};

export default PrivateRoute;
