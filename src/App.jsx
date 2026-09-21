import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    paymentMethod: "",
    expenseDate: "",
    notes: "",
  });

  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getExpenses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/expenses"
      );

      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    getExpenses();
  }, []);

  const handleEdit = (expense) => {
    setEditingId(expense.id);

    setFormData({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      expenseDate: expense.expenseDate,
      notes: expense.notes,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId === null) {
        await axios.post(
          "http://localhost:8081/api/expenses",
          {
            ...formData,
            amount: Number(formData.amount),
          }
        );
      } else {
        await axios.put(
          `http://localhost:8081/api/expenses/${editingId}`,
          {
            ...formData,
            amount: Number(formData.amount),
          }
        );
      }

      setFormData({
        description: "",
        amount: "",
        category: "",
        paymentMethod: "",
        expenseDate: "",
        notes: "",
      });

      setEditingId(null);

      getExpenses();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8081/api/expenses/${id}`
      );

      getExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const highestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((expense) => Number(expense.amount)))
      : 0;

  const averageExpense =
    expenses.length > 0
      ? totalExpenses / expenses.length
      : 0;

  return (
    <div className="app">

      <h1>Expense Tracker</h1>

      <p className="subtitle">
        Manage and track your daily expenses
      </p>

      <div className="dashboard">

        <div className="dashboard-card">
          <span>Total Spent</span>
          <h2>₹{totalExpenses.toFixed(2)}</h2>
        </div>

        <div className="dashboard-card">
          <span>Transactions</span>
          <h2>{expenses.length}</h2>
        </div>

        <div className="dashboard-card">
          <span>Highest Expense</span>
          <h2>₹{highestExpense.toFixed(2)}</h2>
        </div>

        <div className="dashboard-card">
          <span>Average Expense</span>
          <h2>₹{averageExpense.toFixed(2)}</h2>
        </div>

      </div>

      <form className="expense-form" onSubmit={handleSubmit}>

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="">Select Payment Method</option>
          <option value="UPI">UPI</option>
          <option value="Cash">Cash</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
        </select>

        <input
          type="date"
          name="expenseDate"
          value={formData.expenseDate}
          onChange={handleChange}
        />

        <input
          type="text"
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId === null ? "Add Expense" : "Update Expense"}
        </button>

      </form>

      <div className="expense-list">

        <h2>Expenses</h2>

        {expenses.map((expense) => (

          <div className="expense-card" key={expense.id}>

            <h3>{expense.description}</h3>

            <p>Amount: ₹{expense.amount}</p>
            <p>Category: {expense.category}</p>
            <p>Payment: {expense.paymentMethod}</p>
            <p>Date: {expense.expenseDate}</p>
            <p>Notes: {expense.notes}</p>

            <div className="button-group">

              <button
                className="edit-button"
                onClick={() => handleEdit(expense)}
              >
                Edit
              </button>

              <button
                className="delete-button"
                onClick={() => handleDelete(expense.id)}
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

export default App;