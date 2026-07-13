import { Link } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <h2 className="logo">
        <Link to="/">CIVIX AI</Link>
      </h2>

      <ul className="nav-links">

        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <a href="#services">Services</a>
        </li>

        <li>
          <a href="#about">About</a>
        </li>

        <li>
          <a href="#contact">Contact</a>
        </li>

        <li>
          <Link to="/login">Login</Link>
        </li>

      </ul>

    </nav>
  );
}

export default Navbar;