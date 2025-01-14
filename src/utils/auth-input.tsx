/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface AuthInputProps {
  name?: string;
  id?: string;
  type: "text" | "email" | "password" | "number";
  placeholder?: string;
  value: any;
  onChange: any;
}

export default function AuthInput({
  name,
  id,
  type,
  placeholder,
  value,
  onChange,
}: AuthInputProps) {
  return (
    <input
      name={name}
      id={id}
      type={type}
      className="font-inter w-full h-12 rounded-xl bg-[#EBEBEB] border-none focus:outline-0 focus:outline-primary-300 
      transition-all duration-300 ease-in-out placeholder:font-normal placeholder:text-xs placeholder:text-[#969696] placeholder:font-inter
      text-base font-normal"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
