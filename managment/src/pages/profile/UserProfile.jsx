import { useState } from "react";
import "./MyProfile.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";

const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:4000/api/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Erreur chargement profil");
  }
  return res.json();
};

const updateUserProfile = async ({ userId, formData }) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:4000/api/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Erreur modification profile");
  }
  return res.json();
};

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    onSuccess: (data) => {
      setEditedData({
        id: data._id,
        username: data.username || "",
        email: data.email || "",
        role: data.role || "",
        profil: data.profil || "",
        departement: data.departement || "",
      });
    },
  });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["userProfile"], data);
      setIsEditing(false);
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({
      username: user.username,
      email: user.email,
      role: user.role,
      profil: user.profil,
      departement: user.departement || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      username: user.username,
      email: user.email,
      role: user.role,
      profil: user.profil,
      departement: user.departement || "",
    });
  };

  const handleChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedData({ ...editedData, profil: file });
    }
  };

  const handleSave = async () => {
    const formData = new FormData();

    formData.append("username", editedData.username);
    formData.append("email", editedData.email);
    formData.append("role", editedData.role);
    if (editedData.departement) {
      formData.append("departement", editedData.departement);
    }

    if (editedData.profil instanceof File) {
      formData.append("profil", editedData.profil);
    }

    mutation.mutate({
      userId: user._id,
      formData,
    });
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-container page-animate">
      <div className="profile-card card">
        <div className="profile-header">
          <div className={`avatar-wrapper ${isEditing ? "editing" : ""}`}>
            <div className="avatar">
              {editedData.profil ? (
                <img
                  src={
                    editedData.profil instanceof File
                      ? URL.createObjectURL(editedData.profil)
                      : `http://localhost:4000/${editedData.profil}`
                  }
                  alt="Profil"
                  className="avatar-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${user?.username}&background=${isEditing ? "2BD496" : "394a6a"}&color=fff&size=150`;
                  }}
                />
              ) : (
                <div className="avatar-placeholder">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}

              {isEditing && (
                <label className="avatar-overlay">
                  <div className="edit-icon">📷</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={mutation.isPending}
                    className="file-input"
                  />
                </label>
              )}
            </div>
            {isEditing && (
              <p className="avatar-hint">Click to change profile picture</p>
            )}
          </div>
        </div>

        <div className="profile-form">
          <h3 className="section-title">Personal Information</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Username</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={editedData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  disabled={mutation.isPending}
                  placeholder="Enter username"
                  fullWidth
                />
              ) : (
                <div className="readonly-value">{user?.username}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editedData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={mutation.isPending}
                  placeholder="Enter email"
                  fullWidth
                />
              ) : (
                <div className="readonly-value">{user?.email}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Role</label>
              <div className="readonly-value capitalize">{user?.role}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={editedData.departement || ""}
                  onChange={(e) => handleChange("departement", e.target.value)}
                  disabled={mutation.isPending}
                  placeholder="Enter department"
                  fullWidth
                />
              ) : (
                <div className="readonly-value">
                  {user?.departement || "Not specified"}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            {!isEditing ? (
              <Button
                variant="primary"
                onClick={handleEdit}
                className="edit-btn"
              >
                Edit Profile
              </Button>
            ) : (
              <div className="action-buttons">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  loading={mutation.isPending}
                  className="save-btn"
                >
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
