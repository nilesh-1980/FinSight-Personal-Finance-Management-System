import { useEffect, useState } from "react";
import API from "../api";

function Goals() {
  const [goal, setGoal] = useState({
    goalName: "",
    targetAmount: "",
    savedAmount: "",
    deadline: ""
  });

  const [goalList, setGoalList] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      return;
    }

    const res = await API.get(`/goals/${email}`);
    setGoalList(res.data);
  };

  const saveGoal = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      alert("Please login first");
      return;
    }

    if (editId === null) {
      await API.post(`/goals/${email}`, goal);
      alert("Goal Added Successfully");
    } else {
      await API.put(`/goals/${editId}`, goal);
      alert("Goal Updated Successfully");
      setEditId(null);
    }

    setGoal({
      goalName: "",
      targetAmount: "",
      savedAmount: "",
      deadline: ""
    });

    loadGoals();
  };

  const editGoal = (item) => {
    setEditId(item.goalId);

    setGoal({
      goalName: item.goalName,
      targetAmount: item.targetAmount,
      savedAmount: item.savedAmount,
      deadline: item.deadline
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteGoal = async (id) => {
    await API.delete(`/goals/${id}`);
    alert("Goal Deleted");
    loadGoals();
  };

  const cancelEdit = () => {
    setEditId(null);

    setGoal({
      goalName: "",
      targetAmount: "",
      savedAmount: "",
      deadline: ""
    });
  };

  const getProgress = (savedAmount, targetAmount) => {
    if (!targetAmount || targetAmount <= 0) {
      return 0;
    }

    return ((savedAmount / targetAmount) * 100).toFixed(2);
  };

  const getRemaining = (targetAmount, savedAmount) => {
    return Number(targetAmount) - Number(savedAmount);
  };

  return (
    <div className="container">
      <div className="goal-header">
        <div>
          <h1> Savings Goal Tracker</h1>
          <p>Track your dreams, savings progress and financial targets.</p>
        </div>
      </div>

      <div className="goal-form-card">
        <h2>{editId === null ? "Create New Goal" : "Update Goal"}</h2>

        <div className="goal-form-grid">
          <input
            type="text"
            placeholder="Goal Name Example: Buy Laptop"
            value={goal.goalName}
            onChange={(e) => setGoal({ ...goal, goalName: e.target.value })}
          />

          <input
            type="number"
            placeholder="Target Amount"
            value={goal.targetAmount}
            onChange={(e) =>
              setGoal({ ...goal, targetAmount: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Saved Amount"
            value={goal.savedAmount}
            onChange={(e) =>
              setGoal({ ...goal, savedAmount: e.target.value })
            }
          />

          <input
            type="date"
            value={goal.deadline}
            onChange={(e) => setGoal({ ...goal, deadline: e.target.value })}
          />
        </div>

        <button onClick={saveGoal}>
          {editId === null ? "Add Goal" : "Update Goal"}
        </button>

        {editId !== null && (
          <button
            onClick={cancelEdit}
            style={{ marginLeft: "10px", background: "#64748b" }}
          >
            Cancel
          </button>
        )}
      </div>

      <h2 className="section-title">My Goals</h2>

      <div className="goal-grid">
        {goalList.map((item) => {
          const progress = getProgress(item.savedAmount, item.targetAmount);
          const remaining = getRemaining(item.targetAmount, item.savedAmount);

          return (
            <div className="goal-premium-card" key={item.goalId}>
              <div className="goal-top">
                <div>
                  <h2>{item.goalName}</h2>
                  <p>Deadline: {item.deadline}</p>
                </div>

                <div className="goal-badge">{progress}%</div>
              </div>

              <div className="goal-money-row">
                <div>
                  <span>Target</span>
                  <h3>₹{item.targetAmount}</h3>
                </div>

                <div>
                  <span>Saved</span>
                  <h3>₹{item.savedAmount}</h3>
                </div>

                <div>
                  <span>Remaining</span>
                  <h3>₹{remaining < 0 ? 0 : remaining}</h3>
                </div>
              </div>

              <div className="progress-bg premium-progress">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress > 100 ? 100 : progress}%`
                  }}
                ></div>
              </div>

              <p className="goal-status">
                 {progress}% completed toward your goal
              </p>

              <div className="goal-actions">
                <button onClick={() => editGoal(item)}>Edit</button>

                <button
                  onClick={() => deleteGoal(item.goalId)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Goals;