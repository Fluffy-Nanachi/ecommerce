import React, { useState } from "react";
import { useNavigate } from "react-router";
import supabase from "../supabase-client";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Email/password signup
  const handleSignUp = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // store username in metadata
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Redirect after signup; admin check if you manually assign role later
    const userRole = data.user.user_metadata?.role;
    if (userRole === "admin") navigate("/admin");
    else navigate("/Login"); // normally go to login for confirmation
  };

  // Google signup
  const handleGoogleSignUp = async () => {
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

  return (
    <div className="flex flex-col items-center h-full">
      <div className="w-full mb-45"></div>

      <div className="flex rounded-2xl shadow-lg w-[800px] h-[500px] mb-20 bg-white">
        {/* Left: Image */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-pink-200 rounded-l-2xl">
          <img
            src="src/assets/logo.png"
            alt="logo"
            className="relative h-[250px]"
          />
          <p className="font-bold text-white text-[60px] font-horizon-like absolute mt-63">
            HANIME
          </p>
        </div>

        {/* Right: Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-pink-500 mb-6 text-center font-horizon-like">
            Sign Up
          </h1>

          <form onSubmit={handleSignUp} className="flex flex-col space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Username */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-2 text-black border-pink-300 rounded-lg p-3 focus:outline-none focus:border-pink-500"
              required
            />

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
              SIGN UP
            </button>
          </form>

          {/* Google sign up */}
          <button
            onClick={handleGoogleSignUp}
            className="mt-4 w-full flex justify-center bg-white border-2 border-pink-500 text-pink-500 font-semibold py-3 rounded-lg hover:bg-pink-500 hover:text-white transition-colors"
          >
            SIGN UP WITH GOOGLE
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <a
              href="/Login"
              className="text-pink-500 font-semibold hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
