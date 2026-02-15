import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SearchIcon from "../../components/icons/SearchIcon";
import AddIcon from "../../components/icons/AddIcon";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import api from "../../api/api";
import EditIcon from "../../components/icons/EditIcon";
import TrashIcon from "../../components/icons/TrashIcon";
import AddTaskIcon from "../../components/icons/AddTaskIcon";

const fetchUsers = async () => {
  try {
    console.log(
      "Fetching users with token:",
      localStorage.getItem("token") ? "Yes" : "No",
    );

    const response = await api.get("/users");

    if (!response.data) {
      throw new Error("No data returned from API");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });

    // If it's a 401 error and we have a token, it might be expired
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      console.log("Token might be expired, trying to refresh...");

      try {
        // Try to refresh token directly
        const refreshRes = await axios.post(
          "http://localhost:4000/api/auth/refresh",
          {},
          { withCredentials: true },
        );

        if (refreshRes.data.token) {
          localStorage.setItem("token", refreshRes.data.token);
          console.log("Token refreshed, retrying request...");

          // Retry the original request
          const retryResponse = await api.get("/users");
          return retryResponse.data;
        }
      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);
        // Clear token and let the interceptor handle redirect
        localStorage.removeItem("token");
      }
    }

    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
    console.log("User deleted successfully:", id);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    retry: 1,
    retryDelay: 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Delete mutation error:", error);
      alert(error.response?.data?.error || "Error deleting user");
    },
  });

  useEffect(() => {
    if (users.length) {
      setFilteredUsers(users);
    }
  }, [users]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.departement?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      name: "Profile",
      selector: (row) =>
        row.profil ? (
          <img
            src={`http://localhost:4000/${row.profil}`}
            className="profil-pic"
            alt={row.username}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${row.username}&background=26415E&color=fff`;
            }}
          />
        ) : (
          <div className="profil-placeholder">
            {row.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
        ),
      sortable: false,
      width: "80px",
    },
    {
      name: "Username",
      selector: (row) => row.username || "-",
      sortable: true,
      width: "150px",
    },
    {
      name: "Email",
      selector: (row) => row.email || "-",
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role || "-",
      sortable: true,
      cell: (row) => (
        <span className={`role-badge ${row.role}`}>
          {row.role?.toUpperCase() || "USER"}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Department",
      selector: (row) => row.departement || "-",
      sortable: true,
      width: "150px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-btns">
          <Button
            className="edit-btn"
            variant="icon"
            icon={<EditIcon />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin-dashboard/edit/${row._id}`);
            }}
            title="Edit User"
            size="sm"
          ></Button>
          <Button
            variant="icon"
            className="add-task-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/add-task-user/${row._id}`);
            }}
            title="Add Task"
            size="sm"
            icon={<AddTaskIcon />}
          ></Button>
          <Button
            variant="icon"
            className="delete-btn"
            icon={<TrashIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row._id);
            }}
            title="Delete User"
            size="sm"
          ></Button>
        </div>
      ),
      width: "170px",
    },
  ];

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-error">
        <h3>Error loading users</h3>
        <p>{error.response?.data?.msg || error.message || "Unknown error"}</p>
        <div className="error-actions">
          <Button onClick={() => refetch()} variant="primary">
            Retry
          </Button>
          <Button onClick={() => navigate("/login")} variant="ghost">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">User Management</h1>
      </div>

      <div className="dashboard-actions">
        <div className="search-container">
          <Input
            type="text"
            placeholder="Search users by name, email, role, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<SearchIcon />}
            className="search-input"
          />
        </div>
        <Link to="/add-user">
          <Button variant="primary" icon={<AddIcon />}>
            ADD USER
          </Button>
        </Link>
      </div>

      <div className="table-container">
        <DataTable
          columns={columns}
          data={filteredUsers}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 20]}
          highlightOnHover
          striped
          onRowClicked={(row) => navigate(`/task-dashboard/${row._id}`)}
          pointerOnHover
          noDataComponent={
            <div className="no-data">
              {searchTerm ? "No users match your search" : "No users found"}
            </div>
          }
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
                "&:hover": {
                  backgroundColor: "var(--gray-0)",
                },
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

export default AdminDashboard;
