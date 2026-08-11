
import React from "react";
import Breadcrumb from "../common/Breadcrumb";
import { useSidebar } from "../../context/SidebarContext";

function Navbar() {
  const { isOpen } = useSidebar();

  return (
    <div
      className={`
        h-16 flex items-center px-6 border-b border-gray-200 bg-white
        fixed top-0 right-0 z-20 transition-all duration-300
        ${isOpen ? "left-[280px]" : "left-[90px]"}
      `}
    >
      <Breadcrumb />
    </div>
  );
}

export default Navbar;