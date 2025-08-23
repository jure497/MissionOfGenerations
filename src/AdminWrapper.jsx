import React, { useState } from "react";
import AdminPage from "./pages/AdminPage";

export default function AdminWrapper() {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState("");

  const handleLogin = () => {
    const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

    if (input === adminPassword) {
      setAuthenticated(true);
    } else {
      alert("Wrong password!");
    }
  };

  if (!authenticated) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Enter Admin Password</h2>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return <AdminPage />;
}
