import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import supabase from "../supabase-client";
import Logo from "../assets/logo.png";
import ThemeSwitcher from "./ThemeSwitcher";

function NavbarAdmin() {
  const [session, setSession] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="navbar bg-pink-900 text-white shadow-sm px-5 md:px-10 relative">
      {/* Mobile menu button */}
      <div className="flex-none md:hidden">
        <button
          className="btn btn-square btn-ghost"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Logo and brand */}
      <div className="flex-1 flex items-center">
        <img src={Logo} alt="logo" className="h-12 mr-2" />
        <span className="text-2xl font-bold font-horizon-like">
          HANIME ADMIN
        </span>
        <div className="ml-4 hidden md:block">
          <ThemeSwitcher />
        </div>
      </div>

      {/* Desktop menu */}
      <div className="flex-none hidden md:flex items-center space-x-6">
        {session ? (
          <>
            <Link className="btn btn-ghost normal-case" to="/admin">
              Products
            </Link>
            <Link className="btn btn-ghost normal-case" to="/admin/orders">
              Orders
            </Link>
            <button
              onClick={handleSignOut}
              className="btn btn-ghost normal-case"
            >
              SIGN OUT
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-ghost normal-case" to="/SignUp">
              SIGN UP
            </Link>
            <Link className="btn btn-ghost normal-case" to="/Login">
              LOGIN
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-pink-900 flex flex-col space-y-2 p-4 md:hidden z-50">
          {session ? (
            <>
              <Link
                className="btn btn-ghost w-full"
                to="/admin"
                onClick={() => setMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                className="btn btn-ghost w-full"
                to="/admin/orders"
                onClick={() => setMenuOpen(false)}
              >
                Orders
              </Link>
              <button onClick={handleSignOut} className="btn btn-ghost w-full">
                SIGN OUT
              </button>
            </>
          ) : (
            <>
              <Link
                className="btn btn-ghost w-full"
                to="/SignUp"
                onClick={() => setMenuOpen(false)}
              >
                SIGN UP
              </Link>
              <Link
                className="btn btn-ghost w-full"
                to="/Login"
                onClick={() => setMenuOpen(false)}
              >
                LOGIN
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default NavbarAdmin;
