import React from 'react'
import "./Navbar.css"; 
    const Navbar = () => {
      return (
        <nav className="navbar">
          <ul className="nav-links">
           <li>
            <a href="/">
                 <img src="/assets/asset3.png" alt="" />
                </a>
            </li>
            <li><a href="#">Alumni @QAU</a></li>
            <li><a href="#">CMS</a></li>
            <li><a href="#">HMS</a></li>
            <li><a href="#">ORIC</a></li>
            <li><a href="#">Affiliated</a></li>
            <li><a href="#">Research Repository</a></li>
            <li><a href="#">Downloads</a></li>
            <li><a href="#">Library</a></li>
          </ul>
        </nav>
      );
    };
    
    export default Navbar;
