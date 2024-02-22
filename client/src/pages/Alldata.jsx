import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUser } from "../contexts/UserContext";

const AllData = () => {
  const { currentUser } = useUser();
  const [userTransactions, setUserTransactions] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.user) {
      console.log(
        "Novas transações do usuário:",
        currentUser.user.transactions
      );
      setUserTransactions(currentUser.user.transactions);
    }
  }, [currentUser?.user?.transactions]);

  if (!currentUser || !currentUser.user) {
    return (
      <div>
        <div className="card mx-auto my-5" style={{ maxWidth: "600px" }}>
          <div className="card-header font-weight-bold">
            <h4>
              <strong>No user logged in.</strong>
            </h4>
          </div>
        </div>
      </div>
    );
  }

  const { name, email, balance } = currentUser.user;

  return (
    <div>
      <div
        className="card mx-auto my-5"
        style={{
          maxWidth: "600px",
          backgroundColor: "#4c2a85ff",
          color: "#ffffff",
        }}
      >
        <div className="card-header font-weight-bold">
          <h4>
            <strong>User</strong>
          </h4>
        </div>
        <ul
          className="list-group list-group-flush"
          style={{ backgroundColor: "#6B7FD7" }}
        >
          <li
            className="list-group-item"
            style={{ backgroundColor: "#6B7FD7", color: "#ffffff" }}
          >
            Name: {name}
          </li>
          <li
            className="list-group-item"
            style={{ backgroundColor: "#6B7FD7", color: "#ffffff" }}
          >
            Email: {email}
          </li>
        </ul>
        <div className="card-header ">
          <h4>
            <strong>Transactions:</strong>
          </h4>
        </div>
        <ul className="list-group list-group-flush">
          {userTransactions.map((transaction, i) => (
            <li
              key={i}
              className="list-group-item"
              style={{
                backgroundColor:
                  transaction.type === "Withdraw" ? "#FFC0CB" : "#BCEDF6",
              }}
            >
              Type: {transaction.type}, Amount: {transaction.amount}
            </li>
          ))}
        </ul>
        <div className="card-header">
          <h4>
            <strong>{`On time Balance: $${balance.toFixed(2)}`}</strong>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default AllData;
