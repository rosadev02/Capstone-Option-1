import React, { useState } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const CreateAccount = ({ showModal, setShowModal }) => {
  const [successMessage, setSuccessMessage] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser, setCurrentUser } = useUser();
  const [hovered, setHovered] = useState(false);
  const { isAuthenticated, logout } = useAuth0();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      // Desloga do Auth0 antes de criar uma nova conta
      await logout();
    } else {
      setCurrentUser("");
    }
    if (!name) {
      alert("The name field is left blank.");
      return;
    }

    if (!email) {
      alert("The email field is blank.");
      return;
    }

    if (password.length < 8) {
      alert("The password is less than 8 characters long;");
      return;
    }

    e.target.reset();
    const newUser = {
      name: name,
      email: email,
      password: password,
      balance: 0,
      transactions: [], // Inicializa as transações como um array vazio
    };
    axios
      .post("http://localhost:3001/api/register", newUser)
      .then((response) => {
        console.log("User Info Saved:", response.data);
        setSuccessMessage(true);
        setCurrentUser(response.data);
        setTimeout(() => {
          setSuccessMessage(false);
          setShowModal(false);
        }, 3000);
      })
      .catch((error) => {
        let errorMessage = "Error creating account";

        if (error.response) {
          // O servidor retornou uma resposta com um status diferente de 2xx
          console.error("Server Error:", error.response.data);

          // Verifica se a mensagem de erro é "Email already in use"
          if (error.response.data.error === "Email already in use") {
            errorMessage =
              "Email already in use. Please use a different email.";
          }
        } else if (error.request) {
          // A requisição foi feita, mas não recebeu resposta
          console.error("No response received:", error.request);
        } else {
          // Algo aconteceu durante a requisição que causou um erro
          console.error("Request error:", error.message);
        }

        // Atualiza o estado com a mensagem de erro
        setErrorMessage(errorMessage);

        // Exibe a mensagem de erro no console ou toma outra ação necessária
        console.error(errorMessage);
      });

    setName("");
    setEmail("");
    setPassword("");
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const checkFormFilled = () => {
    return name || email || password;
  };

  const handleAddAnotherAccount = () => {
    setSuccessMessage(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div
      className={`modal ${showModal ? "show" : ""} my-5`}
      tabIndex="-1"
      style={{
        display: showModal ? "block" : "none",
      }}
    >
      <div class="modal-dialog" role="document">
        <div
          class="modal-content"
          style={{
            backgroundColor: "#4c2a85ff",
            color: "#ffffff",
          }}
        >
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Create Account
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={closeModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            {successMessage ? (
              <div class="alert alert-success" role="alert">
                Your Account has been created!
              </div>
            ) : null}
            {errorMessage ? (
              <div class="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            ) : null}
            <form onSubmit={handleSubmit}>
              <div class="mb-3">
                <label for="exampleInputName" class="form-label">
                  Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="exampleInputName"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  onInput={checkFormFilled}
                />
              </div>
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  name="email"
                  aria-describedby="emailHelp"
                  value={email}
                  onChange={handleEmailChange}
                  onInput={checkFormFilled}
                />
                <div
                  id="emailHelp"
                  class="form-text"
                  style={{ color: "#ffffff" }}
                >
                  We'll never share your email with anyone else.
                </div>
              </div>
              <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">
                  Password
                </label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onInput={checkFormFilled}
                />
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={closeModal}
                >
                  Close
                </button>
                {successMessage ? (
                  <div className="d-flex">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleAddAnotherAccount}
                    >
                      Create another account
                    </button>
                  </div>
                ) : null}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!checkFormFilled()}
                  style={{
                    backgroundColor: hovered ? "#BCEDF6" : "#ffffff",
                    color: "#6b7fd7ff",
                  }}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateAccount;
