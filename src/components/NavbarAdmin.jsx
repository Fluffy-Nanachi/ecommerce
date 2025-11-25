import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import supabase from "../supabase-client";

function NavbarAdmin() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="h-20 bg-pink-900 w-full">
      <div className="flex items-center justify-between py-3 px-20">
        <div className="flex space-x-1 items-center">
          <img src="src/assets/logo.png" alt="logo" className="h-[50px]" />
          <p className="font-bold text-white text-[30px] font-horizon-like">
            HANIME ADMIN
          </p>
        </div>
        <div className="flex items-center space-x-10 ">
          <div className="space-x-5">
            {!session ? (
              <>
                <button className="font-horizon-like font-semibold text-white text-[20px]">
                  <Link
                    to="/SignUp"
                    className="cursor-pointer hover:bg-pink-300 rounded-lg p-2"
                  >
                    SIGN UP
                  </Link>
                </button>
                <button className="font-horizon-like font-semibold text-white text-[20px]">
                  <Link
                    to="/Login"
                    className="cursor-pointer hover:bg-pink-300 rounded-lg p-2"
                  >
                    LOGIN
                  </Link>
                </button>
              </>
            ) : (
              <button
                onClick={handleSignOut}
                className="font-horizon-like font-semibold text-white text-[20px] cursor-pointer hover:bg-pink-300 rounded-lg p-2"
              >
                SIGN OUT
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarAdmin;
