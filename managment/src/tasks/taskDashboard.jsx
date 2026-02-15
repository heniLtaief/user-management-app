import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import AddTaskIcon from "../components/icons/AddTaskIcon";
import Button from "../components/button/Button";
import api from "../api/api";
import TrashIcon from "../components/icons/TrashIcon";
import EditIcon from "../components/icons/EditIcon";
import "../pages/dashboard/AdminDashboard.css";

const fetchUserById = async (id) => {
  const response = await api.get(`/users/${id}/task`);
  return response.data;
};

const fetchUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d)) return "-";
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
};

const daysLeft = (endDate) => {
  if (!endDate) return "-";
  const today = new Date();
  const end = new Date(endDate);
  if (isNaN(end)) return "-";
  const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? `${diffDays} days left` : "Expired";
};

const TaskDashboard = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userTasks", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const currentUser = users.find((u) => u._id === id);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading tasks...</p>
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

  const tasksArray = (data?.tasks || []).map((task) => ({
    ...task,
    userId: id,
    departement: currentUser?.departement || "-",
  }));

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
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => {
        let statusText = "";
        let statusClass = "";
        switch (row.status) {
          case 1:
            statusText = "Not Started";
            statusClass = "status-1";
            break;
          case 2:
            statusText = "In Progress";
            statusClass = "status-2";
            break;
          case 3:
            statusText = "Completed";
            statusClass = "status-3";
            break;
          default:
            statusText = "Unknown";
            statusClass = "status-1";
        }

        return (
          <span className={`status-badge ${statusClass}`}>{statusText}</span>
        );
      },
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-btns">
          <Link to={`/edit-task-user/${id}/${row._id}`}>
            <Button
              className="edit-btn"
              size="sm"
              variant="icon"
              icon={<EditIcon />}
            ></Button>
          </Link>
          <Button
            variant="icon"
            className="delete-btn"
            icon={<TrashIcon />}
            size="sm"
            onClick={async (e) => {
              e.stopPropagation();
              if (
                window.confirm("Are you sure you want to delete this task?")
              ) {
                try {
                  await api.delete(`/users/${id}/task/${row._id}`);
                  window.location.reload();
                } catch (err) {
                  console.error(err);
                  alert("Error deleting task");
                }
              }
            }}
          ></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="task-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Tasks for {currentUser?.username || "User"}
        </h1>
        {currentUser && (
          <p className="task-dashboard-subtitle">
            {currentUser.departement || "Not assigned"} Department
          </p>
        )}
      </div>

      <div className="dashboard-actions">
        <Link to={`/add-task-user/${id}`}>
          <Button variant="primary" icon={<AddTaskIcon />}>
            ADD TASK
          </Button>
        </Link>
      </div>

      <div className="table-container">
        <DataTable
          columns={columns}
          data={tasksArray}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 20]}
          highlightOnHover
          striped
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
                cursor: "default",
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

export default TaskDashboard;
