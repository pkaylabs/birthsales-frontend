import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Dropdown from "./sidebar-dropdown";

interface DropdownItem {
  title: string;
  to?: string;
  sublinks?: DropdownItem[];
}

interface ResponsiveAsideProps {
  items: DropdownItem[];
}

const ResponsiveAside: React.FC<ResponsiveAsideProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button – shown only when sidebar is closed, on screens below desktop-up */}
      {!isOpen && (
        <div className="mobile:block desktop-up:hidden p-4 flex justify-between items-center z-[100]">
          <button
            onClick={() => setIsOpen(true)}
            className="text-2xl text-gray-700 focus:outline-none"
          >
            <FiMenu />
          </button>
        </div>
      )}

      {/* Off-canvas Sidebar – slides in from the left; top offset prevents overlapping header */}
      <aside
        className={`fixed top-[60px] left-0 h-full w-64 bg-white shadow-lg z-[90] transform transition-transform duration-300 desktop-up:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button inside the Sidebar */}
        <div className="p-4 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="text-2xl text-gray-700 focus:outline-none"
          >
            <FiX />
          </button>
        </div>
        <div className="p-4">
          <Dropdown items={items} />
        </div>
      </aside>
    </>
  );
};

export default ResponsiveAside;

