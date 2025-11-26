import React, { useEffect, useState } from "react";
import supabase from "../supabase-client";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleRecovery = async () => {
      const hash = window.location.hash;
      if (!hash) {
        setMessage("Invalid reset link");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams(hash.replace("#", "?"));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token) {
        setMessage("Reset token missing");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) setMessage(error.message);
      setLoading(false);
    };

    handleRecovery();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) return setMessage(error.message);

    setMessage("🎉 Password updated! You can now login.");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-pink-500"></span>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 px-4">
      <div className="bg-white dark:bg-base-300 w-full max-w-md rounded-2xl shadow-lg p-8 space-y-6 transform transition-all">
        {/* Cute Header */}
        <h2 className="text-3xl font-bold text-center text-pink-500 font-horizon-like">
          Reset Password 🔒💗
        </h2>

        {message && (
          <p className="text-center text-sm text-pink-600 font-medium">
            {message}
          </p>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="password"
            placeholder="Enter New Password"
            className="input input-bordered w-full rounded-xl focus:border-pink-500 focus:outline-none"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button className="btn bg-pink-500 hover:bg-pink-600 text-white w-full rounded-xl">
            Update Password
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-500">
          Remembered your password?{" "}
          <a
            href="/Login"
            className="text-pink-500 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
