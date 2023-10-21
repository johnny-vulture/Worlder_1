import React from "react";
import { useNavigate } from "react-router-dom";
import Stacks from "../components/Stacks";

const Homepage = ({ token }) => {
  let navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div>
      <h3>Welcome back, {token.user.user_metadata.full_name}</h3>
      <button onClick={handleLogout}>Logout</button>
      <h2>Your Stacks</h2>
      <Stacks />{" "}
      {/* Render the Stacks component here to fetch and display user stacks */}
    </div>
  );
};

export default Homepage;
