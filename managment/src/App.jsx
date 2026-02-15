import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AddUser from "./users/AddUser";
import Edituser from "./users/Edituser";
import MyProfile from "./pages/profile/MyProfile";
import Dashboardstat from "./pages/dashboard/DashboardStat";
import UserProfil from "./pages/profile/UserProfil";

import AdminLayout from "./layout/AdminLayout";
import UserLayout from "./layout/UserLayout";
import AddTask from "./tasks/AddTask";

import ProtectedRoute from "./components/ProtectedRoute";
import EditTask from "./tasks/EditTask";
import UserDashboard from "./pages/dashboard/UserDashboard";
import TaskDashboard from "./tasks/taskDashboard";
import AuthPage from "./pages/auth/AuthPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* route public */}
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />

        {/* seuls les admins */}
        <Route
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/admin-dashboard/edit/:id" element={<Edituser />} />
          <Route path="/dashboard-stats" element={<Dashboardstat />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/add-task-user/:id" element={<AddTask />} />
          <Route path="/edit-task-user/:id/:taskId" element={<EditTask />} />
          <Route path="/task-dashboard/:id" element={<TaskDashboard />} />
        </Route>

        {/* User  */}
        <Route
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/user-profile" element={<UserProfil />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Route>

        {/* redirige auto vers /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* route inconnues  */}
        <Route path="*" element={<h1>404 - Page not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
