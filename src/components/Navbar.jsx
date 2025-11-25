import React from "react";
import { Link } from "react-router";

function Navbar() {
  return (
    <nav className="h-20 bg-pink-200 w-full">
      <div className="flex items-center justify-between py-3 px-20">
        <div className="flex space-x-1 items-center">
          <img src="src\assets\logo.png" alt="logo" className="h-[50px] " />
          <p className="font-bold text-white text-[30px] font-horizon-like">
            HANIME
          </p>
        </div>
        <div className="flex items-center space-x-10">
          <button className="font-semibold text-white text-[20px] font-horizon-like ">
            <Link
              to="/"
              className="cursor-pointer hover:bg-pink-300 rounded-lg p-2"
            >
              HOME
            </Link>
          </button>
          <button className="font-semibold text-white text-[20px] font-horizon-like ">
            <Link
              to="/Products"
              className="cursor-pointer hover:bg-pink-300 rounded-lg p-2"
            >
              PRODUCTS
            </Link>
          </button>
          <button className="cursor-pointer hover:bg-pink-300 rounded-lg p-2">
            <Link to="/Cart">
              <img
                src="src\assets\cart.png"
                alt="cart"
                className="h-[30px] filter grayscale brightness-200 "
              />
            </Link>
          </button>
          <div className=" space-x-5">
            <button className="font-horizon-like font-semibold text-white text-[20px]">
              <Link
                to="/SignUp"
                className="cursor-pointer  hover:bg-pink-300 rounded-lg p-2"
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
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
