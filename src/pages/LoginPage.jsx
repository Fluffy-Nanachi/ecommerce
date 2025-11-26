import React, { useState } from "react";
import { useNavigate } from "react-router";
import supabase from "../supabase-client";
import Logo from "../assets/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      setError(error.message);
      return;
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      const userRole = session?.user.user_metadata?.role;
      if (userRole === "admin") navigate("/admin");
      else navigate("/");
    });
  };

  const handleForgotPassword = async () => {
    if (!email) return setError("Please enter your email first");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });
    if (error) setError(error.message);
    else alert("Password reset email sent!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left side: Logo/Image */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-pink-200 relative">
          <img src={Logo} alt="logo" className="h-80 w-auto" />
          <p className="font-bold text-white text-7xl font-horizon-like absolute mt-70 bottom-10">
            HANIME
          </p>
        </div>

        {/* Right side: Login form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-pink-500 mb-6 text-center font-horizon-like">
            Login
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-pink-300 text-black rounded-lg p-3 focus:outline-none focus:border-pink-500"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-pink-300 text-black rounded-lg p-3 w-full focus:outline-none focus:border-pink-500"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-500 font-medium"
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

          <button
            onClick={handleGoogleLogin}
            className="mt-4 w-full flex justify-center items-center border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white font-semibold py-3 rounded-lg transition-colors"
          >
            LOGIN WITH GOOGLE
          </button>

          <p
            className="text-center mt-3 text-sm text-gray-500 cursor-pointer hover:underline"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </p>

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
