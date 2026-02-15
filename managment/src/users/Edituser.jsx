import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditUser.css";
import Dropdown from "../components/Dropdown/Dropdown";
import Input from "../components/input/Input";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profil, setProfil] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [users, setUsers] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    profil: "",
    departement: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:4000/api/users/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data) {
          const userData = response.data;

          const startDate = userData.task?.startDate
            ? userData.task.startDate.slice(0, 10)
            : "";
          const endDate = userData.task?.endDate
            ? userData.task.endDate.slice(0, 10)
            : "";

          setUsers({
            ...userData,
            task: {
              ...userData.task,
              startDate,
              endDate,
            },
          });
        }
      } catch (error) {
        alert("Erreur lors de la récupération de l'utilisateur");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if name exists before calling startsWith
    if (name && name.startsWith("task.")) {
      const field = name.split(".")[1];
      setUsers((prev) => ({
        ...prev,
        task: { ...prev.task, [field]: value },
      }));
    } else if (name) {
      setUsers((prev) => ({ ...prev, [name]: value }));
    }
    // If name is undefined, we can't update anything
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", users.username);
      formData.append("email", users.email);
      formData.append("role", users.role);
      formData.append("departement", users.departement);
      formData.append("task", users.task?.task || "");
      formData.append("startDate", users.task?.startDate || "");
      formData.append("endDate", users.task?.endDate || "");
      if (profil) formData.append("profil", profil);

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:4000/api/users/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data) {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Erreur lors de la mise à jour");
    }
  };
  const handleCancel = () => {
    navigate(`/admin-dashboard`);
    setUsers({
      username: "",
      email: "",
      password: "",
      role: "",
      profil: "",
      departement: "",
    });
  };

  if (userLoading) {
    return (
      <div className="edituser-container page-animate">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="edituser-container page-animate">
      <div className="edituser-wrapper">
        <div className="adduser-desc">
          <div className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="160"
              height="160"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path
                fillRule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
              />
            </svg>
          </div>
          <h2>Edit User</h2>
          <p>Modify user information</p>
        </div>

        <div className="adduser-form-container">
          <div className="adduser-form-box">
            <form className="adduser-form" onSubmit={handleSubmit}>
              <div className="form-input-wrapper">
                {users.profil && (
                  <div className="user-info">
                    <img
                      src={`http://localhost:4000/${users.profil}`}
                      alt="profil"
                      className="user-img"
                    />
                    <span className="user-name">{users.username}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="text">Profile Photo</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfil(e.target.files[0])}
                    fullWidth
                    size="medium"
                  />
                </div>
              </div>
              <div className="form-input-wrapper">
                <div className="form-group">
                  <label className="text">Username</label>
                  <Input
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    value={users.username || ""}
                    onChange={handleChange}
                    fullWidth
                    size="medium"
                  />
                </div>

                <div className="form-group">
                  <label className="text">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={users.email || ""}
                    onChange={handleChange}
                    fullWidth
                    size="medium"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="text">Role</label>
                <Dropdown
                  value={users.role || ""}
                  onChange={handleChange}
                  name="role"
                  options={[
                    { value: "admin", label: "Administrator" },
                    { value: "user", label: "Regular User" },
                  ]}
                  placeholder="Select role"
                  fullWidth
                  size="medium"
                  variant="outlined"
                />
              </div>

              <div className="form-group">
                <label className="text">Department</label>
                <Dropdown
                  value={users.departement || ""}
                  onChange={handleChange}
                  name="departement"
                  options={[
                    { value: "IT", label: "IT" },
                    { value: "HR", label: "Human Resources" },
                    { value: "Marketing", label: "Marketing" },
                    { value: "Finance", label: "Finance" },
                  ]}
                  placeholder="Select department"
                  fullWidth
                  size="medium"
                  variant="outlined"
                />
              </div>
              <div className="task-btn-group">
                <button
                  type="button"
                  className="task-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="task-submit-btn">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
