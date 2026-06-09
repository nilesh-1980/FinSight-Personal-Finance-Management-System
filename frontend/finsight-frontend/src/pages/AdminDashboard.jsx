import { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard() {
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalIncome: 0,
    totalExpense: 0,
    totalSavings: 0,
    totalBudgets: 0,
    totalGoals: 0,
    totalNotifications: 0
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    const res1 = await API.get("/admin/summary");
    setSummary(res1.data);

    const res2 = await API.get("/admin/users");
    setUsers(res2.data);
  };

  return (
    <div className="container">
      <h1>🛡️ Admin Dashboard</h1>

      <div className="card-box">
        <div className="card blue">
          <h3>Total Users</h3>
          <h2>{summary.totalUsers}</h2>
        </div>

        <div className="card green">
          <h3>Total Income</h3>
          <h2>₹{summary.totalIncome}</h2>
        </div>

        <div className="card red">
          <h3>Total Expense</h3>
          <h2>₹{summary.totalExpense}</h2>
        </div>

        <div className="card orange">
          <h3>Total Savings</h3>
          <h2>₹{summary.totalSavings}</h2>
        </div>
      </div>

      <div className="card-box" style={{ marginTop: "25px" }}>
        <div className="card blue">
          <h3>Total Budgets</h3>
          <h2>{summary.totalBudgets}</h2>
        </div>

        <div className="card green">
          <h3>Total Goals</h3>
          <h2>{summary.totalGoals}</h2>
        </div>

        <div className="card red">
          <h3>Notifications</h3>
          <h2>{summary.totalNotifications}</h2>
        </div>
      </div>

      <h2>All Users</h2>

      <table>
        <thead>
          <tr>
            <th>User Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.userId}>
              <td>{u.userId}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;