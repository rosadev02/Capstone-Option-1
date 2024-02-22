import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUser } from "../contexts/UserContext";
import Card from "../components/Card";
import axios from "axios";
const Withdraw = () => {
  const [balance, setBalance] = useState();
  const { userData, setCurrentUser, setUserData, currentUser } = useUser();
  const [withdraw, setWithdraw] = useState();
  const [successMessage, setSuccessMessage] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    console.log("CurrentUser:", currentUser);
    if (currentUser) {
      if (currentUser.user.balance !== undefined) {
        setBalance(currentUser.user.balance);
        console.log("Setting balance:", currentUser.user.balance);
        if (!currentUser.user.transactions) {
          setCurrentUser({
            ...currentUser,
            balance: balance,
            transactions: [],
          });
        }
      } else {
        setBalance(0);
      }
    }
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentUser) {
      if (!withdraw) {
        alert("The withdraw field is blank.");
        return;
      }

      if (withdraw < 0) {
        alert("The withdraw field is a negative number.");
        return;
      }

      if (withdraw > balance) {
        alert("The withdraw higher than the account balance.");
        return;
      }

      if (isNaN(withdraw)) {
        alert("The withdraw field has not a valid number!");
        return;
      }
      const updatedBalance = balance - parseFloat(withdraw);

      const updatedUser = {
        ...currentUser,
        user: {
          ...currentUser.user,
          balance: updatedBalance,
          transactions: [
            ...(currentUser.user.transactions || []),
            {
              type: "Withdraw",
              amount: `-${withdraw}`,
            },
          ],
        },
      };
      const token = currentUser.token;

      // Configura o cabeçalho da requisição com o token de autenticação
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Faz a requisição para depositar o valor no banco de dados
      axios.post(
        `http://localhost:3001/api/withdraw/${currentUser.user.email}`,
        { amount: withdraw, balance: balance + withdraw }, // Enviamos o saldo atualizado na requisição
        config
      );
      setCurrentUser(updatedUser);

      // Atualize o saldo localmente
      setBalance(updatedBalance);

      setSuccessMessage(true);
      e.target.reset();
      setWithdraw(0);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);
    } else {
      alert("Sign in to make transactions!");
    }
  };
  const handlewithdrawChange = (e) => {
    setWithdraw(e.target.value);
  };

  return (
    <Card
      bgcolor="#4C2A85"
      txtcolor="#ffffff"
      header="Withdraw"
      title="Made an withdraw right now!"
      text=""
      body={
        <div>
          {successMessage && (
            <div className="alert alert-success mt-3" role="alert">
              Withdraw received successfully!
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div class="input-group mb-3">
              <span
                class="input-group-text"
                style={{
                  backgroundColor: "#4c2a85ff",
                  color: "#ffffff",
                  border: "2px solid #ffffff",
                  padding: "10px 20px",
                  cursor: "pointer",
                  width: "50px",
                }}
              >
                $
              </span>
              <span
                class="input-group-text"
                style={{
                  backgroundColor: "#4c2a85ff",
                  color: "#ffffff",
                  border: "2px solid #ffffff",
                  padding: "10px 20px",
                  cursor: "pointer",
                  borderBottomRightRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                0.00
              </span>

              <input
                type="text"
                class="form-control"
                aria-label="Dollar amount (with dot and two decimal places)"
                name="withdraw"
                value={withdraw}
                onChange={handlewithdrawChange}
                style={{
                  //border: "2px solid #4C2A85",
                  padding: "10px 20px",
                  cursor: "pointer",
                  //width: "50px",
                  borderRadius: "10px",
                  marginLeft: "4px",
                }}
              />

              <button
                id="withdraw"
                type="submit"
                class="btn"
                style={{
                  backgroundColor: hovered ? "#BCEDF6" : "#ffffff",
                  color: "#6b7fd7ff",
                  //border: "solid #4C2A85",
                  // height: "50px",
                  borderRadius: "10px",
                  marginLeft: "4px",
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                Withdraw
              </button>
            </div>
          </form>
          <div class="card-body" style={{ color: "#ffffff" }}>
            {balance !== undefined
              ? `This is your Balance: $${balance.toFixed(2)}`
              : "Loading balance..."}
          </div>
        </div>
      }
    />
    // <div id="withdraw" class="card mx-auto my-5" style={{ maxWidth: "600px" }}>
    //   <h5 class="card-header">withdraw</h5>
    //   <div class="card-body">
    //     {successMessage && (
    //       <div className="alert alert-success mt-3" role="alert">
    //         withdraw received successfully!
    //       </div>
    //     )}
    //     <h5 class="card-title">Made a withdraw right now!</h5>
    //     <form onSubmit={handleSubmit}>
    //       <div class="input-group mb-3">
    //         <span class="input-group-text">$</span>
    //         <span class="input-group-text">0.00</span>

    //         <input
    //           type="text"
    //           class="form-control"
    //           aria-label="Dollar amount (with dot and two decimal places)"
    //           name="withdraw"
    //           value={withdraw}
    //           onChange={handlewithdrawChange}
    //         />

    //         <button id="withdraw" type="submit" class="btn btn-primary">
    //           withdraw
    //         </button>
    //       </div>
    //     </form>
    //     <div class="card">
    //       <div class="card-body">
    //         {balance !== undefined
    //           ? `This is your Balance: $${balance.toFixed(2)}`
    //           : "Loading balance..."}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};
export default Withdraw;
