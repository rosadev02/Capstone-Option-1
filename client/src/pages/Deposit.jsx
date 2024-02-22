import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
import Card from "../components/Card";
const Deposit = () => {
  const [balance, setBalance] = useState();
  const { userData, setCurrentUser, currentUser } = useUser();
  const [deposit, setDeposit] = useState(0);
  const [successMessage, setSuccessMessage] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    console.log("CurrentUser:", currentUser);
    if (currentUser) {
      console.log("Balance:", currentUser.user.balance);
      if (currentUser.user.balance !== undefined) {
        setBalance(currentUser.user.balance);
        console.log("Setting balance:", currentUser.user.balance);
        if (!currentUser.user.transactions) {
          setCurrentUser({
            ...currentUser,
            balance: balance,
            transactions: [],
          });
          console.log(
            "Initializing transactions:",
            currentUser.user.transactions
          );
        }
      } else {
        setBalance(0);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentUser) {
      if (!deposit) {
        alert("The deposit field is blank.");
        return;
      }

      if (deposit < 0 || isNaN(deposit)) {
        alert("Please enter a valid positive number in the deposit field.");
        return;
      }

      // Atualize o saldo do usuário no contexto de usuário
      const updatedBalance = balance + parseFloat(deposit);
      // Crie um novo objeto de usuário com o novo saldo e as transações atualizadas
      const updatedUser = {
        ...currentUser,
        user: {
          ...currentUser.user,
          balance: updatedBalance,
          transactions: [
            ...(currentUser.user.transactions || []),
            {
              type: "Deposit",
              amount: `+${deposit}`,
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
        `/api/deposit/${currentUser.user.email}`,
        { amount: deposit, balance: balance + deposit }, // Enviamos o saldo atualizado na requisição
        config
      );
      setCurrentUser(updatedUser);

      // Atualize o saldo localmente
      setBalance(updatedBalance);

      setSuccessMessage(true);
      e.target.reset();
      setDeposit(0);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);
    } else {
      alert("Sign in to make transactions!");
    }
  };

  const handleDepositChange = (e) => {
    setDeposit(e.target.value);
  };

  return (
    <Card
      bgcolor="#4C2A85"
      txtcolor="#ffffff"
      header="Deposit"
      title="Made an deposit right now!"
      text=""
      body={
        <div>
          {successMessage && (
            <div className="alert alert-success mt-3" role="alert">
              Deposit received successfully!
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
                name="deposit"
                //value={deposit}
                onChange={handleDepositChange}
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
                id="deposit"
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
                Deposit
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
    //   <div id="deposit" class="card mx-auto my-5" style={{ maxWidth: "600px" }}>
    //     <h5 class="card-header">Deposit</h5>
    //     <div class="card-body">
    //       {successMessage && (
    //         <div className="alert alert-success mt-3" role="alert">
    //           Deposit received successfully!
    //         </div>
    //       )}
    //       <h5 class="card-title">Made an deposit right now!</h5>
    //       <form onSubmit={handleSubmit}>
    //         <div class="input-group mb-3">
    //           <span class="input-group-text">$</span>
    //           <span class="input-group-text">0.00</span>

    //           <input
    //             type="text"
    //             class="form-control"
    //             aria-label="Dollar amount (with dot and two decimal places)"
    //             name="deposit"
    //             value={deposit}
    //             onChange={handleDepositChange}
    //           />

    //           <button id="deposit" type="submit" class="btn btn-primary">
    //             Deposit
    //           </button>
    //         </div>
    //       </form>
    //       <div class="card-body">
    //         {balance !== undefined
    //           ? `This is your Balance: $${balance.toFixed(2)}`
    //           : "Loading balance..."}
    //       </div>
    //     </div>
    //   </div>
  );
};
export default Deposit;
