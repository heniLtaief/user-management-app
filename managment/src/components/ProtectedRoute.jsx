import { Navigate, useLocation } from "react-router-dom";
//uselocation recupere route actuel

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  //children : composant a afficher si utilisateur et autorise
  // requireAdmin : booléen si vras -> seuls les admins peuvent accede
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  let user = null;

  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
  //

  //  si user n'est pas connecté redirection vers /login
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  //  Admin only
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/user-profile" replace />;
  }

  // toutes les conditions sont passees return children ... adminlayout out userlayout
  return children;
};

export default ProtectedRoute;
