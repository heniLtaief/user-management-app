import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./DashboardStat.css";
import AdminIcon from "../../components/icons/AdminIcon";
import UserIcon from "../../components/icons/UserIcon";
import TotalUserIcon from "../../components/icons/TotalUserIcon";
import UsersCountIcon from "../../components/icons/UsersCountIcon";

// fetch users
const fetchUsers = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  const res = await axios.get("http://localhost:4000/api/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// fetch tasks for logged in user
const fetchTasks = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  const res = await axios.get(
    "http://localhost:4000/api/admin/tasks/tasks/all",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data.tasks; // tableau de toutes les tâches
};
const Dashboardstat = () => {
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;
  const departementCount = new Set(
    users.filter((u) => u.departement).map((u) => u.departement),
  ).size;
  const totalCount = users.length;
  const colors = {
    green4: "#4ade80", // Replace with your actual green-4 color
    green6: "#16a34a", // Replace with your actual green-6 color
    gray4: "#9ca3af", // Replace with your actual gray-4 color
    gray6: "#4b5563", // Replace with your actual gray-6 color
    warning: "#fbbf24", // Replace with your actual warning color
    success: "#22c55e", // Replace with your actual success color
    textPrimary: "#1f2937", // Replace with your actual text-primary
    textSecondary: "#6b7280", // Replace with your actual text-secondary
    border: "#e5e7eb", // Replace with your actual border color
  };
  const pieData = {
    labels: ["Admins", "Users"],
    datasets: [
      {
        label: "Count",
        data: [adminCount, userCount],
        backgroundColor: [colors.green4, colors.gray4],
        borderColor: [colors.green6, colors.gray6],
        borderWidth: 2,
      },
    ],
  };

  const lastUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 3).length;
  const inProgressTasks = tasks.filter((t) => t.status === 2).length;
  const notStartedTasks = tasks.filter((t) => t.status === 1).length;

  const barData = {
    labels: ["Not Started", "In Progress", "Completed"],
    datasets: [
      {
        label: "Tasks",
        data: [notStartedTasks, inProgressTasks, completedTasks],
        backgroundColor: [colors.gray4, colors.warning, colors.success],
        borderColor: [colors.gray6, colors.warning, colors.success],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: colors.textPrimary,
          font: {
            size: 14,
          },
        },
      },
    },
  };

  const barOptions = {
    plugins: {
      legend: {
        labels: {
          color: colors.textPrimary,
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: colors.textSecondary,
        },
        grid: {
          color: colors.border,
        },
      },
      x: {
        ticks: {
          color: colors.textSecondary,
        },
        grid: {
          color: colors.border,
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <AdminIcon />
          </div>
          <h3>{adminCount}</h3>
          <p>Admins</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <UserIcon />
          </div>
          <h3>{userCount}</h3>
          <p>Users</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TotalUserIcon />
          </div>
          <h3>{totalCount}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <UsersCountIcon />
          </div>
          <h3>{departementCount}</h3>
          <p>Departments</p>
        </div>
      </div>

      <div className="dashboard-extra">
        <div className="chart-container">
          <h3>Role Distribution</h3>
          <div className="chart-wrapper">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        <div className="chart-container">
          <h3>Task Status</h3>
          <div className="chart-wrapper">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="latest-users">
          <h3>Latest Users</h3>
          <ul>
            {lastUsers.map((user) => (
              <li key={user._id}>
                <div className="user-item">
                  <div className="user-avatar">
                    {user.profil ? (
                      <img
                        src={`http://localhost:4000/api/${user.profil}`}
                        alt={user.username}
                      />
                    ) : (
                      <div className="avatar-fallback">
                        {user.username?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user.username}</span>
                    <span className={`user-role ${user.role}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboardstat;
