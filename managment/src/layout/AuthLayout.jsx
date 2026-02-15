// src/auth/components/AuthLayout.jsx
import { Link } from "react-router-dom";
import Button from "../components/button/Button";

const AuthLayout = ({ mode, children }) => {
  const isLogin = mode === "login";

  const title = isLogin ? "Sign In" : "Create your Account";
  const description = isLogin ? "Hello Friend!" : "Welcome Back!";
  const subDescription = isLogin
    ? "Register Now to discover all of site features"
    : "Enter your personal details to use all of site features";
  const linkTo = isLogin ? "/register" : "/login";
  const linkText = isLogin ? "REGISTER" : "SIGN IN";

  return (
    <div className="auth-container page-animate">
      <div className="auth-wrapper">
        <div className={`auth-description ${isLogin ? "login" : "register"}`}>
          <h2>{description}</h2>
          <p>{subDescription}</p>
          <Link to={linkTo}>
            <Button variant="outline" className="register-btn">
              {linkText}
            </Button>
          </Link>
        </div>

        <div
          className={`auth-form-container ${isLogin ? "login" : "register"}`}
        >
          <div className="auth-form-box">
            <h2>{title}</h2>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
