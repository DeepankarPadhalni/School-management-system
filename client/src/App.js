import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddSchool from "./components/AddSchool";
import ShowSchools from "./components/ShowSchools";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        {/* ✅ Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-school" element={<AddSchool />} />
            <Route path="/schools" element={<ShowSchools />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
          </Routes>
        </main>

        {/* ✅ Footer */}
        <footer className="footer">
          <div className="footer-container">
            <p>
              &copy; {new Date().getFullYear()} School Management System. Built
              with ❤️ using React & MySQL.
            </p>
            <div className="footer-links">
              <a href="https://github.com" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

/* ✅ Navbar Component */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          🏫 SchoolHub
        </Link>

        {/* Desktop Menu */}
        <ul className={`nav-menu ${isOpen ? "active" : ""}`}>
          <li>
            <Link to="/" className="nav-link">🏠 Home</Link>
          </li>
          <li>
            <Link to="/add-school" className="nav-link">➕ Add School</Link>
          </li>
          <li>
            <Link to="/schools" className="nav-link">📋 View Schools</Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">ℹ️ About</Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">📞 Contact</Link>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>
    </nav>
  );
};

/* ✅ Home Page */
const Home = () => (
  <div className="home">
    <section className="hero">
      <div className="hero-content">
        <h1>
          Welcome to <span className="highlight">SchoolHub</span>
        </h1>
        <p>
          Manage and explore schools effortlessly with a modern, responsive
          system designed for simplicity and speed.
        </p>

        <div className="hero-buttons">
          <Link to="/add-school" className="btn btn-primary">
            ➕ Add New School
          </Link>
          <Link to="/schools" className="btn btn-secondary">
            📋 Browse Schools
          </Link>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="features">
      <h2>✨ Why Choose SchoolHub?</h2>
      <div className="features-grid">
        <div className="feature-card">
          <h3>📝 Easy Registration</h3>
          <p>Quickly add schools with detailed info and image uploads.</p>
        </div>
        <div className="feature-card">
          <h3>📱 Responsive Design</h3>
          <p>Seamless experience on mobile, tablet, and desktop.</p>
        </div>
        <div className="feature-card">
          <h3>🔍 Smart Browsing</h3>
          <p>Find schools easily with clean grid view & search tools.</p>
        </div>
      </div>
    </section>
  </div>
);

/* ✅ About Page */
const About = () => (
  <div className="page about">
    <h1>About Us</h1>
    <p>
      SchoolHub is a modern web application designed to make school management
      effortless. From registration to browsing, we focus on simplicity,
      performance, and accessibility.
    </p>
    <p>
      Built with <strong>React</strong> for the frontend and <strong>MySQL</strong> for
      secure data handling.
    </p>
  </div>
);

/* ✅ Contact Page */
const Contact = () => (
  <div className="page contact">
    <h1>Contact Us</h1>
    <p>We’d love to hear from you! Reach out for support or feedback.</p>

    <form className="contact-form">
      <input type="text" placeholder="Your Name" required />
      <input type="email" placeholder="Your Email" required />
      <textarea placeholder="Your Message" rows="4" required></textarea>
      <button type="submit" className="btn btn-primary">
        Send Message
      </button>
    </form>
  </div>
);

export default App;
