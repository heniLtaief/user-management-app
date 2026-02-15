// Updated Navbar.js with consistent styling
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./Navbar.css";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import Button from "../button/Button";

const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch("http://localhost:4000/api/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });

  const handleLogout = async () => {
    await fetch("http://localhost:4000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.clear();
    window.location.href = "/login"; // Force full page reload
  };

  const menuItems = [
    {
      icon: <DashboardIcon />,
      label: "Dashboard",
      onClick: () => navigate("/user-dashboard"),
    },
    {
      icon: <PersonIcon />,
      label: "My Profile",
      onClick: () => navigate("/my-profile"),
    },
  ];

  if (isLoading)
    return (
      <nav className="navbar loading">
        <div className="spinner"></div>
      </nav>
    );

  if (isError) return null;

  // Helper to check if route is active (supports nested routes too)
  const isActive = (path) => location.pathname === path;

  const visibleItems = menuItems.filter(
    (item) => !item.adminOnly || user?.role === "admin",
  );

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content container">
          <Button
            variant="ghost"
            className="menu-toggle"
            onClick={() => setOpenMenu(!openMenu)}
            icon={openMenu ? <CloseIcon /> : <MenuIcon />}
            aria-label={openMenu ? "Close menu" : "Open menu"}
          />

          {/* Desktop Navigation Menu */}
          <div className="desktop-nav-menu">
            {visibleItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`nav-menu-item ${isActive(item.path) ? "active" : ""}`}
                onClick={
                  item.onClick ? item.onClick : () => navigate(item.path)
                }
                icon={item.icon}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div className="navbar-right">
            {user && (
              <div className="nav-user-info">
                <div className="user-avatar">
                  {user.profil ? (
                    <img
                      src={`http://localhost:4000/${user.profil}`}
                      alt={user.username}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${user.username}&background=26415E&color=fff`;
                      }}
                    />
                  ) : (
                    <div className="avatar-fallback">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.username}</span>
                  <span className="user-role">{user.role}</span>
                </div>
                <Button
                  variant="ghost"
                  className="logout-btn"
                  onClick={handleLogout}
                  icon={<LogoutIcon />}
                  title="Logout"
                  aria-label="Logout"
                />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {openMenu && (
        <div className="overlay" onClick={() => setOpenMenu(false)} />
      )}

      <aside className={`sidebar ${openMenu ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.profil ? (
                <img
                  src={`http://localhost:4000/${user.profil}`}
                  alt={user.username}
                />
              ) : (
                <div className="sidebar-avatar-fallback">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="sidebar-user-info">
              <h3>{user?.username}</h3>
              <p>{user?.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="sidebar-close"
            onClick={() => setOpenMenu(false)}
            icon={<CloseIcon />}
            aria-label="Close sidebar"
          />
        </div>

        <div className="sidebar-menu">
          {visibleItems.map((item, index) => (
            <button
              key={index}
              className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => {
                navigate(item.path);
                setOpenMenu(false);
              }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <Button
            variant="ghost"
            className="sidebar-logout"
            onClick={handleLogout}
            icon={<LogoutIcon />}
            fullWidth
          >
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
