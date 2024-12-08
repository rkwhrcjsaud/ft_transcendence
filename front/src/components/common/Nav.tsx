import { Navbar, NavbarBrand, Nav, NavItem, NavLink} from "reactstrap";
import CustomDropdown from './CustomDropdown';
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/FixedNavBar.scss";

export default function NavBar() {
  return (
    <Navbar dark expand="md" fixed="top" id="FixedNavBar" className="px-4 d-flex justify-content-center">
      <NavbarBrand href="/">ft_transcendence</NavbarBrand>
      <Nav className="d-flex justify-content-center align-items-center" navbar>
        <NavItem>
          <NavLink to="/profile" className="px-3 py-2 d-flex align-items-center">
            Profile
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/cpugame" className="px-3 py-2 d-flex align-items-center">
            Single Play
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/multygame" className="px-3 py-2 d-flex align-items-center">
            Multiplay
          </NavLink>
        </NavItem>
      </Nav>
      <Nav navbar>
        <NavItem className="NavLang">
            <CustomDropdown className="px-3"/>
        </NavItem>
        <NavItem className="NavbarLogin">
          <NavLink to="/login" className="px-3 py-2 d-flex align-items-center NavLogin">
            Login
          </NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  );
}
