import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();
  const [hovered, setHovered] = useState(false);
  return (
    isAuthenticated && (
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
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        Log Out
      </button>
    )
  );
};

export default LogoutButton;
