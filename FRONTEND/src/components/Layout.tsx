// src/components/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <main >
        {/* Add padding if your Navbar is fixed */}
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
