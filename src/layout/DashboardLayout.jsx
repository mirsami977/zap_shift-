import { NavLink, Outlet } from "react-router";
import Logo from "../components/logo/Logo";
import { useAuth } from "../hooks/useAuth";

const linkClass = ({ isActive }) =>
  `block rounded-xl px-4 py-2 text-sm font-semibold transition ${
    isActive ? "bg-[#C1E840] text-[#0D3B36]" : "text-[#0D3B36]/70 hover:bg-[#C1E840]/30"
  }`;

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:flex-row">
      <aside className="h-fit w-full rounded-3xl bg-white p-5 shadow-sm md:w-64">
        <NavLink to="/">
          <Logo />
        </NavLink>
        <div className="my-4 rounded-2xl bg-[#F2F5F6] p-3">
          <p className="font-bold text-[#024950]">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
          <p className="mt-1 text-xs font-semibold uppercase text-[#0D3B36]">{user?.role}</p>
        </div>

        <nav className="space-y-1">
          <NavLink to="/dashboard" end className={linkClass}>
            Overview
          </NavLink>
          {user?.role === "user" && (
            <>
              <NavLink to="/dashboard/send-parcel" className={linkClass}>
                Send a parcel
              </NavLink>
              <NavLink to="/dashboard/my-parcels" className={linkClass}>
                My parcels
              </NavLink>
              <NavLink to="/dashboard/payment-history" className={linkClass}>
                Payment history
              </NavLink>
              <NavLink to="/dashboard/be-a-rider" className={linkClass}>
                Be a rider
              </NavLink>
            </>
          )}
          {user?.role === "rider" && (
            <NavLink to="/dashboard/deliveries" className={linkClass}>
              My deliveries
            </NavLink>
          )}
          {user?.role === "admin" && (
            <>
              <NavLink to="/dashboard/all-parcels" className={linkClass}>
                All parcels
              </NavLink>
              <NavLink to="/dashboard/riders" className={linkClass}>
                Manage riders
              </NavLink>
              <NavLink to="/dashboard/users" className={linkClass}>
                Manage users
              </NavLink>
            </>
          )}
          <button
            type="button"
            onClick={logout}
            className="mt-3 w-full rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 rounded-3xl bg-white p-6 shadow-sm">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
