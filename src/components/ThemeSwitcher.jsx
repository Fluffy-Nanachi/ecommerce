import React, { useState, useEffect } from "react";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  return (
    <div className=" flex items-center">
      <label className="mr-2 font-bold .font-horizon-like ">Theme:</label>
      <select
        value={currentTheme}
        onChange={(e) => setCurrentTheme(e.target.value)}
        className="select .font-horizon-like select-bordered cursor-pointer"
      >
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>
    </div>
  );
}
