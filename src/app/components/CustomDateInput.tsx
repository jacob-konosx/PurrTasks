"use client";

import dayjs from "dayjs";
import React, { forwardRef } from "react";

const CustomDateInput = forwardRef(
	({ value, onClick, taskData }: any, ref: any) => (
		<>
			<p className="text-center mb-1">
				{dayjs(taskData.endDate).format("hh:mm a")}
			</p>
			<button
				className="border-solid border-2 border-neutral rounded-md p-3"
				onClick={(e) => {
					e.preventDefault();
					onClick();
				}}
				ref={ref}
			>
				{value}
			</button>
		</>
	)
);

export default CustomDateInput;
