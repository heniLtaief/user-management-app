import CompletedIcon from "./icons/CompletedIcon";
import InProgressIcon from "./icons/InProgressIcon";
import NotStartedIcon from "./icons/NotStartedIcon";
import "./StatusToggle.css";

const StatusToggle = ({
  value = 1,
  onChange,
  disabled = false,
  variant = "default",
  className = "",
  size = "md",
  showTooltip = true,
  
}) => {
  const options = [
    {
      value: 1,
      tooltip: "Not Started",
      icon: (
        <NotStartedIcon/>
      ),
    },
    {
      value: 2,
      tooltip: "In Progress",
      icon: (
        <InProgressIcon/>
      ),
    },
    {
      value: 3,
      tooltip: "Completed",
      icon: (
        <CompletedIcon/>
      ),
    },
  ];

  const getActiveColor = (val) => {
    switch (val) {
      case 1:
        return { background: "var(--primary-medium)", color: "var(--surface)" };
      case 2:
        return { background: "#FFBF00", color: "var(--surface)" };
      case 3:
        return { background: "var(--success)", color: "#0c7328" };
      default:
        return {};
    }
  };

  const handleClick = (newValue) => {
    if (!disabled && onChange) {
      onChange(newValue);
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "status-toggle-sm";
      case "lg":
        return "status-toggle-lg";
      default:
        return "status-toggle-md";
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case "pill":
        return "status-toggle-pill";
      case "minimal":
        return "status-toggle-minimal";
      case "outline":
        return "status-toggle-outline";
      default:
        return "";
    }
  };

  return (
    <div
      className={`status-toggle ${getSizeClass()} ${getVariantClass()} ${className}`}
      role="radiogroup"
      aria-label="Status selector"
    >
      <div className="status-toggle-container">
        {options.map((option) => {
          const isActive = value === option.value;
          const activeStyle = isActive ? getActiveColor(option.value) : {};

          return (
            <button
              key={option.value}
              type="button"
              className={`status-option ${isActive ? "status-option-active" : ""} ${disabled ? "status-option-disabled" : ""}`}
              onClick={() => handleClick(option.value)}
              disabled={disabled}
              aria-checked={isActive}
              aria-label={option.tooltip}
              title={showTooltip ? option.tooltip : ""}
              style={activeStyle}
            >
              <span className="status-icon">
                {option.icon}
                {isActive && variant !== "minimal" && (
                  <span className="status-pulse"></span>
                )}
              </span>
              {isActive && variant !== "minimal" && (
                <span className="status-indicator"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StatusToggle;