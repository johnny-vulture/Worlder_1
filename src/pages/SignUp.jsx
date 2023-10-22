import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../client";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  function handleChange(event) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });
      if (error) throw error;
      alert("Check your email for a verification link");
    } catch (error) {
      alert(error.message); // Display the error message
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-2 mb-4 border rounded"
            type="text"
            placeholder="Fullname"
            name="fullName"
            onChange={handleChange}
          />
          <input
            className="w-full p-2 mb-4 border rounded"
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          <input
            className="w-full p-2 mb-4 border rounded"
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          <button
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            type="submit"
          >
            Submit
          </button>
        </form>
        <p className="mt-4">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
