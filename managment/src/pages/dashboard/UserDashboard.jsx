import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import StatusToggle from "../../components/StatusToggle";
import "./AdminDashboard.css"; // ton CSS existant
import api from "../../api/api";

const fetchMyTasks = async () => {
  const response = await api.get("/users/me/tasks");
  return response.data;
};

const fetchMe = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d)) return "-";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const daysLeft = (endDate) => {
  if (!endDate) return "-";
  const today = new Date();
  const end = new Date(endDate);
  if (isNaN(end)) return "-";
  const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? `${diffDays} days left` : "Expired";
};

const UserDashboard = () => {
  const {
    data: taskData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-tasks"],
    queryFn: fetchMyTasks,
  });

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

  const [tasks, setTasks] = useState([]);

  React.useEffect(() => {
    if (taskData && me) {
      const formattedTasks = taskData.tasks.map((task) => ({
        ...task,
        userId: me._id,
        departement: me.departement || "-",
      }));
      setTasks(formattedTasks);
    }
  }, [taskData, me]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Update local state immediately
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task,
        ),
      );

      // Update on server
      const currentTask = tasks.find((task) => task._id === taskId);
      await api.put(`/users/${currentTask.userId}/task/${taskId}/status`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      // Revert on error
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: currentTask.status } : task,
        ),
      );
    }
  };

  const columns = [
    {
      name: "Department",
      selector: (row) => row.departement,
      sortable: true,
    },
    {
      name: "Task",
      selector: (row) => row.task,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => formatDate(row.startDate),
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => formatDate(row.endDate),
      sortable: true,
    },
    {
      name: "Days Left",
      selector: (row) => daysLeft(row.endDate),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <StatusToggle
          value={row.status}
          variant="pill"
          size="sm"
          showTooltip
          onChange={(newStatus) => handleStatusChange(row._id, newStatus)}
        />
      ),
      sortable: true,
      sortFunction: (a, b) => a.status - b.status,
    },
  ];

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-error">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Tasks</h1>
        <p className="dashboard-subtitle">
          You have {tasks.length} task{tasks.length !== 1 ? "s" : ""} assigned
        </p>
      </div>

      <div className="table-container">
        <DataTable
          columns={columns}
          data={tasks}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 20]}
          highlightOnHover
          striped
          pointerOnHover
          conditionalRowStyles={[
            {
              when: (row) => row.status === 1,
              style: {
                backgroundColor: "var(--gray-0)",
                "&:hover": {
                  backgroundColor: "var(--gray-1)",
                },
              },
            },
            {
              when: (row) => row.status === 2,
              style: {
                backgroundColor: "rgba(243, 156, 18, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(243, 156, 18, 0.2)",
                },
              },
            },
            {
              when: (row) => row.status === 3,
              style: {
                backgroundColor: "rgba(39, 174, 96, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(39, 174, 96, 0.2)",
                },
              },
            },
          ]}
          customStyles={{
            headRow: {
              style: {
                backgroundColor: "var(--gray-9)",
                color: "white",
                fontSize: "0.9rem",
                fontWeight: "600",
              },
            },
            rows: {
              style: {
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              },
            },
            pagination: {
              style: {
                backgroundColor: "var(--surface)",
                borderTop: "1px solid var(--border)",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default UserDashboard;
