"use client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { FormEventHandler, forwardRef, useEffect, useState } from "react";
import toast from "react-simple-toasts";
import DatePicker from "react-datepicker";
import { useRouter } from "next/navigation";
import moment from "moment";
import "react-simple-toasts/dist/theme/warning.css";
import "react-simple-toasts/dist/theme/failure.css";
import "react-datepicker/dist/react-datepicker.css";

function addMins(date: Date, minutes: number) {
	date.setMinutes(date.getMinutes() + minutes);
	return date;
}
interface TaskData {
	user_id: number;
	text: string;
	tags: string[];
	title: string;
	end_date: Date;
}
const page: NextPage = (): JSX.Element => {
	const { data: session } = useSession();
	const { push } = useRouter();
	const [tagInput, setTagInput] = useState("");
	const [taskData, setTaskData] = useState<TaskData>({
		user_id: 0,
		text: "",
		tags: [],
		title: "",
		end_date: addMins(new Date(), 5),
	});

	useEffect(() => {
		if (session) {
			setTaskData({ ...taskData, user_id: session.user.id });
		}
	}, [session]);

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (taskData.title === "") {
			toast("Title cannot be empty!", { theme: "warning" });
			return;
		} else if (taskData.text === "") {
			toast("Description cannot be empty!", { theme: "warning" });
			return;
		} else if (taskData.tags.length === 0) {
			toast("Tags cannot be empty!", { theme: "warning" });
			return;
		} else if (taskData.tags.length > 5) {
			toast("Tags cannot be more than 5!", { theme: "warning" });
			return;
		}
		const res = await fetch(`/api/tasks/`, {
			method: "POST",
			body: JSON.stringify(taskData),
		});
		if (!res.ok) {
			toast("Error creating task!", { theme: "failure" });
			return;
		}
		push("/");
	};
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
		<form className="grid place-items-center mt-24" onSubmit={handleSubmit}>
			<label className="form-control w-full max-w-xs">
				<div className="label">
					<span className="label-text">Title</span>
				</div>
				<input
					type="text"
					placeholder="Enter title"
					className="input input-bordered w-full max-w-xs"
					value={taskData.title}
					onChange={(e) =>
						setTaskData({ ...taskData, title: e.target.value })
					}
				/>
			</label>
			<label className="form-control w-full max-w-xs">
				<div className="label">
					<span className="label-text">Description</span>
				</div>
				<textarea
					placeholder="Enter description"
					className="textarea textarea-bordered w-full max-w-xs"
					value={taskData.text}
					onChange={(e) =>
						setTaskData({ ...taskData, text: e.target.value })
					}
				/>
			</label>
			<label className="form-control w-full max-w-xs">
				<div className="label">
					<span className="label-text">Tags</span>
					<span className="label-text">Click To Remove</span>
				</div>
				<div>
					<input
						type="text"
						placeholder="Enter tag"
						className="input input-bordered w-60 mr-4"
						value={tagInput}
						onChange={(e) => setTagInput(e.target.value)}
					/>
					<button
						className="btn btn-outline"
						onClick={(e) => addTaskTag(e)}
					>
						ADD
					</button>
				</div>
				{taskData.tags.length !== 0 && (
					<div className="mt-2">
						Tags:{" "}
						{taskData.tags.map((tag: string, index) => (
							<span
								className="!inline hover:text-white cursor-pointer"
								onClick={(e) => deleteTag(e, index)}
								key={index}
							>
								{tag},{" "}
							</span>
						))}
					</div>
				)}
			</label>
			<label className="form-control w-full max-w-xs">
				<div className="label">
					<span className="label-text">End Date</span>
				</div>
			</label>

				<DatePicker
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

			<button className="btn btn-outline mt-8">CREATE TASK</button>
		</form>
	);
};

export default page;
