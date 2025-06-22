import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import NavigationBar from "../NavBar/NavBar";

function Layout() {
  return (
    <>
      <NavigationBar />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
