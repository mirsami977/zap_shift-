import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import DashboardLayout from "../layout/DashboardLayout";
import Home from "../pages/home/Home/Home";
import Covarage from "../pages/Covarage/Covarage";
import Services from "../pages/Services/Services";
import About from "../pages/About/About";
import TrackParcel from "../pages/Tracking/TrackParcel";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import PrivateRoute from "./PrivateRoute";
import DashboardHome from "../pages/dashboard/DashboardHome";
import SendParcel from "../pages/dashboard/SendParcel";
import MyParcels from "../pages/dashboard/MyParcels";
import PaymentHistory from "../pages/dashboard/PaymentHistory";
import BeARider from "../pages/dashboard/BeARider";
import AllParcels from "../pages/dashboard/AllParcels";
import ManageRiders from "../pages/dashboard/ManageRiders";
import ManageUsers from "../pages/dashboard/ManageUsers";
import RiderDeliveries from "../pages/dashboard/RiderDeliveries";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "coverage", Component: Covarage },
      { path: "services", Component: Services },
      { path: "about", Component: About },
      { path: "track", Component: TrackParcel },
      { path: "track/:trackingId", Component: TrackParcel },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, Component: DashboardHome },
      {
        path: "send-parcel",
        element: (
          <PrivateRoute roles={["user", "admin"]}>
            <SendParcel />
          </PrivateRoute>
        ),
      },
      { path: "my-parcels", Component: MyParcels },
      { path: "payment-history", Component: PaymentHistory },
      { path: "be-a-rider", Component: BeARider },
      {
        path: "deliveries",
        element: (
          <PrivateRoute roles={["rider", "admin"]}>
            <RiderDeliveries />
          </PrivateRoute>
        ),
      },
      {
        path: "all-parcels",
        element: (
          <PrivateRoute roles={["admin"]}>
            <AllParcels />
          </PrivateRoute>
        ),
      },
      {
        path: "riders",
        element: (
          <PrivateRoute roles={["admin"]}>
            <ManageRiders />
          </PrivateRoute>
        ),
      },
      {
        path: "users",
        element: (
          <PrivateRoute roles={["admin"]}>
            <ManageUsers />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
