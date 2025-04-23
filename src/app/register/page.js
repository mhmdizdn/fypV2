"use client"
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [error, setError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const validatePassword = (password, confirmPassword) => {
    if (password === confirmPassword) {
      setPasswordMatch(true);
      setError("");
      return true;
    } else {
      setPasswordMatch(false);
      setError("Passwords do not match!");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (!validatePassword(form.password, form.confirmPassword)) {
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password
      }),
    });
    const data = await res.json();
    if (data.success) {
      setError("");
    } else {
      setError(data.message);
    }
    alert(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl font-bold">Register</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />

        <div className="space-y-2">
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              if (form.confirmPassword) {
                validatePassword(e.target.value, form.confirmPassword);
              }
            }}
            className={`border p-2 rounded w-full ${!passwordMatch ? 'border-red-500' : ''}`}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => {
              setForm({ ...form, confirmPassword: e.target.value });
              validatePassword(form.password, e.target.value);
            }}
            className={`border p-2 rounded w-full ${!passwordMatch ? 'border-red-500' : ''}`}
            required
          />
          {!passwordMatch && (
            <p className="text-red-500 text-sm">Passwords do not match</p>
          )}
        </div>

        <button 
          type="submit" 
          className={`w-full px-4 py-2 rounded text-white ${
            passwordMatch ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'
          }`}
          disabled={!passwordMatch}
        >
          Register
        </button>
      </form>
    </div>
  );
}
