import { useEffect, useState } from "react";
import API from "../api";

function Budget() {
  const [budget, setBudget] = useState({
    month: "",
    amount: ""
  });

  const [budgetList, setBudgetList] = useState([]);

  useEffect(() => {
    loadBudget();
  }, []);

  const addBudget = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      alert("Please login first");
      return;
    }

    await API.post(`/budget/${email}`, budget);

    alert("Budget Added Successfully");

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

  return (
    <div className="container">
      <h1>Budget Management</h1>

      <input
        type="text"
        placeholder="Month Example: January"
        value={budget.month}
        onChange={(e) => setBudget({ ...budget, month: e.target.value })}
      />

      <input
        type="number"
        placeholder="Monthly Budget Amount"
        value={budget.amount}
        onChange={(e) => setBudget({ ...budget, amount: e.target.value })}
      />

      <button onClick={addBudget}>Set Budget</button>

      <h2>Budget History</h2>

      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Budget Amount</th>
          </tr>
        </thead>

        <tbody>
          {budgetList.map((item) => (
            <tr key={item.budgetId}>
              <td>{item.month}</td>
              <td>₹{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Budget;