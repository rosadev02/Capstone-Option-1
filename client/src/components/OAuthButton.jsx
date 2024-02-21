import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useUser } from "../contexts/UserContext"; // Importe o contexto do usuário

const LoginButton = () => {
  const { loginWithPopup, loginWithRedirect, isAuthenticated, user } =
    useAuth0();
  const [hovered, setHovered] = useState(false);
  const { setCurrentUser } = useUser(); // Obtenha a função setCurrentUser do contexto do usuário
  // Dependências do useEffect

  return (
    !isAuthenticated && (
      <div className="text-center">
        <button
          type="submit"
          className="btn btn-primary"
          style={{
            backgroundColor: hovered ? "#BCEDF6" : "#ffffff",
            color: "#6b7fd7ff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => loginWithRedirect()}
        >
          Okta Login
        </button>
      </div>
    )
  );
};

export default LoginButton;
