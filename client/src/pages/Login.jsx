import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUser } from "../contexts/UserContext";
import Card from "../components/Card";
import LoginButton from "../components/OAuthButton";
import axios from "axios";
import LogoutButton from "../components/LogAuthButton";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const [successMessage, setSuccessMessage] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser, setCurrentUser } = useUser();
  const [hovered, setHovered] = useState(false);
  const { logout, isAuthenticated } = useAuth0();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please provide both email and password.");
      return;
    }

    axios
      .post("/api/login", { email, password })
      .then((response) => {
        const user = response.data; // Aqui estamos pegando os dados da resposta e atribuindo à constante user
        console.log("User Info Saved:", user);

        // Aqui você pode continuar com o restante do código que depende da constante user
        if (user) {
          // Autenticação bem-sucedida
          setCurrentUser(user);
          setSuccessMessage(true);
          alert("Success Login!");
          // Restante do código...
        } else {
          alert("Invalid email or password.");
        }
      })
      .catch((error) => alert("Invalid email or password."));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const checkFormFilled = () => {
    return email || password;
  };
  const handleLogout = () => {
    setCurrentUser("");
  };
  return (
    <Card
      bgcolor="#4C2A85"
      txtcolor="#ffffff"
      header="Login"
      title="Login now and start your transactions!"
      text=""
      body={
        <div>
          <form onSubmit={handleSubmit}>
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <button
                type="submit"
                class="btn btn-primary"
                style={{
                  backgroundColor: hovered ? "#BCEDF6" : "#ffffff",
                  color: "#6b7fd7ff",
                  //marginTop: "15px", // Adicione um espaço entre o formulário e o botão, se necessário
                  alignSelf: "center", // Garante centralização vertical do botão
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                Login
              </button>
            </div>
          </form>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "5px",
            }}
          >
            <LoginButton />
            {!isAuthenticated && currentUser && (
              <button
                type="button"
                className="btn btn-primary"
                style={{
                  backgroundColor: hovered ? "#BCEDF6" : "#ffffff",
                  color: "#6b7fd7ff",
                  marginTop: "5px",
                }}
                onClick={handleLogout}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                Log Out
              </button>
            )}
            <LogoutButton />
          </div>
        </div>
      }
    />
    // <div
    //   class="card mx-auto my-5"
    //   style={{ width: "18rem;", maxWidth: "600px" }}
    // >
    //   <h5 class="card-header">Login</h5>
    //   <div class="card-body">
    // <form onSubmit={handleSubmit}>
    //   <div class="mb-3">
    //     <label for="exampleInputEmail1" class="form-label">
    //       Email address
    //     </label>
    //     <input
    //       type="email"
    //       class="form-control"
    //       id="email"
    //       name="email"
    //       aria-describedby="emailHelp"
    //       value={email}
    //       onChange={handleEmailChange}
    //       onInput={checkFormFilled}
    //     />
    //     <div id="emailHelp" class="form-text">
    //       We'll never share your email with anyone else.
    //     </div>
    //   </div>
    //   <div class="mb-3">
    //     <label for="exampleInputPassword1" class="form-label">
    //       Password
    //     </label>
    //     <input
    //       type="password"
    //       class="form-control"
    //       id="password"
    //       name="password"
    //       value={password}
    //       onChange={handlePasswordChange}
    //       onInput={checkFormFilled}
    //     />
    //   </div>
    //   <div class="mb-3 form-check">
    //     <input
    //       type="checkbox"
    //       class="form-check-input"
    //       id="exampleCheck1"
    //     />
    //     <label class="form-check-label" for="exampleCheck1">
    //       Check me out
    //     </label>
    //   </div>
    //   <button type="submit" class="btn btn-primary">
    //     Submit
    //   </button>
    // </form>
    //   </div>
    // </div>
  );
};
export default Login;
