// AdminLogin.js
import { useState } from "react";

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
      onLogin();
    } else {
      alert("Wrong password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        type="password"
        placeholder="Enter Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />
      <button type="submit" className="ml-2 p-2 bg-blue-500 text-white">
        Login
      </button>
    </form>
  );
}
