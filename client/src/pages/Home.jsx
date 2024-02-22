import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import badBankImage from "../assets/images/Bad-Bank.jpg";
import { Link } from "react-router-dom";
import CreateAccount from "../pages/CreateAccount";
import { useUser } from "../contexts/UserContext";
import Card from "../components/Card";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const { userData, setCurrentUser } = useUser();
  const { loginWithPopup, loginWithRedirect, isAuthenticated, user } =
    useAuth0();
  useEffect(() => {
    if (isAuthenticated) {
      const { email, nickname, token } = user; // Extrai os dados necessários do usuário
      // Cria um objeto de dados do usuário

      axios
        .post("http://localhost:3001/api/auth0-login", user)
        .then((response) => {
          const newUser = response.data; // Extrai o usuário da resposta
          setCurrentUser(newUser); // Define o novo usuário atual
          console.log("User Info Saved:", response.data);
        })
        .catch((error) => console.error("Error saving user info:", error));
    }
  }, [isAuthenticated, user]);
  return (
    <div id="home" class="card mx-auto my-5" style={{ maxWidth: "300px" }}>
      <img src={badBankImage} class="card-img-top" alt="Bad Bank" />
      <div class="card-body text-center">
        <h5 class="card-title link-primary">
          Welcome to my BAD-BANK Application
        </h5>
        <p class="card-text">
          Welcome to BAD-BANK, a modern and user-friendly banking application
          designed to provide you with a seamless financial experience.
        </p>
      </div>
      <div class="card-body text-center">
        <Link
          class="nav-link link-primary"
          onClick={() => {
            setShowModal(true);
          }}
          title="Create an Account"
        >
          Create Account
        </Link>
        <Link class="nav-link link-primary" to={"/login"} title="Sign In!">
          Sign In
        </Link>
      </div>
      <CreateAccount showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default Home;
