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

const ColorSelector: React.FC<SelectComponentProps> = ({
  options,
  onSelect,
}) => {
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
          className={`w-5 h-5 flex justify-center items-center cursor-pointer rounded-full text-sm text-center transition-all duration-300 ease-in-out overflow-hidden ${
            selectedValue === option.value ? "border-2 border-black p-0.5" : ""
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelect(option.value)}
        >
          <motion.div className={`w-full h-full rounded-full ${option.name}`} />
        </motion.div>
      ))}
    </div>
  );
};

export default ColorSelector;
