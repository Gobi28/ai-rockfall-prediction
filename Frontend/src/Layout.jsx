import Navbar from "./components/Navbar";

function Layout({ children, darkMode, setDarkMode }) {
  return (
    <div className={darkMode ? "dark app" : "app"}>
      
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="main-container">
        {children}
      </div>

    </div>
  );
}

export default Layout;