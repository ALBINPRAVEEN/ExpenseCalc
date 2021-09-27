import React, { useState, useEffect } from "react";
import "./App.css";
import logo1 from "./components/expenselogo1.svg";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";
import Alert from "./components/Alert";
import { v4 as uuidv4 } from "uuid";

const initialExpense = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];
// const initialExpense = [
//   { id: uuidv4(), charge: "House Rent", amount: 1600 },
//   { id: uuidv4(), charge: "Vehicle", amount: 1000 },
//   { id: uuidv4(), charge: "Medical", amount: 1200 },
// ];

function App() {
  //  ------STATE VALUES------
  //  all expense, add expense
  const [expenses, setExpenses] = useState(initialExpense);
  //  single expense
  const [charge, setCharge] = useState("");
  //  single amount
  const [amount, setAmount] = useState("");
  //  alert
  const [alert, setAlert] = useState({ show: false });
  //  edit
  const [edit, setEdit] = useState(false);
  //edit expense
  const [id, setId] = useState(0);

  //  ------useEffect hook ------
  useEffect(() => {
    console.log("useEff3ect called");
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  //  ------FUNCTIONS------
  const handleCharge = (e) => {
    setCharge(e.target.value);
  };

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map((item) => {
          return item.id === id ? { ...item, charge, amount } : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({ type: "success", text: "Item added successfully" });
      } else {
        const singleExpense = { id: uuidv4(), charge, amount };
        setExpenses([...expenses, singleExpense]);
        handleAlert({ type: "success", text: "Item added successfully" });
      }

      setCharge("");
      setAmount("");
    } else {
      handleAlert({
        type: "danger",
        text: `Cannot leave the field empty. Try again!`,
      });
    }
  };
  //clear list
  const clearList = () => {
    setExpenses([]);
    handleAlert({ type: "danger", text: "All items deleted successfully" });
  };

  //handle delete
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter((item) => item.id !== id);
    setExpenses(tempExpenses);
    handleAlert({ type: "danger", text: "Item deleted successfully" });
  };

  //handel Edit
  const handleEdit = (id) => {
    let expense = expenses.find((item) => item.id === id);
    let { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <div className="card text-white bg-info mb-3">
        <div className="card-header">
          <h1>
            <img className="logo" src={logo1} alt="logo" />
            Expense Calculator
          </h1>
        </div>
      </div>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearList={clearList}
        />
      </main>
      <h1>
        Total Expenditure :{" "}
        <span className="total">
          ${" "}
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
