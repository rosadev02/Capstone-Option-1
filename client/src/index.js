import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BalanceProvider } from "./contexts/BalanceContext";
import { UserProvider } from "./contexts/UserContext";
import { CardProvider } from "./contexts/CardContext";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-qa34wg5qwlph4ul8.us.auth0.com"
      clientId="AsJJeJPJY94LFkXXbM4y0qDW6mbZC09Z"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <UserProvider>
        <BalanceProvider>
          <CardProvider>
            <App />
          </CardProvider>
        </BalanceProvider>
      </UserProvider>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
