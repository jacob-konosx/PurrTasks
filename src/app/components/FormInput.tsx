import { ChangeEvent, FocusEvent, useState } from "react";

export default function FormInput({
	label,
	name,
	errorMessage,
	onChange,
	value,
	error,
	...inputProps
}: {
	label: string;
	name: string;
	errorMessage: string;
	value: string;
	error: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
	return (
		<div className="form-control w-full">
			<label htmlFor={label} className="label">
				<span className="label-text">{name}</span>
			</label>
			<label
				htmlFor={label}
				className="input input-bordered flex items-center gap-2"
			>
				<input
					{...inputProps}
					value={value}
					className={`grow`}
					onChange={onChange}
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					className="w-4 h-4 opacity-70"
				>
					{label === "email" ? (
						<>
							<path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
							<path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
						</>
					) : (
						<path
							fillRule="evenodd"
							d={inputProps.svg}
							clipRule="evenodd"
						/>
					)}
				</svg>
			</label>
			{error && <p className="text-rose-500 text-sm mt-1">{error}</p>}
		</div>
	);
}
