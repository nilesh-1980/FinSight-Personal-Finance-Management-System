import { useEffect, useState } from "react";
import API from "../api";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    savings: 0,
    budget: 0,
    remainingBudget: 0,
    budgetUsedPercent: 0,
    savingsPercent: 0,
    alertMessage: "",
    savingsInsight: "",
    budgetInsight: ""
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      return;
    }

    const res = await API.get(`/dashboard/${email}`);
    setData(res.data);
  };

  const downloadReport = async () => {
    try {
      const email = localStorage.getItem("email");

      const response = await axios.get(
        `http://localhost:8080/api/report/${email}`,
        {
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "FinSight-Report.pdf");

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert("PDF Download Failed");
    }
  };

  const pieData = [
    { name: "Income", value: data.totalIncome },
    { name: "Expense", value: data.totalExpense },
    { name: "Savings", value: data.savings }
  ];

  const barData = [
    { name: "Income", amount: data.totalIncome },
    { name: "Expense", amount: data.totalExpense },
    { name: "Savings", amount: data.savings },
    { name: "Budget", amount: data.budget }
  ];

  const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

  return (
    <div className="container">
      <h1>FinSight Dashboard</h1>

      <div className="card-box">
        <div className="card green">
          <h3>Total Income</h3>
          <h2>₹{data.totalIncome}</h2>
        </div>

        <div className="card red">
          <h3>Total Expense</h3>
          <h2>₹{data.totalExpense}</h2>
        </div>

        <div className="card blue">
          <h3>Savings</h3>
          <h2>₹{data.savings}</h2>
        </div>

        <div className="card orange">
          <h3>Remaining Budget</h3>
          <h2>₹{data.remainingBudget}</h2>
        </div>
      </div>

      <div className="alert-box">
        <h2>{data.alertMessage}</h2>
        <p>Budget Used: {data.budgetUsedPercent.toFixed(2)}%</p>
        <p>Savings Rate: {data.savingsPercent.toFixed(2)}%</p>
      </div>

      <div className="insight-box">
        <h2> Smart Financial Insights</h2>

        <div className="insight-card">
          <p>{data.savingsInsight}</p>
        </div>

        <div className="insight-card">
          <p>{data.budgetInsight}</p>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={downloadReport}>📄 Download PDF Report</button>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h2>Income vs Expense vs Savings</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Financial Overview</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;