import React, { useState } from "react";
import { motion } from "framer-motion";

interface SizePickerOption {
  name: string;
  value: string;
}

interface SelectComponentProps {
  options: SizePickerOption[];
  onSelect: (value: string) => void;
}

const SizePicker: React.FC<SelectComponentProps> = ({ options, onSelect }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelect(value);
  };

  return (
    <div className="flex flex-wrap gap-3.5">
      {options.map((option) => (
        <motion.div
          key={option.value}
          className={`w-8 h-8 flex justify-center items-center cursor-pointer border rounded-md text-sm text-center transition-all duration-300 ease-in-out ${
            selectedValue === option.value
              ? "bg-[#DB4444] text-white border-[#DB4444]"
              : "bg-white text-black border-gray-300"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelect(option.value)}
        >
          {option.name}
        </motion.div>
      ))}
    </div>
  );
};

export default SizePicker;
