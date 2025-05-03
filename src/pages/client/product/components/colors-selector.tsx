import React from "react";
import { motion } from "framer-motion";

interface ColorOption {
  name: string;
  value: string;
}

interface ColorSelectorProps {
  options: ColorOption[];
  onSelect: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ options, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-3.5">
      {options.map((option) => (
        <motion.div
          key={option.value}
          className={`w-5 h-5 flex justify-center items-center cursor-pointer rounded-full text-sm text-center transition-all duration-300 ease-in-out overflow-hidden 
            "border-2 border-black p-0.5" : ""
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(option.value)}
        >
          <motion.div className={`w-full h-full rounded-full ${option.name}`} />
        </motion.div>
      ))}
    </div>
  );
};

export default ColorSelector;
