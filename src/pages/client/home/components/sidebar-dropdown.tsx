import React, { useState } from "react";

import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-location";

interface DropdownItem {
  title: string;
  to?: string;
  sublinks?: DropdownItem[];
}

interface DropdownProps {
  items: DropdownItem[];
}

const Dropdown: React.FC<DropdownProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleItemClick = (
    index: number,
    to?: string,
    hasSublinks?: boolean
  ) => {
    if (hasSublinks) {
      setOpenIndex(openIndex === index ? null : index);
    } else if (to) {
      navigate({ to });
    }
  };

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index}>
          {/* Main Item */}
          <div
            className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleItemClick(index, item.to, !!item.sublinks)}
          >
            <span>{item.title}</span>
            {item.sublinks ? (
              openIndex === index ? (
                <FiChevronDown className="text-gray-500" />
              ) : (
                <FiChevronRight className="text-gray-500" />
              )
            ) : null}
          </div>

          {/* Sublinks */}
          {item.sublinks && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: openIndex === index ? "auto" : 0,
                opacity: openIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className={`overflow-hidden ml-4 border-l pl-4 ${
                openIndex === index ? "block" : "hidden"
              }`}
            >
              {item.sublinks.map((sublink, subIndex) => (
                <Link
                  key={subIndex}
                  to={sublink.to || "#"}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                >
                  {sublink.title}
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dropdown;
