import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddTask.css";

const EditTask = () => {
  const { id, taskId } = useParams();
  const navigate = useNavigate();

  const [userLoading, setUserLoading] = useState(false);
  const [taskData, setTaskData] = useState({
    task: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchTask = async () => {
      setUserLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:4000/api/users/${id}/task/${taskId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        // Format dates for input
        const startDate = res.data.startDate
          ? new Date(res.data.startDate).toISOString().slice(0, 10)
          : "";
        const endDate = res.data.endDate
          ? new Date(res.data.endDate).toISOString().slice(0, 10)
          : "";

        setTaskData({
          task: res.data.task || "",
          startDate: startDate,
          endDate: endDate,
        });
      } catch (err) {
        alert("Task not found");
        // Navigate back if task not found
        navigate(`/task-dashboard/${id}`);
      } finally {
        setUserLoading(false);
      }
    };

    fetchTask();
  }, [id, taskId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/users/${id}/task/${taskId}`,
        taskData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate(`/task-dashboard/${id}`);
    } catch (err) {
      alert(err.response?.data?.error || "Error updating task");
    }
  };

  const handleCancel = () => {
    navigate(`/task-dashboard/${id}`);
    setTaskData({
      task: "",
      startDate: "",
      endDate: "",
    });
  };

  if (userLoading) {
    return (
      <div className="task-page page-animate">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="task-page page-animate">
      <div className="task-wrapper">
        <div className="task-info-panel">
          <h1 className="task-title">Edit Task</h1>
          <p className="task-description">
            Modify the details of the selected task.
          </p>
        </div>

        <div className="task-form-panel">
          <div className="task-form-box">
            <h2 className="task-form-title">Task Details</h2>
            <form className="task-form" onSubmit={handleSubmit}>
              <div>
                <label>Task</label>
                <input
                  className="task-input"
                  type="text"
                  name="task"
                  placeholder="Task description"
                  value={taskData.task}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="task-dates">
                <div>
                  <label>Start Date</label>
                  <input
                    className="task-input"
                    type="date"
                    name="startDate"
                    value={taskData.startDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>End Date</label>
                  <input
                    className="task-input"
                    type="date"
                    name="endDate"
                    value={taskData.endDate}
                    onChange={handleChange}
                  />
                </div>
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
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
