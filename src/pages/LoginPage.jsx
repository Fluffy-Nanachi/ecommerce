import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import supabase from "../supabase-client";
import Navbar from "../components/Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    const userRole = data.user.user_metadata?.role;

    if (userRole === "admin") navigate("/admin");
    else navigate("/");
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Supabase redirects to your app after OAuth
    // Admin check will happen in onAuthStateChange
    supabase.auth.onAuthStateChange((_event, session) => {
      const userRole = session?.user.user_metadata?.role;
      if (userRole === "admin") navigate("/admin");
      else navigate("/");
    });
  };

  // Forgot password
  const handleForgotPassword = async () => {
    if (!email) return setError("Please enter your email first");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/Login",
    });
    if (error) setError(error.message);
    else alert("Password reset email sent!");
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="w-full mb-45"></div>

      <div className="flex rounded-2xl shadow-lg w-[800px] h-[500px] mb-20 bg-white">
        {/* Left side: Image */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-pink-200 rounded-l-2xl">
          <img
            src="src/assets/logo.png"
            alt="logo"
            className=" relative h-[250px]"
          />
          <p className="font-bold text-white text-[60px] font-horizon-like absolute mt-63">
            HANIME
          </p>
        </div>

        {/* Right side: Login form */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-pink-500 mb-6 text-center font-horizon-like">
            Login
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 text-black border-pink-300 rounded-lg p-3 focus:outline-none focus:border-pink-500"
              required
            />

            {/* Password with show/hide */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 text-black border-pink-300 rounded-lg p-3 w-full focus:outline-none focus:border-pink-500"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              className="bg-pink-500 text-white font-semibold py-3 rounded-lg hover:bg-pink-600 transition-colors"
            >
              LOGIN
            </button>
          </form>

          {/* Google login */}
          <button
            onClick={handleGoogleLogin}
            className="mt-4 w-full flex justify-center bg-white border-2 border-pink-500 text-pink-500 font-semibold py-3 rounded-lg hover:bg-pink-500 hover:text-white transition-colors"
          >
            LOGIN WITH GOOGLE
          </button>

          {/* Forgot password */}
          <p
            className="text-center mt-3 text-sm text-gray-500 cursor-pointer hover:underline"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </p>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <a
              href="/SignUp"
              className="text-pink-500 font-semibold hover:underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
