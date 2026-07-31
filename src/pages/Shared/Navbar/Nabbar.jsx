import { Link, NavLink } from "react-router";

import Logo from "../../../components/logo/Logo";
import { useAuth } from "../../../hooks/useAuth";

const navLinks = [
  { to: "/services", label: "Services" },
  { to: "/coverage", label: "Coverage" },
  { to: "/track", label: "Track parcel" },
  { to: "/about", label: "About us" },
];

const Nabbar = () => {
  const { user, logout } = useAuth();

  const links = navLinks.map((link) => (
    <li key={link.to}>
      <NavLink
        to={link.to}
        className={({ isActive }) => (isActive ? "font-bold text-[#024950]" : "text-[#024950]/70")}
      >
        {link.label}
      </NavLink>
    </li>
  ));

  return (
    <div className="navbar rounded-b-2xl bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm z-10 mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <Link to="/">
          <Logo />
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>

      <div className="navbar-end gap-2">
        {user ? (
          <>
            <Link to="/dashboard" className="rounded-full bg-[#C1E840] px-5 py-2 text-sm font-bold text-[#0D3B36]">
              Dashboard
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-[#024950] px-4 py-2 text-sm font-semibold text-[#024950]"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="rounded-full border border-[#024950] px-4 py-2 text-sm font-semibold text-[#024950]">
              Login
            </Link>
            <Link to="/register" className="rounded-full bg-[#C1E840] px-5 py-2 text-sm font-bold text-[#0D3B36]">
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Nabbar;
