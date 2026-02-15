import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddUser.css";
import add from "../assets/add-user.svg";
import { useMutation } from "@tanstack/react-query";
import Button from "../components/button/Button";
import Input from "../components/input/Input";
import Dropdown from "../components/Dropdown/Dropdown";

const handleAddUser = async (FormData) => {
  const response = await axios.post(
    "http://localhost:4000/api/auth/add",
    FormData,
  );
  return response.data;
};

const AddUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [profil, setProfil] = useState("");
  const [departement, setDepartement] = useState("IT");
  const navigate = useNavigate();

  const addMutation = useMutation({
    mutationFn: handleAddUser,
    onSuccess: (data) => {
      console.log("add successful", data);
      navigate("/admin-dashboard");
    },
    onError: (error) => {
      console.log("add failed ", error);
      alert(error.response?.data?.msg || "add failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("profil", profil);
    formData.append("departement", departement);

    addMutation.mutate(formData);
  };

  const handleCancel = () => {
    navigate(`/admin-dashboard`);
    setUsername("");
    setEmail("");
    setPassword("");
    setProfil("");
    setRole("");
    setDepartement("");
  };

  return (
    <div className="adduser-container page-animate">
      <div className="adduser-wrapper">
        <div className="adduser-desc">
          <div className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="160"
              height="160"
              fill="currentColor"
              className="bi bi-person-fill-add"
              viewBox="0 0 16 16"
            >
              <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
            </svg>
          </div>
          <h2>Add New User</h2>
          <p>Add new users to your dashboard</p>
        </div>

        <div className="adduser-form-container">
          <div className="adduser-form-box">
            <form className="adduser-form" onSubmit={handleSubmit}>
              <div className="form-input-wrapper">
                <div className="form-group">
                  <label className="text">Username</label>
                  <Input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={addMutation.isPending}
                    fullWidth
                    size="medium"
                  />
                </div>

                <div className="form-group">
                  <label className="text">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={addMutation.isPending}
                    fullWidth
                    size="medium"
                  />
                </div>
              </div>
              <div className="form-input-wrapper">
                <div className="form-group">
                  <label className="text">Password</label>
                  <Input
                    type="text"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={addMutation.isPending}
                    fullWidth
                    size="medium"
                  />
                </div>

                <div className="form-group">
                  <label className="text">Role</label>
                  <Dropdown
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={addMutation.isPending}
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
              </div>

              <div className="form-group">
                <label className="text">Department</label>
                <Dropdown
                  value={departement}
                  onChange={(e) => setDepartement(e.target.value)}
                  disabled={addMutation.isPending}
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

              <div className="form-group">
                <label className="text">Profile Photo</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfil(e.target.files[0])}
                  disabled={addMutation.isPending}
                  fullWidth
                  size="medium"
                />
              </div>

              {addMutation.isError && (
                <div className="error-message">
                  {addMutation.error?.response?.data?.msg ||
                    "Add failed. Please try again."}
                </div>
              )}

              <div className="task-btn-group">
                <button
                  type="button"
                  className="task-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="task-submit-btn"
                  loading={addMutation.isPending}
                >
                  {addMutation.isPending ? "Adding..." : "Add User"}
                </button>
              </div>

              {/* <div className="btn-group">
                <Button
                  type="submit"
                  variant="primary"
                  loading={addMutation.isPending}
                  fullWidth
                  size="large"
                >
                  {addMutation.isPending ? "Adding..." : "Add User"}
                </Button>

                <Link to="/admin-dashboard" style={{ width: "100%" }}>
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    size="large"
                  >
                    Cancel
                  </Button>
                </Link>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
