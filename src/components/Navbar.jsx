import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import supabase from "../supabase-client";
import Logo from "../assets/logo.png";
import Cart from "../assets/cart.png";
import DefaultAvatar from "../assets/default-avatar.png";
import { useProfile } from "../context/ProfileContext";
import ThemeSwitcher from "./ThemeSwitcher";

function Navbar() {
  const [session, setSession] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { profile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session) fetchCartCount(session.user.id);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) fetchCartCount(session.user.id);
        else setCartCount(0);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchCartCount = async (userId) => {
    const { data, error } = await supabase
      .from("cart")
      .select("quantity")
      .eq("user_id", userId);

    if (error) {
      console.error(error);
      setCartCount(0);
    } else {
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="navbar bg-pink-900 text-white shadow-sm px-5 md:px-10">
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
      <div className="flex-1 flex  items-center">
        <img src={Logo} alt="logo" className="h-12 mr-2" />
        <span className="text-2xl font-bold font-horizon-like">HANIME</span>
        <div className="ml-4 hidden md:block">
          <ThemeSwitcher />
        </div>
      </div>

      {/* Desktop menu */}
      <div className="flex-none hidden md:flex items-center space-x-6">
        <Link className="btn btn-ghost normal-case" to="/">
          HOME
        </Link>
        <Link className="btn btn-ghost normal-case" to="/Products">
          PRODUCTS
        </Link>
        <Link className="btn btn-ghost normal-case" to="/MyOrders">
          MY ORDERS
        </Link>
        <Link className="relative btn btn-ghost normal-case" to="/Cart">
          <img
            src={Cart}
            alt="cart"
            className="h-6 filter grayscale brightness-200"
          />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {!session ? (
          <>
            <Link className="btn btn-ghost normal-case" to="/SignUp">
              SIGN UP
            </Link>
            <Link className="btn btn-ghost normal-case" to="/Login">
              LOGIN
            </Link>
          </>
        ) : (
          <div className="flex items-center space-x-3">
            <Link to="/Profile">
              <img
                src={profile?.profile_image_url || DefaultAvatar}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
            </Link>
            <button
              onClick={handleSignOut}
              className="btn btn-ghost normal-case"
            >
              SIGN OUT
            </button>
          </div>
        )}
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-pink-900 flex flex-col space-y-2 p-4 md:hidden z-50">
          <Link className="btn btn-ghost w-full" to="/">
            HOME
          </Link>
          <Link className="btn btn-ghost w-full" to="/Products">
            PRODUCTS
          </Link>
          <Link className="btn btn-ghost w-full" to="/my-orders">
            MY ORDERS
          </Link>
          <Link className="btn btn-ghost w-full relative" to="/Cart">
            Cart{" "}
            {cartCount > 0 && (
              <span className="absolute top-0 right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {!session ? (
            <>
              <Link className="btn btn-ghost w-full" to="/SignUp">
                SIGN UP
              </Link>
              <Link className="btn btn-ghost w-full" to="/Login">
                LOGIN
              </Link>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost w-full" to="/Profile">
                Profile
              </Link>
              <button onClick={handleSignOut} className="btn btn-ghost w-full">
                SIGN OUT
              </button>
            </>
          )}

          {/* Mobile theme switcher */}
          <div className="mt-2">
            <ThemeSwitcher />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
