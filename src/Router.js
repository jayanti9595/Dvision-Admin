// import { useState } from "react";
import { Route } from "react-router-dom";
import "./assets/css/App.scss";
import { APP_PREFIX_PATH } from "./config/AppConfig";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageProduct from "./pages/ManageProduct";


function Router() {
  // const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // // Toggle sidebar visibility
  // const toggleSidebar = () => {
  //   setIsSidebarVisible(!isSidebarVisible);
  // };

  return (
    <>
      <Route path={`/${APP_PREFIX_PATH}/`} element={<Login />} />
      <Route path={`/${APP_PREFIX_PATH}/dashboard`} element={<Dashboard />} />
      <Route path={`/${APP_PREFIX_PATH}/manage-product`} element={<ManageProduct />} />
    </>
  );
}

export default Router;
