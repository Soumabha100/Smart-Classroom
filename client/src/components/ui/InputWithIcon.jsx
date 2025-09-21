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
    // This is the new container. It controls everything: the border, background, and focus ring.
    // `focus-within` is a powerful tool that applies focus styles to this container
    // whenever the input inside it is focused.
    <div className="flex items-center gap-3 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 dark:bg-slate-700 dark:ring-slate-600 dark:focus-within:ring-indigo-500">
      <div className="pl-3">
        {/* The icon is passed in as a component */}
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
        // The input itself is now completely transparent and has no border or ring.
        // It blends perfectly into our styled container.
        className="block w-full border-0 bg-transparent py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 dark:text-white dark:placeholder:text-gray-500"
      />
    </div>
  );
};

export default InputWithIcon;
