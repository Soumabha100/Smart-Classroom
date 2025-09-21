import React from "react";

const InputWithIcon = ({
  icon,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {/* The icon is passed in as a component, e.g., <BookCopy /> */}
        {React.cloneElement(icon, {
          className: "h-5 w-5 text-gray-400 dark:text-gray-500",
          "aria-hidden": "true",
        })}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full input-style pl-10" // The left padding makes space for the icon
      />
    </div>
  );
};

export default InputWithIcon;
