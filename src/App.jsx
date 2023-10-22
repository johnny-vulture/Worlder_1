import React, { useState, useEffect } from "react";
import { SignUp, Login, Homepage } from "./pages";
import { Routes, Route } from "react-router-dom";
import StackDetails from "./components/StackDetails";
import LinkDetails from "./components/LinkDetails";

const App = () => {
  const [token, setToken] = useState(false);

  if (token) {
    sessionStorage.setItem("token", JSON.stringify(token));
  }

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      let data = JSON.parse(sessionStorage.getItem("token"));
      setToken(data);
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path={"/signup"} element={<SignUp />} />
        <Route path={"/"} element={<Login setToken={setToken} />} />
        <Route path="/stack/:stackId" element={<StackDetails />} />
        <Route path="/link/:linkId" element={<LinkDetails />} />
        {token ? (
          <Route path={"/homepage"} element={<Homepage token={token} />} />
        ) : (
          ""
        )}
      </Routes>
    </div>
  );
};

export default App;
