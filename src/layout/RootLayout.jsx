import { Outlet } from "react-router";
import Footer from "../pages/Shared/footer/Footer";
import Nabbar from "../pages/Shared/Navbar/Nabbar";

const RootLayout = () => {
  return (
    <div className=" max-w-7xl mx-auto bg-[#C3DFE2]">
      <Nabbar></Nabbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
