import { useEffect, useState } from "react";
import API from "../api";

function Recurring() {

  const [transaction, setTransaction] = useState({
    transactionName: "",
    amount: "",
    category: "",
    frequency: "Monthly"
  });

  const [list, setList] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {

    const email = localStorage.getItem("email");

    const res = await API.get(`/recurring/${email}`);

    setList(res.data);
  };

  const saveTransaction = async () => {

    const email = localStorage.getItem("email");

    await API.post(`/recurring/${email}`, transaction);

    alert("Recurring Transaction Added");

    setTransaction({
      transactionName: "",
      amount: "",
      category: "",
      frequency: "Monthly"
    });

    loadTransactions();
  };

  const deleteTransaction = async (id) => {

    await API.delete(`/recurring/${id}`);

    loadTransactions();
  };

  return (
    <div className="container">

      <h1>🔁 Recurring Transactions</h1>

      <input
        placeholder="Transaction Name"
        value={transaction.transactionName}
        onChange={(e) =>
          setTransaction({
            ...transaction,
            transactionName: e.target.value
          })
        }
      />

      <input
        type="number"
        placeholder="Amount"
        value={transaction.amount}
        onChange={(e) =>
          setTransaction({
            ...transaction,
            amount: e.target.value
          })
        }
      />

      <input
        placeholder="Category"
        value={transaction.category}
        onChange={(e) =>
          setTransaction({
            ...transaction,
            category: e.target.value
          })
        }
      />

      <select
        value={transaction.frequency}
        onChange={(e) =>
          setTransaction({
            ...transaction,
            frequency: e.target.value
          })
        }
      >
        <option>Monthly</option>
        <option>Weekly</option>
        <option>Yearly</option>
      </select>

      <button onClick={saveTransaction}>
        Add Recurring Transaction
      </button>

      <h2>My Recurring Expenses</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Frequency</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {list.map((item) => (
            <tr key={item.recurringId}>
              <td>{item.transactionName}</td>
              <td>₹{item.amount}</td>
              <td>{item.category}</td>
              <td>{item.frequency}</td>

              <td>
                <button
                  onClick={() =>
                    deleteTransaction(item.recurringId)
                  }
                >
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

export default Recurring;