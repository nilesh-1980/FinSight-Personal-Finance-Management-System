import { useEffect, useState } from "react";
import API from "../api";

function Budget() {
  const [budget, setBudget] = useState({
    month: "",
    amount: ""
  });

  const [budgetList, setBudgetList] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadBudget();
  }, []);

  const addBudget = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      alert("Please login first");
      return;
    }

    if (editId === null) {
      await API.post(`/budget/${email}`, budget);
      alert("Budget Added Successfully");
    } else {
      await API.put(`/budget/${editId}`, budget);
      alert("Budget Updated Successfully");
      setEditId(null);
    }

    setBudget({
      month: "",
      amount: ""
    });

    loadBudget();
  };

  const loadBudget = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      return;
    }

    const res = await API.get(`/budget/${email}`);
    setBudgetList(res.data);
  };

  const editBudget = (item) => {
    setEditId(item.budgetId);

    setBudget({
      month: item.month,
      amount: item.amount
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteBudget = async (id) => {
    await API.delete(`/budget/${id}`);
    alert("Budget Deleted");
    loadBudget();
  };

  const cancelEdit = () => {
    setEditId(null);

    setBudget({
      month: "",
      amount: ""
    });
  };

  return (
    <div className="container">
      <div className="budget-header">
        <div>
          <h1> Budget Management</h1>
          <p>Set, track and update your monthly spending limits.</p>
        </div>
      </div>

      <div className="budget-form-card">
        <h2>{editId === null ? "Set Monthly Budget" : "Update Budget"}</h2>

        <div className="budget-form-grid">
          <input
            type="text"
            placeholder="Month Example: January"
            value={budget.month}
            onChange={(e) =>
              setBudget({
                ...budget,
                month: e.target.value
              })
            }
          />

          <input
            type="number"
            placeholder="Monthly Budget Amount"
            value={budget.amount}
            onChange={(e) =>
              setBudget({
                ...budget,
                amount: e.target.value
              })
            }
          />
        </div>

        <button onClick={addBudget}>
          {editId === null ? "Set Budget" : "Update Budget"}
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

      <h2 className="section-title">Budget History</h2>

      <div className="budget-grid">
        {budgetList.map((item) => (
          <div className="budget-card-premium" key={item.budgetId}>
            <div className="budget-card-top">
              <div>
                <span>Month</span>
                <h2>{item.month}</h2>
              </div>

              <div className="budget-icon">₹</div>
            </div>

            <div className="budget-amount-box">
              <span>Budget Amount</span>
              <h3>₹{item.amount}</h3>
            </div>

            <div className="budget-actions">
              <button onClick={() => editBudget(item)}>Edit</button>

              <button
                className="delete-btn"
                onClick={() => deleteBudget(item.budgetId)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Budget;