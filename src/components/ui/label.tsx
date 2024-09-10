import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
	children: React.ReactNode;
}

export function Label({ children, ...props }: LabelProps) {
	return (
		<label
			{...props}
			className={`block text-sm font-medium text-gray-700 ${props.className || ""}`}
		>
			{children}
		</label>
	);
}
