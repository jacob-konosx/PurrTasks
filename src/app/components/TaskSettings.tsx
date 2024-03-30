import { Dispatch, SetStateAction } from "react";

export default function TaskSettings({
	showCompleted,
	setShowCompleted,
}: {
	showCompleted: 	boolean;
	setShowCompleted: Dispatch<SetStateAction<boolean>>;

}): JSX.Element{
	const handleCheckboxClick = () => {
		setShowCompleted(!showCompleted);
		localStorage.setItem("showCompleted", String(!showCompleted));
	};

	return (
		<div className="form-control inline-flex ">
			<label className="cursor-pointer label">
				<span className="label-text mr-2">Show completed tasks</span>
				<input
					type="checkbox"
					checked={showCompleted}
					className="checkbox checkbox-success"
					onChange={handleCheckboxClick}
				/>
			</label>
		</div>
	);
};
