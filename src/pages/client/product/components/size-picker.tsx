import React from "react";
import { motion } from "framer-motion";

interface SizePickerOption {
  name: string;
  value: string;
}

interface SizePickerProps {
  options: SizePickerOption[];
  onSelect: (size: string) => void;
}

const SizePicker: React.FC<SizePickerProps> = ({ options, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-3.5">
      {options.map((option) => (
        <motion.div
          key={option.value}
          className={`w-8 h-8 flex justify-center items-center cursor-pointer border rounded-md text-sm text-center transition-all duration-300 ease-in-out `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(option.value)}
        >
          {option.name}
        </motion.div>
      ))}
    </div>
  );
};

export default SizePicker;
