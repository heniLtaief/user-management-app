import PropTypes from "prop-types";
import "./Button.css";

const Button = ({
  children,
  variant = "primary",
  disabled = false,
  icon,
  iconPosition = "left",
  onClick,
  title = "",
  type = "button",
  className = "",
  loading = false,
}) => {
  const isIconOnly = icon && !children;

  return (
    <button
      title={title}
      type={type}
      className={`btn btn-${variant} ${isIconOnly ? "btn--icon-only" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="btn__loading">
          <span className="btn__loading-dot"></span>
          <span className="btn__loading-dot"></span>
          <span className="btn__loading-dot"></span>
        </span>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="btn__icon btn__icon--left">{icon}</span>
          )}

          {children && <span className="btn__content">{children}</span>}

          {icon && iconPosition === "right" && (
            <span className="btn__icon btn__icon--right">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["primary", "outline", "transparent"]),
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  onClick: PropTypes.func,
  title: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
  loading: PropTypes.bool,
};

export default Button;
