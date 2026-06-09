import { useEffect, useState } from "react";
import API from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

function ExpenseAnalysis() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      return;
    }

    const res = await API.get(`/expense/category-summary/${email}`);

    const chartData = Object.entries(res.data).map(([category, amount]) => ({
      category,
      amount
    }));

    setSummary(chartData);
  };

  const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#14b8a6"];

  return (
    <div className="container">
      <h1>📊 Category Wise Expense Analysis</h1>

      <div className="chart-grid">
        <div className="chart-card">
          <h2>Expense Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summary}
                dataKey="amount"
                nameKey="category"
                outerRadius={100}
                label
              >
                {summary.map((item, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Category Spending</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h2>Category Summary</h2>

      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Total Expense</th>
          </tr>
        </thead>

        <tbody>
          {summary.map((item, index) => (
            <tr key={index}>
              <td>{item.category}</td>
              <td>₹{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseAnalysis;