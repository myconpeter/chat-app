import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [currentForm, setCurrentForm] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentForm === "Sign Up" && !submitted) {
      setSubmitted(true);
      return;
    }

    login(currentForm === "Sign Up" ? "register" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 backdrop-blur-2xl sm:justify-evenly max-sm:flex-col">
      {/* left hand side */}

      <img src={assets.logo_big} alt="" className="w-[min-(30vw, 250px)]" />

      {/* right hand side */}

      <form
        onSubmit={handleSubmit}
        className="border-2 bg-white/8 text-white border-gray-800 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentForm}

          {submitted && (
            <img
              onClick={() => {
                setSubmitted(false);
              }}
              src={assets.arrow_icon}
              alt="icon"
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {currentForm === "Sign Up" && !submitted && (
          <input
            type="text"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full Name"
            required
          />
        )}

        {!submitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email Address"
              required
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Password "
              required
            />
          </>
        )}

        {currentForm === "Sign Up" && submitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter Bio"
            rows={4}
            required
          ></textarea>
        )}

        <button
          type="submit "
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-400 text-white rounded-md cursor-pointer"
        >
          {currentForm === "Sign Up" ? "Sign Up" : "Login"}
        </button>

        {currentForm === "Sign Up" ? (
          <p className="text-sm">
            Already have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer"
              onClick={() => {
                setCurrentForm("Login");
                setSubmitted(false);
                setFullName("");
                setEmail("");
                setPassword("");
                setBio("");
              }}
            >
              Login
            </span>
          </p>
        ) : (
          <p className="text-sm">
            Don't have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer"
              onClick={() => {
                setCurrentForm("Sign Up");
                setSubmitted(false);
                setFullName("");
                setEmail("");
                setPassword("");
                setBio("");
              }}
            >
              Sign Up
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
