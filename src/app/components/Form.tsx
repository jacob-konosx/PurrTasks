"use client";
import moment from "moment";
import { NextPage } from "next";
import { Dispatch, SetStateAction, forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/warning.css";

export function addMins(date: Date, minutes: number) {
	date.setMinutes(date.getMinutes() + minutes);
	return date;
}

export interface TaskData {
	user_id: number;
	text: string;
	tags: string[];
	title: string;
	end_date: Date;
	img_url?: string;
}
interface FormProps {
	taskData: TaskData;
	setTaskData: Dispatch<SetStateAction<TaskData>>;
}
const Form: NextPage<FormProps> = (props): JSX.Element => {
	const [tagInput, setTagInput] = useState("");
	const { taskData, setTaskData } = props;

	const addTaskTag = (e: any) => {
		e.preventDefault();
		if (tagInput === "" || tagInput.includes(",")) {
			toast("Invalid Tag!", { theme: "warning" });
			return;
		}
		setTaskData({ ...taskData, tags: [...taskData.tags, tagInput] });
		setTagInput("");
	};
	const deleteTag = (e: any, index: number) => {
		e.preventDefault();
		setTaskData({
			...taskData,
			tags: taskData.tags.filter((tag, i) => i !== index),
		});
	};
	const filterPassedTime = (time: Date) => {
		const currentDate = new Date();
		const selectedDate = new Date(time);

		return currentDate.getTime() < selectedDate.getTime();
	};
	const CustomDateInput = forwardRef(({ value, onClick }: any, ref: any) => (
		<>
			<p className="text-center mb-1">
				{moment(taskData.end_date).format("hh:mm a")}
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
	));
	return (
		<>
			<label htmlFor="title" className="form-control w-full max-w-xs">
				<div className="w-full">
					{taskData.img_url && (
						<img
							src={taskData.img_url}
							alt="cat photo"
							className="w-full object-cover max-h-20 rounded-lg

"
						/>
					)}
				</div>
				<div className="label">
					<span className="label-text">Title</span>
				</div>
				<input
					id="title"
					type="text"
					placeholder="Enter title"
					className="input input-bordered w-full max-w-xs"
					value={taskData.title}
					onChange={(e) =>
						setTaskData({ ...taskData, title: e.target.value })
					}
				/>
			</label>
			<label
				htmlFor="description"
				className="form-control w-full max-w-xs"
			>
				<div className="label">
					<span className="label-text">Description</span>
				</div>
				<textarea
					id="description"
					placeholder="Enter description"
					className="textarea textarea-bordered w-full max-w-xs"
					value={taskData.text}
					onChange={(e) =>
						setTaskData({ ...taskData, text: e.target.value })
					}
				/>
			</label>
			<label htmlFor="tags" className="form-control w-full max-w-xs">
				<div className="label">
					<span className="label-text">Tags</span>
					<span className="label-text">Click To Remove</span>
				</div>
				<div className="whitespace-nowrap">
					<input
						id="tags"
						type="text"
						placeholder="Enter tag"
						className="input input-bordered w-60 mr-4"
						value={tagInput}
						onChange={(e) => setTagInput(e.target.value)}
					/>
					<button
						className="btn btn-outline inline-block	"
						onClick={(e) => addTaskTag(e)}
					>
						ADD
					</button>
				</div>
				{taskData.tags.length !== 0 && (
					<div className="mt-2">
						Tags:{" "}
						{taskData.tags.map((tag: string, index) => {
							const isLastTag =
								index === taskData.tags.length - 1;
							return (
								<span
									className="!inline hover:text-white cursor-pointer"
									onClick={(e) => deleteTag(e, index)}
									key={index}
								>
									{tag}
									{!isLastTag ? ", " : ""}
								</span>
							);
						})}
					</div>
				)}
			</label>
			<label htmlFor="end_date" className="form-control w-full max-w-xs">
				<div className="label">
					<span className="label-text">End Date</span>
				</div>
			</label>

			<DatePicker
				id="end_date"
				showTimeSelect
				selected={taskData.end_date}
				onChange={(date: Date) =>
					setTaskData({ ...taskData, end_date: date })
				}
				customInput={<CustomDateInput />}
				minDate={moment().toDate()}
				filterTime={filterPassedTime}
				timeIntervals={5}
			/>
		</>
	);
};

export default Form;
