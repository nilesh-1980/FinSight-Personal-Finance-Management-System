import { useEffect, useState } from "react";
import API from "../api";

function Income() {
  const [income, setIncome] = useState({
    amount: "",
    category: "",
    date: "",
    description: ""
  });

  const [incomeList, setIncomeList] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadIncome();
  }, []);

  const addIncome = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      alert("Please login first");
      return;
    }

    if (editId === null) {
      await API.post(`/income/${email}`, income);
      alert("Income Added Successfully");
    } else {
      await API.put(`/income/${editId}`, income);
      alert("Income Updated Successfully");
      setEditId(null);
    }

    setIncome({
      amount: "",
      category: "",
      date: "",
      description: ""
    });

    loadIncome();
  };

  const loadIncome = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      return;
    }

    const res = await API.get(`/income/${email}`);
    setIncomeList(res.data);
  };

  const deleteIncome = async (id) => {
    await API.delete(`/income/${id}`);
    alert("Income Deleted");
    loadIncome();
  };

  const editIncome = (item) => {
    setEditId(item.incomeId);

    setIncome({
      amount: item.amount,
      category: item.category,
      date: item.date,
      description: item.description
    });
  };

  const cancelEdit = () => {
    setEditId(null);

    setIncome({
      amount: "",
      category: "",
      date: "",
      description: ""
    });
  };

  return (
    <div className="container">
      <h1>Income Management</h1>

      <input
        type="number"
        placeholder="Enter Amount"
        value={income.amount}
        onChange={(e) => setIncome({ ...income, amount: e.target.value })}
      />

      <input
        type="text"
        placeholder="Category: Salary, Freelancing, Business"
        value={income.category}
        onChange={(e) => setIncome({ ...income, category: e.target.value })}
      />

      <input
        type="date"
        value={income.date}
        onChange={(e) => setIncome({ ...income, date: e.target.value })}
      />

      <input
        type="text"
        placeholder="Description"
        value={income.description}
        onChange={(e) => setIncome({ ...income, description: e.target.value })}
      />

      <button onClick={addIncome}>
        {editId === null ? "Add Income" : "Update Income"}
      </button>

      {editId !== null && (
        <button onClick={cancelEdit} style={{ marginLeft: "10px", background: "#64748b" }}>
          Cancel
        </button>
      )}

      <h2>Income History</h2>

      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {incomeList.map((item) => (
            <tr key={item.incomeId}>
              <td>₹{item.amount}</td>
              <td>{item.category}</td>
              <td>{item.date}</td>
              <td>{item.description}</td>
              <td>
                <button onClick={() => editIncome(item)}>
                  Edit
                </button>
              </td>
              <td>
                <button onClick={() => deleteIncome(item.incomeId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Income;