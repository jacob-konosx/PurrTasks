import dayjs from "dayjs";
import {
	Dispatch,
	FormEventHandler,
	MouseEvent,
	SetStateAction,
	useState,
} from "react";
import DatePicker from "react-datepicker";
import CustomDateInput from "@/app/components/CustomDateInput";
import { UseMutateFunction } from "@tanstack/react-query";
import {
	StringKeyObject,
	taskDataSchema,
	taskDataTagsSchema,
	validateSchema,
} from "@/lib/validationSchema";

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
	mutate: UseMutateFunction<number | void, Error, TaskData, unknown>;
	buttonText: string;
	isPending: boolean;
}

export default function Form({
	taskData,
	setTaskData,
	mutate,
	buttonText,
	isPending
}: FormProps): JSX.Element {
	const [tagInput, setTagInput] = useState("");
	const [error, setError] = useState<StringKeyObject>({});

	const addTaskTag = async (e: MouseEvent) => {
		e.preventDefault();
		const newTaskData: TaskData = {
			...taskData,
			tags: [...taskData.tags, tagInput],
		};

		try {
			const isValid = await taskDataTagsSchema.validate(newTaskData, {
				abortEarly: false,
			});
			if (isValid) {
				setTaskData(newTaskData);
				setTagInput("");
				setError({
					...error,
					tags: "",
				});
			}
		} catch (tagError: any) {
			setError({ ...error, tags: tagError.inner[0].message });
		}
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
		await validateSchema(taskDataSchema, taskData, mutate, setError);
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
				{error.title && (
					<p className="text-rose-500 text-sm mt-1">{error.title}</p>
				)}
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
						setTaskData({ ...taskData, text: e.target.value })
					}
				/>
				{error.text && (
					<p className="text-rose-500 text-sm mt-1">{error.text}</p>
				)}
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
				{error.tags && (
					<p className="text-rose-500 text-sm mt-1">{error.tags}</p>
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
			{error.endDate && (
				<p className="text-rose-500 text-sm mt-1">{error.endDate}</p>
			)}
			<button disabled={isPending} className="btn btn-outline mt-8">{buttonText}</button>
		</form>
	);
}
