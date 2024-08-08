import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <div className="text-3xl font-bold text-gray-800 bg-white p-3 shadow-md sm:text-3xl md:text-4xl lg:text-5xl text-center md:text-left">
      <span onClick={() => navigate("/")}>S.H.O.W</span>
    </div>
  );
}

export default Header;
