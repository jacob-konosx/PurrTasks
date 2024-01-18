"use client";
import { NextPage } from "next";
import React, { use, useEffect } from "react";

const TaskSettings: NextPage = (): JSX.Element => {
	const [checkedStatus, setCheckedStatus] = React.useState(
		!localStorage.getItem("showCompleted") ||
			localStorage.getItem("showCompleted") === "false"
			? false
			: true
	);
	const handleCheckboxClick = () => {
		setCheckedStatus(!checkedStatus);
		localStorage.setItem("showCompleted", String(!checkedStatus));
		window.dispatchEvent(new Event("storage"));
	};
	return (
		<div className="form-control inline-flex ">
			<label className="cursor-pointer label">
				<span className="label-text mr-2">Show completed tasks</span>
				<input
					type="checkbox"
					checked={checkedStatus}
					className="checkbox checkbox-success"
					onChange={handleCheckboxClick}
				/>
			</label>
		</div>
	);
};

export default TaskSettings;
