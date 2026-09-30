import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell, faPlus, faShieldHalved } from "../icons";

import { Link } from "react-router-dom";

function NavBar() {
  return (
    <header class="navbar-header">
      <div class="navbar-container">

        <div class="nav-brand">
          <span class="brand-icon"> <FontAwesomeIcon icon={faShieldHalved} /></span>
          <h2>KDU Karakatá</h2>
        </div>


        <div class="nav-search">
          <FontAwesomeIcon icon={faSearch} />
          <input type="text" placeholder="Search product" />
        </div>

        <ul class="nav-links">
          <li><a href="#marketplace" class="active">Marketplace</a></li>
          <li><a href="#categories">Categories</a></li>
          <Link to="/safety">Safety & Rules</Link>
          <Link to="/vendor-hub">Vendor Hub</Link>
        </ul>


        <div class="nav-actions">
          <button class="icon-btn"> <FontAwesomeIcon icon={faBell} /><span class="badge">0</span></button>
          <button class="btn-post">  <FontAwesomeIcon icon={faPlus} />Sign Up</button>
          <button class="btn-post">  <FontAwesomeIcon icon={faPlus} />Sign In</button>

        </div>
      </div>
    </header>
  )
}

export default NavBar 