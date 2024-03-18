import dayjs from "dayjs";
import {
	Dispatch,
	FormEventHandler,
	MouseEvent,
	SetStateAction,
	useState,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/failure.css";
import "react-simple-toasts/dist/theme/warning.css";
import CustomDateInput from "@/app/components/CustomDateInput";
import { UseMutateFunction } from "@tanstack/react-query";

export interface TaskData {
	id?: number;
	userId: number;
	text: string;
	tags: string[];
	title: string;
	endDate: Date;
	imgUrl?: string;
}

interface FormProps {
	taskData: TaskData;
	setTaskData: Dispatch<SetStateAction<TaskData>>;
	mutate: UseMutateFunction<void, Error, TaskData, unknown>;
	buttonText: string;
}

export default function Form({
	taskData,
	setTaskData,
	mutate,
	buttonText,
}: FormProps): JSX.Element {
	const [tagInput, setTagInput] = useState("");

	const addTaskTag = (e: MouseEvent) => {
		e.preventDefault();
		if (tagInput === "" || tagInput.includes(",")) {
			toast("Invalid Tag!", { theme: "warning" });
			return;
		}
		setTaskData({ ...taskData, tags: [...taskData.tags, tagInput] });
		setTagInput("");
	};

	const deleteTag = (e: MouseEvent, index: number) => {
		e.preventDefault();
		setTaskData({
			...taskData,
			tags: taskData.tags.filter((tag, i) => i !== index),
		});
	};

	const isTimeInTheFuture = (time: Date): boolean => {
		const currentDate = new Date();
		const selectedDate = new Date(time);

		return currentDate.getTime() < selectedDate.getTime();
	};

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (taskData.title === "") {
			toast("Title cannot be empty!", { theme: "warning" });
			return;
		} else if (taskData.text === "") {
			toast("Description cannot be empty!", { theme: "warning" });
			return;
		} else if (taskData.text.length > 70) {
			toast(
				`Title too long! (${taskData.text.length - 70} chars too many)`,
				{
					theme: "warning",
				}
			);
			return;
		} else if (taskData.tags.length === 0) {
			toast("Tags cannot be empty!", { theme: "warning" });
			return;
		} else if (taskData.tags.length > 5) {
			toast("Cannot have more then 5 tags!", { theme: "warning" });
			return;
		}
		mutate(taskData);
	};

	return (
		<form
			className="grid place-items-center mt-24 px-4 pb-20"
			onSubmit={handleSubmit}
		>
			<div className="form-control w-full max-w-xs">
				<div className="w-full">
					{taskData.imgUrl && (
						<img
							src={taskData.imgUrl}
							alt="cat photo"
							className="w-full object-cover max-h-20 rounded-lg"
						/>
					)}
				</div>
				<label htmlFor="title" className="label">
					<span className="label-text">Title</span>
				</label>
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
			</div>
			<div className="form-control w-full max-w-xs">
				<label htmlFor="description" className="label">
					<span className="label-text">Description</span>
				</label>
				<textarea
					id="description"
					placeholder="Enter description"
					className="textarea textarea-bordered w-full max-w-xs"
					value={taskData.text}
					onChange={(e) =>
						/** REVIEW:
						 * this is really, really, really inefficient! You should have the description as a separate state, because everytime you do ...taskData, you allocate another object in memory to do so
						 * when it is only one object being changed, this is fine, but doing this with something more massive like a long list can cause performance problems due to allocating too much memory
						 */
						setTaskData({ ...taskData, text: e.target.value })
					}
				/>
			</div>
			<div className="form-control w-full max-w-xs">
				<label htmlFor="tags" className="label">
					<span className="label-text">Tags</span>
					<span className="label-text">Click To Remove</span>
				</label>
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
						{taskData.tags.map((tag, index) => {
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
			</div>
			<div className="form-control w-full max-w-xs">
				<label htmlFor="endDate" className="label">
					<span className="label-text">End Date</span>
				</label>
			</div>

			<DatePicker
				id="endDate"
				showTimeSelect
				selected={taskData.endDate}
				onChange={(date: Date) =>
					setTaskData({ ...taskData, endDate: date })
				}
				customInput={<CustomDateInput taskData={taskData} />}
				minDate={dayjs().toDate()}
				filterTime={isTimeInTheFuture}
				timeIntervals={5}
			/>
			<button className="btn btn-outline mt-8">{buttonText}</button>
		</form>
	);
}
