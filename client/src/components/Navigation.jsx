import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import CreateAccount from "../pages/CreateAccount";
import { useUser } from "../contexts/UserContext";
const Navigation = () => {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const { currentUser, setCurrentUser } = useUser();

  return (
    <nav class="navbar navbar-expand-lg" style={{ backgroundColor: "#320E3B" }}>
      <div class="container-fluid">
        <Link
          class="navbar-brand "
          to="/"
          style={{
            color: location.pathname === "/" ? "#6b7fd7ff" : "#ffffff",
          }}
        >
          Bad-Bank
        </Link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <Link
                class="nav-link active"
                to="/"
                title="Go to Home Page"
                style={{
                  color: location.pathname === "/" ? "#6b7fd7ff" : "#ffffff",
                }}
              >
                Home
              </Link>
            </li>
            <li class="nav-item">
              <button
                className="nav-link "
                onClick={() => {
                  setShowModal(true);
                }}
                title="Create an Account"
                style={{
                  color:
                    location.pathname === "/create-account"
                      ? "#6b7fd7ff"
                      : "#ffffff",
                }}
              >
                Create Account
              </button>
            </li>
            <li class="nav-item">
              <Link
                class="nav-link active "
                to="/login"
                title="Sign in and start"
                style={{
                  color:
                    location.pathname === "/login" ? "#6b7fd7ff" : "#ffffff",
                }}
              >
                Login
              </Link>
            </li>
            <li class="nav-item">
              <Link
                class="nav-link "
                to="/deposit"
                title="Go to Deposit Page"
                style={{
                  color:
                    location.pathname === "/deposit" ? "#6b7fd7ff" : "#ffffff",
                }}
              >
                Deposit
              </Link>
            </li>
            <li class="nav-item">
              <Link
                class="nav-link "
                to="/withdraw"
                title="Go to Withdraw Page"
                style={{
                  color:
                    location.pathname === "/withdraw" ? "#6b7fd7ff" : "#ffffff",
                }}
              >
                Withdraw
              </Link>
            </li>
            <li class="nav-item">
              <Link
                class="nav-link"
                to="/all-data"
                title="Go to All data Page"
                style={{
                  color:
                    location.pathname === "/all-data" ? "#6b7fd7ff" : "#ffffff",
                }}
              >
                All Data
              </Link>
            </li>
          </ul>
        </div>
        <div className="ml-auto">
          {currentUser ? (
            <ul className="navbar-nav ">
              <li className="nav-item ">
                <span className="nav-link " style={{ color: "#ffffff" }}>
                  {currentUser.user ? currentUser.user.email : ""}
                </span>
              </li>
            </ul>
          ) : null}
        </div>
      </div>
      <CreateAccount showModal={showModal} setShowModal={setShowModal} />
    </nav>
  );
};

export default Navigation;
