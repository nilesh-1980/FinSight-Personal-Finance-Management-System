import { useEffect, useState } from "react";
import API from "../api";

function Expense() {
  const [expense, setExpense] = useState({
    amount: "",
    category: "",
    date: "",
    description: ""
  });

  const [expenseList, setExpenseList] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadExpense();
  }, []);

  const addExpense = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      alert("Please login first");
      return;
    }

    if (editId === null) {
      await API.post(`/expense/${email}`, expense);
      alert("Expense Added Successfully");
    } else {
      await API.put(`/expense/${editId}`, expense);
      alert("Expense Updated Successfully");
      setEditId(null);
    }

    setExpense({
      amount: "",
      category: "",
      date: "",
      description: ""
    });

    loadExpense();
  };

  const loadExpense = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      return;
    }

    const res = await API.get(`/expense/${email}`);
    setExpenseList(res.data);
  };

  const deleteExpense = async (id) => {
    await API.delete(`/expense/${id}`);
    alert("Expense Deleted");
    loadExpense();
  };

  const editExpense = (item) => {
    setEditId(item.expenseId);

    setExpense({
      amount: item.amount,
      category: item.category,
      date: item.date,
      description: item.description
    });
  };

  const cancelEdit = () => {
    setEditId(null);

    setExpense({
      amount: "",
      category: "",
      date: "",
      description: ""
    });
  };

  return (
    <div className="container">
      <h1>Expense Management</h1>

      <input
        type="number"
        placeholder="Enter Amount"
        value={expense.amount}
        onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
      />

      <input
        type="text"
        placeholder="Category: Food, Rent, Travel, Shopping"
        value={expense.category}
        onChange={(e) => setExpense({ ...expense, category: e.target.value })}
      />

      <input
        type="date"
        value={expense.date}
        onChange={(e) => setExpense({ ...expense, date: e.target.value })}
      />

      <input
        type="text"
        placeholder="Description"
        value={expense.description}
        onChange={(e) => setExpense({ ...expense, description: e.target.value })}
      />

      <button onClick={addExpense}>
        {editId === null ? "Add Expense" : "Update Expense"}
      </button>

      {editId !== null && (
        <button onClick={cancelEdit} style={{ marginLeft: "10px", background: "#64748b" }}>
          Cancel
        </button>
      )}

      <h2>Expense History</h2>

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
          {expenseList.map((item) => (
            <tr key={item.expenseId}>
              <td>₹{item.amount}</td>
              <td>{item.category}</td>
              <td>{item.date}</td>
              <td>{item.description}</td>
              <td>
                <button onClick={() => editExpense(item)}>
                  Edit
                </button>
              </td>
              <td>
                <button onClick={() => deleteExpense(item.expenseId)}>
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

export default Expense;