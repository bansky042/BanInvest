import { useTheme } from "../context/ThemeContext";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        theme === "dark"
          ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
          : "bg-gray-800 text-white hover:bg-gray-700"
      }`}
    >
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default ThemeToggleButton;
