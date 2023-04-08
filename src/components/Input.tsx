import React from "react";

interface Props {
  label: string;
  placeholder: string;
  type: string;
  onChange: (value: string) => void;
  value?: string;
  autoComplete?: string;
}

export const Input = (props: Props) => {
  return (
    <label className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
      <span className="text-xs font-medium text-gray-700"> {props.label} </span>
      <input
        type={props.type}
        id={props.label}
        placeholder={props.placeholder}
        className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
        onChange={(e) => props.onChange(e.target.value)}
        {...(props.value && { value: props.value })}
        {...(props.autoComplete && { autoComplete: props.autoComplete })}
      />
    </label>
  );
};
